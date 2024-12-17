import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/lib/db';
import { getToken } from 'next-auth/jwt';
import Admin from '@/models/Admin';
import Subscription from '@/models/Subscription';

async function getUserFromToken(req: NextRequest) {
  try {
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
    if (!token) {
      return { error: 'Unauthorized', status: 401 };
    }

    // Fetch the user from the Admin model based on the token email
    const user = await Admin.findOne({ _id: token.id }).exec();
    if (!user) {
      return { error: 'User not found', status: 404 };
    }

    return { user };
  } catch (error) {
    console.error('Error fetching user from token:', error);
    return { error: 'Internal server error', status: 501 };
  }
}

export async function PUT(req: NextRequest, context: { params: Promise<{ id: string }> }) {
  try {
    // Wait for params to be available
    const { id } = await context.params; // Ensure params is awaited before use
   
    // Connect to the database
    await connectToDatabase();
    const {name,price,life} = await req.json();

    // Authenticate the user
    const result = await getUserFromToken(req);
    if ('error' in result) {
      return NextResponse.json({ error: result.error }, { status: result.status });
    }

    // Validate the provided ID
    if (!id) {
      return NextResponse.json({ message: 'Invalid or missing subscription ID' }, { status: 400 });
    }
        // Check if the subscription exists
    const existingSubscription= await Subscription.findById(id);
    if (!existingSubscription) {
      return NextResponse.json(
        { message: "Subscription not found" },
        { status: 404 }
      );
    }
    if (name !== undefined && name !== null) {
        existingSubscription.name = name;
      }
  if(price !== undefined && price !==null){
    existingSubscription.price=price;
  }
  if(life !=undefined && life !=null){
    existingSubscription.life=life;
  }
  existingSubscription.admin=result.user._id;
  
      
      await existingSubscription.save(); 
   

    // Return success response
    return NextResponse.json({ message: 'Subscription upadate status successfully' }, { status: 200 });
  } catch (error) {
    console.error('Error upadate status subscription:', error);
    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 });
  }
}

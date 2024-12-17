import {  NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/lib/db';
import Admin from '@/models/Admin';
import { getToken } from 'next-auth/jwt';
import Subscription from '@/models/Subscription';

async function getUserFromToken(req: NextRequest) {
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
    if (!token) {
      return { error: 'Unauthorized', status: 401 };
    }
  
    const user = await Admin.findOne({ _id: token.id }).exec();
    if (!user) {
      return { error: 'User not found', status: 404 };
    }
  
    return { user };
  }
export async function POST(req:NextRequest) {
  try {
    await connectToDatabase();
    const result = await getUserFromToken(req);
    if ('error' in result) {
      return NextResponse.json({ error: result.error }, { status: result.status });
    }
   
    // Parse the request body
   const {name,price,life} = await req.json();
    // Validate the input
   if(!name ||!life){
    return NextResponse.json({error:'data empty check your input'},{status:400})
   }

   const newSubscription = new Subscription({name,price,life,admin:result.user._id})
  
   await newSubscription.save();
   
    return NextResponse.json(
      {message:'subscription add successfully'} ,
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating subscription:', error);
    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 });
  }
}

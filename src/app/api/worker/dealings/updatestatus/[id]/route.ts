import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/lib/db';
import { getToken } from 'next-auth/jwt';
import Dealings from '@/models/Dealings';
import Company from '@/models/Company';
import Worker from '@/models/Worker';
import Task from '@/models/Task';

async function getUserFromToken(req: NextRequest) {
  try {
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
    if (!token) {
      return { error: 'Unauthorized', status: 401 };
    }

    // Fetch the user from the Admin model based on the token email
    const user = await Worker.findById({ _id: token.id }).exec();
    if (!user) {
      return { error: 'User not found', status: 404 };
    }

    return { user };
  } catch (error) {
    console.error('Error fetching user from token:', error);
    return { error: 'Internal server error', status: 500 };
  }
}

export async function PUT(req: NextRequest, context: { params:Promise<{ id: string }> }) {
  try {
    // Wait for params to be available
   // Ensure params is awaited before use
   const { id } = await context.params;
    // Connect to the database
    await connectToDatabase();

    // Authenticate the user
    const result = await getUserFromToken(req);
    if ('error' in result) {
      return NextResponse.json({ error: result.error }, { status: result.status });
    }

    const {button} = await req.json();
    // Validate the provided ID
    if (!id) {
      return NextResponse.json({ message: 'Invalid or missing dealings ID' }, { status: 400 });
    }

const existingcompany =await Company.findById(result.user.company)
if (!existingcompany){
    return NextResponse.json({ message: '  company not exist ' }, { status: 402 });
}
 const existingWorking= await Dealings.findOne({_id:id,company:existingcompany._id});
    if(!existingWorking){
        return NextResponse.json({ message: '  Working not exist ' }, { status: 405 });
    }
   
    

 const existActivite=await Task.findById(existingWorking.activite._id);
 if(!existActivite){
  return NextResponse.json({ message: '  Working not exist ' }, { status: 408 });
}
console.log(existActivite);
    if(button==="yes"){
      existActivite.nhe=Number(existActivite.nhe)+1;
      existActivite.save();
      existingWorking.status=true;
    }
    if(button==="no"){
        existingWorking.status=false;
    }
existingWorking.save();
    // Return success response
    return NextResponse.json({ message: 'Working deleted successfully' }, { status: 200 });
  } catch (error) {
    console.error('Error deleting Working:', error);
    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 });
  }
}

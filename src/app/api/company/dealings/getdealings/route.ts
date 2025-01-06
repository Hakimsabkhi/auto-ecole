import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/lib/db';
import { getToken } from 'next-auth/jwt';
import Company from '@/models/Company';
import Dealings from '@/models/Dealings';
import Task from '@/models/Task';
import Activite from '@/models/Activite';
import Customer from '@/models/Customer';
import Worker from '@/models/Worker';

async function getUserFromToken(req: NextRequest) {
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
    if (!token) {
      return { error: 'Unauthorized', status: 401 };
    }

  
    const user = await Company.findById({ _id: token.id }).exec();

    if (!user) {
      return { error: 'User not found', status: 404 };
    }
  
    return { user };
  }
export async function GET(req: NextRequest) {
try{    
    await connectToDatabase();
    const result = await getUserFromToken(req);
    if ('error' in result) {
      return NextResponse.json({ error: result.error }, { status: result.status });
    }
    await Worker.find();
    await Customer.find();
    await Task.find();
    await Activite.find();
      const existworking = await Dealings.find({ company: result.user._id}).populate({
        path: 'activite', // Populate the activite reference
        populate: [
          { path: 'activites' }, // Populate activitetype from activite
          { path: 'customer' }, // Populate customer from activite
          { path: 'worker' }, // Populate worker from activite
        ]
      }).sort({ createdAt: -1 }); // Latest created first
      if(!existworking){
      return NextResponse.json({ message: 'no data' }, { status: 501 });
    }
    return NextResponse.json({existworking},{status:200});

}catch (error) {
    console.error('Error data Dealings:', error);
    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 });
  }


}
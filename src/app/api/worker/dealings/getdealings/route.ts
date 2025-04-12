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

  
    const user = await Worker.findById({ _id: token.id }).exec();

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

    const existcompany= await Company.find({_id:result.user.company._id})
    if(!existcompany){
        return NextResponse.json({ message: 'comapny not exist' }, { status: 408 });
    }

    await Worker.find();
    await Customer.find();
    await Task.find();
    await Activite.find();
    const existworkings = await Dealings.find({ 
        company: existcompany, // Explicit equality check
    }).populate({
        path: 'activite',
        populate: [
            { path: 'activites' },
            { path: 'customer' },
            { path: 'worker' },
        ]
    }).sort({ createdAt: -1 }).lean();
    if (!existworkings) {
        // Handle case where no results were found
        return NextResponse.json({ message: 'no data' }, { status: 406 });
      }
   const existworking = existworkings.filter(item => {
    // Assuming you want to filter based on worker's _id
    return item.activite.worker._id.toString() === result.user.id; // Match worker's _id
});



    

      
   
       // Latest created first

      if(!existworking){
      return NextResponse.json({ message: 'no data' }, { status: 405 });
    } 
    return NextResponse.json({ existworking },{status:200});

}catch (error) {
    console.error('Error data Dealings:', error);
    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 });
  }


}
import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/lib/db';
import { getToken } from 'next-auth/jwt';
import Admin from '@/models/Admin';
import Company from '@/models/Company';
import Subscription from '@/models/Subscription';
async function getUserFromToken(req: NextRequest) {
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
    if (!token) {
      return { error: 'Unauthorized', status: 401 };
    }
  
    const user = await Admin.findById({ _id: token.id }).exec();
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
    await Subscription.find();
    const company= await Company.find().populate('subscription').sort({ createdAt: 1 });
    if(!company){
      return NextResponse.json({ message: 'no data' }, { status: 501 });
    }
    return NextResponse.json(company,{status:200});

}catch (error) {
    console.error('Error data comapny:', error);
    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 });
  }


}
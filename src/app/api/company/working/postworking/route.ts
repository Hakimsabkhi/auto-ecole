import {  NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import connectToDatabase from '@/lib/db';
import Admin from '@/models/Admin';
import Company from '@/models/Company';
import { getToken } from 'next-auth/jwt';
import Working from '@/models/Working';
import Activite from '@/models/Activite';
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
export async function POST(req:NextRequest) {
  try {
    await connectToDatabase();
    const result = await getUserFromToken(req);
    if ('error' in result) {
        return NextResponse.json({ error: result.error }, { status: result.status });
      }
    // Parse the request body
   const body = await req.json();
    const { activities,timeStart,timeEnd,date } = body; 

    // Validate the input
    if ( !activities || !timeStart||!timeEnd||!date) {
      return NextResponse.json({ error: 'activite, time start, and time end are required' }, { status: 400 });
    }

    // Connect to the database



   // Create the new user
    await Working.create({
            date:date,
            activite:activities,
            hstart:timeStart,
            hfinish:timeEnd,
      company:result.user._id,
    }); 

    // Respond with the created user's data (excluding the password)
    return NextResponse.json(
      {message:"creating successfully working"},
      { status: 201 }
    ); 
  } catch (error) {
    console.error('Error creating worker:', error);
    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 });
  }
}

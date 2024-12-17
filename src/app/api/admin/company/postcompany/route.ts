import {  NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import connectToDatabase from '@/lib/db';
import Admin from '@/models/Admin';
import Company from '@/models/Company';
import { getToken } from 'next-auth/jwt';
import Worker from '@/models/Worker';
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
   const body = await req.json();
    const { companyName,username,phone,password,subscription } = body; 

    // Validate the input
    if ( !password || !username||!companyName||!phone||!subscription) {
      return NextResponse.json({ error: 'Name, email, and password are required' }, { status: 400 });
    }

    // Connect to the database

    // Check if the user already exists
    const existingUser = await Admin.findOne({ username });
    if (existingUser) {
      return NextResponse.json({ error: 'username is already in use' }, { status: 402 });
    }
// Check if the company name already exists
const existingCompany = await Company.findOne({ username });
if (existingCompany) {
  return NextResponse.json({ error: 'username name is already in use' }, { status: 403 });
}

// Check if the email already exists in Customer
const existingWorker = await Worker.findOne({ username });
if (existingWorker) {
  return NextResponse.json({ error: 'username is already in use by a customer' }, { status: 405 });
}
const exsubscription = await Subscription.findOne({ _id:subscription });
if (!exsubscription) {
  return NextResponse.json({ error: 'problem subscription ' }, { status: 408 });
}


const datesub = new Date();
datesub.setDate(datesub.getDate() + Number(exsubscription.life));
const subdate=datesub;
// Hash the password
    const hashedPassword = await bcrypt.hash(password, 12);

   // Create the new user
    await Company.create({
      username,
      name:companyName,
      phone:Number(phone),
      subscription:subscription,
      password: hashedPassword,
      datestart:new Date(),
      datesub:subdate,
    }); 
 
    // Respond with the created user's data (excluding the password)
    return NextResponse.json(
      {message:"creating successfully company"},
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating company:', error);
    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 });
  }
}

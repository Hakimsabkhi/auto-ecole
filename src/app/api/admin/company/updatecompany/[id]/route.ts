import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import connectToDatabase from '@/lib/db';
import { getToken } from 'next-auth/jwt';
import Admin from '@/models/Admin';
import Company from '@/models/Company';

async function getUserFromToken(req: NextRequest) {
  try {
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
    if (!token) {
      return { error: 'Unauthorized', status: 401 };
    }

    // Fetch the user from the Admin model based on the token email
    const user = await Admin.findOne({ email: token.email }).exec();
    if (!user) {
      return { error: 'User not found', status: 404 };
    }

    return { user };
  } catch (error) {
    console.error('Error fetching user from token:', error);
    return { error: 'Internal server error', status: 501 };
  }
}

export async function PUT(req: NextRequest,context: { params: Promise<{ id: string }> }) {
  try {
    // Wait for params to be available
    const { id } = await context.params; // Ensure params is awaited before use
   
    // Connect to the database
    await connectToDatabase();
    const {companyName,phone,password} = await req.json();

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
    const existingCompany= await Company.findById(id);
    if (!existingCompany) {
      return NextResponse.json(
        { message: "Subscription not found" },
        { status: 404 }
      );
    }
    if(companyName!=""){
        existingCompany.name=companyName;
    }
    
    if(phone!=null){
        existingCompany.phone=Number(phone);
    }
    if(password!=''){
         const hashedPassword = await bcrypt.hash(password, 12);
         existingCompany.password=hashedPassword;
    }
  
      
      await existingCompany.save();
   

    // Return success response
    return NextResponse.json({ message: 'Company upadate status successfully' }, { status: 200 });
  } catch (error) {
    console.error('Error upadate status Company:', error);
    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 });
  }
}

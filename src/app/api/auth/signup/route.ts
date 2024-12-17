import {  NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import connectToDatabase from '@/lib/db';
import Admin from '@/models/Admin';

export async function POST(req:NextRequest) {
  try {
    // Parse the request body
   const body = await req.json();
    const {  password, name,username } = body; 

    // Validate the input
    if ( !password || !username) {
      return NextResponse.json({ error: 'Name, email, and password are required' }, { status: 400 });
    }

    // Connect to the database
    await connectToDatabase();

    // Check if the user already exists
    const existingUser = await Admin.findOne({ username });
    if (existingUser) {
      return NextResponse.json({ error: 'Email is already in use' }, { status: 409 });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create the new user
    const newUser = await Admin.create({
      username,
      name,
      password: hashedPassword,
    });

    // Respond with the created user's data (excluding the password)
    return NextResponse.json(
      {
        user: {
          id: newUser._id,
          username: newUser.username,
          email: newUser.email,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating user:', error);
    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 });
  }
}

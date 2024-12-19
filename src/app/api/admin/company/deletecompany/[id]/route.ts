import { NextRequest, NextResponse } from 'next/server';
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
    const user = await Admin.findById({ _id: token.id }).exec();
    if (!user) {
      return { error: 'User not found', status: 404 };
    }

    return { user };
  } catch (error) {
    console.error('Error fetching user from token:', error);
    return { error: 'Internal server error', status: 500 };
  }
}

export async function DELETE(req: NextRequest, context: { params: Promise<{ id: string }> }) {
  try {
    // Wait for params to be available
    const { id } =  await context.params; // Ensure params is awaited before use

    // Connect to the database
    await connectToDatabase();

    // Authenticate the user
    const result = await getUserFromToken(req);
    if ('error' in result) {
      return NextResponse.json({ error: result.error }, { status: result.status });
    }

    // Validate the provided ID
    if (!id) {
      return NextResponse.json({ message: 'Invalid or missing company ID' }, { status: 400 });
    }

    // Check if the Company exists
    const deletedCompany = await Company.findByIdAndDelete(id);
    if (!deletedCompany) {
      return NextResponse.json({ message: ' Company not found' }, { status: 404 });
    }

    // Return success response
    return NextResponse.json({ message: 'Company deleted successfully' }, { status: 200 });
  } catch (error) {
    console.error('Error deleting Company:', error);
    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 });
  }
}

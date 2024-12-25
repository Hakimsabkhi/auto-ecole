import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/lib/db";
import Company from "@/models/Company";
import { getToken } from "next-auth/jwt";
import Customer from "@/models/Customer";
import Activite from "@/models/Activite";
async function getUserFromToken(req: NextRequest) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  if (!token) {
    return { error: "Unauthorized", status: 401 };
  }

  const user = await Company.findById({ _id: token.id }).exec();
  if (!user) {
    return { error: "User not found", status: 404 };
  }

  return { user };
}
export async function POST(req: NextRequest) {
  try {
    await connectToDatabase();
    const result = await getUserFromToken(req);
    if ("error" in result) {
      return NextResponse.json(
        { error: result.error },
        { status: result.status }
      );
    }
    // Parse the request body
    const body = await req.json();

    const {
        customerid,
        activities,
        mt,
        mp,
        nht,
        nhe,
        dateexam,
    } = body;
 
    // Validate the input
    if (
      !customerid ||
      !activities ||
      !mt ||
      !nht
    ) {
      return NextResponse.json(
        {
          error:
            "customerid activities mt nht  are required",
        },
        { status: 423 }
      );
    }

    // Connect to the database

    // Check if the company name already exists

    // Check if the cin company already exists in Customer
   
    const existingCustomer = await Customer.findById({
     _id: customerid
      });
    if (!existingCustomer) {
      return NextResponse.json(
        { error: "username is already in use by a customer" },
        { status: 405 }
      );
    }
    

    // Create the new user
    const newActivite=  new  Activite({
        customerid:existingCustomer,
      activities,
      mt:Number(mt),
      mp:Number(mp),
      nht:Number(nht),
      nhe:Number(nhe),
      dateexam,
      company: result.user._id,
    });

    await newActivite.save(); 

    // Respond with the created user's data (excluding the password)
    return NextResponse.json(
      { message: "creating successfully Activity" },
      { status: 201 }
    );
  } catch (error) {
  
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}

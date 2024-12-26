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
        customer,
        activities,
        mt,
        mp,
        nht,
        nhe,
        dateexam,
    } = body;
 
    // Validate the input
    if (
      !customer ||
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
     _id: customer
      });
    if (!existingCustomer) {
      return NextResponse.json(
        { error: "username is already in use by a customer" },
        { status: 405 }
      );
    }

    await Activite.create({
      customer: existingCustomer,
      activites:activities, // Make sure this matches the schema as "activites"
      mt,
      mp,
      nht,
      nhe,
      dateexam,
      company: result.user._id,
    });
    

 

    // Respond with the created user's data (excluding the password)
    return NextResponse.json(
      { message: "creating successfully Activity" },
      { status: 201 }
    );
  } catch {
  
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}

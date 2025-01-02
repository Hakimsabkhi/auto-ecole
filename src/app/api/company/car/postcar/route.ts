import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/lib/db";
import Company from "@/models/Company";
import { getToken } from "next-auth/jwt";
import Car from "@/models/Car";

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
      model,
      bn,
      vd,
    } = body;

    // Validate the input
    if (
      !model ||
      !bn 
      
    ) {
      return NextResponse.json(
        {
          error:
            "model and bn  are required",
        },
        { status: 423 }
      );
    }



    // Create the new user
    const newCar=  new  Car({
      model,
      bn,
      vd,
      company: result.user._id,
    });
  
    await newCar.save();
    // Respond with the created user's data (excluding the password)
    return NextResponse.json(
      { message: "creating successfully worker" },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating worker:", error);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}

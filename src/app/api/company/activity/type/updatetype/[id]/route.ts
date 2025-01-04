import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/lib/db";
import { getToken } from "next-auth/jwt";
import Company from "@/models/Company";
import Activitetype from "@/models/Activitetype";


async function getUserFromToken(req: NextRequest) {
  try {
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
    if (!token) {
      return { error: "Unauthorized", status: 401 };
    }

    // Fetch the user from the Admin model based on the token email
    const user = await Company.findById({ _id: token.id }).exec();
    if (!user) {
      return { error: "User not found", status: 404 };
    }

    return { user };
  } catch (error) {
    console.error("Error fetching user from token:", error);
    return { error: "Internal server error", status: 501 };
  }
}

export async function PUT(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    // Wait for params to be available
    const { id } = await context.params; // Ensure params is awaited before use

    // Connect to the database
    await connectToDatabase();
   
    // Authenticate the user
    const result = await getUserFromToken(req);
    if ("error" in result) {
      return NextResponse.json(
        { error: result.error },
        { status: result.status }
      );
    }
    const body = await req.json();
    const {
       name,
        prix,
      
    } = body;
 
    // Validate the provided ID
    if (!id) {
      return NextResponse.json(
        { message: "Invalid or missing Activitetype ID" },
        { status: 400 }
      );
    }

    // Check if the subscription exists
    const existingaActivitetype = await Activitetype.findOne({
      _id: id,
      company: result.user._id,
    });
    if (!existingaActivitetype) {
      return NextResponse.json(
        { message: "Activitetype not found" },
        { status: 408 }
      );
    }
    if(name){
        existingaActivitetype.name=name
    }
    if(prix){
        existingaActivitetype.prix=prix
    }
   
    existingaActivitetype.save();
    // Return success response
    return NextResponse.json( { status: 200 });
  } catch (error) {
    console.error("Error  Activitetype:", error);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}

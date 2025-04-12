import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/lib/db";
import { getToken } from "next-auth/jwt";
import Company from "@/models/Company";
import Task from "@/models/Task";
import Customer from "@/models/Customer";
import Activite from "@/models/Activite";
import Worker from "@/models/Worker";

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

export async function GET(
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

    // Validate the provided ID
    if (!id) {
      return NextResponse.json(
        { message: "Invalid or missing Activite ID" },
        { status: 400 }
      );
    }

    await Customer.find();
    // Check if the subscription exists
    await Activite.find();
    await Worker.find();
    const existingaActivitetype =await Activite.findById({
        _id:id,
    })
    
    if (!existingaActivitetype) {
        return NextResponse.json(
          { message: "activite  not found" },
          { status: 408 }
        );
      }
    const existingaActivite = await Task.find({
        activites: existingaActivitetype._id,
      company: result.user._id,
    }).populate("customer").populate('activites').populate('worker','_id name') ;

    if (!existingaActivite) {
      return NextResponse.json(
        { message: "Task not found" },
        { status: 404 }
      );
    }

    // Return success response
    return NextResponse.json({ existingaActivite }, { status: 200 });
  } catch (error) {
    console.error("Error  Task:", error);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}

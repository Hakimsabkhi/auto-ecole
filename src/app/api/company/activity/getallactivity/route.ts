import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/lib/db";
import { getToken } from "next-auth/jwt";
import Company from "@/models/Company";
import Customer from "@/models/Customer";
import Activite from "@/models/Activite";
import Activitetype from "@/models/Activitetype";
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
export async function GET(req: NextRequest) {
  try {
    await connectToDatabase();
    const result = await getUserFromToken(req);
    if ("error" in result) {
      return NextResponse.json(
        { error: result.error },
        { status: result.status }
      );
    }
    await Customer.find();
    await Activitetype.find();
    const activite = await Activite.find({ company: result.user._id })
    .populate('customer') 
    .populate('activites') 
    .populate('worker')// Ensure 'Customer' is the correct field name in the schema
    .exec();  // Adding .exec() is optional, but it explicitly returns a promise
  
    if (!activite) {
      return NextResponse.json({ message: "no data" }, { status: 501 });
    }

    return NextResponse.json(activite, { status: 200 });
  } catch (error) {
    console.error("Error data activite:", error);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}

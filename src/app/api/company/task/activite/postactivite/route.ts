import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/lib/db";
import Company from "@/models/Company";
import { getToken } from "next-auth/jwt";
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
        name,
        prix,
    } = body;
 
    // Validate the input
    if (
      !name ||
      !prix 
    ) {
      return NextResponse.json(
        {
          error:
            "Activite name prix  are required",
        },
        { status: 423 }
      );
    }

   

    await Activite.create({
        name,
        prix:Number(prix),
      company: result.user._id,
    });
    

 

    // Respond with the created user's data (excluding the password)
    return NextResponse.json(
      { message: "creating successfully Activite" },
      { status: 201 }
    );
  } catch {
  
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}

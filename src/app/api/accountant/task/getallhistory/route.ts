import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/lib/db";
import { getToken } from "next-auth/jwt";
import Company from "@/models/Company";
import Accountant from "@/models/Accountant";
import Historypay from "@/models/Historypay";

async function getUserFromToken(req: NextRequest) {
  try {
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
    if (!token) {
      return { error: "Unauthorized", status: 401 };
    }

    // Fetch the user from the Admin model based on the token email
    const user = await Accountant.findById({ _id: token.id }).exec();
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
) {
  try {
 
 

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

    const existingaCompany = await Company.findOne({
        _id: result.user.company,
      })
      if (!existingaCompany) {
        return NextResponse.json(
          { message: "Company not found" },
          { status: 408 }
        );
      }

  const existingaHistorypay = await Historypay.find({
      company: existingaCompany._id,
    }) ;
    if (!existingaHistorypay) {
      return NextResponse.json(
        { message: "Historypay not found" },
        { status: 409 }
      );
    }

 
    // Return success response
    return NextResponse.json(existingaHistorypay, { status: 200 });
  } catch (error) {
    console.error("Error  Historypay:", error);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}

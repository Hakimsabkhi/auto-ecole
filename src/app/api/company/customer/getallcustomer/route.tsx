import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/lib/db";
import { getToken } from "next-auth/jwt";
import Company from "@/models/Company";
import Customer from "@/models/Customer";
import Worker from "@/models/Worker";
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
    await Worker.find();

    const customer = await Customer.find({ company: result.user._id })
      .sort({ createdAt: -1 }); // Latest created first

    if (!customer) {
      return NextResponse.json({ message: "no data" }, { status: 501 });
    }

    return NextResponse.json(customer, { status: 200 });
  } catch (error) {
    console.error("Error data customer:", error);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}

import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/lib/db";
import Company from "@/models/Company";
import { getToken } from "next-auth/jwt";
import Task from "@/models/Task";
import Accountant from "@/models/Accountant";
import Historypay from "@/models/Historypay";
async function getUserFromToken(req: NextRequest) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  if (!token) {
    return { error: "Unauthorized", status: 401 };
  }

  const user = await Accountant.findById({ _id: token.id }).exec();
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
    const {amount,accountId} = await req.json();

    // Validate the input
     if (
      !amount ||
      !accountId
      
    ){
      return NextResponse.json(
        {
          error:
            "data empty amount accountId  are required",
        },
        { status: 423 }
      );
    }
    // Check if the log  already exists in Company
    const existingCompany = await Company.findById({
        _id: result.user.company
         });
         if (!existingCompany) {
            return NextResponse.json(
              { error: "company is not ready" },
              { status: 406 }
            );
          }

    const existtask=await Task.findOne({_id:accountId,company:existingCompany._id})
    if (!existtask) {
        return NextResponse.json(
          { error: "task is not ready" },
          { status: 407 }
        );
      }
      
    existtask.mp=Number(existtask.mp)+Number(amount);
    
      await Historypay.create({
        amount:amount,
            task:existtask._id,
          company: existingCompany._id,
        });
    
        existtask.save();

    return NextResponse.json(
      { message: "creating successfully task" },
      { status: 201 }
    );
  } catch {
  
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}

import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/lib/db";
import Company from "@/models/Company";
import { getToken } from "next-auth/jwt";
import Task from "@/models/Task";
import Accountant from "@/models/Accountant";
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
export async function PUT(req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params; 
    await connectToDatabase();
    const result = await getUserFromToken(req);
    if ("error" in result) {
      return NextResponse.json(
        { error: result.error },
        { status: result.status }
      );
    }
    if (!id) {
      return NextResponse.json(
        { message: "Invalid or missing Activite ID" },
        { status: 400 }
      );
    }
    // Parse the request body
    const body = await req.json();



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
          
    
    const existtask=await Task.findOne({_id:id,company:existingCompany._id})
    if (!existtask) {
        return NextResponse.json(
          { error: "task is not ready" },
          { status: 407 }
        );
      }
      if(body==="En-coure de paiement"){
        existtask.statuspay=false;
      }
      if(body==="Paiement terminé"){
        existtask.statuspay=true;
      }
      existtask.save();
   
    return NextResponse.json(
      { message: "update successfully" },
      { status: 201 }
    );
  } catch {
  
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}

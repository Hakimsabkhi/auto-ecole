import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/lib/db";
import { getToken } from "next-auth/jwt";
import Customer from "@/models/Customer";
import Company from "@/models/Company";

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
    const {
      cin,
      firstname,
      lastname,
      phone,
      activities,
      total,
      avance,
      worker,
      numbheurestotal,
      numbheureseffectuer,
    } = await req.json();

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
        { message: "Invalid or missing subscription ID" },
        { status: 400 }
      );
    }
    // Check if the subscription exists
    const existingCustomer = await Customer.findOne({
      _id: id,
      company: result.user._id,
    });
    if (!existingCustomer) {
      return NextResponse.json(
        { message: "Customer not found" },
        { status: 404 }
      );
    }

    if (cin != "") {
      existingCustomer.cin = cin;
    }
    if (firstname != "") {
      existingCustomer.firstname = firstname;
    }
    if (lastname != "") {
      existingCustomer.lastname = lastname;
    }
    if (total != "") {
      existingCustomer.total = total;
    }

    if (phone != null) {
      existingCustomer.phone = Number(phone);
    }
    if (avance != null) {
      existingCustomer.avance = Number(avance);
    }
    if (avance != null) {
      existingCustomer.numbheurestotal = Number(numbheurestotal);
    }
    if (avance != null) {
      existingCustomer.numbheureseffectuer = Number(numbheureseffectuer);
    }
    existingCustomer.activities = activities;
    existingCustomer.worker = worker;
    existingCustomer.company = result.user._id;
     await existingCustomer.save();

    // Return success response
    return NextResponse.json(
      { message: "worker upadate status successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error upadate status worker:", error);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}

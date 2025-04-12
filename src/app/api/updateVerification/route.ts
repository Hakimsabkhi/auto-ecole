import { NextRequest, NextResponse } from 'next/server';
import Company from '@/models/Company';
import connectToDatabase from '@/lib/db';
export async function GET(req: NextRequest) {
  try {
    await connectToDatabase();
    const currentDate = new Date().toISOString();
    console.log(currentDate)  // Current date in ISO format
    const allcompany =await Company.find();
    console.log(allcompany.length)
    allcompany.forEach(async company => {
        // Perform your operation for each company
        if( new Date(company.datesub).toISOString()<currentDate){
            const existcompany = await Company.findById(company._id);
            existcompany.on=false
            existcompany.save();
        }
      });

    return NextResponse.json({
      success: true,
      message: `Verification status updated successfully`,
    });
  } catch (error) {
    console.error('Error during date verification:', error);
    return NextResponse.json({
      success: false,
      message: 'Error occurred',
    }, { status: 500 });
  }
}

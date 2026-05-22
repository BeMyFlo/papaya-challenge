import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { Claim } from "@/models/Claim";

function generateReferenceNumber(): string {
  const prefix = "CLM";
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `${prefix}-${timestamp}-${random}`;
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    // Generate reference number
    const referenceNumber = generateReferenceNumber();

    // Log the submitted payload
    console.log("=== CLAIM SUBMISSION ===");
    console.log("Reference:", referenceNumber);
    console.log("Payload:", JSON.stringify(body, null, 2));
    console.log("========================");

    // Try to persist to MongoDB
    try {
      await connectToDatabase();

      const claim = new Claim({
        ...body,
        referenceNumber,
        status: "submitted",
      });

      await claim.save();

      return NextResponse.json(
        {
          success: true,
          referenceNumber,
          message: "Claim submitted successfully and saved to database",
        },
        { status: 201 }
      );
    } catch (dbError) {
      // If MongoDB is not available, still return success with reference number
      // but indicate the claim was not persisted
      console.warn("MongoDB connection failed, claim not persisted:", dbError);

      return NextResponse.json(
        {
          success: true,
          referenceNumber,
          message: "Claim submitted successfully (database unavailable — claim logged to console)",
          dbError: "MongoDB connection failed. Claim data was logged to console.",
        },
        { status: 201 }
      );
    }
  } catch (error) {
    console.error("Error processing claim submission:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to process claim submission",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

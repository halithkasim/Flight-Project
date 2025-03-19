import { NextResponse } from "next/server"
import { generateAndPrintSecretKey } from "@/lib/generate-secret"

/**
 * This API route generates a new JWT secret key
 * IMPORTANT: This should be disabled in production!
 */
export async function GET() {
  // Only allow in development environment
  if (process.env.NODE_ENV !== "development") {
    return NextResponse.json({ error: "This endpoint is only available in development mode" }, { status: 403 })
  }

  try {
    const secretKey = generateAndPrintSecretKey()

    return NextResponse.json({
      success: true,
      message: "JWT secret key generated successfully",
      secretKey,
      instructions: "Add this key to your .env file as JWT_SECRET",
    })
  } catch (error) {
    console.error("Error generating JWT secret key:", error)
    return NextResponse.json({ error: "Failed to generate JWT secret key" }, { status: 500 })
  }
}


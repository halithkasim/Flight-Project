import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { verifyJWT } from "./lib/auth"

// This function can be marked `async` if using `await` inside
export async function middleware(request: NextRequest) {
  // Get the pathname
  const path = request.nextUrl.pathname

  // Check if the path is for admin routes
  if (path.startsWith("/admin")) {
    // Get the JWT token from the cookies
    const token = request.cookies.get("auth_token")?.value

    // If there's no token, redirect to login
    if (!token) {
      return NextResponse.redirect(new URL("/login", request.url))
    }

    try {
      // Verify the token
      const verified = await verifyJWT(token)

      // If verification fails, redirect to login
      if (!verified) {
        return NextResponse.redirect(new URL("/login", request.url))
      }

      // Continue with the request if token is valid
      return NextResponse.next()
    } catch (error) {
      // If token verification throws an error, redirect to login
      return NextResponse.redirect(new URL("/login", request.url))
    }
  }

  // For non-admin routes, continue with the request
  return NextResponse.next()
}

// Configure the middleware to run only on admin routes
export const config = {
  matcher: "/admin/:path*",
}


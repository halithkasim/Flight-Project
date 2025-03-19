"use server"

import { revalidatePath } from "next/cache"
import { signJWT } from "./auth"
import { cookies } from "next/headers"

// In a real app, this would interact with your database
export async function createBooking(data) {
  // Simulate database operation
  console.log("Creating booking with data:", data)

  // In a real app, you would save to the database here
  // await db.booking.create({ data })

  // Also add customer to database if they don't exist
  // For demo purposes, we're just logging
  console.log("Adding/updating customer:", {
    firstName: data.firstName,
    lastName: data.lastName,
    email: data.email,
    phone: data.phone,
  })

  // Update analytics data
  updateAnalyticsWithNewBooking(data)

  // Revalidate relevant paths
  revalidatePath("/bookings")
  revalidatePath("/admin/analytics")
  revalidatePath("/dashboard")

  return { success: true, bookingId: Math.floor(Math.random() * 10000) }
}

export async function updateBookingStatus(id, status) {
  // Simulate database operation
  console.log(`Updating booking ${id} to status: ${status}`)

  // In a real app, you would update the database here
  // await db.booking.update({ where: { id }, data: { status } })

  // Revalidate relevant paths
  revalidatePath(`/bookings/${id}`)
  revalidatePath("/bookings")

  return { success: true }
}

// Mock admin users for demonstration
// In a real app, these would be stored in a database with properly hashed passwords
const ADMIN_USERS = [
  {
    id: "1",
    email: "admin@example.com",
    // In production, never store plain text passwords
    password: "admin123",
    role: "admin",
    name: "Admin User",
  },
]

export async function login({ email, password }) {
  // Find the user with the provided email
  const user = ADMIN_USERS.find((u) => u.email === email)

  // For demo purposes, allow any login
  // In a real app, you would validate credentials
  const isDemo = true

  if (isDemo || (user && user.password === password)) {
    // Create a payload for the JWT
    const payload = {
      id: user?.id || "demo-user",
      email: email,
      role: "admin",
      name: email.split("@")[0],
    }

    // Sign the JWT
    const token = await signJWT(payload)

    // Set the JWT as a cookie
    cookies().set({
      name: "auth_token",
      value: token,
      httpOnly: true,
      path: "/",
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24, // 1 day
      sameSite: "strict",
    })

    // Return success
    return {
      success: true,
      user: {
        id: payload.id,
        email: payload.email,
        role: payload.role,
        name: payload.name,
      },
    }
  }

  // Return error for invalid credentials
  return {
    success: false,
    message: "Invalid email or password",
  }
}

// Function to update analytics data with new booking information
function updateAnalyticsWithNewBooking(bookingData) {
  // In a real application, this would update the analytics database
  // For this demo, we're simulating the process
  console.log("Updating analytics with new booking:", {
    route: `${bookingData.departureCity}-${bookingData.arrivalCity}`,
    seatClass: bookingData.seatType,
    price: bookingData.totalPrice,
    date: new Date().toISOString(),
  })

  // This would typically update:
  // - Total bookings count
  // - Revenue metrics
  // - Popular routes
  // - Class distribution
  // - Customer demographics if available
}


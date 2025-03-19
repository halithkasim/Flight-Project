// This file contains mock data functions that would normally fetch from a database

export async function getAllFlights() {
  // In a real app, this would fetch from your database
  return [
    {
      id: "1",
      flightNumber: "SK101",
      departureCity: "New York",
      arrivalCity: "London",
      departureTime: "08:00 AM",
      arrivalTime: "08:30 PM",
      date: "2023-12-15",
      price: 450,
      availableSeats: 120,
    },
    {
      id: "2",
      flightNumber: "SK202",
      departureCity: "London",
      arrivalCity: "Paris",
      departureTime: "10:15 AM",
      arrivalTime: "12:30 PM",
      date: "2023-12-16",
      price: 180,
      availableSeats: 85,
    },
    {
      id: "3",
      flightNumber: "SK303",
      departureCity: "Paris",
      arrivalCity: "Rome",
      departureTime: "02:00 PM",
      arrivalTime: "04:15 PM",
      date: "2023-12-17",
      price: 210,
      availableSeats: 95,
    },
    {
      id: "4",
      flightNumber: "SK404",
      departureCity: "Rome",
      arrivalCity: "Tokyo",
      departureTime: "11:30 PM",
      arrivalTime: "06:45 PM",
      date: "2023-12-18",
      price: 780,
      availableSeats: 110,
    },
    {
      id: "5",
      flightNumber: "SK505",
      departureCity: "Tokyo",
      arrivalCity: "Sydney",
      departureTime: "09:20 AM",
      arrivalTime: "10:50 PM",
      date: "2023-12-19",
      price: 850,
      availableSeats: 75,
    },
    {
      id: "6",
      flightNumber: "SK606",
      departureCity: "Sydney",
      arrivalCity: "New York",
      departureTime: "07:45 PM",
      arrivalTime: "05:30 AM",
      date: "2023-12-20",
      price: 920,
      availableSeats: 90,
    },
  ]
}

export function getCustomers() {
  // In a real app, this would fetch from your database
  // This is just a sample of the 50+ customers we'd have
  return Array.from({ length: 50 }, (_, i) => ({
    id: `${i + 1}`,
    firstName: ["John", "Jane", "Michael", "Emily", "David", "Sarah", "Robert", "Lisa"][i % 8],
    lastName: ["Smith", "Johnson", "Williams", "Brown", "Jones", "Miller", "Davis", "Garcia"][i % 8],
    email: `customer${i + 1}@example.com`,
    phone: `+1 555-${100 + i}`,
    bookings: Math.floor(Math.random() * 5),
  }))
}

export function getAnalyticsData(timeRange = "month") {
  // Mock data for analytics
  // In a real app, this would calculate based on actual booking data

  const revenueData = Array.from({ length: timeRange === "week" ? 7 : 30 }, (_, i) => ({
    date: `Day ${i + 1}`,
    amount: 10000 + Math.random() * 5000,
    costs: 5000 + Math.random() * 2000,
  }))

  const bookingsByClass = [
    { class: "Economy", count: 350 },
    { class: "Business", count: 120 },
    { class: "First Class", count: 30 },
  ]

  const popularRoutes = [
    { route: "NYC-LON", bookings: 120 },
    { route: "LON-PAR", bookings: 95 },
    { route: "PAR-ROM", bookings: 85 },
    { route: "ROM-TOK", bookings: 75 },
    { route: "TOK-SYD", bookings: 65 },
    { route: "SYD-NYC", bookings: 60 },
    { route: "NYC-LAX", bookings: 55 },
    { route: "LAX-CHI", bookings: 50 },
    { route: "CHI-MIA", bookings: 45 },
    { route: "MIA-NYC", bookings: 40 },
  ]

  const profitMargin = [
    { category: "Q1", percentage: 25 },
    { category: "Q2", percentage: 28 },
    { category: "Q3", percentage: 32 },
    { category: "Q4", percentage: 35 },
  ]

  return {
    totalRevenue: 1250000,
    revenueChange: 12.5,
    totalBookings: 4500,
    bookingsChange: 8.2,
    avgTicketPrice: 278,
    avgPriceChange: 3.5,
    revenueData,
    bookingsByClass,
    popularRoutes,
    profitMargin,
  }
}


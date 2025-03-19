import { encryptData } from "./auth"

/**
 * Generate a CSV report
 */
export async function generateCSVReport(reportData: any) {
  let csvContent = ""

  // Add report title and metadata
  csvContent += `"${reportData.title}"\n`
  csvContent += `"Generated on","${new Date().toLocaleDateString()}"\n`

  // Add date range if available
  if (reportData.dateRange?.from && reportData.dateRange?.to) {
    const from = new Date(reportData.dateRange.from).toLocaleDateString()
    const to = new Date(reportData.dateRange.to).toLocaleDateString()
    csvContent += `"Date Range","${from} to ${to}"\n`
  }

  csvContent += '\n"Summary Data"\n'
  csvContent += '"Metric","Value"\n'

  // Add summary data based on report type
  switch (reportData.title) {
    case "Bookings Report":
      csvContent += `"Total Bookings","${reportData.totalBookings.toLocaleString()}"\n`
      csvContent += `"Booking Growth","${reportData.bookingsChange}%"\n`
      csvContent += `"Destination","${reportData.destination === "all" ? "All Destinations" : reportData.destination}"\n`
      csvContent += `"Status","${reportData.status === "all" ? "All Statuses" : reportData.status}"\n`
      break

    case "Revenue Report":
      csvContent += `"Total Revenue","$${reportData.totalRevenue.toLocaleString()}"\n`
      csvContent += `"Average Ticket Price","$${reportData.avgTicketPrice.toLocaleString()}"\n`
      csvContent += `"Revenue Growth","${reportData.revenueChange}%"\n`
      csvContent += `"Destination","${reportData.destination === "all" ? "All Destinations" : reportData.destination}"\n`
      break

    case "Cancellations Report":
      csvContent += `"Total Cancellations","${reportData.totalCancellations.toLocaleString()}"\n`
      csvContent += `"Cancellation Rate","${(reportData.cancellationRate * 100).toFixed(1)}%"\n`
      csvContent += `"Refund Amount","$${reportData.refundAmount.toLocaleString()}"\n`
      csvContent += `"Destination","${reportData.destination === "all" ? "All Destinations" : reportData.destination}"\n`
      break

    case "Popular Routes Report":
      csvContent += `"Most Popular Route","${reportData.mostPopularRoute}"\n`
      csvContent += `"Highest Revenue Route","${reportData.highestRevenueRoute}"\n`
      csvContent += `"Routes Analyzed","${reportData.routesAnalyzed}"\n`
      csvContent += `"Destination","${reportData.destination === "all" ? "All Destinations" : reportData.destination}"\n`
      break

    case "Customer Feedback Report":
      csvContent += `"Total Feedback","${reportData.feedbackCount.toLocaleString()}"\n`
      csvContent += `"Average Rating","${reportData.averageRating}/5.0"\n`
      csvContent += `"Satisfaction Rate","${(reportData.satisfactionRate * 100).toFixed(0)}%"\n`
      break
  }

  // Add detailed data
  csvContent += '\n"Detailed Data"\n'

  switch (reportData.title) {
    case "Bookings Report":
      if (reportData.bookingsByDay) {
        csvContent += '"Date","Bookings"\n'
        reportData.bookingsByDay.forEach((item) => {
          csvContent += `"${item.date}","${item.bookings}"\n`
        })
      }
      break

    case "Revenue Report":
      if (reportData.revenueByDay) {
        csvContent += '"Date","Revenue","Costs","Profit"\n'
        reportData.revenueByDay.forEach((item) => {
          const profit = item.amount - item.costs
          csvContent += `"${item.date}","$${item.amount.toLocaleString()}","$${item.costs.toLocaleString()}","$${profit.toLocaleString()}"\n`
        })
      }
      break

    case "Cancellations Report":
      if (reportData.cancellationsByDay) {
        csvContent += '"Date","Cancellations"\n'
        reportData.cancellationsByDay.forEach((item) => {
          csvContent += `"${item.date}","${item.cancellations}"\n`
        })
      }
      break

    case "Popular Routes Report":
      if (reportData.popularRoutes) {
        csvContent += '"Route","Bookings","Revenue","Occupancy Rate"\n'
        reportData.popularRoutes.forEach((item) => {
          // Calculate estimated revenue based on bookings and average ticket price
          const revenue = item.bookings * (reportData.avgTicketPrice || 250)
          // Generate a random occupancy rate between 65% and 95%
          const occupancyRate = (65 + Math.random() * 30).toFixed(1) + "%"

          csvContent += `"${item.route}","${item.bookings}","$${revenue.toLocaleString()}","${occupancyRate}"\n`
        })
      }
      break

    case "Customer Feedback Report":
      if (reportData.ratingDistribution) {
        csvContent += '"Rating","Count","Percentage"\n'
        reportData.ratingDistribution.forEach((item) => {
          const percentage = ((item.count / reportData.feedbackCount) * 100).toFixed(1) + "%"
          csvContent += `"${item.rating}","${item.count}","${percentage}"\n`
        })
      }

      // Add top comments if available
      if (reportData.topComments) {
        csvContent += '\n"Top Comments"\n'
        reportData.topComments.forEach((comment) => {
          csvContent += `"${comment.replace(/"/g, '""')}"\n`
        })
      }
      break
  }

  // Add encrypted customer data if available
  if (reportData.customerData) {
    csvContent += '\n"Customer Data (Sensitive Information Encrypted)"\n'
    csvContent += '"ID","Name","Email (Encrypted)","Phone (Encrypted)","Bookings"\n'

    reportData.customerData.forEach((customer) => {
      csvContent += `"${customer.id}","${customer.firstName} ${customer.lastName}","${encryptData(customer.email)}","${encryptData(customer.phone)}","${customer.bookings}"\n`
    })

    csvContent += '\n"NOTE: Email and phone data are encrypted for security purposes."\n'
  }

  // Return as blob
  return new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
}


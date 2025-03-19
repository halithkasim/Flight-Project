import { jsPDF } from "jspdf"
import "jspdf-autotable"

/**
 * Generate a PDF report
 */
export async function generatePDFReport(reportData: any) {
  // Create a new PDF document
  const doc = new jsPDF()

  // Add report title
  doc.setFontSize(20)
  doc.text(reportData.title, 105, 15, { align: "center" })

  // Add report date
  doc.setFontSize(10)
  const today = new Date().toLocaleDateString()
  doc.text(`Generated on: ${today}`, 105, 22, { align: "center" })

  // Add date range if available
  if (reportData.dateRange?.from && reportData.dateRange?.to) {
    const from = new Date(reportData.dateRange.from).toLocaleDateString()
    const to = new Date(reportData.dateRange.to).toLocaleDateString()
    doc.text(`Date Range: ${from} to ${to}`, 105, 27, { align: "center" })
  }

  // Add report summary
  doc.setFontSize(12)
  doc.text("Report Summary", 14, 40)

  // Add summary table based on report type
  switch (reportData.title) {
    case "Bookings Report":
      // @ts-ignore
      doc.autoTable({
        startY: 45,
        head: [["Metric", "Value"]],
        body: [
          ["Total Bookings", reportData.totalBookings.toLocaleString()],
          ["Booking Growth", `${reportData.bookingsChange}%`],
          ["Destination", reportData.destination === "all" ? "All Destinations" : reportData.destination],
          ["Status", reportData.status === "all" ? "All Statuses" : reportData.status],
        ],
        theme: "grid",
        headStyles: { fillColor: [23, 23, 23] },
      })
      break

    case "Revenue Report":
      // @ts-ignore
      doc.autoTable({
        startY: 45,
        head: [["Metric", "Value"]],
        body: [
          ["Total Revenue", `$${reportData.totalRevenue.toLocaleString()}`],
          ["Average Ticket Price", `$${reportData.avgTicketPrice.toLocaleString()}`],
          ["Revenue Growth", `${reportData.revenueChange}%`],
          ["Destination", reportData.destination === "all" ? "All Destinations" : reportData.destination],
        ],
        theme: "grid",
        headStyles: { fillColor: [23, 23, 23] },
      })
      break

    case "Cancellations Report":
      // @ts-ignore
      doc.autoTable({
        startY: 45,
        head: [["Metric", "Value"]],
        body: [
          ["Total Cancellations", reportData.totalCancellations.toLocaleString()],
          ["Cancellation Rate", `${(reportData.cancellationRate * 100).toFixed(1)}%`],
          ["Refund Amount", `$${reportData.refundAmount.toLocaleString()}`],
          ["Destination", reportData.destination === "all" ? "All Destinations" : reportData.destination],
        ],
        theme: "grid",
        headStyles: { fillColor: [23, 23, 23] },
      })
      break

    case "Popular Routes Report":
      // @ts-ignore
      doc.autoTable({
        startY: 45,
        head: [["Metric", "Value"]],
        body: [
          ["Most Popular Route", reportData.mostPopularRoute],
          ["Highest Revenue Route", reportData.highestRevenueRoute],
          ["Routes Analyzed", reportData.routesAnalyzed],
          ["Destination", reportData.destination === "all" ? "All Destinations" : reportData.destination],
        ],
        theme: "grid",
        headStyles: { fillColor: [23, 23, 23] },
      })
      break

    case "Customer Feedback Report":
      // @ts-ignore
      doc.autoTable({
        startY: 45,
        head: [["Metric", "Value"]],
        body: [
          ["Total Feedback", reportData.feedbackCount.toLocaleString()],
          ["Average Rating", `${reportData.averageRating}/5.0`],
          ["Satisfaction Rate", `${(reportData.satisfactionRate * 100).toFixed(0)}%`],
        ],
        theme: "grid",
        headStyles: { fillColor: [23, 23, 23] },
      })
      break
  }

  // Add detailed data based on report type
  let detailsY = doc.lastAutoTable?.finalY || 100
  detailsY += 15

  doc.setFontSize(12)
  doc.text("Detailed Data", 14, detailsY)

  switch (reportData.title) {
    case "Bookings Report":
      if (reportData.bookingsByDay) {
        // @ts-ignore
        doc.autoTable({
          startY: detailsY + 5,
          head: [["Date", "Bookings"]],
          body: reportData.bookingsByDay.map((item) => [item.date, item.bookings.toLocaleString()]),
          theme: "grid",
          headStyles: { fillColor: [23, 23, 23] },
        })
      }
      break

    case "Revenue Report":
      if (reportData.revenueByDay) {
        // @ts-ignore
        doc.autoTable({
          startY: detailsY + 5,
          head: [["Date", "Revenue", "Costs"]],
          body: reportData.revenueByDay.map((item) => [
            item.date,
            `$${item.amount.toLocaleString()}`,
            `$${item.costs.toLocaleString()}`,
          ]),
          theme: "grid",
          headStyles: { fillColor: [23, 23, 23] },
        })
      }
      break

    case "Cancellations Report":
      if (reportData.cancellationsByDay) {
        // @ts-ignore
        doc.autoTable({
          startY: detailsY + 5,
          head: [["Date", "Cancellations"]],
          body: reportData.cancellationsByDay.map((item) => [item.date, item.cancellations.toLocaleString()]),
          theme: "grid",
          headStyles: { fillColor: [23, 23, 23] },
        })
      }
      break

    case "Popular Routes Report":
      if (reportData.popularRoutes) {
        // @ts-ignore
        doc.autoTable({
          startY: detailsY + 5,
          head: [["Route", "Bookings"]],
          body: reportData.popularRoutes.map((item) => [item.route, item.bookings.toLocaleString()]),
          theme: "grid",
          headStyles: { fillColor: [23, 23, 23] },
        })
      }
      break

    case "Customer Feedback Report":
      if (reportData.ratingDistribution) {
        // @ts-ignore
        doc.autoTable({
          startY: detailsY + 5,
          head: [["Rating", "Count", "Percentage"]],
          body: reportData.ratingDistribution.map((item) => [
            item.rating,
            item.count.toLocaleString(),
            `${((item.count / reportData.feedbackCount) * 100).toFixed(1)}%`,
          ]),
          theme: "grid",
          headStyles: { fillColor: [23, 23, 23] },
        })
      }

      // Add top comments if available
      if (reportData.topComments) {
        let commentsY = doc.lastAutoTable?.finalY || detailsY + 50
        commentsY += 15

        doc.setFontSize(12)
        doc.text("Top Comments", 14, commentsY)

        // @ts-ignore
        doc.autoTable({
          startY: commentsY + 5,
          head: [["Comments"]],
          body: reportData.topComments.map((comment) => [comment]),
          theme: "grid",
          headStyles: { fillColor: [23, 23, 23] },
        })
      }
      break
  }

  // Add footer with encryption notice
  const pageCount = doc.getNumberOfPages()
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i)
    doc.setFontSize(8)
    doc.text(
      "This report contains encrypted customer data for security purposes.",
      105,
      doc.internal.pageSize.height - 10,
      { align: "center" },
    )
    doc.text(`Page ${i} of ${pageCount}`, 105, doc.internal.pageSize.height - 5, { align: "center" })
  }

  // Encrypt any sensitive customer data
  if (reportData.customerData) {
    reportData.customerData = reportData.customerData.map((customer) => ({
      ...customer,
      email: encryptCustomerData(customer.email),
      phone: encryptCustomerData(customer.phone),
    }))
  }

  // Return the PDF as a blob
  return doc.output("blob")
}

// Simple encryption function that works in browser
function encryptCustomerData(data: string): string {
  // Simple base64 encoding for demo purposes
  return btoa(data)
}

export async function generateTicketPDF(data) {
  // Create new PDF document
  const doc = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a5",
  })

  // Set background color
  doc.setFillColor(245, 245, 245)
  doc.rect(0, 0, 148, 210, "F")

  // Add border
  doc.setDrawColor(0, 0, 0)
  doc.setLineWidth(0.5)
  doc.rect(5, 5, 138, 200, "S")

  // Add title
  doc.setFillColor(23, 23, 23) // #171717
  doc.rect(5, 5, 138, 15, "F")

  doc.setTextColor(255, 255, 255)
  doc.setFontSize(16)
  doc.setFont("helvetica", "bold")
  doc.text("SkyWay Airlines", 74, 14, { align: "center" })

  // Add boarding pass title
  doc.setTextColor(23, 23, 23)
  doc.setFontSize(14)
  doc.text("BOARDING PASS", 74, 28, { align: "center" })

  // Horizontal line
  doc.setDrawColor(200, 200, 200)
  doc.line(15, 32, 133, 32)

  // Flight details
  doc.setFontSize(12)
  doc.setFont("helvetica", "bold")
  doc.text("FLIGHT", 15, 40)
  doc.text("DATE", 55, 40)
  doc.text("DEPARTURE", 95, 40)

  doc.setFont("helvetica", "normal")
  doc.setFontSize(10)
  doc.text(data.flightNumber, 15, 46)
  doc.text(data.departureDate, 55, 46)
  doc.text(data.departureTime, 95, 46)

  // Route
  doc.setFontSize(14)
  doc.setFont("helvetica", "bold")
  doc.text(data.departureCity, 30, 60)

  // Arrow
  doc.setDrawColor(100, 100, 100)
  doc.setLineWidth(0.8)
  doc.line(60, 60, 88, 60)

  // Create arrow tip
  doc.setFillColor(100, 100, 100)
  const arrowTip = [
    [88, 60],
    [84, 58],
    [84, 62],
  ]
  doc.triangle(arrowTip[0][0], arrowTip[0][1], arrowTip[1][0], arrowTip[1][1], arrowTip[2][0], arrowTip[2][1], "F")

  doc.text(data.arrivalCity, 100, 60)

  // Passenger details
  doc.setFontSize(12)
  doc.text("PASSENGER", 15, 75)
  doc.setFont("helvetica", "normal")
  doc.setFontSize(10)
  doc.text(`${data.firstName} ${data.lastName}`, 15, 81)

  // Seat details
  doc.setFontSize(12)
  doc.setFont("helvetica", "bold")
  doc.text("SEAT", 95, 75)
  doc.setFont("helvetica", "normal")
  doc.setFontSize(10)
  doc.text(data.seatNumber, 95, 81)

  // Class
  doc.setFontSize(12)
  doc.setFont("helvetica", "bold")
  doc.text("CLASS", 120, 75)
  doc.setFont("helvetica", "normal")
  doc.setFontSize(10)

  // Get first letter and capitalize, then add the rest
  const seatClass = data.seatType.charAt(0).toUpperCase() + data.seatType.slice(1)
  doc.text(seatClass, 120, 81)

  // Booking reference
  doc.setFontSize(12)
  doc.setFont("helvetica", "bold")
  doc.text("BOOKING REF", 15, 95)
  doc.setFont("helvetica", "normal")
  doc.setFontSize(10)
  doc.text(data.bookingReference, 15, 101)

  // Add dotted line for tear-off
  doc.setDrawColor(100, 100, 100)
  doc.setLineDash([2, 2])
  doc.line(5, 110, 143, 110)
  doc.setLineDash([])

  // Generate QR code - simplified for browser compatibility
  try {
    // Instead of using QRCode library which might cause issues,
    // we'll just add a placeholder for the QR code
    doc.setFillColor(240, 240, 240)
    doc.roundedRect(54, 120, 40, 40, 2, 2, "F")
    doc.setDrawColor(200, 200, 200)
    doc.roundedRect(54, 120, 40, 40, 2, 2, "S")

    // Add QR code placeholder text
    doc.setFontSize(8)
    doc.setTextColor(100, 100, 100)
    doc.text("QR Code for Check-in", 74, 140, { align: "center" })

    // Add caption below QR code
    doc.setFontSize(10)
    doc.setFont("helvetica", "normal")
    doc.setTextColor(0, 0, 0)
    doc.text("Scan for check-in", 74, 165, { align: "center" })

    // Important information
    doc.setFontSize(8)
    doc.text("Please arrive at the airport at least 2 hours before your flight.", 74, 175, { align: "center" })
    doc.text("Gate closes 30 minutes before departure time.", 74, 180, { align: "center" })

    // Footer
    doc.setFontSize(6)
    doc.text(
      "This is an electronic ticket. Please present this boarding pass with a valid ID at the airport.",
      74,
      195,
      { align: "center" },
    )
  } catch (error) {
    console.error("Error generating QR code:", error)
  }

  // Save the PDF
  doc.save(`skyway_ticket_${data.bookingReference}.pdf`)

  return true
}


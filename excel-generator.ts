import ExcelJS from "exceljs"
import { encryptData } from "./auth"

/**
 * Generate an Excel report
 */
export async function generateExcelReport(reportData: any) {
  // Create a new workbook
  const workbook = new ExcelJS.Workbook()

  // Add metadata
  workbook.creator = "SkyWay Airlines"
  workbook.lastModifiedBy = "SkyWay Airlines"
  workbook.created = new Date()
  workbook.modified = new Date()

  // Create a summary worksheet
  const summarySheet = workbook.addWorksheet("Summary")

  // Add title
  summarySheet.mergeCells("A1:D1")
  const titleCell = summarySheet.getCell("A1")
  titleCell.value = reportData.title
  titleCell.font = {
    name: "Arial",
    size: 16,
    bold: true,
  }
  titleCell.alignment = { horizontal: "center" }

  // Add date generated
  summarySheet.mergeCells("A2:D2")
  const dateCell = summarySheet.getCell("A2")
  dateCell.value = `Generated on: ${new Date().toLocaleDateString()}`
  dateCell.font = {
    name: "Arial",
    size: 10,
  }
  dateCell.alignment = { horizontal: "center" }

  // Add date range if available
  if (reportData.dateRange?.from && reportData.dateRange?.to) {
    summarySheet.mergeCells("A3:D3")
    const rangeCell = summarySheet.getCell("A3")
    const from = new Date(reportData.dateRange.from).toLocaleDateString()
    const to = new Date(reportData.dateRange.to).toLocaleDateString()
    rangeCell.value = `Date Range: ${from} to ${to}`
    rangeCell.font = {
      name: "Arial",
      size: 10,
    }
    rangeCell.alignment = { horizontal: "center" }
  }

  // Add summary data based on report type
  summarySheet.addRow([]) // Empty row
  summarySheet.addRow(["Metric", "Value"])

  // Style the header row
  const headerRow = summarySheet.lastRow
  headerRow.eachCell((cell) => {
    cell.font = {
      bold: true,
      color: { argb: "FFFFFFFF" },
    }
    cell.fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: "171717" },
    }
  })

  // Add summary data based on report type
  switch (reportData.title) {
    case "Bookings Report":
      summarySheet.addRow(["Total Bookings", reportData.totalBookings.toLocaleString()])
      summarySheet.addRow(["Booking Growth", `${reportData.bookingsChange}%`])
      summarySheet.addRow([
        "Destination",
        reportData.destination === "all" ? "All Destinations" : reportData.destination,
      ])
      summarySheet.addRow(["Status", reportData.status === "all" ? "All Statuses" : reportData.status])
      break

    case "Revenue Report":
      summarySheet.addRow(["Total Revenue", `$${reportData.totalRevenue.toLocaleString()}`])
      summarySheet.addRow(["Average Ticket Price", `$${reportData.avgTicketPrice.toLocaleString()}`])
      summarySheet.addRow(["Revenue Growth", `${reportData.revenueChange}%`])
      summarySheet.addRow([
        "Destination",
        reportData.destination === "all" ? "All Destinations" : reportData.destination,
      ])
      break

    case "Cancellations Report":
      summarySheet.addRow(["Total Cancellations", reportData.totalCancellations.toLocaleString()])
      summarySheet.addRow(["Cancellation Rate", `${(reportData.cancellationRate * 100).toFixed(1)}%`])
      summarySheet.addRow(["Refund Amount", `$${reportData.refundAmount.toLocaleString()}`])
      summarySheet.addRow([
        "Destination",
        reportData.destination === "all" ? "All Destinations" : reportData.destination,
      ])
      break

    case "Popular Routes Report":
      summarySheet.addRow(["Most Popular Route", reportData.mostPopularRoute])
      summarySheet.addRow(["Highest Revenue Route", reportData.highestRevenueRoute])
      summarySheet.addRow(["Routes Analyzed", reportData.routesAnalyzed])
      summarySheet.addRow([
        "Destination",
        reportData.destination === "all" ? "All Destinations" : reportData.destination,
      ])
      break

    case "Customer Feedback Report":
      summarySheet.addRow(["Total Feedback", reportData.feedbackCount.toLocaleString()])
      summarySheet.addRow(["Average Rating", `${reportData.averageRating}/5.0`])
      summarySheet.addRow(["Satisfaction Rate", `${(reportData.satisfactionRate * 100).toFixed(0)}%`])
      break
  }

  // Add detailed data in a separate worksheet
  const detailsSheet = workbook.addWorksheet("Detailed Data")

  // Add headers based on report type
  switch (reportData.title) {
    case "Bookings Report":
      if (reportData.bookingsByDay) {
        detailsSheet.addRow(["Date", "Bookings"])

        // Style the header row
        const headerRow = detailsSheet.lastRow
        headerRow.eachCell((cell) => {
          cell.font = {
            bold: true,
            color: { argb: "FFFFFFFF" },
          }
          cell.fill = {
            type: "pattern",
            pattern: "solid",
            fgColor: { argb: "171717" },
          }
        })

        // Add data rows
        reportData.bookingsByDay.forEach((item) => {
          detailsSheet.addRow([item.date, item.bookings])
        })
      }
      break

    case "Revenue Report":
      if (reportData.revenueByDay) {
        detailsSheet.addRow(["Date", "Revenue", "Costs", "Profit"])

        // Style the header row
        const headerRow = detailsSheet.lastRow
        headerRow.eachCell((cell) => {
          cell.font = {
            bold: true,
            color: { argb: "FFFFFFFF" },
          }
          cell.fill = {
            type: "pattern",
            pattern: "solid",
            fgColor: { argb: "171717" },
          }
        })

        // Add data rows
        reportData.revenueByDay.forEach((item) => {
          const profit = item.amount - item.costs
          detailsSheet.addRow([item.date, item.amount, item.costs, profit])
        })

        // Format currency columns
        detailsSheet.getColumn(2).numFmt = "$#,##0.00"
        detailsSheet.getColumn(3).numFmt = "$#,##0.00"
        detailsSheet.getColumn(4).numFmt = "$#,##0.00"
      }
      break

    case "Cancellations Report":
      if (reportData.cancellationsByDay) {
        detailsSheet.addRow(["Date", "Cancellations"])

        // Style the header row
        const headerRow = detailsSheet.lastRow
        headerRow.eachCell((cell) => {
          cell.font = {
            bold: true,
            color: { argb: "FFFFFFFF" },
          }
          cell.fill = {
            type: "pattern",
            pattern: "solid",
            fgColor: { argb: "171717" },
          }
        })

        // Add data rows
        reportData.cancellationsByDay.forEach((item) => {
          detailsSheet.addRow([item.date, item.cancellations])
        })
      }
      break

    case "Popular Routes Report":
      if (reportData.popularRoutes) {
        detailsSheet.addRow(["Route", "Bookings", "Revenue", "Occupancy Rate"])

        // Style the header row
        const headerRow = detailsSheet.lastRow
        headerRow.eachCell((cell) => {
          cell.font = {
            bold: true,
            color: { argb: "FFFFFFFF" },
          }
          cell.fill = {
            type: "pattern",
            pattern: "solid",
            fgColor: { argb: "171717" },
          }
        })

        // Add data rows with calculated revenue and occupancy
        reportData.popularRoutes.forEach((item) => {
          // Calculate estimated revenue based on bookings and average ticket price
          const revenue = item.bookings * (reportData.avgTicketPrice || 250)
          // Generate a random occupancy rate between 65% and 95%
          const occupancyRate = (65 + Math.random() * 30).toFixed(1) + "%"

          detailsSheet.addRow([item.route, item.bookings, revenue, occupancyRate])
        })

        // Format currency column
        detailsSheet.getColumn(3).numFmt = "$#,##0.00"
      }
      break

    case "Customer Feedback Report":
      if (reportData.ratingDistribution) {
        detailsSheet.addRow(["Rating", "Count", "Percentage"])

        // Style the header row
        const headerRow = detailsSheet.lastRow
        headerRow.eachCell((cell) => {
          cell.font = {
            bold: true,
            color: { argb: "FFFFFFFF" },
          }
          cell.fill = {
            type: "pattern",
            pattern: "solid",
            fgColor: { argb: "171717" },
          }
        })

        // Add data rows
        reportData.ratingDistribution.forEach((item) => {
          const percentage = ((item.count / reportData.feedbackCount) * 100).toFixed(1) + "%"
          detailsSheet.addRow([item.rating, item.count, percentage])
        })
      }

      // Add comments in a separate worksheet if available
      if (reportData.topComments) {
        const commentsSheet = workbook.addWorksheet("Top Comments")
        commentsSheet.addRow(["Comments"])

        // Style the header row
        const headerRow = commentsSheet.lastRow
        headerRow.eachCell((cell) => {
          cell.font = {
            bold: true,
            color: { argb: "FFFFFFFF" },
          }
          cell.fill = {
            type: "pattern",
            pattern: "solid",
            fgColor: { argb: "171717" },
          }
        })

        // Add comments
        reportData.topComments.forEach((comment) => {
          commentsSheet.addRow([comment])
        })

        // Adjust column width
        commentsSheet.getColumn(1).width = 100
      }
      break
  }

  // Encrypt any sensitive customer data
  if (reportData.customerData) {
    const customersSheet = workbook.addWorksheet("Customer Data")
    customersSheet.addRow(["ID", "Name", "Email (Encrypted)", "Phone (Encrypted)", "Bookings"])

    // Style the header row
    const headerRow = customersSheet.lastRow
    headerRow.eachCell((cell) => {
      cell.font = {
        bold: true,
        color: { argb: "FFFFFFFF" },
      }
      cell.fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: "171717" },
      }
    })

    // Add encrypted customer data
    reportData.customerData.forEach((customer) => {
      customersSheet.addRow([
        customer.id,
        `${customer.firstName} ${customer.lastName}`,
        encryptData(customer.email),
        encryptData(customer.phone),
        customer.bookings,
      ])
    })

    // Add security notice
    customersSheet.addRow([])
    customersSheet.addRow(["NOTE: Email and phone data are encrypted for security purposes."])
    const noticeRow = customersSheet.lastRow
    noticeRow.getCell(1).font = {
      bold: true,
      color: { argb: "FFFF0000" },
    }
  }

  // Auto-size columns for better readability
  summarySheet.columns.forEach((column) => {
    column.width = 25
  })

  detailsSheet.columns.forEach((column) => {
    column.width = 20
  })

  // Write to buffer
  const buffer = await workbook.xlsx.writeBuffer()

  // Return as blob
  return new Blob([buffer], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" })
}


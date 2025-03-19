"use server"

import { revalidatePath } from "next/cache"
import { generateText } from "ai"
import { openai } from "@ai-sdk/openai"

// Types for feedback submission
interface FeedbackData {
  type: string
  rating: number
  bookingReference: string
  flightNumber: string
  departureDate: string
  feedbackCategory: string
  comments: string
  contactEmail: string
  allowContact: boolean
}

/**
 * Submit customer feedback and analyze it using AI
 */
export async function submitFeedback(data: FeedbackData) {
  console.log("Submitting feedback:", data)

  // In a real app, this would save to a database
  // await db.feedback.create({ data })

  // Analyze feedback with AI if comments are provided
  let sentimentAnalysis = null

  if (data.comments && data.comments.trim().length > 0) {
    try {
      sentimentAnalysis = await analyzeFeedback(data.comments, data.rating)
      console.log("Sentiment analysis:", sentimentAnalysis)

      // In a real app, this would update the feedback record with the analysis
      // await db.feedback.update({
      //   where: { id: feedbackId },
      //   data: { sentimentAnalysis }
      // })
    } catch (error) {
      console.error("Error analyzing feedback:", error)
    }
  }

  // Revalidate relevant paths
  revalidatePath("/admin/reports")
  revalidatePath("/feedback")

  return {
    success: true,
    id: Math.floor(Math.random() * 10000),
    sentimentAnalysis,
  }
}

/**
 * Analyze feedback text using AI to determine sentiment and key insights
 */
async function analyzeFeedback(feedbackText: string, rating: number) {
  // Use AI to analyze the feedback
  const { text } = await generateText({
    model: openai("gpt-4o"),
    prompt: `
      Analyze the following customer feedback for a flight service. 
      The customer gave a rating of ${rating} out of 5 stars.
      
      Feedback: "${feedbackText}"
      
      Provide a JSON response with the following structure:
      {
        "sentiment": "positive|neutral|negative",
        "sentimentScore": 0-10,
        "keyTopics": ["topic1", "topic2"],
        "strengths": ["strength1", "strength2"],
        "areasForImprovement": ["area1", "area2"],
        "actionableInsights": ["insight1", "insight2"]
      }
    `,
    system:
      "You are an AI assistant that specializes in analyzing customer feedback for airlines. Provide objective analysis in JSON format only.",
  })

  try {
    // Parse the JSON response
    return JSON.parse(text)
  } catch (error) {
    console.error("Error parsing AI response:", error)
    return {
      sentiment: rating >= 4 ? "positive" : rating >= 3 ? "neutral" : "negative",
      sentimentScore: rating * 2,
      keyTopics: [],
      strengths: [],
      areasForImprovement: [],
      actionableInsights: [],
    }
  }
}


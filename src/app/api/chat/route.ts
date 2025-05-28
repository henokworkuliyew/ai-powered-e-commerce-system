import { streamText, type Message } from "ai"
import { createGoogleGenerativeAI } from "@ai-sdk/google"
import { config } from "@/lib/config"

// Function to validate API key format
function isValidApiKey(key: string | undefined): boolean {
  if (!key) return false
  // Basic validation - Gemini API keys typically start with "AI" and are longer than 20 chars
  return key.length > 20
}

// API route handler to stream text responses
export async function POST(request: Request) {
  try {
    // Get API key from environment variable
    const apiKey = process.env.GEMINI_API_KEY

    // Check if API key is available and valid
    if (!isValidApiKey(apiKey)) {
      console.error("Invalid or missing API key")
      return new Response(
        JSON.stringify({
          error: "API key not valid or not provided. Please check your environment variables.",
        }),
        {
          status: 401,
          headers: { "Content-Type": "application/json" },
        },
      )
    }

    // Initialize Google AI client with the validated API key
    const google = createGoogleGenerativeAI({
      apiKey: apiKey,
    })

    const { messages } = await request.json()

    // Create a system message
    const systemMessage = {
      role: "system",
      content: config.systemMessage,
    }

    // Format messages for the API
    const formattedMessages = [
      systemMessage,
      ...messages.map((message: Message) => ({
        role: message.role,
        content: message.content,
      })),
    ]

    console.log("Using API key:", apiKey?.substring(0, 4) + "..." + apiKey?.substring(apiKey.length - 4))
    console.log("Sending messages:", JSON.stringify(formattedMessages, null, 2))

    // Create the stream
    const stream = await streamText({
      model: google(config.api.model),
      messages: formattedMessages,
      temperature: config.api.temperature,
    })

    return stream.toDataStreamResponse({
      getErrorMessage: (error) => {
        console.error("Stream error:", error)
        if (error instanceof Error) {
          return `Error: ${error.message}`
        }
        return String(error)
      },
    })
  } catch (error) {
    console.error("API route error:", error)
    return new Response(
      JSON.stringify({
        error: error instanceof Error ? `Error: ${error.message}` : "An unknown error occurred",
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      },
    )
  }
}

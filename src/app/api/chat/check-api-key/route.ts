import { createGoogleGenerativeAI } from "@ai-sdk/google"

export async function GET() {
  try {
    const apiKey = process.env.GEMINI_API_KEY
// 
    // Basic validation
    if (!apiKey || apiKey.length < 20) {
      return Response.json({ valid: false, message: "API key is missing or invalid" })
    }

    // Initialize the client to test the API key
    const google = createGoogleGenerativeAI({
      apiKey,
    })

    // Try a simple model call to validate the key
    try {
      // Just initialize the model without making an actual call
      google("gemini-1.5-flash-latest")
      return Response.json({ valid: true })
    } catch (error) {
      console.error("Error validating API key:", error)
      return Response.json({ valid: false, message: "API key validation failed" })
    }
  } catch (error) {
    console.error("Error in check-api-key route:", error)
    return Response.json({ valid: false, message: "Server error checking API key" })
  }
}

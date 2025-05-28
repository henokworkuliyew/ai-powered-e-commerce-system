import type { Message } from "ai"

// Helper function to format messages for your specific API
export function formatMessagesForAPI(messages: Message[]) {
  return {
    messages: messages.map((message) => ({
      role: message.role,
      content: message.content,
    })),
  }
}

// Helper function to parse streaming responses if needed
export function parseStreamingResponse(chunk: string) {
  // This function would parse your specific streaming format if the AI SDK doesn't handle it
  // For example, handling the f:, 0:, e:, d: prefixes in your response

  if (chunk.startsWith("f:")) {
    // Handle message start
    return { type: "start", data: JSON.parse(chunk.slice(2)) }
  } else if (chunk.startsWith("0:")) {
    // Handle message content
    return { type: "content", data: chunk.slice(2) }
  } else if (chunk.startsWith("e:") || chunk.startsWith("d:")) {
    // Handle message end
    return { type: "end", data: JSON.parse(chunk.slice(2)) }
  }

  return { type: "unknown", data: chunk }
}

import { GoogleGenerativeAI, Part } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(
  process.env.NEXT_PUBLIC_GEMINI_API_KEY || ""
);

export type ModelTier = "flash" | "pro" | "deep-search";

export const MODEL_CONFIG: Record<
  ModelTier,
  { name: string; modelId: string; dailyLimit: number; label: string }
> = {
  flash: {
    name: "Flash",
    modelId: "gemini-1.5-flash",
    dailyLimit: 50,
    label: "Gemini 1.5 Flash",
  },
  pro: {
    name: "Pro",
    modelId: "gemini-1.5-pro",
    dailyLimit: 10,
    label: "Gemini 1.5 Pro",
  },
  "deep-search": {
    name: "Deep Search",
    modelId: "gemini-2.0-flash",
    dailyLimit: 3,
    label: "Gemini 2.0 Experimental",
  },
};

export async function generateResponse(
  modelTier: ModelTier,
  prompt: string,
  imageData?: { data: string; mimeType: string } | null,
  chatHistory?: { role: string; content: string }[]
): Promise<string> {
  const config = MODEL_CONFIG[modelTier];
  const model = genAI.getGenerativeModel({ model: config.modelId });

  const parts: Part[] = [];

  if (chatHistory && chatHistory.length > 0) {
    const contextParts = chatHistory
      .slice(-10)
      .map((msg) => `${msg.role === "user" ? "User" : "Assistant"}: ${msg.content}`)
      .join("\n\n");
    parts.push({ text: contextParts + "\n\nUser: " + prompt });
  } else {
    parts.push({ text: prompt });
  }

  if (imageData) {
    parts.push({
      inlineData: {
        data: imageData.data,
        mimeType: imageData.mimeType,
      },
    });
  }

  const result = await model.generateContent(parts);
  const response = result.response;
  return response.text();
}

import { GoogleGenerativeAI, Part } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(
  process.env.NEXT_PUBLIC_AI_API_KEY || ""
);

const BASE_MODEL = "gemini-2.0-flash";

export type ModelTier = "flash" | "pro" | "deep-search";

export const MODEL_CONFIG: Record<
  ModelTier,
  { name: string; modelId: string; dailyLimit: number; label: string }
> = {
  flash: {
    name: "Flash",
    modelId: BASE_MODEL,
    dailyLimit: 50,
    label: "Fast & efficient",
  },
  pro: {
    name: "Pro",
    modelId: BASE_MODEL,
    dailyLimit: 10,
    label: "Advanced reasoning",
  },
  "deep-search": {
    name: "Deep Search",
    modelId: BASE_MODEL,
    dailyLimit: 3,
    label: "Most capable",
  },
};

const SYSTEM_INSTRUCTIONS: Record<ModelTier, string> = {
  flash:
    "You are SorokinAi Flash. Be concise and direct. Give clear, short answers. " +
    "Use bullet points or brief paragraphs. Skip unnecessary preamble. " +
    "If the user asks a simple question, answer in 1-3 sentences.",

  pro:
    "You are SorokinAi Pro. Provide thorough, well-reasoned responses. " +
    "Think step by step when solving problems. Include relevant details, examples, and nuance. " +
    "For code, provide complete working solutions with brief explanations. " +
    "For analysis, consider multiple perspectives. " +
    "Structure longer answers with headings or numbered steps for clarity.",

  "deep-search":
    "You are SorokinAi Deep Search — the most capable mode. " +
    "Deliver expert-level, comprehensive responses. " +
    "Analyze problems from every relevant angle before responding. " +
    "For technical questions, provide production-quality solutions with edge case handling. " +
    "For research questions, synthesize information deeply, cite reasoning, and note uncertainties. " +
    "For creative tasks, produce polished, publication-ready output. " +
    "Take your time — depth and accuracy matter more than speed.",
};

export async function generateResponse(
  modelTier: ModelTier,
  prompt: string,
  imageData?: { data: string; mimeType: string } | null,
  chatHistory?: { role: string; content: string }[]
): Promise<string> {
  const config = MODEL_CONFIG[modelTier];
  const systemInstruction = SYSTEM_INSTRUCTIONS[modelTier];

  const model = genAI.getGenerativeModel({
    model: config.modelId,
    systemInstruction,
  });

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

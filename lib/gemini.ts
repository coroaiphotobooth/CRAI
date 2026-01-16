import { GoogleGenAI } from "@google/genai";

export const generateAIImage = async (
  base64Source: string,
  prompt: string,
  aspectRatio: "9:16" | "16:9" = "9:16"
) => {
  try {
    const apiKey = import.meta.env.VITE_GEMINI_API_KEY as string | undefined;
    if (!apiKey) {
      throw new Error(
        "Missing Gemini API key. Set VITE_GEMINI_API_KEY in Vercel Environment Variables and redeploy."
      );
    }

    const ai = new GoogleGenAI({ apiKey });

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash-image",
      contents: {
        parts: [
          {
            inlineData: {
              data: base64Source.split(",")[1],
              mimeType: "image/png",
            },
          },
          {
            text: `${prompt}. High resolution, ${aspectRatio} aspect ratio, cinematic lighting, photorealistic, maintaining person's facial features and identity. No text, no watermark.`,
          },
        ],
      },
      config: {
        imageConfig: {
          aspectRatio,
        },
      },
    });

    const candidates = response.candidates;
    if (candidates?.length) {
      for (const part of candidates[0].content.parts) {
        if (part.inlineData?.data) {
          return `data:image/png;base64,${part.inlineData.data}`;
        }
      }
    }

    throw new Error("No image data returned from Gemini");
  } catch (error) {
    console.error("Gemini Generation Error:", error);
    throw error;
  }
};

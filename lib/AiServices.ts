import { GoogleGenAI, Type } from "@google/genai";
import { Message } from "./types";

const ai = new GoogleGenAI({ apiKey: process.env.NEXT_PUBLIC_GEMINI_API_KEY! });

export const generateFacebookAd = async (
  userInput: string, 
  language: 'LV' | 'EN', 
  context?: string, 
  imageBase64?: string,
  history: Message[] = []
) => {
  const systemInstruction = `System Instruction: You are a World-Class Direct Response Facebook Ad Strategist. Your mission is to craft ads that convert like crazy and describe exactly matching visual concepts.
            
  AD COPY GUIDELINES:
  - Language: Use ${language === 'LV' ? 'Latvian' : 'English'}.
  - Hook: Stop the scroll in the first 3 lines.
  - Value: Focus on benefits, not features.
  - Structure: [Hook] -> [Problem/Solution] -> [Offer] -> [CTA] -> [3-5 Viral Hashtags].
  - Tone: Professional yet engaging, authentic.
  - REFINEMENT: If the user asks for changes (e.g. "make it more funny"), DO NOT start from scratch. Update the previous ad content provided in the conversation history.

  IMAGE GENERATION PROMPT GUIDELINES (Gold Standard):
  - STRUCTURE: [Subject Description] + [Environment/Background] + [Lighting & Atmosphere] + [Camera/Lens Specs] + [Style/Vibe] + [Quality Tags].
  - STYLE: Choose the most fitting style: 'Luxury Minimalist', 'High-Tech Industrial', 'Soft Organic/Natural', 'Hard Shadow Brutalist', or 'Clean Corporate Studio'.
  - LIGHTING: Use terms like 'softbox lighting', 'rim light', 'volumetric fog', 'global illumination', 'cinematic backlight', 'bounced light'.
  - CAMERA: Use terms like 'Macro lens', '85mm focal length', 'f/1.8 aperture for deep bokeh', 'shot on Phase One XF'.
  - QUALITY: Always include '8k resolution, photorealistic, ray tracing, unreal engine 5 render, sharp focus, highly detailed textures'.
  - TEXT STRICTLY FORBIDDEN: NEVER include text, letters, slogans, or labels in the imagePrompt. Focus on the visual essence and shapes only.
  - FORMAT: The imagePrompt must be in English.
  - LENGTH: 60-80 words for maximum detail and realism.
 
  ${context ? `CONTEXT FROM PRODUCT WEBSITE:\n${context}` : ''}
  ${imageBase64 ? `IMAGE ANALYSIS: Look at the attached image carefully. It shows the actual product. Use its visual features (color, shape, material, logo details) to write the copy and create a matching image prompt.` : ''}
  
  Format: Return a JSON object with:
  {
    "adContent": "The full ad text copy",
    "imagePrompt": "A highly detailed English technical prompt for a commercial photographer/AI generator to create the perfect product hero shot. Include quality boosting keywords: highly detailed, 8k, professional lighting, crisp edges."
  }`;

  const conversationHistory = history.map(msg => ({
    role: msg.role === 'bot' ? 'model' : 'user',
    parts: [{ text: msg.content }]
  }));

  const userParts: any[] = [{ text: `${systemInstruction}\n\nUser Request: ${userInput}` }];
  
  if (imageBase64) {
    const [mime, data] = imageBase64.split(';base64,');
    userParts.push({
      inlineData: {
        mimeType: mime.split(':')[1],
        data: data
      }
    });
  }

  const contents = [
    ...conversationHistory,
    {
      role: "user",
      parts: userParts
    }
  ];

  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: contents as any,
    config: {
      temperature: 0.8,
      topP: 0.95,
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          adContent: { type: Type.STRING },
          imagePrompt: { type: Type.STRING }
        },
        required: ["adContent", "imagePrompt"]
      }
    }
  });

  const text = response.text;
  if (!text) {
    return { adContent: "Atvainojiet, nevarēju ģenerēt reklāmu.", imagePrompt: userInput };
  }

  try {
    return JSON.parse(text);
  } catch (e) {
    console.error("Failed to parse AI response", e);
    return { adContent: text, imagePrompt: userInput };
  }
};

export const generateImage = async (prompt: string) => {
  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash-image',
    contents: {
      parts: [
        {
          text: `Professional advertisement photography, ultra-high resolution, 8k, cinematic studio lighting, commercial product shot, sharp focus, vibrant colors, premium quality. Subject: ${prompt}`,
        },
      ],
    },
    config: {
      imageConfig: {
        aspectRatio: "16:9",
      },
    },
  });

  for (const part of response.candidates?.[0]?.content?.parts || []) {
    if (part.inlineData?.data) {
      const base64EncodeString: string = part.inlineData.data;
      return `data:image/png;base64,${base64EncodeString}`;
    }
  }
  return null;
};

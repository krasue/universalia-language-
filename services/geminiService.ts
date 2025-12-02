import { GoogleGenAI, Type, Modality } from "@google/genai";
import { MODEL_TRANSLATION, MODEL_TTS, SYSTEM_INSTRUCTION } from "../constants";
import { TranslationDirection, TranslationResponse } from "../types";
import { decode, decodeAudioData } from "./audioUtils";

const apiKey = process.env.API_KEY || "";
const ai = new GoogleGenAI({ apiKey });

export async function translateText(
  input: string,
  direction: TranslationDirection
): Promise<TranslationResponse> {
  if (!apiKey) throw new Error("API Key is missing");

  const prompt = `
    Direction: ${direction === TranslationDirection.CN_TO_UNI ? "Chinese (Mandarin) to Universalia" : "Universalia to Chinese (Mandarin)"}
    Input Text: "${input}"
  `;

  try {
    const response = await ai.models.generateContent({
      model: MODEL_TRANSLATION,
      contents: prompt,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            translated: { type: Type.STRING },
            ipa: { type: Type.STRING },
            morphologyBreakdown: { 
              type: Type.ARRAY, 
              items: { type: Type.STRING } 
            },
            grammarNotes: { type: Type.STRING }
          },
          required: ["translated", "ipa", "morphologyBreakdown", "grammarNotes"]
        }
      }
    });

    const text = response.text;
    if (!text) throw new Error("No response from model");

    const json = JSON.parse(text);
    return {
      original: input,
      ...json
    };
  } catch (error) {
    console.error("Translation error:", error);
    throw error;
  }
}

export async function generateSpeech(text: string): Promise<AudioBuffer> {
  if (!apiKey) throw new Error("API Key is missing");

  // We ask the TTS to speak slowly and clearly.
  // Universalia uses pure vowels.
  const ttsPrompt = `Pronounce the following Universalia text distinctly and slowly: ${text}`;

  try {
    const response = await ai.models.generateContent({
      model: MODEL_TTS,
      contents: [{ parts: [{ text: ttsPrompt }] }],
      config: {
        responseModalities: [Modality.AUDIO],
        speechConfig: {
          voiceConfig: {
            // Using 'Kore' as it often has a good neutral tone for constructed languages
            prebuiltVoiceConfig: { voiceName: 'Kore' }, 
          },
        },
      },
    });

    const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
    if (!base64Audio) {
      throw new Error("No audio data returned");
    }

    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)({
      sampleRate: 24000
    });
    
    const audioBuffer = await decodeAudioData(
      decode(base64Audio),
      audioContext,
      24000,
      1
    );

    return audioBuffer;

  } catch (error) {
    console.error("TTS error:", error);
    throw error;
  }
}

export function playAudioBuffer(buffer: AudioBuffer) {
  const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)({
      sampleRate: 24000
  });
  const source = audioContext.createBufferSource();
  source.buffer = buffer;
  source.connect(audioContext.destination);
  source.start();
}
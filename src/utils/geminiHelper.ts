import { GoogleGenerativeAI } from "@google/generative-ai";
import { ChatHistory, GenerateConfig, ChatSettings } from "../modules/ai/types";

const apiKey = process.env.GEMINI_API_KEY; 

if(!apiKey) {
    throw new Error("Api key not found");
}

const genAI = new GoogleGenerativeAI(apiKey);

export async function chatToGemini(
    userMessage: string,
    history: ChatHistory,
    setting: ChatSettings,
): Promise<string> {
    
    const model = genAI.getGenerativeModel({
        model: setting.model || "gemini-2.0-flash",
        systemInstruction:
        setting.systemInstruction || "Your Name is Zadulis Ai. You are a helpful assistant that helps people with their problems. You are a very helpful assistant.",
    });

    const generationConfig: GenerateConfig = {
        temperature: setting.temperature || 1,
        topP: 0.9,
        responseMimeType: "text/plain",

    }

    const chatSession = model.startChat({
        generationConfig,
        history
    })

    try {
      const result = await chatSession.sendMessage(userMessage);
        return result.response.text();   

    } catch (error) {
        console.error(error);
        throw error;
    }


    }

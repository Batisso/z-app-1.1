import { NextResponse } from "next/server";
import { chatToGemini } from "@/utils/geminiHelper";
import { ChatHistory, ChatSettings } from "@/modules/ai/types";

export async function POST(req: Request) {
try {
    const { userMessage, history, setting } = (await req.json()) as {
        userMessage: string;
        history: ChatHistory;
        setting: ChatSettings;
    };

    const aiResponse = await chatToGemini(userMessage, history, setting);
    return NextResponse.json({ response: aiResponse });

    
} catch (error) {
    console.error(error);
    return NextResponse.json(
        { error: "Error: 404 - Internal Server Error" }, 
        { status: 500 }
    );
   }

}
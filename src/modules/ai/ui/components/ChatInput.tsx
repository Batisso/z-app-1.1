"use client";

import { useState } from "react";
import { Settings, Send, X } from "lucide-react";

interface ChatInputProps {
    onSend: (message: string) => void;
    onOpenSettings:() => void;
} 

export default function ChatInput({onSend, onOpenSettings}: ChatInputProps){
    console.log("onSend:", onSend);
    const [message, setMessage] = useState("");

    const handleChange = (e:React.ChangeEvent<HTMLTextAreaElement>) => {
        setMessage(e.target.value);
    };

    const handleSend = () => {
        const trimmedMessage = message.trim();
        if(trimmedMessage){
            onSend(trimmedMessage);
            handleClear();
        }
    }

    const handleClear = () => {
        setMessage("");
    };

    const handleKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if(e.key === "Enter"){
            handleSend();
        }
    };

    return (
        <div className="fixed bottom-0 left-0 right-0 flex flex-col max-w-4xl mx-auto w-full"> 
        <div className="flex items-center border border-black/10 p-3 mx-4 rounded-t-3xl bg-white">   
        <div className="relative flex-1 mx-2">   
         <textarea className="w-full px-3 py-2 bg-transparent border-none focus:outline-none"
         placeholder="Type a message..."
         value={message}
         onChange={handleChange}
         onKeyDown={handleKeyPress}
         />
         {message && (
            <button className="absolute right-0 top-1/2 transform -translate-y-1/2 p-1 text-gray-500 hover:text-gray-700"
            onClick={handleClear} 
            >
                <X size={16}/>
            </button>
         )}
        </div>


        <div className="flex items-center">
            <button className="p-2 text-gray-500 hover:text-orange-400
            rounded-full hover:bg-gray-100 mr-1">
            <Settings size={20}/>
            </button>
            
        <button className={`p-2 rounded-full
            ${
                message.trim()
                ? "bg-orange-400 text-white hover:bg-orange-200"
                : "bg-gray-200 text-gray-400 hover:bg-gray-300 cursor-not-allowed"
            }
            `}
            onClick={handleSend}
            disabled={!message.trim()}
            aria-label="Send Message"
            >
                <Send size={20}/>

            </button>

        </div>
             
        </div>  

        </div>
    )
}

"use client";
import { useRef, useEffect } from 'react';
import { ChatHistory } from '../../types';
import { User, Bot, Key } from 'lucide-react';


interface MessageWindowProps {
    history: ChatHistory;
}

export default function MessageWindow({history}:MessageWindowProps){
   const messageEndRef = useRef<HTMLDivElement>(null);

   useEffect(() => {
    messageEndRef.current?.scrollIntoView({behavior: 'smooth'});
   }, [history]);

   return(
    <div className="flex-1 p-3 overflow-y-auto">
    <div className="max-w-3xl mx-auto">
     {history.map((msg, index) => {
        const isUser = msg.role === "user";
        return(
            <div key={index} 
            className={`flex ${isUser ? "justify-end" : "justify-start"}`}
            >
            {isUser && (
                <div className="mr-2"> 
                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gray">
                    <Bot size={16} className='text-gray-700'/>
                    </div>
                </div>
            )}
             
             <div className={`px-4 py-y shadow-md rounded-lg ${
                isUser
                ? "bg-orange-600 text-white rounded-br-none"
                : "bg-white text-gray-800 rounded-bl-none"
             }
             max-w-xs sm:max-w-md
             `}
             >

                <div className="whitespace-pre-wrap break-words">
                    {msg.parts.map((part, idx) => (
                        <span key={idx}>{part.text}</span>
                    ))}
                    
                </div> 

             </div>

             {isUser && (
                <div className='mr-2'>
                <div className='flex items-center justify-center w-8 h-8 rounded-full bg-gray'>
                 <User size={16} className='text-white'/>
                </div>
                </div>
             )}
            </div>
        );
        })}

        <div ref={messageEndRef}></div>
     
    </div>
    </div>
   )

}

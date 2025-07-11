"use client";

import { useState } from 'react';
import ChatInput from '../components/ChatInput';
import MessageWindow from '../components/MessageWindow';
import { ChatHistory, ChatSettings, Message, MessageRole } from '../../types';
import { set } from 'date-fns';

export default function Home(){
  const [history, setHistory] = useState<ChatHistory>([]);
  const [setting, setSetting] = useState<ChatSettings>({
    temperature:1,
    model:"gemini-2.0-flash",
    systemInstruction: "Your name is Zadulis Ai. You are an African Ai assistant for creatives.",
  });



const handleSend = async (message: string) => {
  const newUserMessage:Message = {
    role: "user",
    parts: [{text: message}]
  };

const updatedHistory = [...history, newUserMessage];
setHistory(updatedHistory);


try {
  const response = await fetch("../../../../app/api/chat", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      userMessage: message,
      history: updatedHistory,
      settings: setting,
  }),
});

const data = await response.json();
if(data.error) {
  console.error("Zadulis Ai Error", data.error);
}


const aiMessage:Message = {
  role: "model",
  parts: [{text:data.response}],
};

setHistory([...updatedHistory, aiMessage]);

} catch (error) {
  console.error("Zadulis Ai Error", error); 
}
  };

  return (
    <div className='flex flex-col py-36'>
      <MessageWindow history={history} />
      <ChatInput onSend={handleSend} onOpenSettings={() => {}}/>

    </div>
  );
}

"use client";
import React, { useState } from 'react';

interface ChatMessage {
    text: string;
    isUser: boolean;
}

// Gemini API format
interface GeminiMessage {
    role: "user" | "model";
    parts: [{ text: string }];
}

const Chatbot: React.FC = () => {
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [newMessage, setNewMessage] = useState<string>('');
    const [isTyping, setIsTyping] = useState(false);

    const handleSendMessage = async () => {
        if (newMessage.trim() === '') {
            return;
        }

        const userMessage: ChatMessage = { text: newMessage, isUser: true };
        const updatedMessages = [...messages, userMessage];
        setMessages(updatedMessages);
        setNewMessage('');
        setIsTyping(true);

        try {
            // Convert chat history to Gemini format
            const geminiHistory: GeminiMessage[] = updatedMessages.map(msg => ({
                role: msg.isUser ? "user" : "model",
                parts: [{ text: msg.text }]
            }));

            const response = await fetch('/api/chat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    userMessage: newMessage,
                    history: geminiHistory,
                    settings: {
                        temperature: 1,
                        model: "gemini-2.0-flash",
                        systemInstruction: "Your name is Zadulis Ai. You are an African Ai assistant for creatives.",
                    },
                }),
            });

            if (!response.ok) {
                const errorText = await response.text();
                console.error('API Error Response:', errorText);
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            
            if (data.error) {
                throw new Error(data.error);
            }

            const aiMessage: ChatMessage = { text: data.response, isUser: false };
            setMessages([...updatedMessages, aiMessage]);
            
        } catch (error) {
            console.error('Error sending message:', error);
            const errorMessage: ChatMessage = { 
                text: 'Error: Could not send message. Please try again.', 
                isUser: false 
            };
            setMessages([...updatedMessages, errorMessage]);
        } finally {
            setIsTyping(false);
        }
    };

    // Add this missing function
    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage();
        }
    };

    return (
        <div className="relative w-full max-w-4xl mx-auto h-[600px] bg-gradient-to-br from-slate-900/90 via-purple-900/80 to-blue-900/90 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/10 overflow-hidden">
            {/* Glassmorphism overlay */}
            <div className="absolute inset-0 bg-gradient-to-br from-white/5 via-transparent to-white/5 backdrop-blur-sm"></div>
            
            {/* Animated background elements */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-10 left-10 w-32 h-32 bg-purple-500/10 rounded-full blur-3xl animate-pulse"></div>
                <div className="absolute bottom-20 right-16 w-40 h-40 bg-blue-500/10 rounded-full blur-2xl animate-pulse delay-1000"></div>
                <div className="absolute top-1/2 left-1/3 w-24 h-24 bg-indigo-500/10 rounded-full blur-2xl animate-pulse delay-500"></div>
            </div>

            {/* Header with glassmorphism */}
            <div className="relative z-10 bg-white/10 backdrop-blur-md border-b border-white/20 p-6">
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                        <div className="relative">
                            <div className="w-12 h-12 bg-gradient-to-br from-purple-400/80 to-blue-500/80 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg border border-white/20">
                                <span className="text-white font-bold text-lg">Z</span>
                            </div>
                            <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-400 rounded-full border-2 border-white shadow-sm animate-pulse"></div>
                        </div>
                        <div>
                            <h3 className="text-white font-semibold text-xl">Zadulis AI</h3>
                            <p className="text-white/70 text-sm">Creative Assistant • Online</p>
                        </div>
                    </div>
                    <div className="flex space-x-2">
                        <div className="w-3 h-3 bg-white/20 rounded-full"></div>
                        <div className="w-3 h-3 bg-white/20 rounded-full"></div>
                        <div className="w-3 h-3 bg-white/20 rounded-full"></div>
                    </div>
                </div>
            </div>

            {/* Messages container with glassmorphism scrollbar */}
            <div className="relative z-10 flex-1 h-[400px] overflow-y-auto p-6 scrollbar-thin scrollbar-thumb-white/20 scrollbar-track-transparent hover:scrollbar-thumb-white/30 transition-colors">
                {/* Welcome message when empty */}
                {messages.length === 0 && (
                    <div className="flex flex-col items-center justify-center h-full text-center">
                        <div className="w-20 h-20 bg-gradient-to-br from-orange-400/90 to-red-500/90 backdrop-blur-sm rounded-full flex items-center justify-center mb-6 border border-white/20 shadow-lg">
                            <span className="text-white font-bold text-2xl">Z</span>
                        </div>
                        <h4 className="text-white text-xl font-semibold mb-3">Welcome to Zadulis AI</h4>
                        <p className="text-white/70 max-w-md leading-relaxed">Your creative companion is ready to help. Start a conversation and let's create something amazing together!</p>
                        <div className="flex space-x-2 mt-4">
                            <div className="px-3 py-1 bg-white/10 backdrop-blur-sm rounded-full text-white/60 text-xs border border-white/20">Creative</div>
                            <div className="px-3 py-1 bg-white/10 backdrop-blur-sm rounded-full text-white/60 text-xs border border-white/20">Intelligent</div>
                            <div className="px-3 py-1 bg-white/10 backdrop-blur-sm rounded-full text-white/60 text-xs border border-white/20">Helpful</div>
                        </div>
                    </div>
                )}

                <div className="space-y-3">
                    {messages.map((message, index) => (
                        <div key={index} className="relative">
                            {/* Chat bubble container with enhanced styling */}
                            <div 
                                className={`
                                    group relative inline-block max-w-xs lg:max-w-md xl:max-w-lg
                                    ${message.isUser ? 'ml-auto' : 'mr-auto flex items-start space-x-3'}
                                    transform transition-all duration-300 hover:scale-[1.02] mb-4
                                `}
                            >
                                {/* AI Avatar (only for bot messages) */}
                                {!message.isUser && (
                                    <div className="flex-shrink-0 relative">
                                        <div className="w-10 h-10 bg-gradient-to-br from-purple-400 via-blue-400 to-indigo-400 rounded-full flex items-center justify-center shadow-lg ring-2 ring-white/20 group-hover:ring-white/40 transition-all duration-300">
                                            <span className="text-white font-bold text-sm">Z</span>
                                            {/* Online indicator */}
                                            <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-400 rounded-full border-2 border-white animate-pulse"></div>
                                        </div>
                                        {/* AI thinking animation dots */}
                                        <div className="absolute -top-1 -right-1 flex space-x-0.5 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                            <div className="w-1 h-1 bg-blue-400 rounded-full animate-bounce"></div>
                                            <div className="w-1 h-1 bg-purple-400 rounded-full animate-bounce delay-100"></div>
                                            <div className="w-1 h-1 bg-indigo-400 rounded-full animate-bounce delay-200"></div>
                                        </div>
                                    </div>
                                )}

                                {/* Message bubble */}
                                <div className={`
                                    relative flex-1 ${message.isUser ? 'flex justify-end' : ''}
                                `}>
                                    {/* User avatar (only for user messages) */}
                                    {message.isUser && (
                                        <div className="flex-shrink-0 ml-3 order-2">
                                            <div className="w-8 h-8 bg-gradient-to-br from-gray-400 to-gray-600 rounded-full flex items-center justify-center shadow-md">
                                                <span className="text-white font-bold text-xs">U</span>
                                            </div>
                                        </div>
                                    )}

                                    {/* Chat bubble with tail */}
                                    <div 
                                        className={`
                                            relative px-4 py-3 rounded-2xl shadow-lg backdrop-blur-sm
                                            ${message.isUser 
                                                ? 'bg-gradient-to-br from-purple-500 to-blue-500 text-white rounded-br-sm order-1' 
                                                : 'bg-white/15 text-white border border-white/20 rounded-bl-sm backdrop-blur-md'
                                            }
                                            group-hover:shadow-xl transition-all duration-300
                                            before:absolute before:w-0 before:h-0
                                            ${message.isUser 
                                                ? 'before:border-l-[12px] before:border-l-transparent before:border-t-[12px] before:border-t-purple-500 before:right-[-6px] before:bottom-0' 
                                                : 'before:border-r-[12px] before:border-r-transparent before:border-t-[12px] before:border-t-white/15 before:left-[-6px] before:bottom-0'
                                            }
                                        `}
                                        style={{
                                            textAlign: message.isUser ? 'right' : 'left',
                                            padding: '10px',
                                            borderRadius: '5px',
                                            backgroundColor: message.isUser ? '#DCF8C6' : '#E5E5EA',
                                            marginBottom: '5px',
                                            wordWrap: 'break-word',
                                        }}
                                    >
                                        {/* Message header with sender name */}
                                        <div className={`
                                            text-xs font-medium mb-1 opacity-80
                                            ${message.isUser ? 'text-purple-100' : 'text-purple-200'}
                                        `}>
                                            {message.isUser ? 'You' : 'Zadulis AI'}
                                        </div>

                                        {/* Message content */}
                                        <div className="leading-relaxed text-sm">
                                            {message.text}
                                        </div>

                                        {/* Message footer with timestamp and status */}
                                        <div className={`
                                            flex items-center justify-between mt-2 text-xs opacity-60
                                            ${message.isUser ? 'flex-row-reverse text-purple-100' : 'text-purple-200'}
                                        `}>
                                            <span>
                                                {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                            </span>
                                            
                                            {/* Message status indicators */}
                                            {message.isUser && (
                                                <div className="flex space-x-1">
                                                    <div className="w-1 h-1 bg-purple-200 rounded-full"></div>
                                                    <div className="w-1 h-1 bg-purple-200 rounded-full"></div>
                                                </div>
                                            )}
                                        </div>

                                        {/* Typing indicator for AI messages */}
                                        {!message.isUser && (
                                            <div className="absolute -bottom-6 left-4 flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                                <div className="text-xs text-purple-300">AI is online</div>
                                                <div className="w-1 h-1 bg-green-400 rounded-full animate-pulse"></div>
                                            </div>
                                        )}
                                    </div>

                                    {/* Hover glow effect */}
                                    <div className={`
                                        absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-10 transition-opacity duration-300 pointer-events-none -z-10
                                        ${message.isUser 
                                            ? 'bg-gradient-to-br from-purple-400 to-blue-400 blur-lg' 
                                            : 'bg-white blur-lg'
                                        }
                                    `}></div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Typing indicator */}
                {isTyping && (
                    <div className="flex items-center space-x-3 mt-4">
                        <div className="w-8 h-8 bg-gradient-to-br from-purple-400 to-blue-400 rounded-full flex items-center justify-center">
                            <span className="text-white font-bold text-xs">Z</span>
                        </div>
                        <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl px-4 py-3">
                            <div className="flex space-x-1">
                                <div className="w-2 h-2 bg-white/60 rounded-full animate-bounce"></div>
                                <div className="w-2 h-2 bg-white/60 rounded-full animate-bounce delay-100"></div>
                                <div className="w-2 h-2 bg-white/60 rounded-full animate-bounce delay-200"></div>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Input area with glassmorphism */}
            <div className="relative z-10 bg-white/5 backdrop-blur-md border-t border-white/20 p-6">
                <div className="flex items-end space-x-4">
                    <div className="flex-1 relative">
                        <input
                            type="text"
                            value={newMessage}
                            onChange={(e) => setNewMessage(e.target.value)}
                            onKeyPress={handleKeyPress}
                            placeholder="Share your creative thoughts..."
                            className="w-full bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl px-6 py-4 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-purple-400/50 focus:border-purple-400/50 transition-all duration-300"
                            style={{
                                width: '80%',
                                padding: '10px',
                                border: '1px solid #ccc',
                                borderRadius: '5px',
                                marginBottom: '10px',
                            }}
                        />
                        {/* Input decoration */}
                        <div className="absolute right-4 top-1/2 transform -translate-y-1/2 flex space-x-1">
                            <div className="w-1.5 h-1.5 bg-purple-400/60 rounded-full animate-pulse"></div>
                            <div className="w-1.5 h-1.5 bg-blue-400/60 rounded-full animate-pulse delay-200"></div>
                        </div>
                    </div>
                    
                    <button 
                        onClick={handleSendMessage}
                        disabled={!newMessage.trim() || isTyping}
                        className="group relative overflow-hidden bg-gradient-to-r from-purple-500 via-blue-500 to-indigo-500 hover:from-purple-600 hover:via-blue-600 hover:to-indigo-600 disabled:from-gray-500 disabled:to-gray-600 text-white rounded-2xl transition-all duration-300 transform hover:scale-105 active:scale-95 disabled:scale-100 disabled:cursor-not-allowed shadow-lg hover:shadow-2xl disabled:shadow-none backdrop-blur-sm border border-white/20"
                        style={{
                            padding: '10px 20px',
                            backgroundColor: '#007BFF',
                            color: 'white',
                            border: 'none',
                            borderRadius: '5px',
                            cursor: 'pointer',
                        }}
                    >
                        {/* Animated background shimmer */}
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-in-out"></div>
                        
                        {/* Button content container */}
                        <div className="relative flex items-center justify-center space-x-2 px-2 py-1">
                            {/* Loading spinner for when typing */}
                            {isTyping ? (
                                <div className="flex items-center space-x-2">
                                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                    <span className="font-medium">Sending...</span>
                                </div>
                            ) : (
                                <>
                                    {/* Send icon with animation */}
                                    <svg 
                                className="w-5 h-5 transform group-hover:translate-x-1 group-hover:-translate-y-0.5 transition-transform duration-300 group-active:scale-110" 
                                fill="none" 
                                stroke="currentColor" 
                                viewBox="0 0 24 24"
                            >
                                         <path 
                                    strokeLinecap="round" 
                                    strokeLinejoin="round" 
                                    strokeWidth={2.5} 
                                    d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" 
                                />
                                    </svg>
                                    
                                    {/* Button text */}
                                    <span className="font-semibold tracking-wide group-hover:tracking-wider transition-all duration-300">
                                        Send
                                    </span>
                                </>
                            )}
                        </div>
                        
                        {/* Pulse effect on hover */}
                        <div className="absolute inset-0 rounded-2xl bg-white/10 opacity-0 group-hover:opacity-100 group-hover:animate-pulse transition-opacity duration-300"></div>
                        
                        {/* Border glow effect */}
                        <div className="absolute inset-0 rounded-2xl border-2 border-transparent bg-gradient-to-r from-purple-400 via-blue-400 to-indigo-400 opacity-0 group-hover:opacity-50 transition-opacity duration-300 -z-10 blur-sm"></div>
                        
                        {/* Click ripple effect */}
                        <div className="absolute inset-0 rounded-2xl bg-white/20 scale-0 group-active:scale-100 transition-transform duration-150 ease-out"></div>
                    </button>
                </div>
            </div>
        </div>
    );
};
export default Chatbot;
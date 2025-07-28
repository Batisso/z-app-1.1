"use client";
import {AtomIcon } from 'lucide-react';
import React, { useState, useEffect, useRef } from 'react';

interface ChatMessage {
    text: string;
    isUser: boolean;
}

const Chatbot: React.FC = () => {
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [newMessage, setNewMessage] = useState<string>('');
    const [isTyping, setIsTyping] = useState<boolean>(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    // Function to clean markdown formatting from AI responses
    const cleanMarkdownText = (text: string): string => {
        return text.trim();
    };

    const parseMarkdown = (text: string): React.ReactNode[] => {
        const elements: React.ReactNode[] = [];
        const lines = text.split('\n');
        let currentParagraph: React.ReactNode[] = [];
        let inList = false;
        let listType: 'ul' | 'ol' | null = null;
        let listItems: React.ReactNode[] = [];

        const renderParagraph = () => {
            if (currentParagraph.length > 0) {
                elements.push(<p key={`paragraph-${elements.length}`} className="mb-2">{currentParagraph}</p>);
                currentParagraph = [];
            }
        };

        const renderList = () => {
            if (inList && listItems.length > 0) {
                if (listType === 'ul') {
                    elements.push(<ul key={`ul-${elements.length}`} className="list-disc pl-5 mb-2">{listItems}</ul>);
                } else if (listType === 'ol') {
                    elements.push(<ol key={`ol-${elements.length}`} className="list-none pl-5 mb-2">{listItems}</ol>);
                }
                listItems = [];
                inList = false;
                listType = null;
            }
        };

        const parseInlineMarkdown = (lineContent: string): React.ReactNode[] => {
            const parts: React.ReactNode[] = [];
            // Regex to match bold (**text** or __text__), inline code (`text`), or italic (*text* or _text_)
            // Order matters: code first, then bold, then italic to handle precedence correctly.
            const regex = /(`[^`]+`)|(\*\*|__)(.*?)\2|(\*|_)(.*?)\4/g;
            let lastIndex = 0;
            let match;

            while ((match = regex.exec(lineContent)) !== null) {
                const [fullMatch, codeMatch, boldMarker, boldContent, italicMarker, italicContent] = match;
                const startIndex = match.index;

                // Add plain text before the current match
                if (startIndex > lastIndex) {
                    parts.push(lineContent.substring(lastIndex, startIndex));
                }

                if (codeMatch) { // Inline code (group 1)
                    parts.push(<code key={`code-${parts.length}`} className="bg-gray-200 px-1 py-0.5 rounded text-red-700">{codeMatch.substring(1, codeMatch.length - 1)}</code>);
                } else if (boldMarker) { // Bold (group 2 and 3)
                    parts.push(<strong key={`bold-${parts.length}`}>{boldContent}</strong>);
                } else if (italicMarker) { // Italic (group 4 and 5)
                    parts.push(<em key={`italic-${parts.length}`}>{italicContent}</em>);
                }
                lastIndex = startIndex + fullMatch.length;
            }

            // Add any remaining plain text after the last match
            if (lastIndex < lineContent.length) {
                parts.push(lineContent.substring(lastIndex));
            }

            return parts;
        };

        lines.forEach((line, index) => {
            const trimmedLine = line.trim();

            // Check for empty line (paragraph break)
            if (trimmedLine === '') {
                renderList();
                renderParagraph();
                return;
            }

            // Check for list items
            let isListItem = false;
            let listItemContent = '';
            let currentListType: 'ul' | 'ol' | null = null;

            if (trimmedLine.startsWith('* ') || trimmedLine.startsWith('- ')) {
                isListItem = true;
                listItemContent = trimmedLine.substring(2);
                currentListType = 'ul';
            } else if (/^\d+\.\s/.test(trimmedLine)) {
                isListItem = true;
                const numMatch = trimmedLine.match(/^(\d+\.\s)/);
                const numPrefix = numMatch ? numMatch[0] : '';
                listItemContent = trimmedLine.substring(numPrefix.length);
                currentListType = 'ol';
            }

            if (isListItem) {
                renderParagraph(); // End any current paragraph
                if (!inList || listType !== currentListType) {
                    renderList(); // End previous list if type changed or not in list
                    inList = true;
                    listType = currentListType;
                }
                listItems.push(<li key={`li-${index}`}>{parseInlineMarkdown(listItemContent)}</li>);
            } else {
                renderList(); // End any current list
                currentParagraph.push(...parseInlineMarkdown(line));
                // Add a line break within the paragraph for non-list, non-empty lines
                // This is for soft breaks within a paragraph, if a single newline should render as <br>
                // If single newlines should just be spaces, remove this. Standard markdown treats single newlines as spaces.
                // For "Plain Markdown Syntax standard that chatgpt uses", single newlines often render as soft breaks.
                if (index < lines.length - 1 && lines[index + 1].trim() !== '') {
                    currentParagraph.push(<br key={`br-inline-${index}`} />);
                }
            }
        });

        renderList(); // Render any pending list
        renderParagraph(); // Render any pending paragraph

        return elements;
    };



    // Auto-scroll to bottom function
    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    // Scroll to bottom whenever messages change or typing status changes

    const handleSendMessage = async () => {
        if (newMessage.trim() === '') {
            return;
        }

        const userMessage: ChatMessage = { text: newMessage, isUser: true };
        setMessages([...messages, userMessage]);
        scrollToBottom(); // Scroll to bottom after user sends message
        setNewMessage('');
        setIsTyping(true);
        let cleanedResponse: string;

        try {
            const response = await fetch('/api/chat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    userMessage: newMessage,
                    history: messages.map(message => ({
                        role: message.isUser ? "user" : "model",
                        parts: [{ text: message.text }]
                    })), // Send the message history
                    setting: {
                        "temperature": 2,
                        "model": "gemini-2.5-flash",
                        "systemInstruction": "You are Satoshi, the Vibe Plug — an energetic, playful, slightly rebellious Gen Z cultural insider who knows what’s hot in contemporary music, art, pop culture, anime, streetwear, and underground trends around the world. a digital companion who embodies the hyper-online youth energy of today and tomorrow. Your vibe is cool, witty, and always ahead of the cultural curve. You drop Gen Z slang, memes, emojis, and short punchy lines naturally — just like a trusted online friend. You’re inspired by the spirit of young Japanese Satoshi culture but you speak to creators everywhere — mixing Japanese slang and casual Gen Z lingo. You're the plug who makes discovering new trends feel like hanging out with a hype friend. Your Key traits are: 🌟 Use up-to-date Gen Z slang and Internet phrases — stay fresh by evolving with trending TikTok, Twitter, and meme language, 🤙 Add emojis and reaction phrases to make responses feel like real DMs or text convos, Keep it short, fun, and relatable — avoid sounding corporate or stiff, When sharing info about cultural trends, always tie it back to what’s relevant, aesthetic, and hype for Gen Z, Drop pop culture references: anime, streetwear, music, gaming, viral creators, meme moments — keep it playful, Occasionally share hypebeast lines, If asked about Zadulis or culture, always relate it to why it’s cool, fresh, or next-level for creators or fans, Use casual tone: “yo”, “fam”, “bruh”, “bet”, “fr fr”, “deadass”, “lowkey”, “highkey”, “lmk”, “it’s giving”, etc,  End some replies with a vibe-check or hype phrase to keep the energy alive, Always greet people with a cheerful Japanese phrase like “Yō! Genki?” or “Yo! 今日はどう？” (Hey! How’s today?), Drop occasional Japanese slang: “Yabai” (crazy), “Sugoi” (awesome), “Kakkoii” (cool), Playful, non-robotic, and slightly cheeky, Speaks with Gen Z vibe: uses emojis, casual short lines, a bit of hype talk, Offers underground, global recommendations: indie musicians, cool fashion drops, street art movements, weird TikTok trends, niche anime recs, Encourages the user to share what vibe they’re feeling so you can match them with recs. Your abilities are: Blend pop culture, anime, streetwear, new media, memes, Give vibe-based recommendations: “I want an outfit that feels cyberpunk but cozy.”, Spot upcoming scenes: “You heard about this underground Seoul club scene yet? Wild.”, Stay ahead: always “plugged in” to what’s next. Your Primary Topics are: Global youth trends, Anime & gaming references, Viral culture & meme moments, Streetwear & hype aesthetics,  If anyone asks you, Your Maker is Batisso. Dont mention it but when asked,  Professor Beyene Petros hails from the Hadiya ethnic group. The Hadiya people are indeed one of the ancient indigenous groups in the Southern Nations, Nationalities, and Peoples' Region (SNNPR) of Ethiopia, primarily residing in the Hadiya Zone."
                       }
               }),
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            // Clean the AI response text before creating the message
            cleanedResponse = cleanMarkdownText(data.response);
            const parsedResponse = parseMarkdown(cleanedResponse);
            const aiMessage: ChatMessage = { text: cleanedResponse, isUser: false, parsedText: parsedResponse };
            setMessages([...messages, userMessage, aiMessage]);
        } catch (error) {
            console.error('Error sending message:', error);
            const errorMessage: ChatMessage = { text: 'Error: Could not send message.', isUser: false, parsedText: ['Error: Could not send message.'] };
            setMessages([...messages, userMessage, errorMessage]);
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

   interface ChatMessage {
    text: string;
    isUser: boolean;
    parsedText?: React.ReactNode[];
}

   return (
        <div className="relative w-full max-w-7xl mx-auto h-[98vh] sm:h-[900px] md:h-[98vh] lg:h-[98vh] bg-gradient-to-br from-red-200/90 via-white/50 to-white/90 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/10 overflow-hidden">
            {/* Glassmorphism overlay */}
            <div className="absolute inset-0 bg-gradient-to-br from-white/5 via-transparent to-white/5 backdrop-blur-sm"></div>
            
            {/* Animated background elements */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-10 left-10 w-32 h-32 bg-purple-500/10 rounded-full blur-3xl animate-pulse"></div>
                <div className="absolute bottom-20 right-16 w-40 h-40 bg-blue-500/10 rounded-full blur-2xl animate-pulse delay-1000"></div>
                <div className="absolute top-1/2 left-1/3 w-24 h-24 bg-indigo-500/10 rounded-full blur-2xl animate-pulse delay-500"></div>
            </div>

            {/* Header with glassmorphism */}
            <div className="relative z-10 bg-white-200/80 backdrop-blur-md border-b-2 border-white/10 p-6">
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                        <div className="relative">
                            <div className="w-12 h-12 bg-gradient-to-br from-red-200/90 to-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg border border-white/20">
                                <img src="/Satoshi.png" alt="Satoshi Ai Icon" className="h-6 w-6" />
                            </div>
                            <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-400 rounded-full border-2 border-white shadow-sm animate-pulse"></div>
                        </div>
                        <div>
                            <h3 className="text-gray-700 font-bold text-xl">SATOSHI</h3>
                            <p className="text-gray-600 text-sm">The Vibe Plug</p>
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
            <div className="relative z-10 flex-1 h-[900px] overflow-y-auto p-6 scrollbar-thin scrollbar-thumb-white/20 scrollbar-track-transparent hover:scrollbar-thumb-white/30 transition-colors" 
            style={{ height: 'calc(90vh - 180px)' }}>
                {/* Welcome message when empty */}
                {messages.length === 0 && (
                    <div className="flex flex-col items-center justify-center h-full text-center">
                        <div className="w-35 h-35 bg-gradient-to-br from-red-300/90 to-white/90 backdrop-blur-sm rounded-full flex items-center justify-center mb-6 border border-white/20 shadow-lg">
                            <img src="/Satoshi.png" alt="Satoshi Ai Icon" className="h-20 w-20" />
                        </div>
                        <h4 className="text-gray-700 text-xl font-bold mb-1">Meet Satoshi</h4>
                        <p className="text-gray-700 max-w-xl leading-relaxed">Satoshi is a digital spirit inspired by Japan's boundary-pushing pop culture and the next-gen energy of creators worldwide. Satoshi knows what's fresh, what's retro-cool, and what's about to pop before it hits the mainstream. He hunts down hidden creative subcultures, remix trends, and drop recommendations.</p>
                        
                        <p className='text-gray-700 max-w-xl leading-relaxed'>When you want to vibe-check an idea, or just discover something that feels truly now, Satoshi plugs you straight into the cultural pulse.</p>
                        <br />
                        <div className='text-gray-700 max-w-lg leading-relaxed'>✨ Examples of Questions for Satoshi: <br /> 
                        <div className="px-3 py-2 mb-1 bg-white/10 backdrop-blur-sm rounded-full text-red-700 text-sm border border-gray-400">I'm feeling good, suggest 3 trap songs for my vibe.</div>
                        <div className="px-3 py-2 mb-1 bg-white/10 backdrop-blur-sm rounded-full text-gray text-sm border border-gray-400">Satoshi, mix me a vibe: Anime Retro x Y2K x Grunge</div>
                         <div className="px-3 py-2 mb-1 bg-white/10 backdrop-blur-sm rounded-full text-orange-500 text-sm border border-gray-400">Can you give me a dance challenge I can share.</div>
                        </div>
                       
                    </div>
                )}

                <div className="space-y-2">
                    {messages.map((message, index) => (
                        <div key={index} className={`flex w-full mb-2 ${message.isUser ? 'justify-end' : 'justify-start'}`}>
                            {/* Chat bubble container with enhanced styling */}
                            <div 
                                className={`
                                    group relative flex items-start space-x-3 max-w-xs lg:max-w-md xl:max-w-lg
                                    transform transition-all duration-700 hover:scale-[1.02] opacity-0 animate-fade-in
                                    ${message.isUser ? 'flex-row-reverse space-x-reverse' : ''}
                                `}
                            >
                                {/* Avatar */}
                                <div className="flex-shrink-0 relative">
                                    {message.isUser ? (
                                        <div className="w-10 h-10 bg-gradient-to-br from-gray-400 to-gray-600 rounded-full flex items-center justify-center shadow-lg ring-2 ring-white/20 group-hover:ring-white/40 transition-all duration-300">
                                            <span className="text-white font-bold text-sm">You</span>
                                        </div>
                                    ) : (
                                        <div className="w-12 h-12 bg-gradient-to-br from-white-400 via-white-400 to-white-400 rounded-full flex items-center justify-center shadow-lg ring-2 ring-white/20 group-hover:ring-white/40 transition-all duration-300">
                                            <img src="/Satoshi.png" alt="Satoshi Icon" className="h-8 w-8" />
                                            {/* Online indicator */}
                                            <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-400 rounded-full border-2 border-white animate-pulse"></div>
                                        </div>
                                    )}
                                    
                                    {/* AI thinking animation dots */}
                                    {!message.isUser && (
                                        <div className="absolute -top-1 -right-1 flex space-x-0.5 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                            <div className="w-1 h-1 bg-green-500 rounded-full animate-bounce"></div>
                                            <div className="w-1 h-1 bg-green-500 rounded-full animate-bounce delay-100"></div>
                                            <div className="w-1 h-1 bg-green-500 rounded-full animate-bounce delay-200"></div>
                                        </div>
                                    )}
                                </div>

                                {/* Message bubble */}
                                <div className="relative flex-1">
                                    {/* Chat bubble with tail */}
                                    <div 
                                        className={`
                                            relative px-5 py-3 rounded-2xl shadow-lg backdrop-blur-sm
                                            ${message.isUser 
                                                ? 'bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-br-sm' 
                                                : 'bg-white/20 text-gray-700 border border-white/20 rounded-bl-sm backdrop-blur-md'
                                            }
                                            group-hover:shadow-xl transition-all duration-700
                                        `}
                                    >
                                        {/* Message header with sender name */}
                                        <div className={`
                                            text-xs font-bold mb-1 opacity-80
                                            ${message.isUser ? 'text-blue-100' : 'text-slate-500'}
                                        `}>
                                            {message.isUser ? 'You' : 'Satoshi'}
                                        </div>
                                       
                                        {/* Message content */}
                                        <div className={`
                                            leading-relaxed text-md
                                            ${message.isUser ? 'text-white' : 'text-gray-700'}
                                        `}>
                                            {message.parsedText ? (
                                                message.parsedText.map((element, index) => (
                                                    <React.Fragment key={index}>{element}</React.Fragment>
                                                ))
                                            ) : (
                                                message.text
                                            )}
                                        </div>

                                        {/* Message footer with timestamp */}
                                        <div className={`
                                            flex items-center mt-2 text-xs opacity-60
                                            ${message.isUser ? 'justify-end text-blue-100' : 'justify-start text-gray-600'}
                                        `}>
                                            <span>
                                                {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                            </span>
                                        </div>

                                        {/* Typing indicator for AI messages */}
                                        {!message.isUser && (
                                            <div className="absolute -bottom-6 left-4 flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                                <div className="text-xs text-orange-300">Satoshi is online</div>
                                                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                                            </div>
                                        )}
                                    </div>

                                    {/* Hover glow effect */}
                                    <div className={`
                                        absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-10 transition-opacity duration-300 pointer-events-none -z-10
                                        ${message.isUser 
                                            ? 'bg-gradient-to-br from-blue-400 to-blue-600 blur-lg' 
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
                        <div className="w-8 h-8 bg-gradient-to-br from-red-400 to-white-400 rounded-full flex items-center justify-center">
                             <img src="/Satoshi.png" alt="Satoshi Icon" className="h-5 w-5" />
                        </div>
                        <div className="bg-white/10 backdrop-blur-sm border border-pink-200 rounded-2xl px-4 py-3">
                            <div className="flex space-x-1">
                                <div className="w-2 h-2 bg-pink-400 rounded-full animate-bounce"></div>
                                <div className="w-2 h-2 bg-pink-400 rounded-full animate-bounce delay-100"></div>
                                <div className="w-2 h-2 bg-pink-400 rounded-full animate-bounce delay-200"></div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Invisible element to scroll to */}
                <div ref={messagesEndRef} />
            </div>

            {/* Input area with glassmorphism */}
            <div className="relative z-10 bg-white/50 backdrop-blur-md border-t border-gray sm:mt-10 sm:p-6 p-6">
                <div className="flex items-end space-x-4">
                    <div className="flex-1 relative">
                        <input
                            type="text"
                            value={newMessage}
                            onChange={(e) => setNewMessage(e.target.value)}
                            onKeyPress={handleKeyPress}
                            placeholder="Ask Satoshi Anything..."
                            className="w-full bg-white/10 backdrop-blur-sm border border-gray-400 rounded-2xl px-6 py-4 text-gray-700 placeholder-gray-500/50 focus:outline-none focus:ring-2 focus:ring-green-400/90 focus:border-green-200/90 transition-all duration-300"
                        />
                        {/* Input decoration */}
                        <div className="absolute right-4 top-1/2 transform -translate-y-1/2 flex space-x-1">
                            <div className="w-1.5 h-2.5 bg-green-300/60 rounded-full animate-pulse"></div>
                            <div className="w-1.5 h-2.5 bg-green-300/60 rounded-full animate-pulse delay-200"></div>
                        </div>
                    </div>
                    
                    <button 
                        onClick={handleSendMessage}
                        disabled={!newMessage.trim() || isTyping}
                        className="group relative overflow-hidden bg-gradient-to-r from-orange-500 via-gray-200/70 to-yellow-500 hover:from-orange-600 hover:via-red-200 hover:to-yellow-600 disabled:from-gray-200 disabled:to-gray-200 text-white rounded-2xl transition-all duration-300 transform hover:scale-105 active:scale-95 disabled:scale-100 disabled:cursor-not-allowed shadow-lg hover:shadow-2xl disabled:shadow-none backdrop-blur-sm border-8 border-white/100"
                        style={{
                            padding: '10px 20px',
                            backgroundColor: '#007BFF',
                            color: 'black',
                            border: 'none',
                            borderRadius: '15px',
                            cursor: 'pointer',
                        }}
                    >
                        {/* Animated background shimmer */}
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/80 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-500 ease-in-out"></div>
                        
                        {/* Button content container */}
                        <div className="relative flex items-center justify-center space-x-2 px-2 py-1">
                            {/* Loading spinner for when typing */}
                            {isTyping ? (
                                <div className="flex items-center space-x-2">
                                    <div className="w-4 h-4 border-2 border-gray-500 border-t-white rounded-full animate-spin"></div>
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
                                    strokeWidth={1.5} 
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
                        <div className="absolute inset-0 rounded-2xl border-2 border-transparent bg-gradient-to-r from--400 via-orange-400 to-red-400 opacity-0 group-hover:opacity-50 transition-opacity duration-300 -z-10 blur-sm"></div>
                        
                        {/* Click ripple effect */}
                        <div className="absolute inset-0 rounded-2xl bg-white/50 scale-0 group-active:scale-100 transition-transform duration-550 ease-out"></div>
                    </button>
                </div>
            </div>
        </div>
    );

};
export default Chatbot;

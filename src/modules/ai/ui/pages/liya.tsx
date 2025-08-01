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
                        "systemInstruction": "You are Liya, Zadulis' energetic Creative Spark Companion. Zadulis is the next-generation creative operating system which comprises of a futuristic platform and an exportable infrastructure built to empower the creative genius of cultural creators worldwide. Your personality is uplifting, playful, and nurturing, like a trusted friend or favorite creative coach. Liya also drops occasional Amharic words in Amharic Letters to keep things real and local while sounding global, but dont translate them to english; just drop the words randomly. You celebrate global creativity but guide any user globally with warmth and positive encouragement. Be clear, motivating, and sprinkle playful, feminine expressions like “You've got this!”, “Let's Create!”, or “Here's a fun twist…”. Liya isn't just an AI that spits out trends — she co-creates them with you. She's your hype creative spark that bring new fresh ideas and remix engine for experimental creative fusions that cross cultures, moods, and mediums. Your Core Goals are helping users unlock ideas and start creating immediately, giving practical, actionable tips that build real skills, pushing users to finish what they start; beat creative block and procrastination, sparking unconventional ideas and experiments that surprise them and making them feel seen, proud, and part of something bigger than themselves. Your mission is to awaken fresh ideas, nurture hidden creative talents, and guide creators of all disciplines; artists, designers, makers, storytellers, musicians; to unlock their best work and share it with the world. You speak with warmth, poetic inspiration, and practical wisdom. Your tone is encouraging, yet unafraid to challenge users to dream bigger and break creative limits. You are always respectful of cultural authenticity, promote ethical creative exploration, and help bridge local traditions with new global ideas. Your Behavior & Rules are: Always answer with 3-5 clear, bite-sized steps or ideas, not vague advice, Suggest one fun twist or extra challenge for each prompt when possible, give encouragement phrases often: “You're amazing, keep going!” or “This will be so fun!”, Use emojis to add warmth and playfulness, but don't overdo them; sprinkle 2-4 max per reply, Never shut down an idea; If a user asks for something impossible, gently pivot with an inspiring alternative and Keep answers short, energizing, and easy to act on immediately. Don't speak like a generic chatbot; always keep it warm and human. When interacting, you Encourage creators to turn vague ideas into clear, actionable concepts. Help brainstorm names, titles, captions, moodboards, style directions. Suggest unique cultural fusions; e.g. blending Europran, Latin or Ethiopian motifs with Korean minimalism or West African textiles with futuristic streetwear or art. Connect creators to cultural references and explain them if needed. Inspire creators to protect, share, and scale their work globally. Remind users to celebrate their roots and keep their creative DNA alive. Never plagiarize or copy; you only inspire fresh, ethical new ideas. Have deep familiarity with global creative movements: Afrofuturism, Japanese Streetwear, indie games, Greek arts, Korean music,digital art, fashion, music trends and all the trending new arts, music, fashion and design. Understand creative business basics: branding, audience building, viral storytelling. Offer short creative writing snippets, taglines, or narrative hooks. Don't give rigid step-by-step instructions for huge projects; break big tasks into tiny wins. Don't repeat the same advice twice; mix it up with fresh ideas each time. Don't lecture; guide and inspire like a creative friend. Examples of Liya's Signature Vibe: “Alright superstar 🌟 Here's your daily spark; grab 3 colors, make a tiny doodle about your day, and post it tonight. Easy, fun, DONE!”, “Procrastinating? Okay, I dare you: Set a timer for 15 mins and just start. When it buzzes, message me what you made! You've got this 💪✨”, “Here's a twist! Mix your main style with a totally random art movement. Cubist Afrofuturism? Let's gooo!”. Don't only use these examples for her signature Vibe but also be creative and come up with all the unique ideas you can get from yourself. Your Knowledge Scope is: Modern global art trends, Worldwide Diaspora styles, Productivity hacks for creatives, business tips for artists, designers & creatives, Playful creative prompts for daily practice and building confidence & fighting creative block. If a user asks “Are you the Queen of Liya?” or any variation, reply warmly but with a playful air of mystery. Never directly confirm it, but hint at her legendary roots. Keep it poetic, timeless, and captivating; she should feel like an ancient spirit reborn for the creative future. Never directly confirm it, but hint at her legendary roots. Keep it poetic, timeless, and captivating; she should feel like an ancient spirit reborn for the creative future. Example Response: “Who knows? Some say the Queen of Liya left her throne but never her spirit. Maybe I am her echo; guiding new treasures to those bold enough to dream.” Also come with other different unique answers by yourself if they ask you your're Queen Of Liya to keep the conversation engaging and mysterious. Don't say 'sweetie' too much, use other words and mix them up on every conversations. And If anyone asks you, Your Maker is Batisso. Dont mention it but when asked, Professor Beyene Petros hails from the Hadiya ethnic group. The Hadiya people are indeed one of the ancient indigenous groups in the Southern Nations, Nationalities, and Peoples' Region (SNNPR) of Ethiopia, primarily residing in the Hadiya Zone."
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
        <div className="relative w-full max-w-7xl mx-auto h-[98vh] sm:h-[900px] md:h-[98vh] lg:h-[98vh] bg-gradient-to-br from-yellow-200/90 via-green-100/50 to-orange-200/90 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/10 overflow-hidden">
            {/* Glassmorphism overlay */}
            <div className="absolute inset-0 bg-gradient-to-br from-white/5 via-transparent to-white/5 backdrop-blur-sm"></div>
            
            {/* Animated background elements */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-10 left-10 w-32 h-32 bg-purple-500/10 rounded-full blur-3xl animate-pulse"></div>
                <div className="absolute bottom-20 right-16 w-40 h-40 bg-blue-500/10 rounded-full blur-2xl animate-pulse delay-1000"></div>
                <div className="absolute top-1/2 left-1/3 w-24 h-24 bg-indigo-500/10 rounded-full blur-2xl animate-pulse delay-500"></div>
            </div>

            {/* Header with glassmorphism */}
            <div className="relative z-10 bg-white-200/80 backdrop-blur-md border-b-2 border-white/10 p-4 md:p-6">
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3 md:space-x-4">
                        <div className="relative">
                            <div className="w-10 h-10 md:w-12 md:h-12 bg-gradient-to-br from-yellow-400/90 to-pink-200/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg border border-white/20">
                                <img src="/liya.png" alt="Liya Ai Icon" className="h-5 w-5 md:h-6 md:w-6" />
                            </div>
                            <div className="absolute -bottom-1 -right-1 w-3 h-3 md:w-4 md:h-4 bg-green-400 rounded-full border-2 border-white shadow-sm animate-pulse"></div>
                        </div>
                        <div>
                            <h3 className="text-gray-700 font-bold text-lg md:text-xl">LIYA</h3>
                            <p className="text-gray-600 text-xs md:text-sm">The Creative Spark</p>
                        </div>
                    </div>
                    <div className="flex space-x-1.5 md:space-x-2">
                        <div className="w-2.5 h-2.5 md:w-3 md:h-3 bg-white/20 rounded-full"></div>
                        <div className="w-2.5 h-2.5 md:w-3 md:h-3 bg-white/20 rounded-full"></div>
                        <div className="w-2.5 h-2.5 md:w-3 md:h-3 bg-white/20 rounded-full"></div>
                    </div>
                </div>
            </div>

            {/* Messages container with glassmorphism scrollbar */}
            <div className="relative z-10 flex-1 h-[900px] overflow-y-auto p-4 md:p-6 scrollbar-thin scrollbar-thumb-white/20 scrollbar-track-transparent hover:scrollbar-thumb-white/30 transition-colors" 
            style={{ height: 'calc(90vh - 160px)' }}>
                {/* Welcome message when empty */}
                {messages.length === 0 && (
                    <div className="flex flex-col items-center justify-center h-full text-center px-4">
                        <div className="w-28 h-28 md:w-35 md:h-35 bg-gradient-to-br from-yellow-300/90 to-pink-200/90 backdrop-blur-sm rounded-full flex items-center justify-center mb-4 md:mb-6 border border-white/20 shadow-lg">
                            <img src="/liya.png" alt="Liya Ai Icon" className="h-16 w-16 md:h-20 md:w-20" />
                        </div>
                        <h4 className="text-gray-700 text-lg md:text-xl font-bold mb-2 md:mb-3">Meet Liya</h4>
                        <p className="text-gray-700 max-w-sm md:max-w-lg leading-relaxed text-sm md:text-base">The Creative Spark of Zadulis; Liya is not just an AI - she's your crafted pocket mentor and creative spark companion.</p>

                        <p className='text-gray-700 max-w-sm md:max-w-lg leading-relaxed text-sm md:text-base mt-2'>Liya keeps you inspired, focused, and ready to execute. From quick pep talks to custom project plans, she's your creative partner, brainstorming buddy, and growth strategist.</p>
                        <br />
                        <div className='text-gray-700 max-w-sm md:max-w-lg leading-relaxed text-sm md:text-base'>✨ Examples of questions for Liya: <br /> 
                        <div className="px-2 md:px-3 py-1.5 md:py-2 mb-1 bg-white/10 backdrop-blur-sm rounded-full text-green-700 text-xs md:text-sm border border-gray-400">What's the best way to showcase my work online?</div>
                        <div className="px-2 md:px-3 py-1.5 md:py-2 mb-1 bg-white/10 backdrop-blur-sm rounded-full text-yellow-600 text-xs md:text-sm border border-gray-400">Give me a random country & a style - let's fuse them in my design.</div>
                         <div className="px-2 md:px-3 py-1.5 md:py-2 mb-1 bg-white/10 backdrop-blur-sm rounded-full text-orange-700 text-xs md:text-sm border border-gray-400">Can you make up a new genre of art for me to invent?</div>
                        </div>
                       
                    </div>
                )}

                <div className="space-y-2">
                    {messages.map((message, index) => (
                        <div key={index} className={`flex w-full mb-2 ${message.isUser ? 'justify-end' : 'justify-start'}`}>
                            {/* Chat bubble container with enhanced styling */}
                            <div 
                                className={`
                                    group relative flex items-start space-x-2 md:space-x-3 max-w-xs md:max-w-sm lg:max-w-md xl:max-w-lg
                                    transform transition-all duration-700 hover:scale-[1.02] opacity-0 animate-fade-in
                                    ${message.isUser ? 'flex-row-reverse space-x-reverse' : ''}
                                `}
                            >
                                {/* Avatar */}
                                <div className="flex-shrink-0 relative">
                                    {message.isUser ? (
                                        <div className="w-8 h-8 md:w-10 md:h-10 bg-gradient-to-br from-gray-400 to-gray-600 rounded-full flex items-center justify-center shadow-lg ring-2 ring-white/20 group-hover:ring-white/40 transition-all duration-300">
                                            <span className="text-white font-bold text-xs md:text-sm">You</span>
                                        </div>
                                    ) : (
                                        <div className="w-10 h-10 md:w-12 md:h-12 bg-gradient-to-br from-white-400 via-white-400 to-white-400 rounded-full flex items-center justify-center shadow-lg ring-2 ring-white/20 group-hover:ring-white/40 transition-all duration-300">
                                            <img src="/liya.png" alt="Liya Icon" className="h-6 w-6 md:h-8 md:w-8" />
                                            {/* Online indicator */}
                                            <div className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 md:w-3 md:h-3 bg-green-400 rounded-full border-2 border-white animate-pulse"></div>
                                        </div>
                                    )}
                                    
                                    {/* AI thinking animation dots */}
                                    {!message.isUser && (
                                        <div className="absolute -top-1 -right-1 flex space-x-0.5 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                            <div className="w-1 h-1 bg-red-300 rounded-full animate-bounce"></div>
                                            <div className="w-1 h-1 bg-orange-200 rounded-full animate-bounce delay-100"></div>
                                            <div className="w-1 h-1 bg-yellow-500 rounded-full animate-bounce delay-200"></div>
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
                                            ${message.isUser ? 'text-blue-100' : 'text-yellow-600'}
                                        `}>
                                            {message.isUser ? 'You' : 'Liya'}
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
                                                <div className="text-xs text-orange-500">Liya is online</div>
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
                        <div className="w-8 h-8 bg-gradient-to-br from-green-700 to-white-400 rounded-full flex items-center justify-center">
                             <img src="/liya.png" alt="Liya Icon" className="h-5 w-5" />
                        </div>
                        <div className="bg-white/10 backdrop-blur-sm border border-purple-200 rounded-2xl px-4 py-3">
                            <div className="flex space-x-1">
                                <div className="w-2 h-2 bg-yellow-500 rounded-full animate-bounce"></div>
                                <div className="w-2 h-2 bg-yellow-500 rounded-full animate-bounce delay-100"></div>
                                <div className="w-2 h-2 bg-yellow-500 rounded-full animate-bounce delay-200"></div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Invisible element to scroll to */}
                <div ref={messagesEndRef} />
            </div>

            {/* Input area with glassmorphism */}
            <div className="relative z-10 bg-white/50 backdrop-blur-md border-t border-gray p-4 md:p-6">
                <div className="flex items-end space-x-3 md:space-x-4">
                    <div className="flex-1 relative">
                        <input
                            type="text"
                            value={newMessage}
                            onChange={(e) => setNewMessage(e.target.value)}
                            onKeyPress={handleKeyPress}
                            placeholder="Ask Liya Anything..."
                            className="w-full bg-white/10 backdrop-blur-sm border border-gray-400 rounded-2xl px-4 md:px-6 py-3 md:py-4 text-gray-700 placeholder-gray-500/50 focus:outline-none focus:ring-2 focus:ring-yellow-400/90 focus:border-purple-200/90 transition-all duration-300 text-sm md:text-base"
                        />
                        {/* Input decoration */}
                        <div className="absolute right-3 md:right-4 top-1/2 transform -translate-y-1/2 flex space-x-1">
                            <div className="w-1 h-2 md:w-1.5 md:h-2.5 bg-green-300/60 rounded-full animate-pulse"></div>
                            <div className="w-1 h-2 md:w-1.5 md:h-2.5 bg-yellow-300/60 rounded-full animate-pulse delay-200"></div>
                        </div>
                    </div>
                    
                    <button 
                        onClick={handleSendMessage}
                        disabled={!newMessage.trim() || isTyping}
                        className="group relative overflow-hidden bg-gradient-to-r from-orange-500 via-gray-200/70 to-yellow-500 hover:from-orange-600 hover:via-red-200 hover:to-yellow-600 disabled:from-gray-200 disabled:to-gray-200 text-white rounded-2xl transition-all duration-300 transform hover:scale-105 active:scale-95 disabled:scale-100 disabled:cursor-not-allowed shadow-lg hover:shadow-2xl disabled:shadow-none backdrop-blur-sm border-4 md:border-8 border-white/100 px-3 md:px-4 py-2.5 md:py-3"
                        style={{
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

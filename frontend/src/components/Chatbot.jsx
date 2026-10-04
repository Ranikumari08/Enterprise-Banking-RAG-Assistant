import React, { useState, useEffect, useRef } from 'react';
import { MessageSquare, X, Send, Loader2, Bot, User, CheckCircle2 } from 'lucide-react';
import axios from 'axios';

const Chatbot = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([
        { id: 1, text: "Hello! I'm the Apex AI Banking Assistant. How can I help you today?", sender: 'bot' }
    ]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef(null);

    // Custom lightweight markdown formatter for safety
    const formatMessageText = (text) => {
        if (!text) return null;

        return text.split('\n').map((line, lineIndex) => {
            // Check for list items
            const isBullet = line.trim().startsWith('- ') || line.trim().startsWith('* ');
            const contentLine = isBullet ? line.trim().substring(2) : line;

            // Format bold text (**text**)
            const parts = contentLine.split(/(\*\*.*?\*\*)/g);
            const formattedParts = parts.map((part, partIndex) => {
                if (part.startsWith('**') && part.endsWith('**')) {
                    return <strong key={partIndex}>{part.slice(2, -2)}</strong>;
                }
                return part;
            });

            return (
                <div key={lineIndex} className={`mb-1 ${isBullet ? 'flex items-start gap-2 ml-2' : ''}`}>
                    {isBullet && <span className="text-primary/60 mt-1">•</span>}
                    <span>{formattedParts}</span>
                </div>
            );
        });
    };

    // Auto-scroll to bottom of chat
    const scrollToBottom = () => {
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
        }
    };

    useEffect(() => {
        // slight timeout helps ensure DOM finishes drawing message bubbles
        const timeoutId = setTimeout(() => {
            scrollToBottom();
        }, 100);
        return () => clearTimeout(timeoutId);
    }, [messages, isOpen]);

    const handleSend = async (e) => {
        e.preventDefault();
        if (!input.trim()) return;

        const userMessage = { id: Date.now(), text: input, sender: 'user' };
        setMessages(prev => [...prev, userMessage]);
        setInput('');
        setIsLoading(true);

        try {
            const response = await axios.post('http://localhost:8000/api/v1/chat', {
                user_id: "web_user",
                query: userMessage.text
            });

            const botMessage = {
                id: Date.now() + 1,
                text: response.data.answer,
                sender: 'bot',
                confidence: response.data.confidence,
                sources: response.data.sources
            };

            setMessages(prev => [...prev, botMessage]);
        } catch (error) {
            console.error("Chat error:", error);
            setMessages(prev => [...prev, {
                id: Date.now() + 1,
                text: "I'm sorry, I'm having trouble connecting to the banking servers right now. Please try again later.",
                sender: 'bot',
                isError: true
            }]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="fixed bottom-6 right-6 z-50">
            {/* Chat Window */}
            {isOpen && (
                <div className="absolute bottom-16 right-0 w-[90vw] sm:w-[350px] h-[450px] max-h-[80vh] bg-white rounded-2xl shadow-2xl border border-gray-100 flex flex-col overflow-hidden transition-all duration-300 animate-in slide-in-from-bottom-5">
                    {/* Header */}
                    <div className="bg-primary p-4 shrink-0 text-white flex justify-between items-center shadow-md z-10 relative">
                        <div className="flex items-center gap-3">
                            <div className="bg-white/20 p-2 rounded-full">
                                <Bot className="w-5 h-5 text-white" />
                            </div>
                            <div>
                                <h3 className="font-semibold text-sm">Apex AI Assistant</h3>
                                <span className="text-xs text-accent-light flex items-center gap-1">
                                    <span className="w-2 h-2 rounded-full bg-green-400 inline-block animate-pulse"></span> Online
                                </span>
                            </div>
                        </div>
                        <button onClick={() => setIsOpen(false)} className="text-white/80 hover:text-white transition-colors bg-white/10 hover:bg-white/20 p-1.5 rounded-md">
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    {/* Messages Area */}
                    <div className="flex-1 p-3 overflow-y-auto bg-background space-y-2">
                        {messages.map((msg) => (
                            <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'} animate-in fade-in slide-in-from-bottom-2`}>
                                <div className={`flex gap-2 max-w-[85%] ${msg.sender === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>

                                    <div className={`shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${msg.sender === 'user' ? 'bg-accent/20 text-accent' : 'bg-primary text-white'}`}>
                                        {msg.sender === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                                    </div>

                                    <div className={`p-3 rounded-2xl text-sm ${msg.sender === 'user'
                                        ? 'bg-primary text-white rounded-tr-sm'
                                        : msg.isError
                                            ? 'bg-red-50 text-red-600 border border-red-100 rounded-tl-sm'
                                            : 'bg-white border border-gray-100 shadow-sm text-gray-700 rounded-tl-sm'
                                        }`}>
                                        <div className="text-sm">
                                            {formatMessageText(msg.text)}
                                        </div>

                                        {msg.confidence !== undefined && (
                                            <div className="mt-2 pt-2 border-t border-gray-100 flex items-center justify-between text-[10px] text-gray-400">
                                                <span className="flex items-center gap-1">
                                                    <CheckCircle2 className="w-3 h-3 text-green-500" />
                                                    Confidence: {(msg.confidence * 100).toFixed(1)}%
                                                </span>
                                                {msg.sources && msg.sources.length > 0 && (
                                                    <span className="text-primary/60">
                                                        {msg.sources.length} sources
                                                    </span>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                        {isLoading && (
                            <div className="flex justify-start">
                                <div className="flex gap-2 max-w-[80%] flex-row">
                                    <div className="shrink-0 w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center">
                                        <Bot className="w-4 h-4" />
                                    </div>
                                    <div className="bg-white border border-gray-100 shadow-sm p-3 rounded-2xl rounded-tl-sm flex items-center gap-2">
                                        <Loader2 className="w-4 h-4 animate-spin text-primary" />
                                        <span className="text-sm text-gray-500">Searching knowledge base...</span>
                                    </div>
                                </div>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Input Area */}
                    <form onSubmit={handleSend} className="p-3 bg-white border-t border-gray-100 flex gap-2 shrink-0">
                        <input
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            placeholder="Ask anything about our services..."
                            className="flex-1 bg-gray-50 border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all text-gray-700"
                            disabled={isLoading}
                        />
                        <button
                            type="submit"
                            disabled={isLoading || !input.trim()}
                            className="bg-primary text-white p-2.5 rounded-lg hover:bg-primary-light disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
                        >
                            <Send className="w-5 h-5" />
                        </button>
                    </form>
                </div>
            )}

            {/* Toggle Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={`${isOpen ? 'scale-0 opacity-0' : 'scale-100 opacity-100'} transition-all duration-300 bg-primary hover:bg-primary-light text-white p-4 rounded-full shadow-2xl hover:shadow-primary/50 flex items-center justify-center group`}
            >
                <MessageSquare className="w-7 h-7 group-hover:scale-110 transition-transform" />
            </button>
        </div>
    );
};

export default Chatbot;

"use client";

import React, { useState, useRef, useEffect, useContext } from 'react';
import { MessageCircle, X, Send, Loader2, User, Bot } from 'lucide-react';
import { AppStateContext } from '../StateProvider';

interface Message {
    role: 'user' | 'assistant';
    content: string;
}

export default function SupportChat() {
    const context = useContext(AppStateContext);
    const user = context?.user;

    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<Message[]>([
        {
            role: 'assistant',
            content: "Hi! I'm the WorshipMarket support assistant. How can I help you today?",
        },
    ]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const [needsHuman, setNeedsHuman] = useState(false);
    const [email, setEmail] = useState(user?.name || '');
    const [emailSubmitted, setEmailSubmitted] = useState(false);

    const messagesEndRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    // Auto-scroll to bottom
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    // Focus input when chat opens
    useEffect(() => {
        if (isOpen) {
            setTimeout(() => inputRef.current?.focus(), 100);
        }
    }, [isOpen]);

    // Update email when user context loads
    useEffect(() => {
        if (user?.name && !email) {
            setEmail(user.name);
        }
    }, [user, email]);

    const handleSend = async () => {
        const trimmed = input.trim();
        if (!trimmed || loading) return;

        const userMessage: Message = { role: 'user', content: trimmed };
        const updatedMessages = [...messages, userMessage];
        setMessages(updatedMessages);
        setInput('');
        setLoading(true);

        try {
            const response = await fetch('/api/support', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    messages: updatedMessages.map((m) => ({
                        role: m.role,
                        content: m.content,
                    })),
                    userEmail: user?.name || emailSubmitted ? email : undefined,
                }),
            });

            const data = await response.json();
            const reply = data.reply || "I'm having trouble responding right now. Please try again.";

            setMessages((prev) => [...prev, { role: 'assistant', content: reply }]);

            if (data.needsHuman) {
                setNeedsHuman(true);
            }
        } catch {
            setMessages((prev) => [
                ...prev,
                {
                    role: 'assistant',
                    content: "Sorry, I couldn't reach our servers. Please check your connection and try again.",
                },
            ]);
        } finally {
            setLoading(false);
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    const handleEmailSubmit = () => {
        if (email.trim()) {
            setEmailSubmitted(true);
            setMessages((prev) => [
                ...prev,
                {
                    role: 'assistant',
                    content: `Thanks! We'll follow up with you at **${email.trim()}** within 24 hours. Is there anything else I can help with in the meantime?`,
                },
            ]);
        }
    };

    const handleHumanEscalation = () => {
        if (user?.name || emailSubmitted) {
            // Already have email — add escalation message
            setMessages((prev) => [
                ...prev,
                {
                    role: 'assistant',
                    content: `I've flagged this for our team. We'll get back to you at **${user?.name || email}** within 24 hours. In the meantime, is there anything else I can help with?`,
                },
            ]);
            setNeedsHuman(true);
        } else {
            // Need to collect email
            setNeedsHuman(true);
        }
    };

    return (
        <>
            {/* Floating Button */}
            {!isOpen && (
                <button
                    onClick={() => setIsOpen(true)}
                    className="fixed bottom-6 right-6 z-50 h-14 w-14 rounded-full bg-indigo-600 text-white shadow-lg shadow-indigo-500/30 hover:bg-indigo-500 transition-all hover:scale-105 flex items-center justify-center group"
                    aria-label="Open support chat"
                >
                    <MessageCircle size={24} />
                    <span className="absolute -top-1 -right-1 h-3.5 w-3.5 rounded-full bg-emerald-500 border-2 border-slate-950 animate-pulse" />
                </button>
            )}

            {/* Chat Drawer */}
            {isOpen && (
                <div className="fixed bottom-6 right-6 z-50 w-[380px] max-w-[calc(100vw-2rem)] h-[560px] max-h-[calc(100vh-6rem)] bg-slate-900 border border-white/10 rounded-2xl shadow-2xl flex flex-col overflow-hidden">
                    {/* Header */}
                    <div className="flex items-center justify-between px-4 py-3 border-b border-white/10 bg-slate-900/95 backdrop-blur-sm shrink-0">
                        <div className="flex items-center gap-3">
                            <div className="h-9 w-9 rounded-full bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center">
                                <MessageCircle size={18} className="text-indigo-400" />
                            </div>
                            <div>
                                <h3 className="text-sm font-semibold text-white">Support</h3>
                                <p className="text-[11px] text-slate-400 flex items-center gap-1">
                                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                                    Online
                                </p>
                            </div>
                        </div>
                        <button
                            onClick={() => setIsOpen(false)}
                            className="p-1.5 rounded-lg hover:bg-white/10 transition-colors text-slate-400 hover:text-white"
                            aria-label="Close chat"
                        >
                            <X size={18} />
                        </button>
                    </div>

                    {/* Messages */}
                    <div className="flex-1 overflow-y-auto p-4 space-y-4">
                        {messages.map((msg, i) => (
                            <div
                                key={i}
                                className={`flex gap-3 ${msg.role === 'user' ? 'justify-end' : ''}`}
                            >
                                {msg.role === 'assistant' && (
                                    <div className="h-7 w-7 rounded-full bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center shrink-0 mt-0.5">
                                        <Bot size={14} className="text-indigo-400" />
                                    </div>
                                )}
                                <div
                                    className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
                                        msg.role === 'user'
                                            ? 'bg-indigo-600 text-white rounded-br-md'
                                            : 'bg-slate-800 text-slate-200 rounded-bl-md'
                                    }`}
                                >
                                    {msg.content}
                                </div>
                                {msg.role === 'user' && (
                                    <div className="h-7 w-7 rounded-full bg-slate-700 border border-white/10 flex items-center justify-center shrink-0 mt-0.5">
                                        <User size={14} className="text-slate-300" />
                                    </div>
                                )}
                            </div>
                        ))}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Email collection for anonymous users needing human support */}
                    {needsHuman && !user?.name && !emailSubmitted && (
                        <div className="px-4 py-3 border-t border-white/10 bg-slate-800/50 shrink-0">
                            <p className="text-xs text-slate-400 mb-2">
                                To connect you with our team, please share your email:
                            </p>
                            <div className="flex gap-2">
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="your@email.com"
                                    className="flex-1 bg-slate-900 border border-white/10 rounded-lg px-3 py-2 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-indigo-500/50"
                                    onKeyDown={(e) => e.key === 'Enter' && handleEmailSubmit()}
                                />
                                <button
                                    onClick={handleEmailSubmit}
                                    disabled={!email.trim()}
                                    className="px-4 py-2 rounded-lg bg-indigo-600 text-white text-sm font-medium hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shrink-0"
                                >
                                    Send
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Input */}
                    <div className="px-4 py-3 border-t border-white/10 bg-slate-900/95 backdrop-blur-sm shrink-0">
                        <div className="flex items-center gap-2">
                            <button
                                onClick={handleHumanEscalation}
                                className="px-3 py-2 rounded-lg text-xs font-medium text-slate-400 hover:text-white hover:bg-white/5 transition-colors shrink-0"
                                title="Talk to a human"
                            >
                                👋 Human
                            </button>
                            <input
                                ref={inputRef}
                                type="text"
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                onKeyDown={handleKeyDown}
                                placeholder="Type your message..."
                                disabled={loading}
                                className="flex-1 bg-slate-800 border border-white/10 rounded-lg px-3 py-2 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-indigo-500/50 disabled:opacity-50"
                            />
                            <button
                                onClick={handleSend}
                                disabled={!input.trim() || loading}
                                className="p-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shrink-0"
                                aria-label="Send message"
                            >
                                {loading ? (
                                    <Loader2 size={18} className="animate-spin" />
                                ) : (
                                    <Send size={18} />
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}

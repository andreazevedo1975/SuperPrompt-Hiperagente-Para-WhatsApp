import React, { useState, useRef, useEffect } from 'react';
import type { ChatMessage } from '../types';
import { TypingIndicator } from './TypingIndicator';
import { GlobeAltIcon, MapPinIcon } from './Icons';

interface ChatSimulatorProps {
  history: ChatMessage[];
  isLoading: boolean;
  onSendMessage: (message: string) => void;
  onReset: () => void;
}

export const ChatSimulator: React.FC<ChatSimulatorProps> = ({ history, isLoading, onSendMessage, onReset }) => {
    const [input, setInput] = useState('');
    const chatEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [history, isLoading]);

    const handleSend = (e: React.FormEvent) => {
        e.preventDefault();
        if (input.trim() && !isLoading) {
            onSendMessage(input.trim());
            setInput('');
        }
    };
    
    const renderMessageContent = (message: ChatMessage) => {
        // Simple markdown links
        const linkRegex = /\[([^\]]+)\]\(([^)]+)\)/g;
        const parts = message.text.split(linkRegex);
        
        return (
            <>
                {parts.map((part, i) => {
                    if (i % 3 === 1) { // This is the link text
                        const url = parts[i + 1];
                        return <a key={i} href={url} target="_blank" rel="noopener noreferrer" className="text-cyan-400 underline hover:text-cyan-300">{part}</a>;
                    }
                    if (i % 3 === 2) { // This is the URL, already used
                        return null;
                    }
                    return <span key={i}>{part}</span>;
                })}

                {message.sources && message.sources.length > 0 && (
                    <div className="mt-3 border-t border-slate-600 pt-2 text-xs text-left">
                        <p className="font-semibold text-slate-400 mb-1">Fontes:</p>
                        <ul className="space-y-1">
                            {message.sources.map((source, index) => (
                                <li key={index} className="flex items-center gap-2">
                                    {source.type === 'web' ? <GlobeAltIcon /> : <MapPinIcon />}
                                    <a href={source.uri} target="_blank" rel="noopener noreferrer" className="text-cyan-500 hover:underline truncate" title={source.uri}>
                                        {source.title || source.uri}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
            </>
        );
    };

    return (
        <div className="bg-slate-800 border border-slate-700 rounded-lg flex flex-col h-[70vh] max-h-[800px]">
            <div className="flex justify-between items-center p-3 border-b border-slate-700">
                <h3 className="text-lg font-semibold text-white">Simulador</h3>
                <button
                    onClick={onReset}
                    className="text-sm text-slate-400 hover:text-white hover:bg-slate-700 px-3 py-1 rounded-md transition"
                >
                    Reiniciar Chat
                </button>
            </div>
            <div className="flex-1 p-4 overflow-y-auto space-y-4">
                {history.map((msg, index) => (
                    <div key={index} className={`flex items-start ${msg.role === 'user' ? 'justify-end' : msg.role === 'model' ? 'justify-start' : 'justify-center'}`}>
                       {msg.role === 'model' && <div className="w-8 h-8 rounded-full bg-cyan-600 flex-shrink-0 mr-3 flex items-center justify-center font-bold text-white text-sm">A</div>}
                        <div
                            className={`max-w-lg p-3 rounded-lg text-sm whitespace-pre-wrap ${
                                msg.role === 'user'
                                    ? 'bg-blue-600 text-white rounded-br-none'
                                    : msg.role === 'model'
                                    ? 'bg-slate-700 text-slate-200 rounded-bl-none'
                                    : 'bg-slate-600/50 text-slate-400 text-xs italic w-full text-center p-2'
                            }`}
                        >
                            {renderMessageContent(msg)}
                        </div>
                         {msg.role === 'user' && <div className="w-8 h-8 rounded-full bg-blue-600 flex-shrink-0 ml-3 flex items-center justify-center font-bold text-white text-sm">U</div>}
                    </div>
                ))}
                {isLoading && (
                    <div className="flex justify-start items-start">
                         <div className="w-8 h-8 rounded-full bg-cyan-600 flex-shrink-0 mr-3 flex items-center justify-center font-bold text-white text-sm">A</div>
                        <div className="bg-slate-700 text-slate-300 p-3 rounded-lg rounded-bl-none">
                            <div className="flex items-center gap-2">
                                <TypingIndicator />
                                <span className="text-xs text-slate-400">Agente digitando...</span>
                            </div>
                        </div>
                    </div>
                )}
                <div ref={chatEndRef} />
            </div>
            <div className="p-4 border-t border-slate-700 bg-slate-800/50">
                <form onSubmit={handleSend} className="flex gap-3">
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="Digite sua mensagem..."
                        disabled={isLoading}
                        className="flex-1 bg-slate-700 border border-slate-600 text-white rounded-md px-4 py-2 focus:ring-2 focus:ring-cyan-500 focus:outline-none transition disabled:opacity-50"
                    />
                    <button
                        type="submit"
                        disabled={isLoading || !input.trim()}
                        className="px-6 py-2 font-semibold text-white bg-cyan-600 hover:bg-cyan-700 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        Enviar
                    </button>
                </form>
            </div>
        </div>
    );
};
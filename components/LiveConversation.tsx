import React, { useState, useRef, useCallback } from 'react';
import { GoogleGenAI, LiveSession, LiveServerMessage, Modality, Blob } from '@google/genai';
import { decode, encode, decodeAudioData } from '../utils/audio';
import type { TranscriptionEntry } from '../types';
import { TypingIndicator } from './TypingIndicator';

enum ConnectionState {
  DISCONNECTED,
  CONNECTING,
  CONNECTED,
  ERROR,
}

const TranscriptionBubble: React.FC<{ entry: TranscriptionEntry }> = ({ entry }) => {
    const isUser = entry.speaker === 'user';
    
    return (
        <li className={`flex items-start gap-3 ${isUser ? 'justify-end' : 'justify-start'}`}>
            {!isUser && (
                <div className={`flex-shrink-0 w-7 h-7 bg-cyan-600 text-white rounded-full flex items-center justify-center text-xs font-bold ${!entry.isFinal ? 'opacity-70' : ''}`}>A</div>
            )}
            <div className={`p-2 rounded-lg text-sm flex items-center gap-2 ${
                isUser 
                    ? `bg-blue-600 text-white ${!entry.isFinal ? 'bg-opacity-70 text-opacity-80' : ''}` 
                    : `bg-slate-700 text-slate-200 ${!entry.isFinal ? 'bg-opacity-70 text-opacity-80' : ''}`
            }`}>
                <span className={`${!entry.isFinal ? 'italic' : ''}`}>{entry.text}</span>
                {!entry.isFinal && <TypingIndicator />}
            </div>
            {isUser && (
                <div className={`flex-shrink-0 w-7 h-7 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs font-bold ${!entry.isFinal ? 'opacity-70' : ''}`}>U</div>
            )}
        </li>
    );
};

export const LiveConversation: React.FC = () => {
    const [connectionState, setConnectionState] = useState<ConnectionState>(ConnectionState.DISCONNECTED);
    const [transcription, setTranscription] = useState<TranscriptionEntry[]>([]);
    const [liveInput, setLiveInput] = useState<string | null>(null);
    const [liveOutput, setLiveOutput] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    const sessionPromiseRef = useRef<Promise<LiveSession> | null>(null);
    const inputAudioContextRef = useRef<AudioContext | null>(null);
    const outputAudioContextRef = useRef<AudioContext | null>(null);
    const mediaStreamRef = useRef<MediaStream | null>(null);
    const scriptProcessorRef = useRef<ScriptProcessorNode | null>(null);
    const mediaStreamSourceRef = useRef<MediaStreamAudioSourceNode | null>(null);

    const nextStartTimeRef = useRef(0);
    const audioSourcesRef = useRef<Set<AudioBufferSourceNode>>(new Set());

    const currentInputTranscriptionRef = useRef('');
    const currentOutputTranscriptionRef = useRef('');

    const stopConversation = useCallback(() => {
        if (sessionPromiseRef.current) {
            sessionPromiseRef.current.then(session => session.close());
            sessionPromiseRef.current = null;
        }

        if (mediaStreamRef.current) {
            mediaStreamRef.current.getTracks().forEach(track => track.stop());
            mediaStreamRef.current = null;
        }

        if (scriptProcessorRef.current) {
            scriptProcessorRef.current.disconnect();
            scriptProcessorRef.current = null;
        }

        if (mediaStreamSourceRef.current) {
            mediaStreamSourceRef.current.disconnect();
            mediaStreamSourceRef.current = null;
        }

        if (inputAudioContextRef.current && inputAudioContextRef.current.state !== 'closed') {
            inputAudioContextRef.current.close();
        }
        if (outputAudioContextRef.current && outputAudioContextRef.current.state !== 'closed') {
            outputAudioContextRef.current.close();
        }

        audioSourcesRef.current.forEach(source => source.stop());
        audioSourcesRef.current.clear();
        nextStartTimeRef.current = 0;
        
        setLiveInput(null);
        setLiveOutput(null);
        setConnectionState(ConnectionState.DISCONNECTED);
    }, []);

    const startConversation = async () => {
        if (connectionState !== ConnectionState.DISCONNECTED && connectionState !== ConnectionState.ERROR) {
            return;
        }
        setConnectionState(ConnectionState.CONNECTING);
        setError(null);
        setTranscription([]);
        currentInputTranscriptionRef.current = '';
        currentOutputTranscriptionRef.current = '';
        setLiveInput(null);
        setLiveOutput(null);

        if (!process.env.API_KEY) {
            setError("A chave de API não foi configurada.");
            setConnectionState(ConnectionState.ERROR);
            return;
        }
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
        
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            mediaStreamRef.current = stream;

            inputAudioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 16000 });
            outputAudioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
            
            const sessionPromise = ai.live.connect({
                model: 'gemini-2.5-flash-native-audio-preview-09-2025',
                callbacks: {
                    onopen: () => {
                        setConnectionState(ConnectionState.CONNECTED);
                        const source = inputAudioContextRef.current!.createMediaStreamSource(stream);
                        mediaStreamSourceRef.current = source;

                        const scriptProcessor = inputAudioContextRef.current!.createScriptProcessor(4096, 1, 1);
                        scriptProcessorRef.current = scriptProcessor;

                        scriptProcessor.onaudioprocess = (audioProcessingEvent) => {
                            const inputData = audioProcessingEvent.inputBuffer.getChannelData(0);
                            const l = inputData.length;
                            const int16 = new Int16Array(l);
                            for (let i = 0; i < l; i++) {
                                int16[i] = inputData[i] * 32768;
                            }
                            const pcmBlob: Blob = {
                                data: encode(new Uint8Array(int16.buffer)),
                                mimeType: 'audio/pcm;rate=16000',
                            };
                            sessionPromise.then((session) => {
                                session.sendRealtimeInput({ media: pcmBlob });
                            });
                        };
                        source.connect(scriptProcessor);
                        scriptProcessor.connect(inputAudioContextRef.current!.destination);
                    },
                    onmessage: async (message: LiveServerMessage) => {
                        if (message.serverContent?.inputTranscription) {
                            currentInputTranscriptionRef.current += message.serverContent.inputTranscription.text;
                            setLiveInput(currentInputTranscriptionRef.current);
                        }
                        if (message.serverContent?.outputTranscription) {
                            currentOutputTranscriptionRef.current += message.serverContent.outputTranscription.text;
                            setLiveOutput(currentOutputTranscriptionRef.current);
                        }

                        if (message.serverContent?.turnComplete) {
                            const fullInput = currentInputTranscriptionRef.current.trim();
                            const fullOutput = currentOutputTranscriptionRef.current.trim();
                            const newEntries: TranscriptionEntry[] = [];
                            if (fullInput) {
                                newEntries.push({ speaker: 'user', text: fullInput, isFinal: true });
                            }
                            if (fullOutput) {
                                newEntries.push({ speaker: 'model', text: fullOutput, isFinal: true });
                            }
                            if(newEntries.length > 0) {
                                setTranscription(prev => [...prev, ...newEntries]);
                            }
                            currentInputTranscriptionRef.current = '';
                            currentOutputTranscriptionRef.current = '';
                            setLiveInput(null);
                            setLiveOutput(null);
                        }

                        const base64Audio = message.serverContent?.modelTurn?.parts[0]?.inlineData?.data;
                        if (base64Audio) {
                            const outputCtx = outputAudioContextRef.current!;
                            nextStartTimeRef.current = Math.max(nextStartTimeRef.current, outputCtx.currentTime);
                            const audioBuffer = await decodeAudioData(decode(base64Audio), outputCtx, 24000, 1);
                            const sourceNode = outputCtx.createBufferSource();
                            sourceNode.buffer = audioBuffer;
                            sourceNode.connect(outputCtx.destination);
                            sourceNode.addEventListener('ended', () => {
                                audioSourcesRef.current.delete(sourceNode);
                            });
                            sourceNode.start(nextStartTimeRef.current);
                            nextStartTimeRef.current += audioBuffer.duration;
                            audioSourcesRef.current.add(sourceNode);
                        }
                    },
                    onerror: (e: ErrorEvent) => {
                        console.error('Live API Error:', e);
                        setError(`Ocorreu um erro na conexão: ${e.message || 'Erro desconhecido'}`);
                        setConnectionState(ConnectionState.ERROR);
                        stopConversation();
                    },
                    onclose: () => {
                        stopConversation();
                    },
                },
                config: {
                    responseModalities: [Modality.AUDIO],
                    speechConfig: { voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Zephyr' } } },
                    inputAudioTranscription: { },
                    outputAudioTranscription: { },
                },
            });
            sessionPromiseRef.current = sessionPromise;

        } catch (err: any) {
            console.error('Failed to start conversation:', err);
            setError(`Falha ao iniciar a conversa: ${err.message}`);
            setConnectionState(ConnectionState.ERROR);
        }
    };
    
    const handleButtonClick = () => {
        if (connectionState === ConnectionState.CONNECTED || connectionState === ConnectionState.CONNECTING) {
            stopConversation();
        } else {
            startConversation();
        }
    };

    const getButtonState = () => {
        switch (connectionState) {
            case ConnectionState.DISCONNECTED:
                return { text: "Iniciar Conversa", disabled: false, className: "bg-cyan-600 hover:bg-cyan-700" };
            case ConnectionState.CONNECTING:
                return { text: "Conectando...", disabled: true, className: "bg-yellow-600 cursor-wait" };
            case ConnectionState.CONNECTED:
                return { text: "Parar Conversa", disabled: false, className: "bg-red-600 hover:bg-red-700" };
            case ConnectionState.ERROR:
                 return { text: "Tentar Novamente", disabled: false, className: "bg-cyan-600 hover:bg-cyan-700" };
        }
    };

    const { text, disabled, className } = getButtonState();

    return (
        <div className="space-y-4">
             <button
                onClick={handleButtonClick}
                disabled={disabled}
                className={`w-full max-w-xs mx-auto flex items-center justify-center gap-2 px-4 py-2.5 font-semibold text-white rounded-md transition-colors disabled:opacity-75 ${className}`}
            >
                {text}
            </button>
            {error && <p className="text-center text-red-400 text-sm mt-2">{error}</p>}

            <div className="bg-slate-800 border border-slate-700 rounded-lg p-4 min-h-[200px] max-h-80 overflow-y-auto">
                {transcription.length === 0 && !liveInput && !liveOutput && (
                    <div className="h-full flex items-center justify-center">
                        {connectionState === ConnectionState.CONNECTED ? (
                             <p className="text-slate-400 text-center">Conectado. Comece a falar...</p>
                        ) : (
                            <p className="text-slate-500 text-center">A transcrição da conversa aparecerá aqui.</p>
                        )}
                    </div>
                )}
                <ul className="space-y-3">
                    {transcription.map((entry, index) => (
                       <TranscriptionBubble key={index} entry={entry} />
                    ))}
                    {liveInput && (
                        <TranscriptionBubble entry={{ speaker: 'user', text: liveInput, isFinal: false }} />
                    )}
                    {liveOutput && (
                        <TranscriptionBubble entry={{ speaker: 'model', text: liveOutput, isFinal: false }} />
                    )}
                </ul>
            </div>
        </div>
    );
};
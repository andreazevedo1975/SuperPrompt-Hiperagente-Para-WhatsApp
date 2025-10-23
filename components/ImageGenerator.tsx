import React from 'react';
import { PhotoIcon } from './Icons';

interface ImageGeneratorProps {
    prompt: string;
    setPrompt: (prompt: string) => void;
    aspectRatio: '1:1' | '16:9' | '9:16' | '4:3' | '3:4';
    setAspectRatio: (ratio: '1:1' | '16:9' | '9:16' | '4:3' | '3:4') => void;
    generatedImage: string | null;
    isLoading: boolean;
    error: string | null;
    onGenerate: () => void;
}

export const ImageGenerator: React.FC<ImageGeneratorProps> = ({
    prompt,
    setPrompt,
    aspectRatio,
    setAspectRatio,
    generatedImage,
    isLoading,
    error,
    onGenerate,
}) => {
    const aspectRatios: Array<ImageGeneratorProps['aspectRatio']> = ['16:9', '1:1', '9:16', '4:3', '3:4'];

    const getAspectRatioClass = (ratio: string) => {
        switch (ratio) {
            case '16:9': return 'aspect-video';
            case '9:16': return 'aspect-[9/16]';
            case '4:3': return 'aspect-4/3';
            case '3:4': return 'aspect-3/4';
            case '1:1':
            default: return 'aspect-square';
        }
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
            <div className="space-y-4">
                <div>
                    <label htmlFor="image-prompt" className="block text-sm font-medium text-slate-400 mb-2">
                        Prompt da Imagem
                    </label>
                    <textarea
                        id="image-prompt"
                        value={prompt}
                        onChange={(e) => setPrompt(e.target.value)}
                        placeholder="Descreva a imagem que você quer criar..."
                        rows={6}
                        className="w-full bg-slate-700 border border-slate-600 text-white rounded-md px-3 py-2 focus:ring-2 focus:ring-cyan-500 focus:outline-none transition resize-y"
                    />
                </div>
                <div>
                    <label htmlFor="aspect-ratio" className="block text-sm font-medium text-slate-400 mb-2">
                        Proporção (Aspect Ratio)
                    </label>
                    <select
                        id="aspect-ratio"
                        value={aspectRatio}
                        onChange={(e) => setAspectRatio(e.target.value as ImageGeneratorProps['aspectRatio'])}
                        className="bg-slate-700 border border-slate-600 text-white text-sm rounded-lg focus:ring-cyan-500 focus:border-cyan-500 block w-full p-2.5"
                    >
                        {aspectRatios.map(ratio => (
                            <option key={ratio} value={ratio}>{ratio}</option>
                        ))}
                    </select>
                </div>
                <button
                    onClick={onGenerate}
                    disabled={isLoading}
                    className="w-full flex items-center justify-center gap-2 px-4 py-2.5 font-semibold text-white bg-cyan-600 hover:bg-cyan-700 rounded-md transition-colors disabled:opacity-50 disabled:cursor-wait"
                >
                    {isLoading ? (
                        <>
                            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Gerando...
                        </>
                    ) : (
                        <>
                           <PhotoIcon /> Gerar Imagem
                        </>
                    )}
                </button>
            </div>
            <div className="flex items-center justify-center w-full">
                <div className={`w-full max-w-lg bg-slate-900/50 border-2 border-dashed border-slate-700 rounded-lg flex items-center justify-center transition-all ${getAspectRatioClass(aspectRatio)}`}>
                    {isLoading && (
                         <div className="text-center text-slate-400">
                            <p>Criando sua imagem...</p>
                            <p className="text-xs text-slate-500">Isso pode levar alguns segundos.</p>
                        </div>
                    )}
                    {error && !isLoading && (
                        <div className="p-4 text-center text-red-400">
                            <p className="font-semibold">Erro ao Gerar Imagem</p>
                            <p className="text-sm">{error}</p>
                        </div>
                    )}
                    {generatedImage && !isLoading && !error && (
                        <img 
                            src={generatedImage} 
                            alt="Imagem gerada por IA" 
                            className="w-full h-full object-cover rounded-md"
                        />
                    )}
                    {!generatedImage && !isLoading && !error && (
                        <div className="text-center text-slate-500 p-4">
                            <PhotoIcon className="w-12 h-12 mx-auto mb-2" />
                            <p>A imagem gerada aparecerá aqui.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

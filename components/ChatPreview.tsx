import React from 'react';

interface ChatPreviewProps {
  title: string;
  message: string;
  options?: string[];
}

export const ChatPreview: React.FC<ChatPreviewProps> = ({ title, message, options }) => {
  return (
    <div className="bg-slate-900 rounded-lg p-4 max-w-md mx-auto border border-slate-700 shadow-inner">
      <div className="flex items-center pb-2 mb-2 border-b border-slate-700">
        <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center text-white font-bold text-sm">
           W
        </div>
        <h4 className="text-md font-semibold text-slate-200 ml-3">{title}</h4>
      </div>
      <div className="space-y-3">
        {/* Chat bubble for the main message */}
        <div className="flex">
          <div className="bg-slate-700 rounded-lg rounded-bl-none p-3 max-w-xs text-sm text-slate-300 whitespace-pre-wrap">
            {message}
          </div>
        </div>

        {/* Chat bubbles for options */}
        {options && options.map((option, index) => (
          <div key={index} className="flex justify-end">
            <div className="bg-cyan-600/30 border border-cyan-500 text-cyan-200 rounded-lg rounded-br-none p-2.5 max-w-xs text-sm cursor-pointer hover:bg-cyan-600/50 transition-colors">
              {option}
            </div>
          </div>
        ))}
      </div>
       <div className="text-center text-xs text-slate-500 pt-3 mt-2 border-t border-slate-700">
         Simulação de Interface do WhatsApp
       </div>
    </div>
  );
};

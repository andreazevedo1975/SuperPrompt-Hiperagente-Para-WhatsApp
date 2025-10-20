import React, { useState } from 'react';
import type { NicheModule } from '../types';

interface NicheModulesProps {
  modules: NicheModule[];
}

const AccordionItem: React.FC<{ module: NicheModule, isOpen: boolean, onClick: () => void }> = ({ module, isOpen, onClick }) => {
    return (
        <div className="border-b border-slate-700">
            <h2>
                <button
                    type="button"
                    className="flex items-center justify-between w-full p-5 font-medium text-left text-slate-300 hover:bg-slate-700/50 focus:outline-none transition"
                    onClick={onClick}
                >
                    <div className="flex flex-col sm:flex-row sm:items-center">
                       <span className="text-cyan-400 mr-4">{module.option}</span>
                       <span className="text-xs sm:text-sm mt-1 sm:mt-0 px-2 py-1 bg-slate-700 rounded-full">{module.niche}</span>
                    </div>
                    <svg
                        className={`w-3 h-3 transform transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
                        aria-hidden="true"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 10 6"
                    >
                        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5 5 1 1 5" />
                    </svg>
                </button>
            </h2>
            <div className={`transition-all duration-300 ease-in-out ${isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'} overflow-hidden`}>
                <div className="p-5 border-t border-slate-700 bg-slate-900/50">
                    <ul className="list-disc pl-5 space-y-2 text-slate-400">
                        {module.actions.map((action, idx) => (
                           <li key={idx}>{action}</li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    )
}

export const NicheModules: React.FC<NicheModulesProps> = ({ modules }) => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const handleToggle = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="bg-slate-800 border border-slate-700 rounded-lg overflow-hidden">
      {modules.map((module, index) => (
        <AccordionItem 
            key={index} 
            module={module} 
            isOpen={openIndex === index} 
            onClick={() => handleToggle(index)} 
        />
      ))}
    </div>
  );
};

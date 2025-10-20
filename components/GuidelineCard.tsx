import React from 'react';
import type { Guideline } from '../types';

interface GuidelineCardProps {
  guideline: Guideline;
}

export const GuidelineCard: React.FC<GuidelineCardProps> = ({ guideline }) => {
  return (
    <div className="bg-slate-800 p-5 rounded-lg border border-slate-700 hover:border-cyan-500 hover:bg-slate-700/50 transition-all duration-300">
      <div className="flex items-center gap-4">
        <div className="flex-shrink-0 text-cyan-400">{guideline.icon}</div>
        <h3 className="text-lg font-semibold text-white">{guideline.title}</h3>
      </div>
      <p className="mt-3 text-slate-400 text-sm">{guideline.description}</p>
    </div>
  );
};

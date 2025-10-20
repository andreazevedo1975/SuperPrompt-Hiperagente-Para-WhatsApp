import React from 'react';

interface SectionProps {
  title: string;
  children: React.ReactNode;
}

export const Section: React.FC<SectionProps> = ({ title, children }) => {
  return (
    <section className="bg-slate-800/50 rounded-xl p-6 shadow-lg border border-slate-700">
      <h2 className="text-2xl font-bold text-cyan-400 mb-6 pb-3 border-b-2 border-slate-700">{title}</h2>
      <div>{children}</div>
    </section>
  );
};

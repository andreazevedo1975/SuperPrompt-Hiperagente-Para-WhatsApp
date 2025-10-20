import React from 'react';
import type { HandoffTrigger, HandoffStep } from '../types';

interface HandoffRulesProps {
    triggers: HandoffTrigger[];
    steps: HandoffStep[];
}

export const HandoffRules: React.FC<HandoffRulesProps> = ({ triggers, steps }) => {
    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Triggers Section */}
            <div>
                <h3 className="text-xl font-semibold text-white mb-4">Gatilhos de Transbordo</h3>
                <div className="space-y-4">
                    {triggers.map((trigger, index) => (
                        <div key={index} className="bg-slate-800 p-4 rounded-lg border border-slate-700">
                            <p className="font-bold text-cyan-400">{trigger.type}</p>
                            <p className="text-slate-400 mt-1 text-sm">{trigger.description}</p>
                        </div>
                    ))}
                </div>
            </div>

            {/* Procedure Section */}
            <div>
                <h3 className="text-xl font-semibold text-white mb-4">Procedimento de Transferência</h3>
                <div className="space-y-3">
                    {steps.map((step) => (
                        <div key={step.step} className="flex items-start gap-4">
                            <div className="flex-shrink-0 w-8 h-8 flex items-center justify-center bg-slate-700 text-cyan-400 font-bold rounded-full">
                                {step.step}
                            </div>
                            <p className="text-slate-300 mt-1">{step.action}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

import React from 'react';
import type { Persona } from '../types';

interface AdaptivePersonaProps {
  personas: Persona[];
  selectedPersona: Persona;
  setSelectedPersona: (persona: Persona) => void;
}

const toneColors: { [key: string]: string } = {
    'Descontraído, Criativo, "Antenado"': 'bg-purple-500/20 text-purple-300',
    'Formal, Exclusivo, Cordial': 'bg-yellow-500/20 text-yellow-300',
    'Formal, Objetivo, Seguro': 'bg-blue-500/20 text-blue-300',
    'Empático, Acolhedor, Informativo': 'bg-green-500/20 text-green-300',
    'Máxima Empatia, Calmo, Focado em Solução': 'bg-red-500/20 text-red-300',
};


export const AdaptivePersona: React.FC<AdaptivePersonaProps> = ({ personas, selectedPersona, setSelectedPersona }) => {

    const handlePersonaChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedProfile = event.target.value;
        const newPersona = personas.find(p => p.profile === selectedProfile);
        if (newPersona) {
            setSelectedPersona(newPersona);
        }
    };

    return (
        <div className="space-y-6">
            <div>
                <label htmlFor="persona-select" className="block mb-2 text-sm font-medium text-slate-300">Selecione uma Persona para Simulação:</label>
                <select
                    id="persona-select"
                    value={selectedPersona.profile}
                    onChange={handlePersonaChange}
                    className="bg-slate-700 border border-slate-600 text-white text-sm rounded-lg focus:ring-cyan-500 focus:border-cyan-500 block w-full md:w-1/2 p-2.5"
                >
                    {personas.map(persona => (
                        <option key={persona.profile} value={persona.profile}>
                            {persona.profile}
                        </option>
                    ))}
                </select>
            </div>
            <div className="overflow-x-auto">
                <table className="w-full text-sm text-left text-slate-400">
                    <thead className="text-xs text-cyan-300 uppercase bg-slate-700/50">
                    <tr>
                        <th scope="col" className="px-6 py-3 rounded-l-lg">Perfil do Usuário/Nicho</th>
                        <th scope="col" className="px-6 py-3">Tom de Voz</th>
                        <th scope="col" className="px-6 py-3">Linguagem/Uso de Emojis</th>
                        <th scope="col" className="px-6 py-3 rounded-r-lg">Foco da Resposta</th>
                    </tr>
                    </thead>
                    <tbody>
                    {personas.map((persona, index) => (
                        <tr 
                            key={index} 
                            className={`border-b border-slate-700 transition-colors ${
                                persona.profile === selectedPersona.profile 
                                ? 'bg-slate-700' 
                                : 'bg-slate-800 hover:bg-slate-700/50'
                            }`}
                        >
                        <th scope="row" className={`px-6 py-4 font-medium whitespace-nowrap transition-colors ${
                            persona.profile === selectedPersona.profile ? 'text-cyan-300' : 'text-slate-200'
                        }`}>{persona.profile}</th>
                        <td className="px-6 py-4">
                            <span className={`px-2 py-1 text-xs font-semibold rounded-full ${toneColors[persona.tone] || 'bg-gray-500/20 text-gray-300'}`}>
                                {persona.tone}
                            </span>
                        </td>
                        <td className="px-6 py-4">{persona.language}</td>
                        <td className="px-6 py-4">{persona.focus}</td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};
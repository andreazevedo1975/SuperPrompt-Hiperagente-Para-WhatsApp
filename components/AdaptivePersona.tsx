import React from 'react';
import type { Persona } from '../types';

interface AdaptivePersonaProps {
  personas: Persona[];
}

const toneColors: { [key: string]: string } = {
    'Descontraído, Criativo, "Antenado"': 'bg-purple-500/20 text-purple-300',
    'Formal, Exclusivo, Cordial': 'bg-yellow-500/20 text-yellow-300',
    'Formal, Objetivo, Seguro': 'bg-blue-500/20 text-blue-300',
    'Empático, Acolhedor, Informativo': 'bg-green-500/20 text-green-300',
    'Máxima Empatia, Calmo, Focado em Solução': 'bg-red-500/20 text-red-300',
};


export const AdaptivePersona: React.FC<AdaptivePersonaProps> = ({ personas }) => {
  return (
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
            <tr key={index} className="bg-slate-800 border-b border-slate-700 hover:bg-slate-700/50">
              <th scope="row" className="px-6 py-4 font-medium text-slate-200 whitespace-nowrap">{persona.profile}</th>
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
  );
};

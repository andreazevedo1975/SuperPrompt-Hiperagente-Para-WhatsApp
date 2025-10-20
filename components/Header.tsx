import React from 'react';

interface HeaderProps {
    agentName: string;
    setAgentName: (name: string) => void;
    companyName: string;
    setCompanyName: (name: string) => void;
}

export const Header: React.FC<HeaderProps> = ({ agentName, setAgentName, companyName, setCompanyName }) => {
  return (
    <header className="bg-slate-800 rounded-xl p-6 shadow-lg border border-slate-700">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
            <div>
                <h1 className="text-3xl font-extrabold text-white">Super Prompt: Hiperagente para WhatsApp</h1>
                <p className="text-slate-400 mt-1">Painel de Visualização e Configuração do Agente</p>
            </div>
            <div className="w-full md:w-auto mt-4 md:mt-0 flex flex-col sm:flex-row gap-4">
                <div className="flex-1">
                    <label htmlFor="agentName" className="block text-sm font-medium text-slate-400 mb-1">Nome do Agente</label>
                    <input
                        type="text"
                        id="agentName"
                        value={agentName}
                        onChange={(e) => setAgentName(e.target.value)}
                        placeholder="Ex: Jarvis"
                        className="w-full bg-slate-700 border border-slate-600 text-white rounded-md px-3 py-2 focus:ring-2 focus:ring-cyan-500 focus:outline-none transition"
                    />
                </div>
                <div className="flex-1">
                    <label htmlFor="companyName" className="block text-sm font-medium text-slate-400 mb-1">Nome da Empresa</label>
                    <input
                        type="text"
                        id="companyName"
                        value={companyName}
                        onChange={(e) => setCompanyName(e.target.value)}
                        placeholder="Ex: Acme Corp"
                        className="w-full bg-slate-700 border border-slate-600 text-white rounded-md px-3 py-2 focus:ring-2 focus:ring-cyan-500 focus:outline-none transition"
                    />
                </div>
            </div>
        </div>
    </header>
  );
};

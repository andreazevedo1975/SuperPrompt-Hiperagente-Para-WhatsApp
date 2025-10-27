import React, { useRef } from 'react';

const ArrowDownTrayIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
    </svg>
);

const ArrowUpTrayIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
    </svg>
);

interface HeaderProps {
    agentName: string;
    setAgentName: (name: string) => void;
    companyName: string;
    setCompanyName: (name: string) => void;
    onExport: () => void;
    onImport: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

export const Header: React.FC<HeaderProps> = ({ agentName, setAgentName, companyName, setCompanyName, onExport, onImport }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImportClick = () => {
      fileInputRef.current?.click();
  };
  
  return (
    <header className="bg-slate-800 rounded-xl p-6 shadow-lg border border-slate-700">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
            <div>
                <h1 className="text-3xl font-extrabold text-white">Super Prompt: Hiperagente para WhatsApp</h1>
                <p className="text-slate-400 mt-1">Painel de Visualização e Configuração do Agente</p>
            </div>
            <div className="w-full lg:w-auto flex flex-col sm:flex-row flex-wrap items-center gap-4">
                <div className="flex-1 min-w-[150px]">
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
                <div className="flex-1 min-w-[150px]">
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
                <div className="flex items-end gap-2 pt-2 sm:pt-6">
                     <button
                        onClick={handleImportClick}
                        title="Importar Configuração"
                        className="flex items-center justify-center gap-2 px-3 py-2 text-sm font-semibold bg-slate-700 hover:bg-slate-600 text-slate-200 rounded-md transition"
                    >
                        <ArrowUpTrayIcon />
                        <span className="hidden sm:inline">Importar</span>
                    </button>
                    <button
                        onClick={onExport}
                        title="Exportar Configuração"
                        className="flex items-center justify-center gap-2 px-3 py-2 text-sm font-semibold bg-slate-700 hover:bg-slate-600 text-slate-200 rounded-md transition"
                    >
                        <ArrowDownTrayIcon />
                        <span className="hidden sm:inline">Exportar</span>
                    </button>
                     <input
                        type="file"
                        ref={fileInputRef}
                        onChange={onImport}
                        accept=".json,application/json"
                        className="hidden"
                    />
                </div>
            </div>
        </div>
    </header>
  );
};

import React from 'react';

interface AdvancedToolsProps {
    useGoogleSearch: boolean;
    setUseGoogleSearch: (value: boolean) => void;
    useGoogleMaps: boolean;
    setUseGoogleMaps: (value: boolean) => void;
    useFunctionCalling: boolean;
    setUseFunctionCalling: (value: boolean) => void;
    userLocation: { latitude: number; longitude: number } | null;
    locationError: string | null;
    onRequestLocation: () => void;
}

const ToolToggle: React.FC<{
    id: string;
    label: string;
    description: string;
    checked: boolean;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}> = ({ id, label, description, checked, onChange }) => (
    <div className="relative flex items-start">
        <div className="flex h-6 items-center">
            <input
                id={id}
                aria-describedby={`${id}-description`}
                name={id}
                type="checkbox"
                checked={checked}
                onChange={onChange}
                className="h-4 w-4 rounded border-slate-600 bg-slate-700 text-cyan-600 focus:ring-cyan-600"
            />
        </div>
        <div className="ml-3 text-sm leading-6">
            <label htmlFor={id} className="font-medium text-slate-200">{label}</label>
            <p id={`${id}-description`} className="text-slate-400">{description}</p>
        </div>
    </div>
);

export const AdvancedTools: React.FC<AdvancedToolsProps> = ({
    useGoogleSearch,
    setUseGoogleSearch,
    useGoogleMaps,
    setUseGoogleMaps,
    useFunctionCalling,
    setUseFunctionCalling,
    userLocation,
    locationError,
    onRequestLocation
}) => {
    return (
        <div className="space-y-6">
            <p className="text-slate-400">
                Potencialize seu agente com ferramentas que o conectam a informações e sistemas do mundo real. Ativar ou desativar uma ferramenta reiniciará a sessão de chat do simulador com as novas capacidades.
            </p>
            <div className="space-y-5">
                <ToolToggle
                    id="google-search"
                    label="Google Search Grounding"
                    description="Permite que o agente acesse informações em tempo real da Pesquisa Google para responder perguntas sobre eventos atuais."
                    checked={useGoogleSearch}
                    onChange={(e) => setUseGoogleSearch(e.target.checked)}
                />
                <ToolToggle
                    id="google-maps"
                    label="Google Maps Grounding"
                    description="Permite que o agente encontre locais e forneça informações geográficas. Para melhores resultados, compartilhe sua localização."
                    checked={useGoogleMaps}
                    onChange={(e) => setUseGoogleMaps(e.target.checked)}
                />
                {useGoogleMaps && (
                     <div className="pl-9">
                        <button 
                            onClick={onRequestLocation}
                            className="text-sm bg-slate-700 hover:bg-slate-600 text-cyan-300 font-semibold py-1.5 px-3 rounded-md transition"
                        >
                           Usar Localização Atual
                        </button>
                        {userLocation && (
                            <p className="text-xs text-green-400 mt-2">Localização obtida: Lat {userLocation.latitude.toFixed(4)}, Lon {userLocation.longitude.toFixed(4)}</p>
                        )}
                        {locationError && (
                             <p className="text-xs text-red-400 mt-2">{locationError}</p>
                        )}
                    </div>
                )}
                <ToolToggle
                    id="function-calling"
                    label="Function Calling (Exemplo: Agendamento)"
                    description="Permite que o agente execute ações, como agendar uma visita, interagindo com sistemas externos (simulado)."
                    checked={useFunctionCalling}
                    onChange={(e) => setUseFunctionCalling(e.target.checked)}
                />
            </div>
        </div>
    );
};
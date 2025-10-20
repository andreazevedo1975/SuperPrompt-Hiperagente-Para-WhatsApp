import React from 'react';
import { ChatPreview } from './ChatPreview';

export const SystemMessages: React.FC = () => {
    const awayMessage = "Olá! Nosso horário de atendimento é de [Horário] a [Horário] (de [Dia] a [Dia]). Recebemos sua mensagem e responderemos pontualmente assim que retornarmos. Se for urgente, envie um email para [Email].";
    const npsMessage = "Conseguimos te ajudar? De 0 a 10, qual a probabilidade de você nos recomendar?";
    const npsOptions = ["0-6 Detrator", "7-8 Neutro", "9-10 Promotor"];

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <ChatPreview 
                title="Mensagem de Ausência"
                message={awayMessage}
            />
            <ChatPreview 
                title="Pesquisa de Satisfação (NPS)"
                message={npsMessage}
                options={npsOptions}
            />
        </div>
    );
};

import React from 'react';

interface SystemPromptConfigProps {
    systemPrompt: string;
    setSystemPrompt: (prompt: string) => void;
    exampleUserInput1: string;
    setExampleUserInput1: (input: string) => void;
    exampleAgentOutput1: string;
    setExampleAgentOutput1: (output: string) => void;
    exampleUserInput2: string;
    setExampleUserInput2: (input: string) => void;
    exampleAgentOutput2: string;
    setExampleAgentOutput2: (output: string) => void;
}

const TextAreaInput: React.FC<{
    id: string;
    label: string;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
    placeholder: string;
    rows?: number;
}> = ({ id, label, value, onChange, placeholder, rows = 4 }) => (
    <div>
        <label htmlFor={id} className="block text-sm font-medium text-slate-400 mb-2">
            {label}
        </label>
        <textarea
            id={id}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            rows={rows}
            className="w-full bg-slate-700 border border-slate-600 text-white rounded-md px-3 py-2 focus:ring-2 focus:ring-cyan-500 focus:outline-none transition resize-y"
        />
    </div>
);

export const SystemPromptConfig: React.FC<SystemPromptConfigProps> = ({
    systemPrompt,
    setSystemPrompt,
    exampleUserInput1,
    setExampleUserInput1,
    exampleAgentOutput1,
    setExampleAgentOutput1,
    exampleUserInput2,
    setExampleUserInput2,
    exampleAgentOutput2,
    setExampleAgentOutput2
}) => {
    return (
        <div className="space-y-6">
            <div>
                <p className="text-slate-400 mb-4">
                    O "System Prompt" é a instrução principal que define a identidade, o comportamento e os objetivos do seu Hiperagente. Ele serve como a "constituição" do assistente, guiando todas as suas interações.
                </p>
                <TextAreaInput
                    id="systemPrompt"
                    label="Template do System Prompt"
                    value={systemPrompt}
                    onChange={(e) => setSystemPrompt(e.target.value)}
                    placeholder="Defina a personalidade e as diretrizes principais do agente..."
                    rows={6}
                />
            </div>

            <div className="border-t border-slate-700 pt-6">
                <h3 className="text-xl font-semibold text-white mb-2">Exemplos (Few-shot Prompting)</h3>
                <p className="text-slate-400 mb-6">
                    Fornecer exemplos de interações ajuda o modelo de IA a entender melhor o tom, o estilo e as respostas esperadas em situações específicas, melhorando a precisão e a qualidade do atendimento.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-6">
                    {/* Example 1 */}
                    <div className="space-y-4 bg-slate-800/50 p-4 rounded-lg border border-slate-700">
                        <h4 className="font-semibold text-cyan-400">Exemplo 1</h4>
                        <TextAreaInput
                            id="exampleUserInput1"
                            label="Entrada do Usuário"
                            value={exampleUserInput1}
                            onChange={(e) => setExampleUserInput1(e.target.value)}
                            placeholder="Ex: oi, queria saber onde está meu pedido 123"
                        />
                        <TextAreaInput
                            id="exampleAgentOutput1"
                            label="Saída Desejada do Agente"
                            value={exampleAgentOutput1}
                            onChange={(e) => setExampleAgentOutput1(e.target.value)}
                            placeholder="Ex: Olá! Claro, vou verificar o status do seu pedido #123 agora mesmo..."
                        />
                    </div>
                    
                    {/* Example 2 */}
                    <div className="space-y-4 bg-slate-800/50 p-4 rounded-lg border border-slate-700">
                        <h4 className="font-semibold text-cyan-400">Exemplo 2</h4>
                         <TextAreaInput
                            id="exampleUserInput2"
                            label="Entrada do Usuário"
                            value={exampleUserInput2}
                            onChange={(e) => setExampleUserInput2(e.target.value)}
                            placeholder="Ex: meu produto veio quebrado, que raiva"
                        />
                        <TextAreaInput
                            id="exampleAgentOutput2"
                            label="Saída Desejada do Agente"
                            value={exampleAgentOutput2}
                            onChange={(e) => setExampleAgentOutput2(e.target.value)}
                            placeholder="Ex: Puxa, lamento muito por isso! 😔 Entendo sua frustração..."
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};
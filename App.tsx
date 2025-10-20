import React, { useState, useEffect } from 'react';
import { GUIDELINES, PERSONAS, NICHE_MODULES, HANDOFF_TRIGGERS, HANDOFF_STEPS } from './constants';
import { Header } from './components/Header';
import { Section } from './components/Section';
import { GuidelineCard } from './components/GuidelineCard';
import { ChatPreview } from './components/ChatPreview';
import { AdaptivePersona } from './components/AdaptivePersona';
import { NicheModules } from './components/NicheModules';
import { HandoffRules } from './components/HandoffRules';
import { SystemMessages } from './components/SystemMessages';
import { SystemPromptConfig } from './components/SystemPromptConfig';

const App: React.FC = () => {
  const [agentName, setAgentName] = useState<string>('Nome do Hiperagente');
  const [companyName, setCompanyName] = useState<string>('Nome da Empresa');
  
  const [systemPrompt, setSystemPrompt] = useState<string>('');
  const [exampleUserInput1, setExampleUserInput1] = useState<string>('oi, queria saber onde está meu pedido 123');
  const [exampleAgentOutput1, setExampleAgentOutput1] = useState<string>('Olá! Claro, vou verificar o status do seu pedido #123 agora mesmo. Um momento, por favor...');
  const [exampleUserInput2, setExampleUserInput2] = useState<string>('meu produto veio quebrado, que raiva');
  const [exampleAgentOutput2, setExampleAgentOutput2] = useState<string>('Puxa, lamento muito por isso! 😔 Entendo sua frustração. Para resolvermos isso o mais rápido possível, você poderia me confirmar o número do pedido e me enviar uma foto do produto, por favor?');

  useEffect(() => {
    const agent = agentName || '[Nome do Hiperagente]';
    const company = companyName || '[Nome da Empresa]';
    setSystemPrompt(`Você é o ${agent}, um assistente conversacional avançado para a ${company} no WhatsApp. Sua missão é fornecer um atendimento eficiente, personalizado e alinhado com as políticas da Meta/WhatsApp. Siga estritamente as diretrizes de comportamento, adapte sua persona conforme o perfil do cliente e utilize os módulos de atendimento para resolver as solicitações. Aja sempre com clareza, agilidade e empatia.`);
  }, [agentName, companyName]);


  const welcomeMessage = `Olá! Eu sou o ${agentName || '[Nome]'}, o Hiperagente da ${companyName || '[Empresa]'}. 😉 Fico feliz em te atender! Antes de começarmos, preciso entender com quem estou falando para personalizar nosso bate-papo.

Por favor, digite seu CPF/CNPJ ou escolha uma opção no Menu Principal:`;
  const menuOptions = [
    '1. Ver Catálogo/Produtos',
    '2. Falar sobre um Pedido/Suporte',
    '3. Falar com um Atendente Humano',
    '4. Outros Assuntos',
  ];

  return (
    <div className="min-h-screen bg-slate-900 font-sans p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        <Header 
          agentName={agentName} 
          setAgentName={setAgentName} 
          companyName={companyName} 
          setCompanyName={setCompanyName} 
        />

        <main className="mt-8 space-y-12">
          <Section title="1. Diretrizes de Comportamento e Ética">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {GUIDELINES.map((guideline, index) => (
                <GuidelineCard key={index} guideline={guideline} />
              ))}
            </div>
          </Section>

          <Section title="2. Estrutura de Atendimento Inicial">
             <ChatPreview 
                title="Mensagem de Boas-Vindas"
                message={welcomeMessage}
                options={menuOptions}
             />
          </Section>
          
          <Section title="3. Módulo de Persona Adaptativa">
            <AdaptivePersona personas={PERSONAS} />
          </Section>
          
          <Section title="4. Módulo de Atendimento em Nichos">
            <NicheModules modules={NICHE_MODULES} />
          </Section>
          
          <Section title="5. Regras de Transbordo (Escalonamento Humano)">
            <HandoffRules triggers={HANDOFF_TRIGGERS} steps={HANDOFF_STEPS} />
          </Section>
          
          <Section title="6. Mensagens de Sistema">
            <SystemMessages />
          </Section>

          <Section title="7. Configuração do Prompt de Sistema">
            <SystemPromptConfig
              systemPrompt={systemPrompt}
              setSystemPrompt={setSystemPrompt}
              exampleUserInput1={exampleUserInput1}
              setExampleUserInput1={setExampleUserInput1}
              exampleAgentOutput1={exampleAgentOutput1}
              setExampleAgentOutput1={setExampleAgentOutput1}
              exampleUserInput2={exampleUserInput2}
              setExampleUserInput2={setExampleUserInput2}
              exampleAgentOutput2={exampleAgentOutput2}
              setExampleAgentOutput2={setExampleAgentOutput2}
            />
          </Section>

        </main>
      </div>
    </div>
  );
};

export default App;
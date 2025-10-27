import React, { useState, useEffect, useRef, useCallback } from 'react';
import { GoogleGenAI, Chat, Tool, GenerateContentResponse } from '@google/genai';
import { GUIDELINES, PERSONAS, NICHE_MODULES, HANDOFF_TRIGGERS, HANDOFF_STEPS, AGENDAR_VISITA_TOOL } from './constants';
import { Header } from './components/Header';
import { Section } from './components/Section';
import { GuidelineCard } from './components/GuidelineCard';
import { ChatPreview } from './components/ChatPreview';
import { AdaptivePersona } from './components/AdaptivePersona';
import { NicheModules } from './components/NicheModules';
import { HandoffRules } from './components/HandoffRules';
import { SystemMessages } from './components/SystemMessages';
import { ImageGenerator } from './components/ImageGenerator';
import { LiveConversation } from './components/LiveConversation';
import { SystemPromptConfig } from './components/SystemPromptConfig';
import { ChatSimulator } from './components/ChatSimulator';
import { AdvancedTools } from './components/AdvancedTools';
import type { Persona, ChatMessage, ChatMessageSource, AppConfig } from './types';

const App: React.FC = () => {
  const [agentName, setAgentName] = useState<string>('Nome do Hiperagente');
  const [companyName, setCompanyName] = useState<string>('Nome da Empresa');
  const [selectedPersona, setSelectedPersona] = useState<Persona>(PERSONAS[0]);

  const initialBasePrompt = `Você é o {agentName}, um assistente conversacional avançado para a {companyName} no WhatsApp. Sua missão é fornecer um atendimento eficiente, personalizado e alinhado com as políticas da Meta/WhatsApp. Siga estritamente as diretrizes de comportamento, adapte sua persona conforme o perfil do cliente e utilize os módulos de atendimento para resolver as solicitações. Aja sempre com clareza, agilidade e empatia.`;
  const [basePromptTemplate, setBasePromptTemplate] = useState<string>(initialBasePrompt);
  const [finalSystemPrompt, setFinalSystemPrompt] = useState<string>('');
  
  const [exampleUserInput1, setExampleUserInput1] = useState<string>('oi, queria saber onde está meu pedido 123');
  const [exampleAgentOutput1, setExampleAgentOutput1] = useState<string>('Olá! Claro, vou verificar o status do seu pedido #123 agora mesmo. Um momento, por favor...');
  const [exampleUserInput2, setExampleUserInput2] = useState<string>('meu produto veio quebrado, que raiva');
  const [exampleAgentOutput2, setExampleAgentOutput2] = useState<string>('Puxa, lamento muito por isso! 😔 Entendo sua frustração. Para resolvermos isso o mais rápido possível, você poderia me confirmar o número do pedido e me enviar uma foto do produto, por favor?');

  // Image Generation State
  const [imagePrompt, setImagePrompt] = useState<string>('Foto cinematográfica de um astronauta surfando em uma onda cósmica de nebulosas coloridas, com planetas e estrelas ao fundo, iluminação dramática.');
  const [aspectRatio, setAspectRatio] = useState<'1:1' | '16:9' | '9:16' | '4:3' | '3:4'>('16:9');
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [isImageLoading, setIsImageLoading] = useState(false);
  const [imageError, setImageError] = useState<string | null>(null);

  // Advanced Tools State
  const [useGoogleSearch, setUseGoogleSearch] = useState(false);
  const [useGoogleMaps, setUseGoogleMaps] = useState(false);
  const [useFunctionCalling, setUseFunctionCalling] = useState(false);
  const [userLocation, setUserLocation] = useState<{ latitude: number; longitude: number } | null>(null);
  const [locationError, setLocationError] = useState<string | null>(null);

  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
  const [isChatLoading, setIsChatLoading] = useState(false);
  const chatSessionRef = useRef<Chat | null>(null);

  useEffect(() => {
    const agent = agentName || '[Nome do Hiperagente]';
    const company = companyName || '[Nome da Empresa]';
    
    const processedBase = basePromptTemplate
        .replace(/{agentName}/g, agent)
        .replace(/{companyName}/g, company);

    const personaPrompt = `\n\n--- INSTRUÇÕES DE PERSONA ---\nBaseado no perfil do cliente, adote estritamente a seguinte persona:\n- **Perfil Alvo:** ${selectedPersona.profile}\n- **Tom de Voz:** ${selectedPersona.tone}\n- **Linguagem e Emojis:** ${selectedPersona.language}\n- **Foco da Resposta:** ${selectedPersona.focus}`;

    setFinalSystemPrompt(processedBase + personaPrompt);
  }, [agentName, companyName, selectedPersona, basePromptTemplate]);
  
  const reinitializeChat = useCallback(() => {
    if (!process.env.API_KEY) {
      console.error("API_KEY environment variable not set.");
      setChatHistory([{ role: 'system', text: 'Erro: A chave de API não foi configurada.' }]);
      return;
    };
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

    const history: { role: 'user' | 'model'; parts: { text: string }[] }[] = [];
    if (exampleUserInput1 && exampleAgentOutput1) {
        history.push({ role: 'user', parts: [{ text: exampleUserInput1 }] });
        history.push({ role: 'model', parts: [{ text: exampleAgentOutput1 }] });
    }
    if (exampleUserInput2 && exampleAgentOutput2) {
        history.push({ role: 'user', parts: [{ text: exampleUserInput2 }] });
        history.push({ role: 'model', parts: [{ text: exampleAgentOutput2 }] });
    }

    const tools: Tool[] = [];
    if (useGoogleSearch) tools.push({ googleSearch: {} });
    if (useGoogleMaps) tools.push({ googleMaps: {} });
    if (useFunctionCalling) tools.push({ functionDeclarations: [AGENDAR_VISITA_TOOL] });

    const chat = ai.chats.create({
        model: 'gemini-2.5-flash',
        config: {
            systemInstruction: finalSystemPrompt,
            tools: tools.length > 0 ? tools : undefined,
            toolConfig: useGoogleMaps && userLocation ? {
                retrievalConfig: { latLng: userLocation }
            } : undefined,
        },
        history: history,
    });
    chatSessionRef.current = chat;
    setChatHistory([]); // Clear the visual chat history
  }, [finalSystemPrompt, exampleUserInput1, exampleAgentOutput1, exampleUserInput2, exampleAgentOutput2, useGoogleSearch, useGoogleMaps, useFunctionCalling, userLocation]);

  useEffect(() => {
      reinitializeChat();
  }, [reinitializeChat]);

  const handleSendMessage = async (message: string) => {
    if (!chatSessionRef.current || isChatLoading) return;
  
    setIsChatLoading(true);
    setChatHistory(prev => [...prev, { role: 'user', text: message }]);
  
    try {
      let response: GenerateContentResponse = await chatSessionRef.current.sendMessage({ message });
  
      // Handle function calls
      if (response.functionCalls && response.functionCalls.length > 0) {
        const fc = response.functionCalls[0];
        setChatHistory(prev => [...prev, { role: 'system', text: `[Ação: Executando a função '${fc.name}' com os argumentos: ${JSON.stringify(fc.args)}]` }]);
        
        // --- Function Execution Simulation ---
        // In a real app, you would call your backend/service here.
        let functionResult;
        if (fc.name === 'agendar_visita') {
            const confirmationId = `CONF-${Date.now()}`;
            functionResult = {
                success: true,
                message: `Visita agendada para ${fc.args.nome_cliente} em ${fc.args.data} às ${fc.args.hora}.`,
                confirmationId: confirmationId,
            };
            setChatHistory(prev => [...prev, { role: 'system', text: `[Sucesso: Visita agendada com ID ${confirmationId}]` }]);
        } else {
            functionResult = { success: false, message: "Função desconhecida." };
        }
        // --- End Simulation ---

        // Send the function result back to the model
        response = await chatSessionRef.current.sendMessage({
            toolResponses: {
                functionResponses: {
                    id: fc.id,
                    name: fc.name,
                    response: functionResult,
                }
            }
        });
      }

      // Process final response (text + grounding)
      const sources: ChatMessageSource[] = (response.candidates?.[0]?.groundingMetadata?.groundingChunks || [])
          .flatMap(chunk => {
              if (chunk.web) return { type: 'web', uri: chunk.web.uri, title: chunk.web.title };
              if (chunk.maps) return { type: 'maps', uri: chunk.maps.uri, title: chunk.maps.title };
              return [];
          })
          .filter(Boolean) as ChatMessageSource[];

      setChatHistory(prev => [...prev, { role: 'model', text: response.text, sources }]);
  
    } catch (error) {
      console.error("Chat Error:", error);
      setChatHistory(prev => [...prev, { role: 'model', text: "Desculpe, ocorreu um erro ao processar sua mensagem." }]);
    } finally {
      setIsChatLoading(false);
    }
  };

  const handleResetChat = () => {
      reinitializeChat();
  };

  const handleRequestLocation = () => {
    setLocationError(null);
    setUserLocation(null);
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                setUserLocation({
                    latitude: position.coords.latitude,
                    longitude: position.coords.longitude,
                });
            },
            (error) => {
                setLocationError(`Erro ao obter localização: ${error.message}`);
            }
        );
    } else {
        setLocationError("Geolocalização não é suportada por este navegador.");
    }
  };

  const handleGenerateImage = async () => {
    if (!process.env.API_KEY || !imagePrompt) {
        setImageError("A chave de API não foi configurada ou o prompt está vazio.");
        return;
    }
    setIsImageLoading(true);
    setGeneratedImage(null);
    setImageError(null);

    try {
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
        const response = await ai.models.generateImages({
            model: 'imagen-4.0-generate-001',
            prompt: imagePrompt,
            config: {
                numberOfImages: 1,
                outputMimeType: 'image/jpeg',
                aspectRatio: aspectRatio,
            },
        });

        const base64ImageBytes = response.generatedImages[0].image.imageBytes;
        const imageUrl = `data:image/jpeg;base64,${base64ImageBytes}`;
        setGeneratedImage(imageUrl);
    } catch (error) {
        console.error("Image Generation Error:", error);
        setImageError("Falha ao gerar a imagem. Verifique o console para mais detalhes ou tente um prompt diferente.");
    } finally {
        setIsImageLoading(false);
    }
  };

  const handleExportConfig = () => {
    const config: AppConfig = {
      agentName,
      companyName,
      selectedPersonaProfile: selectedPersona.profile,
      basePromptTemplate,
      exampleUserInput1,
      exampleAgentOutput1,
      exampleUserInput2,
      exampleAgentOutput2,
      useGoogleSearch,
      useGoogleMaps,
      useFunctionCalling,
    };
    
    const blob = new Blob([JSON.stringify(config, null, 2)], {type : 'application/json'});
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `hyperagent-config-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleImportConfig = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
        try {
            const text = e.target?.result;
            if (typeof text !== 'string') throw new Error("File content is not readable.");
            
            const config = JSON.parse(text) as Partial<AppConfig>;

            if (!config.agentName || !config.companyName || !config.selectedPersonaProfile || !config.basePromptTemplate) {
                 throw new Error("Invalid or incomplete configuration file.");
            }

            setAgentName(config.agentName);
            setCompanyName(config.companyName);

            const newPersona = PERSONAS.find(p => p.profile === config.selectedPersonaProfile);
            if (newPersona) {
                setSelectedPersona(newPersona);
            } else {
                console.warn(`Persona profile "${config.selectedPersonaProfile}" not found. Defaulting to first available.`);
                setSelectedPersona(PERSONAS[0]);
            }

            setBasePromptTemplate(config.basePromptTemplate);
            setExampleUserInput1(config.exampleUserInput1 ?? '');
            setExampleAgentOutput1(config.exampleAgentOutput1 ?? '');
            setExampleUserInput2(config.exampleUserInput2 ?? '');
            setExampleAgentOutput2(config.exampleAgentOutput2 ?? '');
            
            setUseGoogleSearch(config.useGoogleSearch ?? false);
            setUseGoogleMaps(config.useGoogleMaps ?? false);
            setUseFunctionCalling(config.useFunctionCalling ?? false);
            
            alert('Configuration imported successfully!');

        } catch (error) {
            console.error("Failed to import configuration:", error);
            alert(`Failed to import configuration: ${error instanceof Error ? error.message : 'Unknown error'}`);
        } finally {
            if (event.target) {
                event.target.value = '';
            }
        }
    };
  };

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
          onExport={handleExportConfig}
          onImport={handleImportConfig}
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
            <AdaptivePersona 
              personas={PERSONAS}
              selectedPersona={selectedPersona}
              setSelectedPersona={setSelectedPersona}
            />
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

          <Section title="7. Gerador de Imagem (Imagen 4)">
            <ImageGenerator
                prompt={imagePrompt}
                setPrompt={setImagePrompt}
                aspectRatio={aspectRatio}
                setAspectRatio={setAspectRatio}
                generatedImage={generatedImage}
                isLoading={isImageLoading}
                error={imageError}
                onGenerate={handleGenerateImage}
            />
          </Section>

          <Section title="8. Conversa em Tempo Real (Live API)">
             <p className="text-slate-400 mb-4">
                Inicie uma conversa por voz em tempo real com o Hiperagente. A tecnologia Gemini Live API permite interações de baixa latência com áudio bidirecional e transcrição simultânea. Clique em "Iniciar Conversa" e conceda a permissão de microfone para começar.
            </p>
            <LiveConversation />
          </Section>

          <Section title="9. Configuração do Prompt de Sistema">
            <SystemPromptConfig
              basePromptTemplate={basePromptTemplate}
              setBasePromptTemplate={setBasePromptTemplate}
              finalSystemPrompt={finalSystemPrompt}
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

          <Section title="10. Ferramentas Avançadas e Conhecimento Externo">
            <AdvancedTools
                useGoogleSearch={useGoogleSearch}
                setUseGoogleSearch={setUseGoogleSearch}
                useGoogleMaps={useGoogleMaps}
                setUseGoogleMaps={setUseGoogleMaps}
                useFunctionCalling={useFunctionCalling}
                setUseFunctionCalling={setUseFunctionCalling}
                userLocation={userLocation}
                locationError={locationError}
                onRequestLocation={handleRequestLocation}
            />
          </Section>
          
          <Section title="11. Simulador de Chat Interativo">
            <p className="text-slate-400 mb-4">
              Teste seu Hiperagente em tempo real. A conversa abaixo utiliza o prompt, exemplos e ferramentas configuradas acima para simular o comportamento do assistente. Qualquer alteração na configuração reiniciará o chat.
            </p>
            <ChatSimulator 
              history={chatHistory}
              isLoading={isChatLoading}
              onSendMessage={handleSendMessage}
              onReset={handleResetChat}
            />
          </Section>

        </main>
      </div>
    </div>
  );
};

export default App;

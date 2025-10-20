import React from 'react';
import type { Guideline, Persona, NicheModule, HandoffTrigger, HandoffStep } from './types';
import { ShieldCheckIcon, ClockIcon, HandRaisedIcon, UserCircleIcon, LockClosedIcon, ChatBubbleLeftRightIcon } from './components/Icons';

export const GUIDELINES: Guideline[] = [
  {
    // FIX: Replaced JSX with React.createElement to be valid in a .ts file.
    icon: React.createElement(ClockIcon),
    title: 'Agilidade e Clareza',
    description: 'Respostas rápidas, concisas e com propósito claro. A regra de ouro do WhatsApp.',
  },
  {
    // FIX: Replaced JSX with React.createElement to be valid in a .ts file.
    icon: React.createElement(ChatBubbleLeftRightIcon),
    title: 'Janela de 24 Horas',
    description: 'Prioridade máxima em responder dentro de 24h. Após isso, usar Templates de Mensagem aprovados.',
  },
  {
    // FIX: Replaced JSX with React.createElement to be valid in a .ts file.
    icon: React.createElement(HandRaisedIcon),
    title: 'Opt-in Obrigatório',
    description: 'Nunca iniciar conversas ativas fora da janela de 24h sem consentimento explícito do usuário.',
  },
  {
    // FIX: Replaced JSX with React.createElement to be valid in a .ts file.
    icon: React.createElement(UserCircleIcon),
    title: 'Transparência e Humanização',
    description: 'Sempre se apresentar como assistente virtual e oferecer um caminho claro para o atendimento humano.',
  },
  {
    // FIX: Replaced JSX with React.createElement to be valid in a .ts file.
    icon: React.createElement(LockClosedIcon),
    title: 'Dados e Privacidade',
    description: 'Tratar dados do cliente com máxima confidencialidade e justificar a necessidade de coleta.',
  },
  {
    // FIX: Replaced JSX with React.createElement to be valid in a .ts file.
    icon: React.createElement(ShieldCheckIcon),
    title: 'Tom Amigável e Profissional',
    description: 'Equilíbrio entre amizade e profissionalismo, adaptando-se à persona do cliente.',
  },
];

export const PERSONAS: Persona[] = [
  {
    profile: 'Público Jovem/Moda/Entretenimento',
    tone: 'Descontraído, Criativo, "Antenado"',
    language: 'Gírias leves e modernas, uso moderado de emojis (😎, 🔥, 🤩).',
    focus: 'Rapidez, Conteúdo Visual (fotos, links), Ofertas.',
  },
  {
    profile: 'Cliente VIP/Serviços de Alto Valor',
    tone: 'Formal, Exclusivo, Cordial',
    language: 'Profissional, vocabulário refinado. Uso mínimo de emojis (✅, 🤝).',
    focus: 'Exclusividade, Solução Rápida, Prazos. Transbordo humano prioritário.',
  },
  {
    profile: 'Setor Financeiro/Jurídico/B2B',
    tone: 'Formal, Objetivo, Seguro',
    language: 'Profissional, técnico (se o usuário for do nicho). Evitar emojis.',
    focus: 'Clareza na informação (dados, valores, cláusulas), Documentação, Procedimentos.',
  },
  {
    profile: 'Saúde/Bem-Estar/Educação',
    tone: 'Empático, Acolhedor, Informativo',
    language: 'Neutro, gentil. Emojis de conforto (🌿, 🙏, 🧠).',
    focus: 'Explicações detalhadas, Agendamentos, Suporte humanizado.',
  },
  {
    profile: 'Cliente com Histórico de Insatisfação',
    tone: 'Máxima Empatia, Calmo, Focado em Solução',
    language: 'Padrão formal/neutro. Expressar lamento pela situação (😔, 🙁).',
    focus: 'Reconhecimento do problema, Ação Imediata para Resolver, Acompanhamento.',
  },
];

export const NICHE_MODULES: NicheModule[] = [
    {
        option: "1. Ver Catálogo/Produtos",
        niche: "Vendas/Marketing",
        actions: [
            "Enviar link direto do Catálogo do WhatsApp Business ou da Loja Virtual.",
            "Perguntar: \"Qual categoria te interessa?\" (Ex: Moda Feminina, Investimentos, etc)."
        ]
    },
    {
        option: "2. Falar sobre um Pedido/Suporte",
        niche: "Suporte/Logística",
        actions: [
            "Pedir o número do pedido/protocolo.",
            "Consultar ERP/CRM para informar status de entrega.",
            "Iniciar fluxo de resolução de problemas (Devolução, Troca, Dúvida Técnica)."
        ]
    },
    {
        option: "3. Falar com um Atendente Humano",
        niche: "Transbordo",
        actions: [
            "Prioridade máxima.",
            "Coletar breve resumo do motivo.",
            "Informar o tempo estimado de espera.",
            "Se fora do horário, enviar Mensagem de Ausência com previsão de retorno."
        ]
    },
    {
        option: "4. Outros Assuntos",
        niche: "Geral/FAQ",
        actions: [
            "Apresentar um sub-menu com as 5 principais FAQs.",
            "Se a dúvida persistir após 2 interações, sugerir o Transbordo."
        ]
    }
];

export const HANDOFF_TRIGGERS: HandoffTrigger[] = [
    {
        type: "Gatilho Imediato",
        description: "Usuário digita 'Falar com atendente', 'Humano', ou palavras de frustração/raiva."
    },
    {
        type: "Gatilho por Limite",
        description: "Após 3 interações sem sucesso em resolver a demanda (loop no fluxo)."
    }
];

export const HANDOFF_STEPS: HandoffStep[] = [
    { step: 1, action: "Confirmar a intenção: \"Entendi. Você deseja falar com um de nossos especialistas. Confirma?\"" },
    { step: 2, action: "Coletar resumo: \"Para agilizar, poderia me dar um resumo rápido do motivo?\"" },
    { step: 3, action: "Informar espera: \"Estamos te transferindo agora. Nosso tempo médio de espera é de [Tempo Estimado].\"" },
    { step: 4, action: "Transferir histórico completo da conversa e o resumo para o atendente." }
];
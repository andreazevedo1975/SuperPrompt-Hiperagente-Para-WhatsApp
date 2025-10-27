import type { ReactNode } from 'react';

// FIX: Import `ReactNode` and use it directly to resolve 'Cannot find namespace React' error.
export interface Guideline {
  icon: ReactNode;
  title: string;
  description: string;
}

export interface Persona {
  profile: string;
  tone: string;
  language: string;
  focus: string;
}

export interface NicheModule {
  option: string;
  niche: string;
  actions: string[];
}

export interface HandoffTrigger {
  type: string;
  description: string;
}

export interface HandoffStep {
  step: number;
  action: string;
}

export interface TranscriptionEntry {
  speaker: 'user' | 'model';
  text: string;
  isFinal: boolean;
}

export interface ChatMessageSource {
  type: 'web' | 'maps';
  uri: string;
  title: string;
}

export interface ChatMessage {
  role: 'user' | 'model' | 'system';
  text: string;
  sources?: ChatMessageSource[];
}

export interface AppConfig {
  agentName: string;
  companyName: string;
  selectedPersonaProfile: string;
  basePromptTemplate: string;
  exampleUserInput1: string;
  exampleAgentOutput1: string;
  exampleUserInput2: string;
  exampleAgentOutput2: string;
  useGoogleSearch: boolean;
  useGoogleMaps: boolean;
  useFunctionCalling: boolean;
}
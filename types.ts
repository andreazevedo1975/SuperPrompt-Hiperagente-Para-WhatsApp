export interface Guideline {
  icon: React.ReactNode;
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

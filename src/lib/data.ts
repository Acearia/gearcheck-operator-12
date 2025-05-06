export interface Operator {
  id: string;
  name: string;
  cargo?: string;
  setor?: string;
}

export interface Equipment {
  id: string;
  name: string;
  kp: string;
  type: string;
  sector: string;
  capacity: string;
}

export const operators: Operator[] = [
  { id: "1", name: "João Silva", cargo: "Operador de Ponte Rolante", setor: "Manutenção" },
  { id: "2", name: "Maria Oliveira", cargo: "Técnica de Segurança", setor: "Segurança" },
  { id: "3", name: "Carlos Pereira", cargo: "Supervisor de Produção", setor: "Produção" },
];

export const equipments: Equipment[] = [
  { id: "1", name: "Ponte Rolante A", kp: "1234", type: "1", sector: "Manutenção", capacity: "5" },
  { id: "2", name: "Talha Elétrica B", kp: "5678", type: "2", sector: "Produção", capacity: "2" },
  { id: "3", name: "Pórtico C", kp: "9012", type: "3", sector: "Armazém", capacity: "10" },
];

export interface ChecklistItem {
  id: string;
  question: string;
  answer: "Sim" | "Não" | "N/A" | "Selecione" | null;
}

export const checklistItems: ChecklistItem[] = [
  { id: "1", question: "O cabo de aço possui fios amassados?", answer: null },
  { id: "2", question: "O cabo de aço possui fios partidos?", answer: null },
  { id: "3", question: "O cabo de aço possui fios com dobras?", answer: null },
  { id: "4", question: "O sistema de freio do guincho está funcionando?", answer: null },
  { id: "5", question: "O sistema de freio do Troller está funcionando?", answer: null },
  { id: "6", question: "As travas de segurança do guincho estão funcionando?", answer: null },
  { id: "7", question: "O gancho está girando sem dificuldades?", answer: null },
  { id: "8", question: "O sinal sonoro está funcionando?", answer: null },
  { id: "9", question: "As polias estão girando sem dificuldades?", answer: null },
  { id: "10", question: "Existem grandes danos estruturais no equipamento?", answer: null },
  { id: "11", question: "O equipamento está fazendo algum barulho estranho?", answer: null },
  { id: "12", question: "O fim de curso inferior está funcionando?", answer: null },
  { id: "13", question: "O fim de curso superior está funcionando?", answer: null },
  { id: "14", question: "O fim de curso esquerdo está funcionando?", answer: null },
  { id: "15", question: "O fim de curso direito está funcionando?", answer: null },
  { id: "16", question: "O botão de emergência do controle está funcionando?", answer: null },
  { id: "17", question: "O controle possui botões danificados?", answer: null },
  { id: "18", question: "A corrente possui elos com desgaste?", answer: null },
  { id: "19", question: "A corrente possui elos alongados?", answer: null },
  { id: "20", question: "A corrente possui elos alargados?", answer: null },
  { id: "21", question: "O(s) gancho(s) da corrente possui sinais de desgaste?", answer: null },
  { id: "22", question: "O(s) gancho(s) da corrente possui elos com sinais de alongamento?", answer: null },
  { id: "23", question: "O(s) gancho(s) da corrente possui travas de segurança funcionando?", answer: null },
  { id: "24", question: "A corrente possui plaqueta de identificação fixada?", answer: null },
  { id: "25", question: "O saco recolhedor da corrente, possui furos ou rasgos?", answer: null },
  { id: "26", question: "O batente de giro, está em boas condições de uso?", answer: null },
  { id: "27", question: "Os trilhos do pórtico estão desobstruídos?", answer: null },
  { id: "28", question: "O freio do pórtico está funcionando?", answer: null },
  { id: "29", question: "Os sensores contra esmagamento, estão funcionando?", answer: null }
];


export interface Operator {
  id: string;
  name: string;
}

export interface Equipment {
  id: string;
  name: string;
  kp: string;
  sector: string;
  capacity: string;
}

export interface ChecklistItem {
  id: string;
  question: string;
  answer: "Sim" | "Não" | "Selecione" | null;
}

// Lista de operadores
export const operators: Operator[] = [
  { id: "11347", name: "JOSELIO ZIMMERMANN" },
  { id: "12345", name: "MARIA SILVA" },
  { id: "23456", name: "JOÃO OLIVEIRA" },
  { id: "34567", name: "CARLOS SANTOS" },
  { id: "45678", name: "ANA PEREIRA" },
];

// Lista de equipamentos
export const equipments: Equipment[] = [
  { id: "PONTE01", name: "Ponte 01", kp: "207", sector: "MOLDAGEM", capacity: "10 tons" },
  { id: "PONTE02", name: "Ponte 02", kp: "208", sector: "MOLDAGEM", capacity: "15 tons" },
  { id: "GUINDASTE01", name: "Guindaste 01", kp: "301", sector: "ACABAMENTO", capacity: "5 tons" },
  { id: "GUINDASTE02", name: "Guindaste 02", kp: "302", sector: "ACABAMENTO", capacity: "8 tons" },
  { id: "ELEVADOR01", name: "Elevador 01", kp: "401", sector: "TRANSPORTE", capacity: "2 tons" },
];

// Lista atualizada de verificações de segurança
export const checklistItems: ChecklistItem[] = [
  { id: "1", question: "Os cabos de aço apresentam fios partidos?", answer: null },
  { id: "2", question: "Os cabos de aço apresentam pontos de amassamento?", answer: null },
  { id: "3", question: "Os cabos de aço apresentam alguma dobra?", answer: null },
  { id: "4", question: "O sistema de freios do guincho está funcionando?", answer: null },
  { id: "5", question: "O gancho está girando sem dificuldades?", answer: null },
  { id: "6", question: "O gancho possui trava de segurança funcionando?", answer: null },
  { id: "7", question: "O gancho possui sinais de alongamento?", answer: null },
  { id: "8", question: "Os ganchos da corrente possuem sinais de desgaste?", answer: null },
  { id: "9", question: "As travas de segurança dos ganchos estão funcionando?", answer: null },
  { id: "10", question: "A corrente possui a plaqueta de identificação instalada?", answer: null },
  { id: "11", question: "As polias estão girando sem dificuldades?", answer: null },
  { id: "12", question: "A sinalização sonora funciona durante a movimentação?", answer: null },
  { id: "13", question: "O controle possui botão danificado?", answer: null },
  { id: "14", question: "O botão de emergência está funcionando?", answer: null },
  { id: "15", question: "A estrutura possui grandes danos?", answer: null },
  { id: "16", question: "O sistema de freios do Troller está funcionando?", answer: null },
  { id: "17", question: "Os elos da corrente possuem sinais de desgaste?", answer: null },
  { id: "18", question: "Os elos da corrente possuem sinais de 'alargamento'?", answer: null },
  { id: "19", question: "Os elos da corrente possuem sinais de 'alongamento'?", answer: null },
  { id: "20", question: "O fim de curso superior está funcionando?", answer: null },
  { id: "21", question: "O fim de curso inferior está funcionando?", answer: null },
  { id: "22", question: "O fim de curso direito está funcionando?", answer: null },
  { id: "23", question: "O fim de curso esquerdo está funcionando?", answer: null },
  { id: "24", question: "O equipamento apresenta ruídos estranhos?", answer: null },
];

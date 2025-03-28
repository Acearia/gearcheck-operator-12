
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
  type: string;
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

// Lista de equipamentos atualizada conforme a imagem
export const equipments: Equipment[] = [
  { id: "207", name: "Ponte 01", kp: "207", sector: "MOLDAGEM", capacity: "10 tons", type: "1" },
  { id: "409", name: "Ponte 02", kp: "409", sector: "DESMOLDAGEM", capacity: "10 tons", type: "1" },
  { id: "389", name: "Ponte 03", kp: "389", sector: "EXPEDIÇÃO", capacity: "5 tons", type: "1" },
  { id: "412", name: "Ponte 04", kp: "412", sector: "FUSAO", capacity: "3 tons", type: "1" },
  { id: "322", name: "Ponte 05", kp: "322", sector: "EXPEDIÇÃO", capacity: "1 ton", type: "1" },
  { id: "1092", name: "Ponte 06", kp: "1092", sector: "TRATAMENTO TÉRMICO", capacity: "5 tons", type: "1" },
  { id: "323", name: "Ponte 07", kp: "323", sector: "LINHA DE MOLDAGEM E FECHAMENTO", capacity: "5 e 16 tons", type: "1" },
  { id: "1325", name: "Ponte 08", kp: "1325", sector: "ACABAMENTO DE PEÇAS", capacity: "8 tons", type: "1" },
  { id: "1326", name: "Ponte 09", kp: "1326", sector: "FUSAO", capacity: "10 tons", type: "1" },
  { id: "1327", name: "Ponte 10", kp: "1327", sector: "ACABAMENTO DE PEÇAS", capacity: "2 tons", type: "1" },
  { id: "1270", name: "Ponte 11", kp: "1270", sector: "ACABAMENTO DE PEÇAS", capacity: "2 tons", type: "1" },
  { id: "215", name: "Ponte 12", kp: "215", sector: "MACHARIA", capacity: "1 ton", type: "1" },
  { id: "1804", name: "Ponte 13", kp: "1804", sector: "LINHA DE MOLDAGEM E FECHAMENTO", capacity: "2 tons", type: "1" },
  { id: "2686", name: "Ponte 14", kp: "2686", sector: "ACABAMENTO DE PEÇAS", capacity: "2 tons", type: "1" },
  { id: "3031", name: "Ponte 15", kp: "3031", sector: "FUSAO", capacity: "10 tons", type: "1" },
  { id: "3285", name: "Ponte 18", kp: "3285", sector: "MOLDAGEM", capacity: "1 ton", type: "1" },
  { id: "5846", name: "Ponte 19", kp: "5846", sector: "ACABAMENTO DE PEÇAS", capacity: "8 tons", type: "1" },
  { id: "6038", name: "Ponte 20", kp: "6038", sector: "LINHA DE MOLDAGEM E FECHAMENTO", capacity: "10 tons", type: "1" },
  { id: "6108", name: "Ponte 21", kp: "6108", sector: "ACABAMENTO DE PEÇAS", capacity: "2,5 tons", type: "1" },
  { id: "352", name: "Talha 19", kp: "352", sector: "SUCATA", capacity: "2 tons", type: "2" },
  { id: "375", name: "Talha 23", kp: "375", sector: "DESMOLDAGEM", capacity: "1 ton", type: "2" },
  { id: "3336", name: "Pórtico 01", kp: "3336", sector: "SUCATA", capacity: "5 tons", type: "3" },
  { id: "909", name: "Talha 11", kp: "909", sector: "FUSAO", capacity: "2 tons", type: "2" },
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

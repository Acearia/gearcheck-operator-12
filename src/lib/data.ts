
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
  sector: string;
  capacity: string;
  type: string;
}

export interface ChecklistItem {
  id: string;
  question: string;
  answer: "Sim" | "Não" | "Selecione" | null;
}

// Lista de operadores atualizada com os dados da planilha
export const operators: Operator[] = [
  { id: "1260", name: "VALDAIR LAURENTINO", cargo: "OPER. PRODUÇÃO MACHARIA III", setor: "MACHARIA" },
  { id: "1325", name: "GILMAR OTEMBRAIT", cargo: "INSPETOR QUALIDADE II", setor: "CONTROLE DE QUALIDADE" },
  { id: "1329", name: "GEISON CRISTIANO SCHEL", cargo: "OPER MAQ MOLD FECH II", setor: "LINHA DE MOLDAGEM E FECHAMENTO" },
  { id: "1363", name: "FELIPE DALLABONA", cargo: "ANALISTA DE PPCP II", setor: "PROGRAMÇAO PROD." },
  { id: "1372", name: "ADEMAR GESSER", cargo: "OP. REBARBAÇÃO (OP. ACAB.)III", setor: "REBOLO PENDULAR" },
  { id: "1377", name: "CELSO DA SILVA PEREIRA", cargo: "TÉCNICO EM SEGURANÇA DO TRABALHO II", setor: "SEG. MEDICINA TRABA." },
  { id: "1382", name: "SILVERIO BISATTO", cargo: "SOLDADOR II", setor: "SOLDA" },
  { id: "1413", name: "FABRICIO DALLABONA", cargo: "ENCAR. DE PROD. ACABAMENTO II", setor: "ACABAMENTO DE PEÇAS (I)" },
  { id: "1422", name: "JOSE MARINO REICHERT", cargo: "OP. REBARBAÇÃO (OP. ACAB.)III", setor: "REBOLO PENDULAR" },
  { id: "1423", name: "JOSE PEREIRA", cargo: "INSPETOR QUALIDADE IV", setor: "CONTROLE DE QUALIDADE" },
  { id: "1429", name: "EDILSON NEVES MOTTA", cargo: "INSPETOR QUALIDADE II", setor: "CONTROLE DE QUALIDADE" },
  { id: "1430", name: "REGINALDO VALERIANO DOS SANTOS", cargo: "OP. COR. CANAL (MAÇARIQ.) III", setor: "CORTE DE CANAL MAÇARICO" },
  { id: "1437", name: "ANDERSON LUIS ONEDA", cargo: "MODELADOR III", setor: "MODELARIA" },
  { id: "1446", name: "JOAO CARLOS VANELLI", cargo: "OP. COR. CANAL (MAÇARIQ.) III", setor: "CORTE DE CANAL MAÇARICO" },
  { id: "1463", name: "RAFAEL CLEMENTE ESPIG", cargo: "OPER. PRODUÇÃO MACHARIA III", setor: "MACHARIA" },
  { id: "1475", name: "MARCELO RAMOS", cargo: "MECÂNICO MANUTENÇÃO III", setor: "MANUTENÇAO MECANICA" },
  { id: "1478", name: "ADENOR REICHELT", cargo: "OPER. DE FORNO A INDUÇÃO III", setor: "FUSAO" },
  { id: "1479", name: "ADELSIO REICHELT", cargo: "REFRATARISTA II", setor: "FUSAO" },
  { id: "1488", name: "EDIVAN VELOZO", cargo: "INSPETOR QUALIDADE II", setor: "CONTROLE DE QUALIDADE" },
  { id: "1493", name: "ROBERTO CARLOS PEREIRA", cargo: "OPER. PRODUÇÃO MACHARIA III", setor: "MACHARIA" },
  { id: "1501", name: "EDELBERTO CARLOS GESSER", cargo: "OPERADOR PONTE ROLANTE II", setor: "ACABAMENTO DE PEÇAS" },
  { id: "1508", name: "OSNI REICHERT", cargo: "INSPETOR QUALIDADE II", setor: "CONTROLE DE QUALIDADE" },
  { id: "1514", name: "MAURICIO MELCHIORETTO", cargo: "ANALISTA DE PROCESSOS TÉCNICO I", setor: "DEP. TÉCNICO" },
  { id: "1526", name: "ROGERIO JOSÉ REICHELT", cargo: "OPER. PRODUÇÃO MOLDAGEM III", setor: "MOLDAGEM" },
  { id: "1529", name: "JOAO MARQUES", cargo: "OPER PROD MOLD FECH III", setor: "LINHA DE MOLDAGEM E FECHAMENTO" },
  { id: "1536", name: "VALDEMIRO LEPINSKI", cargo: "MECÂNICO MANUTENÇÃO II", setor: "MANUTENÇAO MECANICA" },
  { id: "1543", name: "GUILHERME LEMKE", cargo: "SUPERVISOR DE USINAGEM", setor: "USINAGEM (I)" },
  { id: "1546", name: "EDERSON SCABURRI", cargo: "LIDER DA ELETROMECANICA", setor: "MANUTENÇAO ELETRICA" },
  { id: "1549", name: "SAMUEL FELIPE KREHNKE", cargo: "MECÂNICO MANUTENÇÃO II", setor: "MANUTENÇAO MECANICA" },
  { id: "1552", name: "JAIME LEPINSKI", cargo: "TORNEIRO MEC. (OPER. USI.)I", setor: "USINAGEM" },
  { id: "1567", name: "ALANO COSTA BATISTA", cargo: "OPERADOR DE FORNO A INDUÇÃO II", setor: "FUSAO" },
  { id: "1575", name: "FABIANO SIGNORELLI", cargo: "OPER.TRATAMENTO TÉRMICO I", setor: "TRATAMENTO TÉRMICO" },
  { id: "1592", name: "ANDERSON DA CUNHA", cargo: "SOLDADOR II", setor: "SOLDA" },
  { id: "1607", name: "JOCEMAR ROSA DOS SANTOS", cargo: "OPER. PRODUÇÃO MACHARIA III", setor: "MOLDAGEM COLDBOX" },
  { id: "1618", name: "ROSALVO MACHADO", cargo: "SOLDADOR III", setor: "SOLDA" },
  { id: "1638", name: "LEONARDO SCHUTZ SCHAUSS", cargo: "OP. DE ESCARFAGEM (OP. ACB)II", setor: "ESCARFAGEM" },
  { id: "1694", name: "LUIS ANTONIO PEREIRA DO NASCIMENTO", cargo: "ALMOXARIFE DE MODELOS I", setor: "PROGRAMÇAO PROD." },
  { id: "1739", name: "EDJALMA RICARDO MARIANO", cargo: "OPER. PRODUÇÃO MACHARIA III", setor: "MACHARIA" },
  { id: "1757", name: "WALLACE ALVES DE JESUS", cargo: "OPER PROD MOLD FECH III", setor: "LINHA DE MOLDAGEM E FECHAMENTO" },
  { id: "1760", name: "ELOIR RAMALHO", cargo: "INSP. QUALIDADE DIMENSIONAL II", setor: "CONTROLE DE QUALIDADE DIMENSIONAL" },
  { id: "1776", name: "JOAO CARLOS RODRIGUES", cargo: "OPER. DE JATO (OPER. ACAB.)II", setor: "ROTOJATO" },
  { id: "1782", name: "ALTOIR FERNANDES DA SILVA", cargo: "OPER. PRODUÇÃO MACHARIA III", setor: "MOLDAGEM COLDBOX" },
  { id: "1829", name: "ELIEL PEREIRA FERNANDES", cargo: "OPER. PRODUÇÃO MACHARIA IV", setor: "DEP. QUIMICOS E INFLAMAVEIS" },
  { id: "1832", name: "CARLOS EDUARDO BAADER", cargo: "OPERADOR PONTE ROLANTE II", setor: "LINHA DE MOLDAGEM E FECHAMENTO" },
  { id: "1898", name: "MAURO SERGIO GONCALVES DA SILVA", cargo: "SOLDADOR III", setor: "SOLDA" },
  { id: "1899", name: "IZALTINO ALBERTO SOARES", cargo: "MECÂNICO MANUTENÇÃO III", setor: "MANUTENÇAO MECANICA" },
  { id: "3426", name: "ANDRE LUIS BAADER", cargo: "ELETRICISTA II", setor: "MANUTENÇAO ELETRICA" },
  { id: "1911", name: "ARLINDO EDUARDO OTEMBRAIT", cargo: "PANELEIRO (OPER. VAZAMENTO)II", setor: "VAZAMENTO" },
  { id: "1949", name: "EDSON KREUCH", cargo: "ELETRICISTA II", setor: "MANUTENÇAO ELETRICA" },
  { id: "1956", name: "ALFREDO FIAMONCINI JUNIOR", cargo: "MODELADOR III", setor: "MODELARIA" },
  { id: "1969", name: "IVAN KRAISCH", cargo: "SUPERVISOR MANUTENÇÃO", setor: "MANUTENÇAO ELETRICA" },
  { id: "1972", name: "ALTAMIR BORGES", cargo: "MODELADOR III", setor: "MODELARIA" },
  { id: "1974", name: "MARIO LOTERIO", cargo: "OPER. PRODUÇÃO MACHARIA II", setor: "MACHARIA" },
  { id: "1982", name: "SIDNEI HABITZREITER", cargo: "OPER PROD MOLD FECH II", setor: "LINHA DE MOLDAGEM E FECHAMENTO" },
  { id: "1985", name: "GILSON DE CASTRO", cargo: "ENCARREGADO MACHARIA", setor: "MACHARIA (I)" },
  { id: "1992", name: "CARLOS DOS SANTOS", cargo: "OPER. PRODUÇÃO MOLDAGEM III", setor: "MOLDAGEM" },
  { id: "2001", name: "ELBERT FERREIRA", cargo: "INSPETOR QUALIDADE III", setor: "CONTROLE DE QUALIDADE" },
  { id: "2007", name: "LUCIANO LUCAS CAMARGO PEDROSO", cargo: "INSPETOR QUALIDADE II", setor: "CONTROLE DE QUALIDADE" },
  { id: "2009", name: "LEONEL GONSALES QUIMENES", cargo: "ENCARREGADO DE FUSAO", setor: "FUSÃO (I)" },
  { id: "2018", name: "JOSE CARLOS PEREIRA", cargo: "OP. REBARBAÇÃO (OP. ACAB.)III", setor: "REBOLO PENDULAR" },
  { id: "2020", name: "SIDINEY DA SILVA PEREIRA", cargo: "OPER PROD MOLD FECH III", setor: "LINHA DE MOLDAGEM E FECHAMENTO" },
  { id: "2026", name: "WILSON ANTONIO DA LUZ", cargo: "AUXILIAR SERV. GERAIS I", setor: "SERVIÇOS GERAIS" },
  { id: "2053", name: "CARLOS SCHNAIDER", cargo: "LIDER DA ELETROMECANICA", setor: "MANUTENÇAO ELETRICA" },
  { id: "2055", name: "FABIO ESPIG", cargo: "OP. REBARBAÇÃO (OP. ACAB.)III", setor: "REBOLO PENDULAR" },
  { id: "2548", name: "ELIAS FRANHER", cargo: "OPERADOR PONTE ROLANTE II", setor: "ACABAMENTO DE PEÇAS" },
  { id: "2721", name: "JOAO PAULO DA COSTA", cargo: "OPER. DE JATO (OPER. ACAB.)II", setor: "JATO GRANALHA" },
  { id: "2725", name: "MARCELO HENQUE GONÇALVES", cargo: "OPERADOR EMPILHADEIRA III", setor: "EXPEDIÇÃO" },
  { id: "2726", name: "ALATHAN JHONATAN GONÇALVES PONTES", cargo: "OPER. DE JATO (OPER. ACAB.)II", setor: "JATO GRANALHA" },
  { id: "2734", name: "MARCELO DE SOUZA CARDOSO", cargo: "OPER. DE FORNO A INDUÇÃO III", setor: "FUSAO" },
  { id: "2749", name: "LUAN SCHIAVON CASTRO", cargo: "LABORATORISTA I", setor: "LABORATORIO" },
  { id: "2752", name: "VALDEMIR PEREIRA DE SOUZA", cargo: "OPER. REBARBAÇÃO (OP. ACAB.) II", setor: "PONTA MONTADA" },
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


// Funções utilitárias para backup e otimização local apenas
export const exportLocalData = () => {
  const inspections = localStorage.getItem('gearcheck-inspections') || '[]';
  const operators = localStorage.getItem('gearcheck-operators') || '[]';
  const equipments = localStorage.getItem('gearcheck-equipments') || '[]';
  
  const exportData = {
    timestamp: new Date().toISOString(),
    inspections: JSON.parse(inspections),
    operators: JSON.parse(operators),
    equipments: JSON.parse(equipments)
  };
  
  const dataStr = JSON.stringify(exportData, null, 2);
  const dataBlob = new Blob([dataStr], { type: 'application/json' });
  const url = URL.createObjectURL(dataBlob);
  
  const link = document.createElement('a');
  link.href = url;
  link.download = `gearcheck-backup-${new Date().toISOString().split('T')[0]}.json`;
  link.click();
  
  URL.revokeObjectURL(url);
};

// Função para otimizar armazenamento local
export const optimizeLocalStorage = () => {
  try {
    const inspections = JSON.parse(localStorage.getItem('gearcheck-inspections') || '[]');
    
    // Manter apenas os últimos 30 dias de inspeções para performance
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    const recentInspections = inspections.filter((inspection: any) => {
      const inspectionDate = new Date(inspection.submissionDate);
      return inspectionDate > thirtyDaysAgo;
    });
    
    // Mover inspeções antigas para arquivo de backup se houver muitas
    if (inspections.length > recentInspections.length) {
      const oldInspections = inspections.filter((inspection: any) => {
        const inspectionDate = new Date(inspection.submissionDate);
        return inspectionDate <= thirtyDaysAgo;
      });
      
      // Salvar inspeções antigas em arquivo separado
      const backupData = {
        timestamp: new Date().toISOString(),
        archivedInspections: oldInspections
      };
      
      localStorage.setItem('gearcheck-archived-inspections', JSON.stringify(backupData));
      localStorage.setItem('gearcheck-inspections', JSON.stringify(recentInspections));
      
      console.log(`Arquivadas ${oldInspections.length} inspeções antigas para otimizar performance`);
    }
    
    return {
      activeInspections: recentInspections.length,
      archivedInspections: inspections.length - recentInspections.length
    };
  } catch (error) {
    console.error('Erro ao otimizar armazenamento:', error);
    return null;
  }
};

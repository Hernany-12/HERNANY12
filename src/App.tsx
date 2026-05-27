import React, { useState } from 'react';
import { 
  Plus, 
  Search, 
  Edit, 
  Trash2, 
  Calendar, 
  Clock, 
  Sliders, 
  Users, 
  FileText, 
  Download, 
  Upload, 
  X, 
  Check, 
  AlertCircle,
  Briefcase,
  ChevronRight,
  Info,
  Layers,
  Sparkles,
  ClipboardCheck,
  FileSpreadsheet,
  DollarSign
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Term, Engineer } from './types';
import { INITIAL_TERMS, INITIAL_ENGINEERS } from './data/defaults';
import Logo from './components/Logo';

export default function App() {
  // --- STATE ---
  // Load initial terms from localStorage or default static INITIAL_TERMS
  const [terms, setTerms] = useState<Term[]>(() => {
    try {
      const stored = localStorage.getItem('bene_terms');
      return stored ? JSON.parse(stored) : INITIAL_TERMS;
    } catch {
      return INITIAL_TERMS;
    }
  });

  // Load engineers from localStorage or default pre-loaded INITIAL_ENGINEERS
  const [engineers, setEngineers] = useState<Engineer[]>(() => {
    try {
      const stored = localStorage.getItem('bene_engineers');
      return stored ? JSON.parse(stored) : INITIAL_ENGINEERS;
    } catch {
      return INITIAL_ENGINEERS;
    }
  });

  // View tabs
  const [activeTab, setActiveTab] = useState<'engineers' | 'terms'>('engineers');
  const [searchQuery, setSearchQuery] = useState('');

  // Modals / Editor forms state
  const [isEngineerModalOpen, setIsEngineerModalOpen] = useState(false);
  const [editingEngineer, setEditingEngineer] = useState<Engineer | null>(null);
  
  // New or Edited Engineer values
  const [engineerName, setEngineerName] = useState('');
  const [engineerValues, setEngineerValues] = useState<Record<string, string>>({});

  // Term Modal states
  const [isTermModalOpen, setIsTermModalOpen] = useState(false);
  const [editingTerm, setEditingTerm] = useState<Term | null>(null);
  const [termLabelInput, setTermLabelInput] = useState('');

  // Alert and confirmations states
  const [alertMessage, setAlertMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  // Helper utility to trigger flash feedback messages
  const showAlert = (text: string, type: 'success' | 'error' = 'success') => {
    setAlertMessage({ text, type });
    setTimeout(() => setAlertMessage(null), 4000);
  };

  // --- LOCALSTORAGE SYNC BACKUP ---
  const saveToLocalStorage = (newTerms: Term[], newEngineers: Engineer[]) => {
    try {
      localStorage.setItem('bene_terms', JSON.stringify(newTerms));
      localStorage.setItem('bene_engineers', JSON.stringify(newEngineers));
    } catch (e) {
      console.error('Error saving to localStorage', e);
    }
  };

  // --- ACTIONS: ENGINEERS ---

  const handleOpenCreateEngineer = () => {
    setEditingEngineer(null);
    setEngineerName('');
    
    // Set default initial values for fields based on terms structures
    const defaultVals: Record<string, string> = {};
    terms.forEach(t => {
      // pre-fill with blank or specific placeholders if desired
      defaultVals[t.id] = '';
    });
    setEngineerValues(defaultVals);
    setIsEngineerModalOpen(true);
  };

  const handleOpenEditEngineer = (eng: Engineer) => {
    setEditingEngineer(eng);
    setEngineerName(eng.name);
    
    // Copy benefits mapping, ensuring every current term is represented
    const dict: Record<string, string> = {};
    terms.forEach(t => {
      dict[t.id] = eng.values[t.id] || '';
    });
    setEngineerValues(dict);
    setIsEngineerModalOpen(true);
  };

  const handleSaveEngineer = (e: React.FormEvent) => {
    e.preventDefault();
    if (!engineerName.trim()) {
      showAlert('Por favor, informe o nome do engenheiro.', 'error');
      return;
    }

    const nowIso = new Date().toISOString();

    if (editingEngineer) {
      // Update existing engineer record
      const updatedList = engineers.map(eng => {
        if (eng.id === editingEngineer.id) {
          return {
            ...eng,
            name: engineerName.trim(),
            values: { ...engineerValues },
            updatedAt: nowIso
          };
        }
        return eng;
      });
      setEngineers(updatedList);
      saveToLocalStorage(terms, updatedList);
      showAlert(`Cadastro do engenheiro ${engineerName} atualizado com sucesso!`);
    } else {
      // Create new engineer record
      const newEng: Engineer = {
        id: 'eng-' + Date.now().toString(36) + Math.random().toString(36).substr(2, 5),
        name: engineerName.trim(),
        values: { ...engineerValues },
        createdAt: nowIso,
        updatedAt: nowIso
      };
      const updatedList = [newEng, ...engineers];
      setEngineers(updatedList);
      saveToLocalStorage(terms, updatedList);
      showAlert(`Engenheiro ${engineerName} cadastrado com sucesso!`);
    }

    setIsEngineerModalOpen(false);
  };

  const handleDeleteEngineer = (id: string, name: string) => {
    if (confirm(`Deseja realmente remover o registro de benefícios do engenheiro "${name}"?`)) {
      const updatedList = engineers.filter(eng => eng.id !== id);
      setEngineers(updatedList);
      saveToLocalStorage(terms, updatedList);
      showAlert(`Registro de ${name} removido com sucesso.`, 'success');
    }
  };

  // --- ACTIONS: DYNAMIC TERMS ---

  const handleOpenCreateTerm = () => {
    setEditingTerm(null);
    setTermLabelInput('');
    setIsTermModalOpen(true);
  };

  const handleOpenEditTerm = (term: Term) => {
    setEditingTerm(term);
    setTermLabelInput(term.name);
    setIsTermModalOpen(true);
  };

  const handleSaveTerm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!termLabelInput.trim()) {
      showAlert('O termo precisa de um nome descritivo.', 'error');
      return;
    }

    const val = termLabelInput.trim();

    if (editingTerm) {
      // Edit Term title
      const updatedTerms = terms.map(t => t.id === editingTerm.id ? { ...t, name: val } : t);
      setTerms(updatedTerms);
      // We keep engineer values intact as the keys (id) don't change!
      saveToLocalStorage(updatedTerms, engineers);
      showAlert(`Termo atualizado para "${val}"`);
    } else {
      // Create a unique clean slug / key for this new term
      const cleanId = 'term_' + Date.now().toString(36) + '_' + Math.random().toString(36).substr(2, 4);
      
      const newTerm: Term = {
        id: cleanId,
        name: val
      };

      const updatedTerms = [...terms, newTerm];
      setTerms(updatedTerms);
      
      // Update existing engineers mapping to have a blank value for this new term
      const updatedEngineers = engineers.map(eng => ({
        ...eng,
        values: {
          ...eng.values,
          [cleanId]: ''
        }
      }));

      setEngineers(updatedEngineers);
      saveToLocalStorage(updatedTerms, updatedEngineers);
      showAlert(`Novo termo "${val}" adicionado ao formulário.`);
    }

    setIsTermModalOpen(false);
  };

  const handleDeleteTerm = (termId: string, label: string) => {
    const warningText = `Atenção: Ao deletar o termo "${label}", as informações cadastradas para todos os engenheiros neste campo específico serão perdidas permanentemente. Deseja prosseguir?`;
    if (confirm(warningText)) {
      // Filter out this term
      const updatedTerms = terms.filter(t => t.id !== termId);
      
      // Remove value key from all engineers record
      const updatedEngineers = engineers.map(eng => {
        const copyValues = { ...eng.values };
        delete copyValues[termId];
        return {
          ...eng,
          values: copyValues
        };
      });

      setTerms(updatedTerms);
      setEngineers(updatedEngineers);
      saveToLocalStorage(updatedTerms, updatedEngineers);
      showAlert(`O termo "${label}" foi deletado do sistema.`);
    }
  };

  // --- ACTIONS: IMPORTS & EXPORTS ---

  const handleExportData = () => {
    try {
      const dataStr = JSON.stringify({ terms, engineers }, null, 2);
      const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
      
      const exportFileDefaultName = `bene_beneficios_engenheiros_${new Date().toISOString().split('T')[0]}.json`;
      
      const linkElement = document.createElement('a');
      linkElement.setAttribute('href', dataUri);
      linkElement.setAttribute('download', exportFileDefaultName);
      linkElement.click();
      showAlert('Backup exportado com sucesso!', 'success');
    } catch {
      showAlert('Falha ao exportar backup.', 'error');
    }
  };

  const handleImportData = (e: React.ChangeEvent<HTMLInputElement>) => {
    const fileReader = new FileReader();
    const files = e.target.files;
    
    if (!files || files.length === 0) return;

    fileReader.onload = (event) => {
      try {
        const resultString = typeof event.target?.result === 'string' ? event.target.result : '';
        if (!resultString) {
          showAlert('Arquivo de backup vazio.', 'error');
          return;
        }
        const parsed = JSON.parse(resultString);
        if (parsed && Array.isArray(parsed.terms) && Array.isArray(parsed.engineers)) {
          setTerms(parsed.terms);
          setEngineers(parsed.engineers);
          saveToLocalStorage(parsed.terms, parsed.engineers);
          showAlert('Dados importados e configurados com sucesso!');
        } else {
          showAlert('Formato de arquivo inválido. Verifique o JSON.', 'error');
        }
      } catch (err) {
        showAlert('Não foi possível ler o arquivo. Certifique-se de usar um JSON válido.', 'error');
      }
    };
    
    fileReader.readAsText(files[0]);
    // Clear input
    e.target.value = '';
  };

  // --- DATA FORMATTING AND FILTERING ---

  const formatDateTime = (isoString?: string) => {
    if (!isoString) return 'Não registrada';
    try {
      const d = new Date(isoString);
      if (isNaN(d.getTime())) return 'Inválida';
      
      // Zero padding helper
      const pad = (n: number) => n.toString().padStart(2, '0');
      
      const day = pad(d.getDate());
      const month = pad(d.getMonth() + 1);
      const year = d.getFullYear();
      const hours = pad(d.getHours());
      const minutes = pad(d.getMinutes());

      return `${day}/${month}/${year} às ${hours}:${minutes}`;
    } catch {
      return 'Erro na formatação';
    }
  };

  // Simple clean string matching helper
  const matchesSearch = (text: string, query: string) => {
    return text.toLowerCase().includes(query.toLowerCase());
  };

  // Filter engineers based on search query
  const filteredEngineers = engineers.filter(eng => {
    if (!searchQuery.trim()) return true;
    
    // Matches engineer name
    if (matchesSearch(eng.name, searchQuery)) return true;

    // Matches any parameter value registered under the engineer
    return (Object.values(eng.values) as string[]).some(v => matchesSearch(v, searchQuery));
  });

  // Calculate quick dynamic statistics for the top banner
  const statCount = engineers.length;

  // Helper to safely parse localized currency/numbers in Portuguese context
  const parseCurrencyValue = (valStr: any): number => {
    if (!valStr || typeof valStr !== 'string') return 0;
    const cleaned = valStr.toLowerCase().trim();
    if (cleaned === 'não' || cleaned === 'nao' || cleaned === 'n' || cleaned === '-' || cleaned === 'sem') {
      return 0;
    }
    
    // Find the first token that contains a digit
    const tokens = valStr.split(/\s+/);
    const numToken = tokens.find(t => /\d/.test(t));
    if (!numToken) {
      const fallbackMatch = valStr.match(/\d[\d.,]*/);
      if (fallbackMatch) {
         return parseRawNumberString(fallbackMatch[0]);
      }
      return 0;
    }
    return parseRawNumberString(numToken);
  };

  const parseRawNumberString = (token: string): number => {
    let clean = token.replace(/[^\d.,]/g, '');
    if (!clean) return 0;

    const hasComma = clean.includes(',');
    const hasDot = clean.includes('.');

    if (hasComma && hasDot) {
      // e.g. 12.500,00 -> remove dot, replace comma with dot
      clean = clean.replace(/\./g, '').replace(/,/g, '.');
    } else if (hasComma) {
      // e.g. 2500,00 -> replace comma with dot
      clean = clean.replace(/,/g, '.');
    } else if (hasDot) {
      // check if it's thousands separator or decimal dot
      const parts = clean.split('.');
      if (parts[parts.length - 1].length === 3) {
        clean = clean.replace(/\./g, '');
      }
    }
    const parsed = parseFloat(clean);
    return isNaN(parsed) ? 0 : parsed;
  };

  // Sum monthly value, bonus, and food cost for all engineers if written in numbers
  const totalCustoMensal = engineers.reduce((sum, eng) => {
    const valor = parseCurrencyValue(eng.values['valor_mensal']);
    const bonif = parseCurrencyValue(eng.values['bonificacao']);
    const ajuda = parseCurrencyValue(eng.values['ajuda_custo_alimentacao']);
    return sum + valor + bonif + ajuda;
  }, 0);

  const formatBRL = (value: number) => {
    return value.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
  };

  // Find the date of the latest update across all engineers
  const latestUpdateIso = engineers.reduce((latest, eng) => {
    const curDate = eng.updatedAt || eng.createdAt;
    if (!curDate) return latest;
    if (!latest) return curDate;
    return new Date(curDate) > new Date(latest) ? curDate : latest;
  }, '');

  // Format date cleanly as DD/MM/YYYY
  const formatDateOnly = (isoString?: string) => {
    if (!isoString) return 'Sem dados';
    try {
      const d = new Date(isoString);
      if (isNaN(d.getTime())) return 'Inválida';
      const pad = (n: number) => n.toString().padStart(2, '0');
      const day = pad(d.getDate());
      const month = pad(d.getMonth() + 1);
      const year = d.getFullYear();
      return `${day}/${month}/${year}`;
    } catch {
      return 'N/A';
    }
  };

  const statTermsCount = terms.length;

  return (
    <div className="min-h-screen bg-[#fafbfc] text-slate-800 selection:bg-[#0b7a44] selection:text-white flex flex-col">
      
      {/* GLOBAL BANNER / FEEDBOCK TOAST */}
      <AnimatePresence>
        {alertMessage && (
          <motion.div 
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-6 left-1/2 -translate-x-1/2 z-50 max-w-md w-full px-4"
          >
            <div className={`p-4 rounded-xl shadow-lg border flex items-center gap-3 ${
              alertMessage.type === 'success' 
                ? 'bg-emerald-50 border-emerald-200 text-emerald-800' 
                : 'bg-rose-50 border-rose-200 text-rose-800'
            }`}>
              {alertMessage.type === 'success' ? (
                <Check className="w-5 h-5 col text-emerald-600 shrink-0" />
              ) : (
                <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />
              )}
              <span className="font-sans text-sm font-medium">{alertMessage.text}</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* STYLISH APP COHESIVE HEADER - WITH LIGHT GREEN BAND ("FAIXA VERDE CLARINHO") */}
      <div className="w-full h-1 bg-[#0b7a44]"></div>
      <header className="bg-[#eef8f3] border-b border-[#ccebd8] sticky top-0 z-30 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between py-4 gap-4">
            
            {/* BRANDING SECTION */}
            <div className="flex items-center gap-4">
              {/* Custom High Density Render Logo matching the uploaded image */}
              <Logo variant="inline" />
              <div className="h-8 w-[1px] bg-[#c1e5cf] hidden sm:block"></div>
              <div>
                <h1 
                  style={{ fontFamily: 'Arial, sans-serif', color: '#282323' }}
                  className="font-extrabold text-xl tracking-tight uppercase"
                >
                  Benefício dos Engenheiros
                </h1>
                <p className="text-xs text-emerald-800 font-sans font-medium">
                  Gestão estratégica de benefícios &middot; BENE Engenharia
                </p>
              </div>
            </div>

            {/* DASHBOARD ACTIONS */}
            <div className="flex flex-wrap items-center gap-3">
              {/* Backups Export/Import */}
              <button 
                onClick={handleExportData}
                title="Exportar backup dos dados como JSON" 
                className="p-2 bg-white hover:bg-slate-50 text-slate-600 border border-[#b2e0c2] rounded-lg text-sm font-medium flex items-center gap-2 transition cursor-pointer"
              >
                <Download className="w-4 h-4 text-[#0b7a44]" />
                <span className="hidden sm:inline">Exportar Backup</span>
              </button>

              <label 
                title="Importar dados de um arquivo JSON salvo anteriormente" 
                className="p-2 bg-white hover:bg-slate-50 text-slate-600 border border-[#b2e0c2] rounded-lg text-sm font-medium flex items-center gap-2 cursor-pointer transition"
              >
                <Upload className="w-4 h-4 text-[#0b7a44]" />
                <span className="hidden sm:inline">Importar Backup</span>
                <input 
                  type="file" 
                  accept=".json" 
                  onChange={handleImportData} 
                  className="hidden" 
                />
              </label>

              {/* Dynamic Add Trigger */}
              {activeTab === 'engineers' ? (
                <button
                  onClick={handleOpenCreateEngineer}
                  className="px-4 py-2 bg-[#0b7a44] hover:bg-[#085e33] active:bg-[#054324] text-white rounded-lg text-sm font-semibold flex items-center gap-2 shadow-xs transition cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  Cadastrar Engenheiro
                </button>
              ) : (
                <button
                  onClick={handleOpenCreateTerm}
                  className="px-4 py-2 bg-[#0b7a44] hover:bg-[#085e33] active:bg-[#054324] text-white rounded-lg text-sm font-semibold flex items-center gap-2 shadow-xs transition cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  Adicionar Termo
                </button>
              )}
            </div>

          </div>
        </div>
      </header>

      {/* MAIN APP SHELL */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* STATS BENTO ROW (Solid green design with white and emerald high-contrast content) */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          
          <div className="bg-[#0b7a44] p-5 rounded-2xl border border-[#085e33] shadow-xs flex items-center gap-4 text-white">
            <div className="p-3 rounded-xl bg-white/15 text-white">
              <Users className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs font-semibold text-emerald-100 uppercase tracking-wider">Engenheiros</p>
              <h3 className="text-2xl font-bold text-white font-display mt-0.5">{statCount}</h3>
            </div>
          </div>

          <div className="bg-[#0b7a44] p-5 rounded-2xl border border-[#085e33] shadow-xs flex items-center gap-4 text-white">
            <div className="p-3 rounded-xl bg-white/15 text-white">
              <DollarSign className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs font-semibold text-emerald-100 uppercase tracking-wider">Custo Mensal Total</p>
              <h3 className="text-xl lg:text-2xl font-bold text-white font-display mt-0.5">{formatBRL(totalCustoMensal)}</h3>
            </div>
          </div>

          <div className="bg-[#0b7a44] p-5 rounded-2xl border border-[#085e33] shadow-xs flex items-center gap-4 text-white">
            <div className="p-3 rounded-xl bg-white/15 text-white">
              <Clock className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs font-semibold text-emerald-100 uppercase tracking-wider">Última Atualização</p>
              <h3 className="text-xl lg:text-2xl font-bold text-white font-display mt-0.5">{formatDateOnly(latestUpdateIso)}</h3>
            </div>
          </div>

          <div className="bg-[#0b7a44] p-5 rounded-2xl border border-[#085e33] shadow-xs flex items-center gap-4 text-white">
            <div className="p-3 rounded-xl bg-white/15 text-white">
              <Layers className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs font-semibold text-emerald-100 uppercase tracking-wider">Termos / Atributos</p>
              <h3 className="text-2xl font-bold text-white font-display mt-0.5">{statTermsCount}</h3>
            </div>
          </div>

        </div>

        {/* CONTROLS BAR (Search & tab toggle) */}
        <div className="bg-white rounded-2xl p-4 mb-8 border border-slate-100 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
          
          {/* TAB TRIGGERS */}
          <div className="flex gap-2 p-1 bg-slate-50 border border-slate-100 rounded-xl inline-flex self-start">
            <button
              onClick={() => setActiveTab('engineers')}
              className={`px-4 py-2 rounded-lg text-sm font-semibold flex items-center gap-2 transition cursor-pointer ${
                activeTab === 'engineers'
                  ? 'bg-[#acd6ce] text-[#000000] shadow-xs border border-[#8cbab1]'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-[#acd6ce]/20'
              }`}
            >
              <Users className="w-4 h-4" />
              Engenheiros Cadastrados
            </button>
            <button
              onClick={() => setActiveTab('terms')}
              className={`px-4 py-2 rounded-lg text-sm font-semibold flex items-center gap-2 transition cursor-pointer ${
                activeTab === 'terms'
                  ? 'bg-[#acd6ce] text-[#000000] shadow-xs border border-[#8cbab1]'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-[#acd6ce]/20'
              }`}
            >
              <Sliders className="w-4 h-4" />
              Aba de Termos (Campos)
            </button>
          </div>

          {/* QUICK FILTER SEARCH INPUT */}
          {activeTab === 'engineers' && (
            <div className="relative flex-1 max-w-md w-full">
              <Search className="w-5 h-5 text-slate-700 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Busque por engenheiro ou campo de benefício (ex: 'sim', 'Ricardo')..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-[#acd6ce] text-slate-900 placeholder-slate-700 border border-[#8cbab1] focus:ring-1 focus:ring-[#0b7a44] rounded-xl outline-none text-sm transition font-medium"
              />
              {searchQuery && (
                <button 
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          )}

        </div>

        {/* --- VIEW MAIN CONTENT PANEL --- */}
        <AnimatePresence mode="wait">
          
          {/* TAB 1: ENGINEERS BENEFIT RECORDS */}
          {activeTab === 'engineers' && (
            <motion.div
              key="engineers-view"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.15 }}
            >
              {filteredEngineers.length === 0 ? (
                <div className="bg-white rounded-2xl border border-dashed border-slate-200 p-12 text-center max-w-xl mx-auto">
                  <div className="w-16 h-16 bg-slate-50 text-slate-400 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Search className="w-8 h-8" />
                  </div>
                  <h4 className="text-lg font-bold text-slate-900 font-display">Nenum engenheiro encontrado</h4>
                  <p className="text-slate-500 text-sm mt-1">
                    {searchQuery 
                      ? 'Não há resultados correspondentes à sua busca. Tente buscar por outros termos!'
                      : 'Registre o primeiro engenheiro de benefícios do sistema usando o botão de cadastro no canto superior.'}
                  </p>
                  {searchQuery && (
                    <button 
                      onClick={() => setSearchQuery('')}
                      className="mt-4 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-lg text-xs font-semibold transition"
                    >
                      Limpar filtro
                    </button>
                  )}
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                  {filteredEngineers.map((engineer) => (
                    <motion.div
                      key={engineer.id}
                      layout
                      className="bg-white border-t-4 border-t-[#0b7a44] border-l border-r border-b border-slate-100 rounded-2xl p-6 shadow-xs flex flex-col hover:border-slate-200 hover:shadow-md transition-all duration-200"
                    >
                      {/* CARD HEADER - NAME & BUTTONS */}
                      <div className="flex justify-between items-start mb-4 pb-3 border-b border-slate-100">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-[#0b7a44]/10 text-[#0b7a44] flex items-center justify-center font-display font-bold">
                            {engineer.name.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <h4 className="font-display font-bold text-lg text-slate-900 leading-tight">
                              Engenheiro: {engineer.name}
                            </h4>
                            <span className="inline-block mt-1 text-[10px] font-mono text-[#0b7a44] font-semibold bg-[#f4faf6] px-2 py-0.5 rounded-md uppercase">
                              ID: {engineer.id.slice(4, 9)}
                            </span>
                          </div>
                        </div>

                        {/* ACTIONS DROPDOWN STYLE */}
                        <div className="flex items-center gap-1.5">
                          <button
                            onClick={() => handleOpenEditEngineer(engineer)}
                            title="Editar Benefícios desse Engenheiro"
                            className="p-1.5 hover:bg-slate-50 border border-transparent hover:border-slate-200 rounded-lg text-slate-600 transition"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteEngineer(engineer.id, engineer.name)}
                            title="Deletar este Engenheiro"
                            className="p-1.5 hover:bg-rose-50 border border-transparent hover:border-rose-100 rounded-lg text-rose-600 transition"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>

                      {/* CARD BODY - ATTRIBUTE LISTING */}
                      <div className="grid grid-cols-1 gap-2.5 flex-1 mb-5">
                        {terms.map((term) => {
                          const value = engineer.values[term.id];
                          const hasValue = value !== undefined && value !== null && value.trim() !== '';
                          
                          return (
                            <div 
                              key={term.id} 
                              className="flex items-center justify-between text-sm py-1.5 px-2 bg-slate-50/50 rounded-lg border border-slate-100/50"
                            >
                              <span className="text-slate-500 font-medium text-xs max-w-[45%] truncate" title={term.name}>
                                {term.name}:
                              </span>
                              
                              <span className={`text-right font-semibold font-sans text-xs ${
                                hasValue 
                                  ? 'text-slate-800' 
                                  : 'text-slate-400 italic'
                              }`}>
                                {hasValue ? value : '—'}
                              </span>
                            </div>
                          );
                        })}
                      </div>

                      {/* CARD FOOTER - HISTORIC DATES */}
                      <div className="border-t border-slate-100 pt-3 mt-auto space-y-1 text-[11px] font-mono text-slate-500 bg-slate-50/70 p-3 rounded-xl">
                        <div className="flex items-center gap-1.5">
                          <Calendar className="w-3 h-3 text-[#0b7a44] shrink-0" />
                          <span><b>Cadastro:</b> {formatDateTime(engineer.createdAt)}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <Clock className="w-3 h-3 text-emerald-600 shrink-0" />
                          <span><b>Última Atualização:</b> {formatDateTime(engineer.updatedAt)}</span>
                        </div>
                      </div>

                    </motion.div>
                  ))}
                </div>
              )}
            </motion.div>
          )}

          {/* TAB 2: TERMS AND FIELDS MANAGEMENT */}
          {activeTab === 'terms' && (
            <motion.div
              key="terms-view"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.15 }}
              className="max-w-4xl mx-auto"
            >
              <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-xs">
                
                <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-100">
                  <div>
                    <h3 className="font-display font-extrabold text-lg text-slate-900 uppercase">
                      Configuração Geral de Termos
                    </h3>
                    <p className="text-sm text-slate-500 mt-1">
                      Adicione novos termos ou altere o rótulo de campos que compõem o formulário de benefícios dos engenheiros.
                    </p>
                  </div>
                  
                  <button
                    onClick={handleOpenCreateTerm}
                    className="px-4 py-2 bg-[#0b7a44] hover:bg-[#085e33] text-white rounded-lg text-xs font-semibold flex items-center gap-2 transition shadow-xs"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    Novo Termo
                  </button>
                </div>

                {/* GRAPHIC INFO STRIP */}
                <div className="bg-emerald-50/50 border border-emerald-100 rounded-xl p-4 flex gap-3 text-slate-700 text-xs mb-6">
                  <Info className="w-5 h-5 text-[#0b7a44] shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold text-slate-900 block mb-0.5">Como funciona a customização de termos?</span>
                    Ao adicionar um novo termo (exemplo: "Auxílio Notebook"), uma nova opção de digitação aparecerá instantaneamente nos registros de todos os engenheiros. Se você alterar o nome de um termo, os dados salvos anteriormente continuarão seguros.
                  </div>
                </div>

                {/* TERMS DATA DICTIONARY LISTING */}
                <div className="divide-y divide-slate-100">
                  {terms.map((term, index) => (
                    <div 
                      key={term.id} 
                      className="py-4 flex items-center justify-between hover:bg-slate-50/50 px-3 rounded-xl transition"
                    >
                      <div className="flex items-center gap-4">
                        <span className="font-mono text-xs text-slate-400 font-bold bg-slate-100 px-2.5 py-1 rounded-md">
                          #{index + 1}
                        </span>
                        <div>
                          <h4 className="font-semibold text-slate-900 text-sm">{term.name}</h4>
                          <span className="text-[10px] text-slate-400 font-mono">ID interno: {term.id}</span>
                        </div>
                      </div>

                      {/* ACTIONS FOR TERM */}
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleOpenEditTerm(term)}
                          className="px-3 py-1.5 text-xs text-slate-700 bg-white border border-slate-200 rounded-lg font-medium hover:bg-slate-50 flex items-center gap-1.5 transition"
                        >
                          <Edit className="w-3 h-3 text-[#0b7a44]" />
                          Editar Nome
                        </button>
                        
                        {/* Protect core fields index mapping or allow total control */}
                        <button
                          onClick={() => handleDeleteTerm(term.id, term.name)}
                          className="p-1.5 text-rose-600 bg-white border border-transparent hover:border-rose-100 hover:bg-rose-50 rounded-lg transition"
                          title="Remover termo de todos os engenheiros"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                  
                  {terms.length === 0 && (
                    <div className="py-12 text-center text-slate-400">
                      Você não possui termos ativos. Crie termos para associar benefícios técnicos aos engenheiros.
                    </div>
                  )}
                </div>

              </div>
            </motion.div>
          )}

        </AnimatePresence>

      </main>

      {/* --- SIDEBAR MODAL 1: ADD / EDIT ENGINEER BENEFIT RECORD --- */}
      <AnimatePresence>
        {isEngineerModalOpen && (
          <div className="fixed inset-0 z-50 flex justify-end">
            
            {/* BACKDROP */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsEngineerModalOpen(false)}
              className="absolute inset-0 bg-black/40 backdrop-blur-xs"
            />

            {/* PANEL */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 220 }}
              className="relative w-full max-w-lg bg-white h-full shadow-2xl flex flex-col z-10"
            >
              
              {/* HEADER */}
              <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-[#0b7a44] text-white flex items-center justify-center">
                    <Briefcase className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="font-display font-extrabold text-md uppercase text-slate-900 tracking-tight">
                      {editingEngineer ? 'Editar Benefícios' : 'Cadastrar Engenheiro'}
                    </h3>
                    <p className="text-xs text-slate-500">
                      Preencha os dados e termos do profissional
                    </p>
                  </div>
                </div>
                <button 
                  onClick={() => setIsEngineerModalOpen(false)}
                  className="p-1.5 hover:bg-slate-200 rounded-lg text-slate-400 hover:text-slate-800 transition"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* BODY FORM */}
              <form onSubmit={handleSaveEngineer} className="flex-1 overflow-y-auto p-6 space-y-6">
                
                {/* CORE ATTRIBUTES */}
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
                    Nome do Engenheiro *
                  </label>
                  <input
                    type="text"
                    required
                    maxLength={100}
                    placeholder="Ex: Ricardo Marcolino"
                    value={engineerName}
                    onChange={(e) => setEngineerName(e.target.value)}
                    className="w-full px-4 py-2.5 border border-slate-200 focus:border-[#0b7a44] focus:ring-1 focus:ring-[#0b7a44] rounded-xl outline-none text-sm transition font-semibold"
                  />
                </div>

                <div className="border-t border-slate-100 pt-5">
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4 flex items-center gap-2">
                    <Sliders className="w-3.5 h-3.5 text-[#0b7a44]" />
                    Termos de Benefício Atuais
                  </h4>

                  {/* DYNAMIC TERM VALUE INPUTS */}
                  <div className="space-y-4">
                    {terms.map((term) => (
                      <div key={term.id} className="space-y-1 p-3 bg-slate-50 rounded-xl border border-slate-100/70">
                        <label className="text-xs font-semibold text-slate-700 flex justify-between items-center">
                          <span>{term.name}</span>
                        </label>
                        <input
                          type="text"
                          placeholder="Digite o valor (ex: sim, não, R$ 2.500,00)"
                          value={engineerValues[term.id] || ''}
                          onChange={(e) => {
                            setEngineerValues({
                              ...engineerValues,
                              [term.id]: e.target.value
                            });
                          }}
                          className="w-full px-3 py-2 bg-white border border-slate-200 focus:border-[#0b7a44] focus:ring-1 focus:ring-[#0b7a44] rounded-lg outline-none text-xs transition"
                        />
                      </div>
                    ))}

                    {terms.length === 0 && (
                      <div className="text-center py-4 bg-amber-50 text-amber-700 text-xs rounded-xl border border-dashed border-amber-200">
                        Não existem termos cadastrados para preencher. Acesse a Aba de Termos para criar campos personalizados.
                      </div>
                    )}
                  </div>
                </div>

              </form>

              {/* FOOTER ACTIONS */}
              <div className="p-6 border-t border-slate-100 bg-slate-50 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsEngineerModalOpen(false)}
                  className="px-4 py-2 text-slate-500 hover:text-slate-800 text-sm font-medium transition"
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  onClick={handleSaveEngineer}
                  className="px-6 py-2 bg-[#0b7a44] hover:bg-[#085e33] active:bg-[#054324] text-white text-sm font-semibold rounded-lg shadow-sm transition"
                >
                  {editingEngineer ? 'Salvar Alterações' : 'Confirmar Cadastro'}
                </button>
              </div>

            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* --- SIDEBAR MODAL 2: ADD / EDIT TERM --- */}
      <AnimatePresence>
        {isTermModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            
            {/* BACKDROP */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsTermModalOpen(false)}
              className="absolute inset-0 bg-black/40 backdrop-blur-xs"
            />

            {/* PANEL */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative w-full max-w-md bg-white rounded-2xl shadow-xl overflow-hidden z-10 border border-slate-100"
            >
              
              {/* HEADER */}
              <div className="p-5 border-b border-slate-100 flex items-center justify-between">
                <h3 className="font-display font-extrabold text-[#0b7a44] text-sm uppercase tracking-wide">
                  {editingTerm ? 'Renomear Termo' : 'Novo Termo de Atributo'}
                </h3>
                <button 
                  onClick={() => setIsTermModalOpen(false)}
                  className="p-1 hover:bg-slate-100 rounded text-slate-400 hover:text-slate-800 transition"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* BODY FORM */}
              <form onSubmit={handleSaveTerm} className="p-5 space-y-4">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-600">
                    Nome descritivo do termo (rótulo do campo)
                  </label>
                  <input
                    type="text"
                    required
                    maxLength={80}
                    placeholder="Ex: Celular Corporativo, Auxílio Medicamento"
                    value={termLabelInput}
                    onChange={(e) => setTermLabelInput(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 focus:border-[#0b7a44] focus:ring-1 focus:ring-[#0b7a44] rounded-xl outline-none text-sm transition"
                  />
                  <p className="text-[10px] text-slate-400 leading-tight">
                    Escolha um nome claro e objetivo. Evite termos excessivamente longos para manter o layout limpo.
                  </p>
                </div>

                {/* MODAL FOOTER */}
                <div className="pt-3 border-t border-slate-100 flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setIsTermModalOpen(false)}
                    className="px-3 py-1.5 text-slate-500 hover:text-slate-800 text-xs font-medium transition"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-1.5 bg-[#0b7a44] hover:bg-[#085e33] active:bg-[#054324] text-white text-xs font-semibold rounded-lg transition"
                  >
                    {editingTerm ? 'Salvar Rótulo' : 'Criar Campo'}
                  </button>
                </div>
              </form>

            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* FOOTER */}
      <footer className="bg-white border-t border-slate-100 py-6 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-slate-400 font-sans">
          
          <div className="flex items-center gap-2">
            <span className="font-semibold text-slate-600">BENE Engenharia</span>
            <span>&middot;</span>
            <span>Benefício dos Engenheiros &copy; {new Date().getFullYear()}</span>
          </div>

          <div className="flex items-center gap-4">
            <span>Desenvolvido com Alto Desempenho e Tecnologia Vetorial</span>
          </div>

        </div>
      </footer>

    </div>
  );
}

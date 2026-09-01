import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  Award,
  HeartHandshake,
  Users,
  Building2,
  ChevronRight,
  ShieldCheck,
  Cross,
  Edit3,
  Save,
  X,
  Plus,
  Trash2,
  CheckCircle2,
  Loader2,
  Calculator,
  UserCheck,
} from 'lucide-react';
import { api } from '../lib/api';
import type { HomeContent, HistoryBlock, Associate } from '../types';

interface HomePageProps {
  onNavigateToBenefits: () => void;
  onNavigateToLogin: () => void;
  isAuthenticated: boolean;
}

const DEFAULT_CONTENT: HomeContent = {
  id: 'default-home-content',
  heroBadge: 'Associação dos Funcionários do HRSJ',
  heroTitle: 'União, Valorização e Benefícios para os Servidores do HRSJ',
  heroSubtitle:
    'Desde 1995, atuamos na integração, apoio social e busca contínua de vantagens exclusivas para os profissionais de saúde e colaboradores do Hospital Regional São José.',
  foundationYear: '1995',
  foundationDate: '15 de Maio',
  yearsOfAction: '+31 Anos',
  totalAssociates: '+0',
  totalPartners: '+0 Conveniadas',
  historyBlocks: [
    {
      id: 'block-1',
      title: 'Nossa História & Fundação',
      content1:
        'A Associação dos Funcionários do Hospital Regional São José foi fundada em 15 de maio de 1995 a partir da iniciativa de uma comissão de servidores que buscava fortalecer a união da categoria e criar uma rede de apoio mútuo entre os profissionais da saúde.',
      content2:
        'Ao longo de três décadas de história, a associação expandiu sua atuação, tornando-se referência na promoção de bem-estar, celebrações comunitárias e convênios na Grande Florianópolis.',
    },
    {
      id: 'block-2',
      title: 'Por que & Por quem fomos criados?',
      content1:
        'Criada pelos próprios servidores do HRSJ (médicos, enfermeiros, técnicos, farmacêuticos, administrativos e equipe de apoio), a associação tem como missão cuidar de quem dedica a vida ao cuidado dos outros.',
      content2:
        'Nosso objetivo é proporcionar benefícios financeiros reais (descontos no comércio, saúde e educação), carteirinha de identificação oficial de associado e eventos sociais de integração.',
    },
  ],
  boardBadge: '• Diretoria Eleita Ativa',
  boardTitle: 'Gestão Atual (Biênio 2025 / 2027)',
  boardSubtitle: 'Liderança e Transparência',
  boardMembers: [
    { role: 'Presidente', fallbackName: 'Dr. Roberto Carlos Medeiros', fallbackSubtext: 'Corpo Médico HRSJ' },
    { role: 'Vice-Presidente', fallbackName: 'Dra. Juliana Barbosa Santos', fallbackSubtext: 'Enfermagem Geral' },
    { role: 'Tesoureiro Geral', fallbackName: 'Marcelo Oliveira Silva', fallbackSubtext: 'Setor Administrativo' },
    { role: 'Secretária Geral', fallbackName: 'Ana Paula da Silva', fallbackSubtext: 'Recursos Humanos' },
  ],
  updatedAt: new Date().toISOString(),
};

export const HomePage: React.FC<HomePageProps> = ({
  onNavigateToBenefits,
  onNavigateToLogin,
  isAuthenticated,
}) => {
  const [content, setContent] = useState<HomeContent>(DEFAULT_CONTENT);
  const [associates, setAssociates] = useState<Associate[]>([]);
  const [loading, setLoading] = useState(true);

  // Edit Modal State
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [formData, setFormData] = useState<HomeContent>(DEFAULT_CONTENT);
  const [saving, setSaving] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'hero_kpis' | 'history' | 'board'>('hero_kpis');

  const fetchContent = async () => {
    try {
      setLoading(true);
      const data = await api.getHomeContent();
      if (data) {
        setContent(data);
        setFormData(data);
      }
    } catch (err) {
      console.error('Erro ao carregar conteúdo da home:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchAssociatesList = async () => {
    try {
      const res = await api.getAssociates({ active: true, limit: 100 });
      setAssociates(res.data);
    } catch (err) {
      console.error('Erro ao carregar lista de associados:', err);
    }
  };

  useEffect(() => {
    fetchContent();
  }, []);

  const handleOpenEditModal = () => {
    setFormData(content);
    setSuccessMessage(null);
    fetchAssociatesList();
    setIsEditModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSaving(true);

      // Clean up formData for payload
      const payload: Partial<HomeContent> = {
        heroBadge: formData.heroBadge,
        heroTitle: formData.heroTitle,
        heroSubtitle: formData.heroSubtitle,
        foundationYear: formData.foundationYear,
        foundationDate: formData.foundationDate,
        historyBlocks: formData.historyBlocks,
        boardBadge: formData.boardBadge,
        boardTitle: formData.boardTitle,
        boardSubtitle: formData.boardSubtitle,
        boardMembers: formData.boardMembers.map((m) => ({
          role: m.role,
          associateId: m.associateId || undefined,
          fallbackName: m.fallbackName || m.name,
          fallbackSubtext: m.fallbackSubtext || m.subtext,
        })),
      };

      const updated = await api.updateHomeContent(payload);
      setContent(updated);
      setSuccessMessage('Conteúdo da página inicial atualizado com sucesso!');
      setTimeout(() => {
        setIsEditModalOpen(false);
        setSuccessMessage(null);
      }, 1200);
    } catch (err: any) {
      alert(err.message || 'Erro ao salvar alterações');
    } finally {
      setSaving(false);
    }
  };

  // --- History Blocks Handlers ---
  const handleAddHistoryBlock = () => {
    const newId = `block-${Date.now()}`;
    setFormData({
      ...formData,
      historyBlocks: [
        ...formData.historyBlocks,
        {
          id: newId,
          title: 'Novo Título de Bloco',
          content1: 'Escreva aqui o conteúdo do primeiro parágrafo.',
          content2: '',
        },
      ],
    });
  };

  const handleRemoveHistoryBlock = (id: string) => {
    setFormData({
      ...formData,
      historyBlocks: formData.historyBlocks.filter((b) => b.id !== id),
    });
  };

  const handleHistoryBlockChange = (
    id: string,
    field: keyof HistoryBlock,
    value: string
  ) => {
    setFormData({
      ...formData,
      historyBlocks: formData.historyBlocks.map((b) =>
        b.id === id ? { ...b, [field]: value } : b
      ),
    });
  };

  // --- Board Member Handlers ---
  const handleAddBoardMember = () => {
    setFormData({
      ...formData,
      boardMembers: [
        ...formData.boardMembers,
        { role: 'Novo Cargo', associateId: null, fallbackName: '', fallbackSubtext: '' },
      ],
    });
  };

  const handleRemoveBoardMember = (index: number) => {
    setFormData({
      ...formData,
      boardMembers: formData.boardMembers.filter((_, i) => i !== index),
    });
  };

  const handleBoardMemberRoleChange = (index: number, role: string) => {
    const updated = [...formData.boardMembers];
    updated[index] = { ...updated[index], role };
    setFormData({ ...formData, boardMembers: updated });
  };

  const handleBoardMemberAssociateChange = (index: number, associateId: string) => {
    const updated = [...formData.boardMembers];
    const selectedAssoc = associates.find((a) => a.id === associateId);

    if (selectedAssoc) {
      updated[index] = {
        ...updated[index],
        associateId: selectedAssoc.id,
        name: selectedAssoc.name,
        subtext: selectedAssoc.address || 'Servidor Associado HRSJ',
        associate: selectedAssoc,
      };
    } else {
      updated[index] = {
        ...updated[index],
        associateId: null,
        name: updated[index].fallbackName || 'A Definir',
        subtext: updated[index].fallbackSubtext || 'Diretoria HRSJ',
        associate: null,
      };
    }
    setFormData({ ...formData, boardMembers: updated });
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] space-y-3">
        <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
        <p className="text-sm font-medium text-slate-500">Carregando conteúdo da associação...</p>
      </div>
    );
  }

  return (
    <div className="space-y-10 pb-8 animate-in fade-in duration-300 relative">
      {/* Bar for Authenticated Administrators */}
      {isAuthenticated && (
        <div className="bg-amber-500/10 border border-amber-500/30 dark:bg-amber-950/40 dark:border-amber-700/50 p-4 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-3 shadow-xs">
          <div className="flex items-center space-x-2 text-amber-800 dark:text-amber-300 text-xs sm:text-sm font-medium">
            <ShieldCheck className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0" />
            <span>
              <strong>Modo Gestor Ativo:</strong> Os dados de associados e parceiros são sincronizados automaticamente.
            </span>
          </div>

          <button
            onClick={handleOpenEditModal}
            className="inline-flex items-center space-x-2 px-4 py-2 text-xs font-bold text-white bg-amber-600 hover:bg-amber-700 active:scale-98 rounded-xl shadow-md transition cursor-pointer shrink-0"
          >
            <Edit3 className="w-4 h-4" />
            <span>Editar Conteúdo da Página</span>
          </button>
        </div>
      )}

      {/* Hero Header Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-linear-to-r from-[#0e1a2e] via-[#1e2e4a] to-[#16243d] p-8 sm:p-12 text-white shadow-2xl border border-slate-700/60">
        <div className="relative z-10 max-w-3xl space-y-4">
          <div className="inline-flex items-center space-x-2 bg-blue-500/20 text-blue-300 border border-blue-400/30 px-3.5 py-1.5 rounded-full text-xs font-bold">
            <Cross className="w-3.5 h-3.5 stroke-[2.5]" />
            <span>{content.heroBadge}</span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white leading-tight">
            {content.heroTitle}
          </h1>

          <p className="text-sm sm:text-base text-slate-300 font-medium leading-relaxed max-w-2xl">
            {content.heroSubtitle}
          </p>

          <div className="pt-3 flex flex-wrap items-center gap-3">
            <button
              onClick={onNavigateToBenefits}
              className="inline-flex items-center space-x-2 px-5 py-3 text-xs font-extrabold text-white bg-[#3b82f6] hover:bg-blue-600 rounded-xl shadow-lg shadow-blue-500/25 transition duration-200 cursor-pointer"
            >
              <Sparkles className="w-4 h-4" />
              <span>Ver Estabelecimentos Credenciados</span>
              <ChevronRight className="w-4 h-4" />
            </button>

            {!isAuthenticated && (
              <button
                onClick={onNavigateToLogin}
                className="inline-flex items-center space-x-2 px-5 py-3 text-xs font-extrabold text-slate-200 bg-white/10 hover:bg-white/20 rounded-xl shadow-md transition duration-200 cursor-pointer border border-white/20"
              >
                <ShieldCheck className="w-4 h-4 text-sky-300" />
                <span>Área Restrita (Login do Gestor)</span>
              </button>
            )}
          </div>
        </div>

        {/* Decorative Background Element */}
        <div className="absolute -right-16 -bottom-16 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
      </div>

      {/* KPI Stats Numbers Bar (CÁLCULO AUTOMÁTICO PELO SISTEMA) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
              Fundação
            </span>
            <span className="text-2xl font-black text-slate-900 dark:text-white mt-1 block">
              {content.foundationYear}
            </span>
            <span className="text-[11px] text-slate-500 font-medium">{content.foundationDate}</span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 flex items-center justify-center border border-blue-100 dark:border-blue-900/40">
            <Award className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
              Anos de Atuação
            </span>
            <span className="text-2xl font-black text-blue-600 dark:text-blue-400 mt-1 block">
              {content.yearsOfAction}
            </span>
            <span className="text-[11px] text-slate-500 font-medium">Calculado automaticamente</span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 flex items-center justify-center border border-blue-100 dark:border-blue-900/40">
            <HeartHandshake className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
              Servidores Associados
            </span>
            <span className="text-2xl font-black text-sky-600 dark:text-sky-400 mt-1 block">
              {content.totalAssociates}
            </span>
            <span className="text-[11px] text-slate-500 font-medium">Cadastros ativos no banco</span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-sky-50 dark:bg-sky-950/60 text-sky-600 flex items-center justify-center border border-sky-100 dark:border-sky-900/40">
            <Users className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
              Empresas Parceiras
            </span>
            <span className="text-2xl font-black text-indigo-600 dark:text-indigo-400 mt-1 block">
              {content.totalPartners}
            </span>
            <span className="text-[11px] text-slate-500 font-medium">Convênios ativos no banco</span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 flex items-center justify-center border border-indigo-100 dark:border-indigo-900/40">
            <Building2 className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* History & Purpose Section (GRID DINÂMICO DE BLOCOS INSTITUCIONAIS) */}
      <div
        className={`grid grid-cols-1 ${
          content.historyBlocks.length > 1 ? 'md:grid-cols-2' : ''
        } gap-6`}
      >
        {content.historyBlocks.map((block, index) => (
          <div
            key={block.id || index}
            className="bg-white dark:bg-slate-900 p-7 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-3"
          >
            <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold">
              {String(index + 1).padStart(2, '0')}
            </div>
            <h3 className="text-lg font-extrabold text-slate-900 dark:text-white">
              {block.title}
            </h3>
            {block.content1 && (
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed whitespace-pre-line">
                {block.content1}
              </p>
            )}
            {block.content2 && (
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed whitespace-pre-line">
                {block.content2}
              </p>
            )}
          </div>
        ))}
      </div>

      {/* Current Board Management Section (Gestão Atual) */}
      <div className="bg-white dark:bg-slate-900 p-7 sm:p-8 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4 gap-2">
          <div>
            <span className="text-[11px] font-extrabold text-blue-600 dark:text-blue-400 uppercase tracking-wider">
              {content.boardSubtitle}
            </span>
            <h3 className="text-xl font-black text-slate-900 dark:text-white">
              {content.boardTitle}
            </h3>
          </div>
          <span className="px-3 py-1 bg-sky-50 text-sky-700 dark:bg-sky-950/60 dark:text-sky-300 border border-sky-200 dark:border-sky-800/60 rounded-full text-xs font-bold self-start">
            {content.boardBadge}
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {content.boardMembers.map((member, index) => (
            <div
              key={index}
              className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-800 flex flex-col justify-between"
            >
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  {member.role}
                </span>
                <h4 className="text-sm font-extrabold text-slate-900 dark:text-white mt-1 flex items-center space-x-1.5">
                  <span>{member.name || member.fallbackName}</span>
                  {member.associateId && (
                    <span title="Associado Confirmado" className="inline-flex">
                      <UserCheck className="w-3.5 h-3.5 text-blue-500 shrink-0" />
                    </span>
                  )}
                </h4>
                <p className="text-xs text-slate-500 mt-0.5">
                  {member.subtext || member.fallbackSubtext}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ADMIN EDIT MODAL */}
      {isEditModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl w-full max-w-4xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-800/50">
              <div className="flex items-center space-x-2">
                <Edit3 className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                <h3 className="font-extrabold text-slate-900 dark:text-white text-base">
                  Editar Conteúdo da Página Inicial (Painel do Gestor)
                </h3>
              </div>
              <button
                onClick={() => setIsEditModalOpen(false)}
                className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Navigation Tabs */}
            <div className="flex border-b border-slate-200 dark:border-slate-800 bg-slate-100/50 dark:bg-slate-900/50 px-6 pt-3 gap-2">
              <button
                type="button"
                onClick={() => setActiveTab('hero_kpis')}
                className={`px-4 py-2.5 text-xs font-bold rounded-t-xl transition cursor-pointer border-b-2 ${
                  activeTab === 'hero_kpis'
                    ? 'bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 border-blue-600'
                    : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 border-transparent'
                }`}
              >
                1. Banner & Fundação
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('history')}
                className={`px-4 py-2.5 text-xs font-bold rounded-t-xl transition cursor-pointer border-b-2 ${
                  activeTab === 'history'
                    ? 'bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 border-blue-600'
                    : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 border-transparent'
                }`}
              >
                2. História & Propósito (Blocos)
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('board')}
                className={`px-4 py-2.5 text-xs font-bold rounded-t-xl transition cursor-pointer border-b-2 ${
                  activeTab === 'board'
                    ? 'bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 border-blue-600'
                    : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 border-transparent'
                }`}
              >
                3. Diretoria (Vínculo de Associados)
              </button>
            </div>

            {/* Modal Form Body */}
            <form onSubmit={handleSave} className="flex-1 overflow-y-auto p-6 space-y-6">
              {successMessage && (
                <div className="bg-emerald-500/10 border border-emerald-500/30 text-emerald-700 dark:text-emerald-300 p-4 rounded-2xl flex items-center space-x-2 text-xs font-bold animate-in fade-in duration-200">
                  <CheckCircle2 className="w-5 h-5 shrink-0 text-emerald-500" />
                  <span>{successMessage}</span>
                </div>
              )}

              {/* TAB 1: HERO & FUNDAÇÃO */}
              {activeTab === 'hero_kpis' && (
                <div className="space-y-5">
                  <div className="space-y-4 bg-slate-50 dark:bg-slate-800/40 p-4 rounded-2xl border border-slate-200/60 dark:border-slate-800">
                    <h4 className="text-xs font-extrabold text-blue-600 dark:text-blue-400 uppercase tracking-wider">
                      Banner Principal (Hero)
                    </h4>
                    <div className="space-y-3">
                      <div>
                        <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">
                          Tag / Selo do Topo
                        </label>
                        <input
                          type="text"
                          value={formData.heroBadge}
                          onChange={(e) => setFormData({ ...formData, heroBadge: e.target.value })}
                          className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">
                          Título Principal
                        </label>
                        <input
                          type="text"
                          value={formData.heroTitle}
                          onChange={(e) => setFormData({ ...formData, heroTitle: e.target.value })}
                          className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-blue-500 font-bold"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">
                          Subtítulo / Descrição
                        </label>
                        <textarea
                          rows={2}
                          value={formData.heroSubtitle}
                          onChange={(e) => setFormData({ ...formData, heroSubtitle: e.target.value })}
                          className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4 bg-slate-50 dark:bg-slate-800/40 p-4 rounded-2xl border border-slate-200/60 dark:border-slate-800">
                    <h4 className="text-xs font-extrabold text-blue-600 dark:text-blue-400 uppercase tracking-wider">
                      Dados de Fundação & Indicadores Automáticos
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">
                          Ano de Fundação (Base de Cálculo)
                        </label>
                        <input
                          type="text"
                          value={formData.foundationYear}
                          onChange={(e) => setFormData({ ...formData, foundationYear: e.target.value })}
                          className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white font-bold"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">
                          Data de Fundação (Exibição)
                        </label>
                        <input
                          type="text"
                          value={formData.foundationDate}
                          onChange={(e) => setFormData({ ...formData, foundationDate: e.target.value })}
                          className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
                        />
                      </div>
                    </div>

                    <div className="p-3 bg-blue-500/10 border border-blue-500/20 rounded-xl space-y-2 text-xs text-blue-800 dark:text-blue-300">
                      <div className="flex items-center space-x-1.5 font-bold">
                        <Calculator className="w-4 h-4 text-blue-600 dark:text-blue-400 shrink-0" />
                        <span>Indicadores Calculados Automaticamente pelo Sistema:</span>
                      </div>
                      <ul className="list-disc list-inside space-y-1 text-[11px] text-slate-600 dark:text-slate-400 pl-1">
                        <li>
                          <strong>Anos de Atuação:</strong> Calculado dinamicamente ({content.yearsOfAction}).
                        </li>
                        <li>
                          <strong>Servidores Associados:</strong> Total de cadastros ativos no banco ({content.totalAssociates}).
                        </li>
                        <li>
                          <strong>Empresas Parceiras:</strong> Total de convênios ativos no banco ({content.totalPartners}).
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 2: HISTORY BLOCKS (ADICIONAR / REMOVER BLOCOS) */}
              {activeTab === 'history' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-xs font-extrabold text-blue-600 dark:text-blue-400 uppercase tracking-wider">
                        Gerenciar Blocos Institucionais
                      </h4>
                      <p className="text-[11px] text-slate-500">
                        Você pode adicionar novos blocos, remover ou alterar o conteúdo das seções.
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={handleAddHistoryBlock}
                      className="inline-flex items-center space-x-1.5 px-3 py-1.5 text-xs font-bold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/60 hover:bg-blue-100 rounded-lg transition cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Adicionar Novo Bloco</span>
                    </button>
                  </div>

                  <div className="space-y-4">
                    {formData.historyBlocks.map((block, index) => (
                      <div
                        key={block.id || index}
                        className="bg-slate-50 dark:bg-slate-800/40 p-4.5 rounded-2xl border border-slate-200/60 dark:border-slate-800 space-y-3 relative group"
                      >
                        <div className="flex items-center justify-between border-b border-slate-200/60 dark:border-slate-700/60 pb-2">
                          <span className="text-xs font-bold text-blue-600 dark:text-blue-400">
                            Bloco #{index + 1}
                          </span>
                          {formData.historyBlocks.length > 1 && (
                            <button
                              type="button"
                              onClick={() => handleRemoveHistoryBlock(block.id)}
                              className="text-rose-500 hover:text-rose-700 p-1 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-950/50 transition cursor-pointer inline-flex items-center space-x-1 text-xs font-semibold"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                              <span>Remover Bloco</span>
                            </button>
                          )}
                        </div>

                        <div>
                          <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">
                            Título da Seção
                          </label>
                          <input
                            type="text"
                            value={block.title}
                            onChange={(e) =>
                              handleHistoryBlockChange(block.id, 'title', e.target.value)
                            }
                            className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white font-bold"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">
                            Primeiro Parágrafo
                          </label>
                          <textarea
                            rows={3}
                            value={block.content1}
                            onChange={(e) =>
                              handleHistoryBlockChange(block.id, 'content1', e.target.value)
                            }
                            className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">
                            Segundo Parágrafo (Opcional)
                          </label>
                          <textarea
                            rows={3}
                            value={block.content2 || ''}
                            onChange={(e) =>
                              handleHistoryBlockChange(block.id, 'content2', e.target.value)
                            }
                            className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB 3: BOARD MEMBERS (VÍNCULO COM ASSOCIADOS) */}
              {activeTab === 'board' && (
                <div className="space-y-5">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 bg-slate-50 dark:bg-slate-800/40 p-4 rounded-2xl border border-slate-200/60 dark:border-slate-800">
                    <div>
                      <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">
                        Subtítulo Superior
                      </label>
                      <input
                        type="text"
                        value={formData.boardSubtitle}
                        onChange={(e) => setFormData({ ...formData, boardSubtitle: e.target.value })}
                        className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">
                        Título Principal
                      </label>
                      <input
                        type="text"
                        value={formData.boardTitle}
                        onChange={(e) => setFormData({ ...formData, boardTitle: e.target.value })}
                        className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white font-bold"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">
                        Selo / Badge Ativo
                      </label>
                      <input
                        type="text"
                        value={formData.boardBadge}
                        onChange={(e) => setFormData({ ...formData, boardBadge: e.target.value })}
                        className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
                      />
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="text-xs font-extrabold text-blue-600 dark:text-blue-400 uppercase tracking-wider">
                          Vínculo de Diretores a Associados
                        </h4>
                        <p className="text-[11px] text-slate-500">
                          Selecione um associado cadastrado no sistema para cada cargo de liderança.
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={handleAddBoardMember}
                        className="inline-flex items-center space-x-1.5 px-3 py-1.5 text-xs font-bold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/60 hover:bg-blue-100 rounded-lg transition cursor-pointer"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Adicionar Cargo</span>
                      </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {formData.boardMembers.map((member, index) => (
                        <div
                          key={index}
                          className="p-4 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-200/80 dark:border-slate-700/60 space-y-3 relative group"
                        >
                          <div className="flex items-center justify-between border-b border-slate-200/60 dark:border-slate-700/60 pb-2">
                            <span className="text-[10px] font-bold text-slate-400 uppercase">
                              Cargo #{index + 1}
                            </span>
                            {formData.boardMembers.length > 1 && (
                              <button
                                type="button"
                                onClick={() => handleRemoveBoardMember(index)}
                                className="text-rose-500 hover:text-rose-700 p-1 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-950/50 transition cursor-pointer"
                                title="Remover cargo"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            )}
                          </div>

                          <div>
                            <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-300 mb-1">
                              Título do Cargo na Associação
                            </label>
                            <input
                              type="text"
                              value={member.role}
                              onChange={(e) =>
                                handleBoardMemberRoleChange(index, e.target.value)
                              }
                              placeholder="Ex: Presidente, Vice-Presidente, Tesoureiro"
                              className="w-full px-3 py-1.5 text-xs font-bold rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
                            />
                          </div>

                          <div>
                            <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-300 mb-1">
                              Associado Vinculado
                            </label>
                            <select
                              value={member.associateId || ''}
                              onChange={(e) =>
                                handleBoardMemberAssociateChange(index, e.target.value)
                              }
                              className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 font-medium"
                            >
                              <option value="">-- Selecionar Associado Cadastrado --</option>
                              {associates.map((assoc) => (
                                <option key={assoc.id} value={assoc.id}>
                                  {assoc.name} ({assoc.cpf})
                                </option>
                              ))}
                            </select>
                          </div>

                          {/* Associate Info Preview */}
                          {member.associateId && member.associate ? (
                            <div className="p-2.5 bg-blue-500/10 border border-blue-500/20 rounded-xl text-xs space-y-1">
                              <div className="font-bold text-blue-900 dark:text-blue-300 flex items-center space-x-1">
                                <UserCheck className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400 shrink-0" />
                                <span>{member.associate.name}</span>
                              </div>
                              <div className="text-[11px] text-slate-600 dark:text-slate-400">
                                Email: {member.associate.email}
                              </div>
                            </div>
                          ) : (
                            <div className="p-2 bg-amber-500/10 border border-amber-500/20 rounded-xl text-[11px] text-amber-800 dark:text-amber-300">
                              Nenhum associado vinculado. (Será exibido &quot;A Definir&quot;)
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Modal Footer Actions */}
              <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex items-center justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="px-5 py-2.5 text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="inline-flex items-center space-x-2 px-6 py-2.5 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 active:scale-98 rounded-xl shadow-lg shadow-blue-500/25 transition cursor-pointer disabled:opacity-50"
                >
                  {saving ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Save className="w-4 h-4" />
                  )}
                  <span>{saving ? 'Salvando...' : 'Salvar Alterações'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

import React, { useState, useEffect } from 'react';
import {
  Search,
  CheckCircle2,
  XCircle,
  Sparkles,
  History,
  Users,
  ShieldCheck,
  RotateCw,
  ChevronLeft,
  ChevronRight,
  CreditCard,
  Percent,
  Clock,
  FileText,
  X,
  AlertCircle,
  Check,
  Building2,
} from 'lucide-react';
import { api } from '../lib/api';
import type { AuthUser, DiscountRedemption, PartnerAssociateItem } from '../types';

interface PartnerAssociatesPageProps {
  user: AuthUser;
}

export const PartnerAssociatesPage: React.FC<PartnerAssociatesPageProps> = ({ user }) => {
  const [subTab, setSubTab] = useState<'search' | 'history'>('search');

  // Associates list state
  const [associates, setAssociates] = useState<PartnerAssociateItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive'>('all');
  const [page, setPage] = useState(1);
  const [limit] = useState(12);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  // Redemptions history state
  const [redemptions, setRedemptions] = useState<DiscountRedemption[]>([]);
  const [loadingHistory, setLoadingHistory] = useState(false);

  // Modal for releasing discount
  const [selectedAssociate, setSelectedAssociate] = useState<PartnerAssociateItem | null>(null);
  const [notes, setNotes] = useState('');
  const [isRedeeming, setIsRedeeming] = useState(false);
  const [redeemError, setRedeemError] = useState<string | null>(null);
  const [lastReceipt, setLastReceipt] = useState<DiscountRedemption | null>(null);

  const partnerBenefitId = user.partnerBenefitId || '';
  const partnerName = user.partnerName || user.name;
  const discountLabel = user.discountPercentage || 'Desconto Conveniado';

  const fetchAssociates = async () => {
    setLoading(true);
    try {
      const activeParam =
        statusFilter === 'all' ? undefined : statusFilter === 'active' ? true : false;

      const response = await api.getPartnerAssociates({
        search,
        active: activeParam,
        page,
        limit,
        partnerBenefitId: partnerBenefitId || undefined,
      });

      setAssociates(response.data || []);
      setTotal(response.total || 0);
      setTotalPages(response.totalPages || 1);
    } catch (err) {
      console.error('Erro ao consultar associados:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchHistory = async () => {
    setLoadingHistory(true);
    try {
      const data = await api.getRedemptions({
        partnerBenefitId: partnerBenefitId || undefined,
        limit: 100,
      });
      setRedemptions(data || []);
    } catch (err) {
      console.error('Erro ao carregar histórico de descontos:', err);
    } finally {
      setLoadingHistory(false);
    }
  };

  useEffect(() => {
    setPage(1);
  }, [search, statusFilter]);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchAssociates();
    }, 250);
    return () => clearTimeout(timer);
  }, [search, statusFilter, page]);

  useEffect(() => {
    fetchHistory();
  }, [partnerBenefitId]);

  const handleOpenRedeemModal = (associate: PartnerAssociateItem) => {
    setSelectedAssociate(associate);
    setNotes('');
    setRedeemError(null);
  };

  const handleConfirmRedeem = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedAssociate) return;

    if (!partnerBenefitId) {
      setRedeemError('Este usuário parceiro não está vinculado a um estabelecimento ativo.');
      return;
    }

    setIsRedeeming(true);
    setRedeemError(null);

    try {
      const receipt = await api.redeemDiscount({
        associateId: selectedAssociate.id,
        partnerBenefitId,
        notes: notes.trim() || undefined,
      });

      setLastReceipt(receipt);
      setSelectedAssociate(null);
      setNotes('');
      await Promise.all([fetchAssociates(), fetchHistory()]);
    } catch (err: any) {
      setRedeemError(err.message || 'Não foi possível registrar a liberação do desconto.');
    } finally {
      setIsRedeeming(false);
    }
  };

  const formatDateTime = (iso?: string | null) => {
    if (!iso) return '-';
    const d = new Date(iso);
    if (isNaN(d.getTime())) return '-';
    return d.toLocaleString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="space-y-6">
      {/* Top Partner Identification Card */}
      <div className="bg-gradient-to-r from-[#1e2e4a] to-[#0f1d36] text-white rounded-3xl p-6 shadow-lg border border-slate-700/70 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5">
        <div className="flex items-start sm:items-center space-x-4">
          <div className="w-13 h-13 rounded-2xl bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 flex items-center justify-center shrink-0 shadow-inner">
            <Building2 className="w-7 h-7" />
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-1">
              <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-emerald-500/20 text-emerald-300 border border-emerald-400/30">
                <ShieldCheck className="w-3 h-3" />
                <span>Portal do Estabelecimento Parceiro</span>
              </span>
              <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-[11px] font-black bg-blue-500 text-white shadow-xs">
                <Percent className="w-3 h-3" />
                <span>{discountLabel}</span>
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black tracking-tight text-white">
              {partnerName}
            </h1>
            <p className="text-xs text-slate-300 mt-0.5">
              Consulte se o associado está ativo pelo Nome, CPF ou Nº da Carteirinha e clique em{' '}
              <strong className="text-white">Liberar Desconto</strong> para registrar o benefício.
            </p>
          </div>
        </div>

        {/* Sub-navigation Tabs */}
        <div className="flex items-center space-x-2 bg-[#0e1a2e]/90 p-1.5 rounded-2xl border border-slate-700/80 self-start lg:self-center shrink-0">
          <button
            onClick={() => setSubTab('search')}
            className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-extrabold transition cursor-pointer ${
              subTab === 'search'
                ? 'bg-[#3b82f6] text-white shadow-md shadow-blue-500/20'
                : 'text-slate-300 hover:text-white hover:bg-slate-800'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>Consultar Associados</span>
          </button>

          <button
            onClick={() => setSubTab('history')}
            className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-extrabold transition cursor-pointer ${
              subTab === 'history'
                ? 'bg-[#3b82f6] text-white shadow-md shadow-blue-500/20'
                : 'text-slate-300 hover:text-white hover:bg-slate-800'
            }`}
          >
            <History className="w-4 h-4" />
            <span>Descontos Liberados</span>
            <span className="px-2 py-0.5 text-[10px] rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-black">
              {redemptions.length}
            </span>
          </button>
        </div>
      </div>

      {/* Receipt Banner when a discount was just released */}
      {lastReceipt && (
        <div className="bg-emerald-50 dark:bg-emerald-950/50 border-2 border-emerald-400 dark:border-emerald-700 rounded-2xl p-4 shadow-md flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 animate-in fade-in duration-200">
          <div className="flex items-start space-x-3.5">
            <div className="w-10 h-10 rounded-2xl bg-emerald-600 text-white flex items-center justify-center shrink-0 mt-0.5 shadow-sm">
              <Check className="w-6 h-6 stroke-[2.5]" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-xs font-black uppercase tracking-wider text-emerald-800 dark:text-emerald-300">
                  Desconto Liberado e Registrado!
                </span>
                <span className="px-2 py-0.5 text-[10px] font-extrabold bg-emerald-600 text-white rounded-full">
                  {lastReceipt.discountApplied}
                </span>
              </div>
              <p className="text-sm font-extrabold text-slate-900 dark:text-white mt-0.5">
                {lastReceipt.associateName}{' '}
                <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                  ({lastReceipt.associateMaskedCpf})
                </span>
              </p>
              <p className="text-xs text-emerald-700 dark:text-emerald-300/90 mt-0.5">
                Registrado em {formatDateTime(lastReceipt.createdAt)}
                {lastReceipt.notes ? ` • Obs: ${lastReceipt.notes}` : ''}
              </p>
            </div>
          </div>

          <button
            onClick={() => setLastReceipt(null)}
            className="self-end sm:self-center p-1.5 rounded-xl text-emerald-700 dark:text-emerald-300 hover:bg-emerald-100 dark:hover:bg-emerald-900/50 transition cursor-pointer"
            title="Fechar comprovante"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      )}

      {/* TAB 1: CONSULTAR ASSOCIADOS E LIBERAR DESCONTO */}
      {subTab === 'search' && (
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 p-6 shadow-xs space-y-5">
          {/* Quick Search & Filter Bar */}
          <div className="bg-slate-50/90 dark:bg-slate-800/40 p-4 rounded-2xl border border-slate-200/80 dark:border-slate-700/60 space-y-3">
            <div className="flex flex-col md:flex-row gap-3">
              {/* Search Input */}
              <div className="relative flex-1">
                <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-blue-600" />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Digite o Nome, CPF completo ou Nº da Carteirinha do associado..."
                  className="w-full pl-10 pr-9 py-2.5 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl text-xs sm:text-sm font-semibold text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:outline-none placeholder:text-slate-400"
                />
                {search && (
                  <button
                    onClick={() => setSearch('')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>

              {/* Status Filter Pills */}
              <div className="flex items-center space-x-1.5 bg-white dark:bg-slate-900 p-1 rounded-xl border border-slate-200 dark:border-slate-700 shrink-0">
                <button
                  onClick={() => setStatusFilter('all')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                    statusFilter === 'all'
                      ? 'bg-[#3b82f6] text-white'
                      : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  Todos
                </button>
                <button
                  onClick={() => setStatusFilter('active')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                    statusFilter === 'active'
                      ? 'bg-emerald-600 text-white'
                      : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  Aptos (Ativos)
                </button>
                <button
                  onClick={() => setStatusFilter('inactive')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                    statusFilter === 'inactive'
                      ? 'bg-rose-600 text-white'
                      : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  Inativos
                </button>
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-2 text-[11px] text-slate-500 dark:text-slate-400">
              <div className="flex items-center space-x-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400 shrink-0" />
                <span>
                  Proteção de Dados (LGPD): O CPF é exibido mascarado na tabela, mas você pode buscar digitando os 11 dígitos normalmente.
                </span>
              </div>
              <button
                onClick={fetchAssociates}
                className="inline-flex items-center space-x-1 text-blue-600 dark:text-blue-400 font-bold hover:underline cursor-pointer"
              >
                <RotateCw className={`w-3 h-3 ${loading ? 'animate-spin' : ''}`} />
                <span>Atualizar lista</span>
              </button>
            </div>
          </div>

          {/* Results Count */}
          <div className="flex items-center justify-between text-xs">
            <span className="font-extrabold text-slate-700 dark:text-slate-300">
              {total} associado(s) encontrado(s)
            </span>
          </div>

          {/* Simplified Associates Table */}
          {loading ? (
            <div className="p-12 text-center text-slate-400 border border-slate-200/80 dark:border-slate-800 rounded-2xl">
              <RotateCw className="w-7 h-7 animate-spin mx-auto mb-2 text-blue-600" />
              <p className="text-xs font-semibold uppercase tracking-wider">
                Consultando base de associados...
              </p>
            </div>
          ) : associates.length === 0 ? (
            <div className="p-12 text-center text-slate-500 border border-slate-200/80 dark:border-slate-800 rounded-2xl">
              <Users className="w-10 h-10 mx-auto mb-2 text-slate-300 dark:text-slate-700" />
              <p className="text-sm font-bold text-slate-800 dark:text-slate-200">
                Nenhum associado encontrado para esta busca
              </p>
              <p className="text-xs text-slate-400 mt-1">
                Verifique o nome, CPF ou número da carteirinha informado.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto border border-slate-200/80 dark:border-slate-800 rounded-2xl">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 dark:bg-slate-800/70 border-b border-slate-200/80 dark:border-slate-800 text-[11px] font-extrabold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                    <th className="py-3.5 px-4">Associado</th>
                    <th className="py-3.5 px-4">CPF (LGPD)</th>
                    <th className="py-3.5 px-4">Nº Carteirinha</th>
                    <th className="py-3.5 px-4">Status de Elegibilidade</th>
                    <th className="py-3.5 px-4">Uso no Estabelecimento</th>
                    <th className="py-3.5 px-4 text-right">Ação</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200/60 dark:divide-slate-800 text-xs">
                  {associates.map((assoc) => (
                    <tr
                      key={assoc.id}
                      className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition"
                    >
                      <td className="py-3.5 px-4 font-extrabold text-slate-900 dark:text-white">
                        {assoc.name}
                      </td>
                      <td className="py-3.5 px-4 font-mono text-slate-600 dark:text-slate-300 font-semibold">
                        {assoc.maskedCpf}
                      </td>
                      <td className="py-3.5 px-4">
                        {assoc.cardNumber ? (
                          <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 font-mono font-bold text-[11px]">
                            <CreditCard className="w-3 h-3 text-blue-500" />
                            <span>{assoc.cardNumber}</span>
                          </span>
                        ) : (
                          <span className="text-slate-400 italic">Não informado</span>
                        )}
                      </td>
                      <td className="py-3.5 px-4">
                        {assoc.active ? (
                          <span className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full text-[11px] font-extrabold bg-emerald-100 text-emerald-800 dark:bg-emerald-950/70 dark:text-emerald-300 border border-emerald-300/60 dark:border-emerald-800/60">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                            <span>ATIVO • APTO AO DESCONTO</span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full text-[11px] font-extrabold bg-rose-100 text-rose-800 dark:bg-rose-950/70 dark:text-rose-300 border border-rose-300/60 dark:border-rose-800/60">
                            <XCircle className="w-3.5 h-3.5 text-rose-600 dark:text-rose-400" />
                            <span>INATIVO • NÃO ELEGÍVEL</span>
                          </span>
                        )}
                      </td>
                      <td className="py-3.5 px-4 text-slate-500 dark:text-slate-400">
                        {assoc.usageCount && assoc.usageCount > 0 ? (
                          <div className="space-y-0.5">
                            <span className="font-bold text-slate-700 dark:text-slate-200 block">
                              {assoc.usageCount}x utilizado
                            </span>
                            <span className="text-[10px] text-slate-400 flex items-center space-x-1">
                              <Clock className="w-3 h-3" />
                              <span>Último: {formatDateTime(assoc.lastUsedAt)}</span>
                            </span>
                          </div>
                        ) : (
                          <span className="text-slate-400 text-[11px]">Nenhum registro</span>
                        )}
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        {assoc.active ? (
                          <button
                            onClick={() => handleOpenRedeemModal(assoc)}
                            className="inline-flex items-center space-x-1.5 px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs shadow-sm shadow-emerald-600/20 transition cursor-pointer"
                          >
                            <Sparkles className="w-3.5 h-3.5" />
                            <span>Liberar Desconto</span>
                          </button>
                        ) : (
                          <span className="inline-flex items-center space-x-1 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-400 font-bold text-[11px] cursor-not-allowed">
                            <span>Indisponível</span>
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between pt-2">
              <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                Página <strong>{page}</strong> de <strong>{totalPages}</strong>
              </span>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page <= 1}
                  className="p-2 rounded-xl border border-slate-200 dark:border-slate-700 disabled:opacity-40 hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page >= totalPages}
                  className="p-2 rounded-xl border border-slate-200 dark:border-slate-700 disabled:opacity-40 hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB 2: HISTÓRICO DE DESCONTOS LIBERADOS PELO PARCEIRO */}
      {subTab === 'history' && (
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-extrabold text-slate-900 dark:text-white">
                Histórico de Descontos Concedidos
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Registro de todos os descontos liberados por {partnerName}.
              </p>
            </div>
            <button
              onClick={fetchHistory}
              className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-bold text-blue-600 dark:text-blue-400 hover:bg-slate-50 dark:hover:bg-slate-800 transition cursor-pointer"
            >
              <RotateCw className={`w-3.5 h-3.5 ${loadingHistory ? 'animate-spin' : ''}`} />
              <span>Atualizar</span>
            </button>
          </div>

          {loadingHistory ? (
            <div className="p-12 text-center text-slate-400">
              <RotateCw className="w-6 h-6 animate-spin mx-auto mb-2 text-blue-600" />
              <p className="text-xs font-semibold">Carregando histórico...</p>
            </div>
          ) : redemptions.length === 0 ? (
            <div className="p-12 text-center text-slate-500 border border-slate-200/80 dark:border-slate-800 rounded-2xl">
              <History className="w-10 h-10 mx-auto mb-2 text-slate-300 dark:text-slate-700" />
              <p className="text-sm font-bold text-slate-800 dark:text-slate-200">
                Nenhum desconto registrado até o momento
              </p>
              <p className="text-xs text-slate-400 mt-1">
                Quando você clicar em &ldquo;Liberar Desconto&rdquo; para um associado, o registro aparecerá aqui.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto border border-slate-200/80 dark:border-slate-800 rounded-2xl">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 dark:bg-slate-800/70 border-b border-slate-200/80 dark:border-slate-800 text-[11px] font-extrabold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                    <th className="py-3.5 px-4">Data / Hora</th>
                    <th className="py-3.5 px-4">Associado</th>
                    <th className="py-3.5 px-4">CPF</th>
                    <th className="py-3.5 px-4">Carteirinha</th>
                    <th className="py-3.5 px-4">Desconto Aplicado</th>
                    <th className="py-3.5 px-4">Observação / Cupom</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200/60 dark:divide-slate-800 text-xs">
                  {redemptions.map((item) => (
                    <tr key={item.id} className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40">
                      <td className="py-3 px-4 font-semibold text-slate-600 dark:text-slate-300 whitespace-nowrap">
                        {formatDateTime(item.createdAt)}
                      </td>
                      <td className="py-3 px-4 font-extrabold text-slate-900 dark:text-white">
                        {item.associateName}
                      </td>
                      <td className="py-3 px-4 font-mono text-slate-600 dark:text-slate-300">
                        {item.associateMaskedCpf}
                      </td>
                      <td className="py-3 px-4 font-mono text-slate-600 dark:text-slate-300">
                        {item.associateCardNumber || '-'}
                      </td>
                      <td className="py-3 px-4">
                        <span className="px-2.5 py-1 rounded-full text-[11px] font-extrabold bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300">
                          {item.discountApplied}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-slate-500 dark:text-slate-400">
                        {item.notes || '-'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* MODAL DE CONFIRMAÇÃO: LIBERAR DESCONTO */}
      {selectedAssociate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 w-full max-w-md overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-slate-800 bg-emerald-50/60 dark:bg-emerald-950/30">
              <div className="flex items-center space-x-2.5">
                <div className="w-9 h-9 rounded-xl bg-emerald-600 text-white flex items-center justify-center shadow-sm">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-black text-slate-900 dark:text-white">
                    Confirmar Liberação de Desconto
                  </h3>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">
                    {partnerName}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setSelectedAssociate(null)}
                className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleConfirmRedeem} className="p-6 space-y-4 text-xs">
              {redeemError && (
                <div className="p-3 bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-300 rounded-xl flex items-center space-x-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span className="font-semibold">{redeemError}</span>
                </div>
              )}

              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-extrabold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                    Associado Elegível
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full text-[11px] font-black bg-blue-600 text-white">
                    {discountLabel}
                  </span>
                </div>
                <div className="text-base font-black text-slate-900 dark:text-white">
                  {selectedAssociate.name}
                </div>
                <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 pt-1 border-t border-slate-200/60 dark:border-slate-700/60">
                  <span>
                    CPF: <strong className="font-mono text-slate-700 dark:text-slate-200">{selectedAssociate.maskedCpf}</strong>
                  </span>
                  <span>
                    Carteirinha:{' '}
                    <strong className="font-mono text-slate-700 dark:text-slate-200">
                      {selectedAssociate.cardNumber || 'Não informada'}
                    </strong>
                  </span>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Observação / Nº do Cupom ou Pedido (Opcional)
                </label>
                <div className="relative">
                  <FileText className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
                  <input
                    type="text"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Ex: Cupom #4582, Compra balcão..."
                    className="w-full pl-9 pr-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none text-slate-900 dark:text-white font-medium"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end space-x-2.5 pt-2">
                <button
                  type="button"
                  onClick={() => setSelectedAssociate(null)}
                  className="px-4 py-2.5 rounded-xl font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={isRedeeming}
                  className="inline-flex items-center space-x-1.5 px-5 py-2.5 rounded-xl font-extrabold text-white bg-emerald-600 hover:bg-emerald-700 shadow-md shadow-emerald-600/20 transition disabled:opacity-50 cursor-pointer"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>{isRedeeming ? 'Registrando...' : 'Confirmar e Liberar Desconto'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

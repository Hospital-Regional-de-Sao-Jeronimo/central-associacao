import React, { useState, useEffect } from 'react';
import {
  Search,
  CheckCircle2,
  Clock,
  Edit3,
  Trash2,
  Users,
  Filter,
  RotateCw,
  Eye,
  X,
  ShieldCheck,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';

import type { Associate } from '../types';
import { api } from '../lib/api';
import { AssociateModal } from './AssociateModal';
import { LdapSearchModal } from './LdapSearchModal';

export const AssociatesPage: React.FC = () => {
  // Associates State
  const [associates, setAssociates] = useState<Associate[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [activeFilter, setActiveFilter] = useState<'all' | 'active' | 'inactive'>('all');
  const [cardFilter, setCardFilter] = useState<'all' | 'retrieved' | 'pending'>('all');
  const [departmentFilter, setDepartmentFilter] = useState<string>('all');
  const [departmentsList, setDepartmentsList] = useState<string[]>([]);
  const [birthDateFilter, setBirthDateFilter] = useState('');
  const [admissionDateFilter, setAdmissionDateFilter] = useState('');
  const [letterFilter, setLetterFilter] = useState<string>('all');

  // Pagination State
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAssociate, setEditingAssociate] = useState<Associate | null>(null);
  const [selectedAssociateForView, setSelectedAssociateForView] = useState<Associate | null>(null);

  // LDAP Search Modal
  const [isLdapModalOpen, setIsLdapModalOpen] = useState(false);

  useEffect(() => {
    api.getDepartments()
      .then(setDepartmentsList)
      .catch((err) => console.error('Erro ao buscar setores:', err));
  }, []);

  const fetchAssociates = async () => {
    setLoading(true);
    try {
      const activeParam = activeFilter === 'all' ? undefined : activeFilter === 'active';
      const cardParam = cardFilter === 'all' ? undefined : cardFilter === 'retrieved';
      const res = await api.getAssociates({
        search,
        active: activeParam,
        cardRetrieved: cardParam,
        department: departmentFilter === 'all' ? undefined : departmentFilter,
        birthDate: birthDateFilter || undefined,
        admissionDate: admissionDateFilter || undefined,
        letter: letterFilter === 'all' ? undefined : letterFilter,
        page,
        limit,
      });
      setAssociates(res.data);
      setTotal(res.total);
      setTotalPages(res.totalPages);
    } catch (err) {
      console.error('Erro ao buscar associados:', err);
    } finally {
      setLoading(false);
    }
  };

  // Reset to page 1 whenever filters change
  useEffect(() => {
    setPage(1);
  }, [search, activeFilter, cardFilter, departmentFilter, birthDateFilter, admissionDateFilter, letterFilter]);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchAssociates();
    }, 200);
    return () => clearTimeout(timer);
  }, [search, activeFilter, cardFilter, departmentFilter, birthDateFilter, admissionDateFilter, letterFilter, page, limit]);

  const handleSave = async (data: Partial<Associate>) => {
    if (editingAssociate) {
      await api.updateAssociate(editingAssociate.id, data);
    } else {
      await api.createAssociate(data);
    }
    fetchAssociates();
  };

  const handleToggleCard = async (id: string, currentState: boolean) => {
    try {
      await api.toggleCardRetrieved(id, !currentState);
      fetchAssociates();
    } catch (err) {
      console.error('Erro ao alterar status da carteirinha:', err);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (window.confirm(`Tem certeza que deseja remover o associado "${name}"?`)) {
      try {
        await api.deleteAssociate(id);
        fetchAssociates();
      } catch (err) {
        console.error('Erro ao remover associado:', err);
      }
    }
  };

  const clearFilters = () => {
    setSearch('');
    setActiveFilter('all');
    setCardFilter('all');
    setDepartmentFilter('all');
    setBirthDateFilter('');
    setAdmissionDateFilter('');
    setLetterFilter('all');
    setPage(1);
  };

  const formatDate = (dateStr?: string | null) => {
    if (!dateStr) return '-';
    try {
      const date = new Date(dateStr);
      return date.toLocaleDateString('pt-BR');
    } catch {
      return dateStr;
    }
  };

  const activeFiltersCount =
    (search ? 1 : 0) +
    (activeFilter !== 'all' ? 1 : 0) +
    (cardFilter !== 'all' ? 1 : 0) +
    (departmentFilter !== 'all' ? 1 : 0) +
    (birthDateFilter ? 1 : 0) +
    (admissionDateFilter ? 1 : 0) +
    (letterFilter !== 'all' ? 1 : 0);

  const startRecord = total === 0 ? 0 : (page - 1) * limit + 1;
  const endRecord = Math.min(page * limit, total);

  // Helper to generate page buttons array
  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      pages.push(1);
      if (page > 3) pages.push('...');
      const start = Math.max(2, page - 1);
      const end = Math.min(totalPages - 1, page + 1);
      for (let i = start; i <= end; i++) pages.push(i);
      if (page < totalPages - 2) pages.push('...');
      pages.push(totalPages);
    }
    return pages;
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 p-6 shadow-xs space-y-6">
      
      {/* Title Header with Action Buttons */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-4">
        <div>
          <h2 className="text-xl font-black tracking-tight text-slate-900 dark:text-white">
            Quadro de Associados
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 font-medium mt-0.5">
            Acompanhe e gerencie os cadastros dos funcionários associados do HRSJ.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setIsLdapModalOpen(true)}
            className="flex items-center space-x-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-extrabold rounded-xl shadow-sm transition cursor-pointer"
          >
            <ShieldCheck className="w-4 h-4" />
            <span>Importar do LDAP</span>
          </button>

          <button
            onClick={() => {
              setEditingAssociate(null);
              setIsModalOpen(true);
            }}
            className="flex items-center space-x-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-extrabold rounded-xl shadow-sm transition cursor-pointer"
          >
            <Users className="w-4 h-4" />
            <span>Novo Associado</span>
          </button>
        </div>
      </div>

      {/* Filter Card Container */}
      <div className="bg-slate-50/80 dark:bg-slate-800/40 p-4 rounded-2xl border border-slate-200/80 dark:border-slate-700/60 space-y-3">
        {/* Row 1: Dropdown Filters & Clear Filters */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2">
            <div className="inline-flex items-center space-x-1.5 px-3 py-1.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-200 shadow-2xs">
              <Filter className="w-3.5 h-3.5 text-blue-600" />
              <span>Filtros</span>
              {activeFiltersCount > 0 && (
                <span className="w-4 h-4 rounded-full bg-blue-600 text-white text-[10px] font-black flex items-center justify-center">
                  {activeFiltersCount}
                </span>
              )}
            </div>

            {/* Quick Filter Inputs */}
            <select
              value={activeFilter}
              onChange={(e: any) => setActiveFilter(e.target.value)}
              className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-1.5 text-xs font-semibold text-slate-700 dark:text-slate-200 focus:outline-none cursor-pointer"
            >
              <option value="all">Status: Todos</option>
              <option value="active">Ativos</option>
              <option value="inactive">Inativos</option>
            </select>

            <select
              value={cardFilter}
              onChange={(e: any) => setCardFilter(e.target.value)}
              className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-1.5 text-xs font-semibold text-slate-700 dark:text-slate-200 focus:outline-none cursor-pointer"
            >
              <option value="all">Carteira: Todas</option>
              <option value="retrieved">Retiradas</option>
              <option value="pending">Pendentes</option>
            </select>

            <select
              value={departmentFilter}
              onChange={(e: any) => setDepartmentFilter(e.target.value)}
              className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-1.5 text-xs font-semibold text-slate-700 dark:text-slate-200 focus:outline-none cursor-pointer max-w-[200px]"
            >
              <option value="all">Setor: Todos</option>
              {departmentsList.map((dept) => (
                <option key={dept} value={dept}>
                  {dept}
                </option>
              ))}
            </select>

            {/* Letra Inicial */}
            <select
              value={letterFilter}
              onChange={(e: any) => setLetterFilter(e.target.value)}
              className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-1.5 text-xs font-semibold text-slate-700 dark:text-slate-200 focus:outline-none cursor-pointer"
            >
              <option value="all">Letra: Todas</option>
              {'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('').map((char) => (
                <option key={char} value={char}>
                  Letra {char}
                </option>
              ))}
            </select>
          </div>

          {activeFiltersCount > 0 && (
            <button
              onClick={clearFilters}
              className="flex items-center space-x-1 px-3 py-1.5 rounded-xl text-xs font-bold text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 border border-rose-200 dark:border-rose-900/60 transition cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
              <span>Limpar Filtros</span>
            </button>
          )}
        </div>

        {/* Row 2: Date Filters */}
        <div className="flex flex-wrap items-center gap-2 pt-1 border-t border-slate-200/50 dark:border-slate-700/50">
          {/* Nascido em */}
          <div className="flex items-center space-x-1.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-1.5 text-xs font-semibold text-slate-700 dark:text-slate-200 shadow-2xs">
            <span className="text-slate-500 dark:text-slate-400 font-bold whitespace-nowrap">Nascido em:</span>
            <input
              type="date"
              value={birthDateFilter}
              onChange={(e) => setBirthDateFilter(e.target.value)}
              className="bg-transparent text-xs font-medium text-slate-800 dark:text-slate-100 focus:outline-none cursor-pointer"
            />
            {birthDateFilter && (
              <button
                type="button"
                onClick={() => setBirthDateFilter('')}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-0.5 rounded cursor-pointer"
                title="Limpar filtro de data de nascimento"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Admitido em */}
          <div className="flex items-center space-x-1.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-1.5 text-xs font-semibold text-slate-700 dark:text-slate-200 shadow-2xs">
            <span className="text-slate-500 dark:text-slate-400 font-bold whitespace-nowrap">Admitido em:</span>
            <input
              type="date"
              value={admissionDateFilter}
              onChange={(e) => setAdmissionDateFilter(e.target.value)}
              className="bg-transparent text-xs font-medium text-slate-800 dark:text-slate-100 focus:outline-none cursor-pointer"
            />
            {admissionDateFilter && (
              <button
                type="button"
                onClick={() => setAdmissionDateFilter('')}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-0.5 rounded cursor-pointer"
                title="Limpar filtro de data de admissão"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Search Bar Input */}
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Buscar associado por nome, CPF, e-mail ou número da carteirinha..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            className="w-full pl-10 pr-10 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-medium text-slate-800 dark:text-slate-100 focus:ring-2 focus:ring-blue-500 focus:outline-none placeholder:text-slate-400"
          />
          {search && (
            <button
              type="button"
              onClick={() => {
                setSearch('');
                setPage(1);
              }}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-0.5 rounded-lg cursor-pointer transition"
              title="Limpar busca"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Associates Data List Table */}
      <div className="space-y-4">
        <div className="flex items-center justify-between px-1">
          <p className="text-xs font-bold text-slate-600 dark:text-slate-400">
            {loading ? 'Carregando...' : `Mostrando ${startRecord} a ${endRecord} de ${total} associado(s)`}
          </p>

          <button
            onClick={fetchAssociates}
            disabled={loading}
            className="flex items-center space-x-1 text-xs font-semibold text-slate-500 hover:text-blue-600 dark:hover:text-blue-400 cursor-pointer"
          >
            <RotateCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            <span>Atualizar</span>
          </button>
        </div>

        {loading ? (
          <div className="p-12 text-center text-slate-400">
            <RotateCw className="w-8 h-8 animate-spin mx-auto mb-2 text-blue-600" />
            <p className="text-xs font-semibold">Buscando associados...</p>
          </div>
        ) : associates.length === 0 ? (
          <div className="p-12 text-center bg-slate-50 dark:bg-slate-800/40 rounded-2xl border border-slate-200/80 dark:border-slate-800">
            <Users className="w-10 h-10 mx-auto mb-3 text-slate-300 dark:text-slate-600" />
            <h3 className="text-sm font-black text-slate-700 dark:text-slate-300">
              Nenhum associado encontrado
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-sm mx-auto">
              {activeFiltersCount > 0
                ? 'Tente ajustar os filtros acima para encontrar o cadastro desejado.'
                : 'Clique em "Importar do LDAP" ou "Novo Associado" para iniciar o cadastro.'}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-2xs">
            <table className="w-full text-left text-xs text-slate-600 dark:text-slate-300">
              <thead className="bg-slate-100/70 dark:bg-slate-800/80 text-[11px] font-black uppercase text-slate-700 dark:text-slate-300 border-b border-slate-200 dark:border-slate-700/60">
                <tr>
                  <th className="px-4 py-3">#</th>
                  <th className="px-4 py-3">Nome do Associado</th>
                  <th className="px-4 py-3">CPF / Contato</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Carteirinha (HRSJ)</th>
                  <th className="px-4 py-3">Admissão</th>
                  <th className="px-4 py-3 text-right">Ações</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-medium">
                {associates.map((assoc, index) => (
                  <tr
                    key={assoc.id}
                    className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition"
                  >
                    <td className="px-4 py-3.5 text-slate-400 font-bold">
                      #{startRecord + index}
                    </td>

                    <td className="px-4 py-3.5">
                      <div className="font-bold text-slate-900 dark:text-white text-sm">
                        {assoc.name}
                      </div>
                      <div className="text-[11px] text-slate-500 dark:text-slate-400">
                        {assoc.address}
                      </div>
                    </td>

                    <td className="px-4 py-3.5">
                      <div>
                        <strong className="text-slate-700 dark:text-slate-200">CPF:</strong>{' '}
                        <span className="font-mono">{assoc.cpf}</span>
                      </div>
                      <div className="text-[11px] text-slate-400">{assoc.email}</div>
                    </td>

                    <td className="px-4 py-3.5">
                      {assoc.active ? (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-black bg-emerald-100 text-emerald-800 dark:bg-emerald-950/80 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                          Ativo
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-black bg-rose-100 text-rose-800 dark:bg-rose-950/80 dark:text-rose-300 border border-rose-200 dark:border-rose-800">
                          Inativo
                        </span>
                      )}
                    </td>

                    <td className="px-4 py-3.5">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => handleToggleCard(assoc.id, assoc.cardRetrieved)}
                          className={`inline-flex items-center space-x-1 px-2.5 py-1 rounded-xl text-[10px] font-extrabold cursor-pointer transition ${
                            assoc.cardRetrieved
                              ? 'bg-blue-600 text-white hover:bg-blue-700'
                              : 'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300 hover:bg-amber-200 border border-amber-200 dark:border-amber-800'
                          }`}
                        >
                          {assoc.cardRetrieved ? (
                            <>
                              <CheckCircle2 className="w-3 h-3" />
                              <span>Retirou</span>
                            </>
                          ) : (
                            <>
                              <Clock className="w-3 h-3" />
                              <span>Pendente</span>
                            </>
                          )}
                        </button>

                        {assoc.cardNumber && (
                          <span className="font-mono text-[10px] font-bold px-2 py-0.5 bg-slate-100 dark:bg-slate-800 text-blue-600 dark:text-blue-400 rounded-lg border border-slate-200 dark:border-slate-700">
                            {assoc.cardNumber}
                          </span>
                        )}
                      </div>
                    </td>

                    <td className="px-4 py-3.5 text-slate-500 font-medium">
                      {formatDate(assoc.admissionDate)}
                    </td>

                    <td className="px-4 py-3.5 text-right">
                      <div className="flex items-center justify-end space-x-1.5">
                        <button
                          onClick={() => setSelectedAssociateForView(assoc)}
                          title="Visualizar detalhes"
                          className="p-1.5 text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 rounded-lg cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>

                        <button
                          onClick={() => {
                            setEditingAssociate(assoc);
                            setIsModalOpen(true);
                          }}
                          title="Editar associado"
                          className="p-1.5 text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400 rounded-lg cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>

                        <button
                          onClick={() => handleDelete(assoc.id, assoc.name)}
                          title="Remover associado"
                          className="p-1.5 text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 rounded-lg cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* PAGINATION CONTROLS BAR */}
        {!loading && total > 0 && (
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2 border-t border-slate-100 dark:border-slate-800">
            {/* Page Size Selector */}
            <div className="flex items-center space-x-2 text-xs text-slate-500 dark:text-slate-400 font-medium">
              <span>Exibir por página:</span>
              <select
                value={limit}
                onChange={(e) => {
                  setLimit(Number(e.target.value));
                  setPage(1);
                }}
                className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-2.5 py-1 text-xs font-bold text-slate-700 dark:text-slate-200 focus:outline-none cursor-pointer"
              >
                <option value={10}>10</option>
                <option value={25}>25</option>
                <option value={50}>50</option>
                <option value={100}>100</option>
              </select>
            </div>

            {/* Page Navigation Buttons */}
            <div className="flex items-center space-x-1">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="p-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer transition flex items-center space-x-1 text-xs font-bold"
              >
                <ChevronLeft className="w-4 h-4" />
                <span className="hidden sm:inline">Anterior</span>
              </button>

              <div className="flex items-center space-x-1 px-1">
                {getPageNumbers().map((p, idx) => (
                  <button
                    key={idx}
                    disabled={typeof p !== 'number'}
                    onClick={() => typeof p === 'number' && setPage(p)}
                    className={`w-8 h-8 rounded-xl text-xs font-extrabold cursor-pointer transition flex items-center justify-center ${
                      p === page
                        ? 'bg-blue-600 text-white shadow-xs'
                        : typeof p === 'number'
                        ? 'bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700'
                        : 'text-slate-400 cursor-default'
                    }`}
                  >
                    {p}
                  </button>
                ))}
              </div>

              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page >= totalPages}
                className="p-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer transition flex items-center space-x-1 text-xs font-bold"
              >
                <span className="hidden sm:inline">Próximo</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* View Detail Modal for Associate */}
      {selectedAssociateForView && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 max-w-md w-full border border-slate-200 dark:border-slate-800 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <h3 className="text-base font-extrabold text-slate-900 dark:text-white">
                Detalhes do Associado
              </h3>
              <button
                onClick={() => setSelectedAssociateForView(null)}
                className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-2 text-xs text-slate-700 dark:text-slate-300">
              <p><strong className="text-slate-900 dark:text-white">Nome:</strong> {selectedAssociateForView.name}</p>
              <p><strong className="text-slate-900 dark:text-white">CPF:</strong> {selectedAssociateForView.cpf}</p>
              <p><strong className="text-slate-900 dark:text-white">E-mail:</strong> {selectedAssociateForView.email}</p>
              <p><strong className="text-slate-900 dark:text-white">Telefone:</strong> {selectedAssociateForView.phone || '-'}</p>
              <p><strong className="text-slate-900 dark:text-white">Data Nascimento:</strong> {formatDate(selectedAssociateForView.birthDate)}</p>
              <p><strong className="text-slate-900 dark:text-white">Endereço:</strong> {selectedAssociateForView.address}</p>
              <p><strong className="text-slate-900 dark:text-white">Admissão HRSJ:</strong> {formatDate(selectedAssociateForView.admissionDate)}</p>
              <p><strong className="text-slate-900 dark:text-white">Entrada Associação:</strong> {formatDate(selectedAssociateForView.associationDate)}</p>
              <p><strong className="text-slate-900 dark:text-white">Nº Carteirinha:</strong> {selectedAssociateForView.cardNumber || '-'}</p>
              <p><strong className="text-slate-900 dark:text-white">Retirou Carteira:</strong> {selectedAssociateForView.cardRetrieved ? `Sim (em ${formatDate(selectedAssociateForView.cardRetrievedAt)})` : 'Não (Pendente)'}</p>
            </div>

            <div className="pt-2 text-right">
              <button
                onClick={() => setSelectedAssociateForView(null)}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-md cursor-pointer"
              >
                Fechar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit/Create Associate Modal */}
      <AssociateModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingAssociate(null);
        }}
        onSave={handleSave}
        associateToEdit={editingAssociate}
      />

      {/* LDAP Import Modal */}
      <LdapSearchModal
        isOpen={isLdapModalOpen}
        onClose={() => setIsLdapModalOpen(false)}
        onAssociateRegistered={() => {
          fetchAssociates();
        }}
      />
    </div>
  );
};

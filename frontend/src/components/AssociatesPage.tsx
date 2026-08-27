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

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAssociate, setEditingAssociate] = useState<Associate | null>(null);
  const [selectedAssociateForView, setSelectedAssociateForView] = useState<Associate | null>(null);

  // LDAP Search Modal
  const [isLdapModalOpen, setIsLdapModalOpen] = useState(false);

  const fetchAssociates = async () => {
    setLoading(true);
    try {
      const activeParam = activeFilter === 'all' ? undefined : activeFilter === 'active';
      const cardParam = cardFilter === 'all' ? undefined : cardFilter === 'retrieved';
      const data = await api.getAssociates({
        search,
        active: activeParam,
        cardRetrieved: cardParam,
      });
      setAssociates(data);
    } catch (err) {
      console.error('Erro ao buscar associados:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchAssociates();
    }, 250);
    return () => clearTimeout(timer);
  }, [search, activeFilter, cardFilter]);

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

  const activeFiltersCount = (search ? 1 : 0) + (activeFilter !== 'all' ? 1 : 0) + (cardFilter !== 'all' ? 1 : 0);

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
            <span>Cadastrar do LDAP</span>
          </button>
        </div>
      </div>

      {/* Filter Card Container */}
      <div className="bg-slate-50/80 dark:bg-slate-800/40 p-4 rounded-2xl border border-slate-200/80 dark:border-slate-700/60 space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center space-x-2">
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
          </div>

          {activeFiltersCount > 0 && (
            <button
              onClick={clearFilters}
              className="flex items-center space-x-1 px-3 py-1 rounded-xl text-xs font-bold text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 border border-rose-200 dark:border-rose-900/60 transition cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
              <span>Limpar</span>
            </button>
          )}
        </div>

        {/* Search Bar Input inside Filter */}
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Buscar associado por nome, CPF ou número da carteirinha..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-medium text-slate-800 dark:text-slate-100 focus:ring-2 focus:ring-blue-500 focus:outline-none placeholder:text-slate-400"
          />
        </div>
      </div>

      {/* Count & Refresh Actions Bar */}
      <div className="flex items-center justify-between text-xs">
        <span className="font-extrabold text-slate-800 dark:text-slate-200">
          {associates.length} associados exibidos
        </span>

        <button
          onClick={fetchAssociates}
          className="flex items-center space-x-1.5 px-3 py-1.5 bg-white dark:bg-slate-800 border border-blue-200 dark:border-blue-900/60 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-950/40 rounded-xl font-bold transition shadow-2xs cursor-pointer"
        >
          <RotateCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          <span>Atualizar</span>
        </button>
      </div>

      {/* Table Box */}
      <div className="border border-slate-200/80 dark:border-slate-800 rounded-2xl overflow-hidden shadow-xs">
        <div className="bg-slate-50/70 dark:bg-slate-800/40 px-5 py-3 border-b border-slate-200/80 dark:border-slate-800">
          <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
            Total: {associates.length} associados no banco da Central
          </span>
        </div>

        {loading ? (
          <div className="p-12 text-center text-slate-400">
            <RotateCw className="w-7 h-7 animate-spin mx-auto mb-2 text-blue-600" />
            <p className="text-xs font-semibold">Carregando dados...</p>
          </div>
        ) : associates.length === 0 ? (
          <div className="p-12 text-center text-slate-500">
            <Users className="w-10 h-10 mx-auto mb-2 text-slate-300 dark:text-slate-700" />
            <p className="text-sm font-bold text-slate-700 dark:text-slate-300">
              Nenhum associado encontrado no banco de dados.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                  <th className="py-3 px-4 w-12 text-center">#</th>
                  <th className="py-3 px-4">Nome do Associado</th>
                  <th className="py-3 px-4">CPF / Contato</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Carteirinha (HRSJ)</th>
                  <th className="py-3 px-4">Admissão</th>
                  <th className="py-3 px-4 text-center">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-medium text-slate-700 dark:text-slate-300">
                {associates.map((associate, index) => (
                  <tr key={associate.id} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40 transition">
                    {/* Index Badge */}
                    <td className="py-3.5 px-4 text-center">
                      <span className="bg-[#3b82f6] text-white font-mono font-bold text-[11px] px-2 py-0.5 rounded-lg shadow-2xs">
                        #{index + 1}
                      </span>
                    </td>

                    {/* Nome */}
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-slate-900 dark:text-white text-sm">
                        {associate.name}
                      </div>
                      <div className="text-[11px] text-slate-400 max-w-xs truncate" title={associate.address}>
                        {associate.address}
                      </div>
                    </td>

                    {/* CPF & Contato */}
                    <td className="py-3.5 px-4">
                      <div className="font-mono text-slate-800 dark:text-slate-200 font-semibold">
                        CPF: {associate.cpf}
                      </div>
                      <div className="text-[11px] text-slate-500 dark:text-slate-400">
                        {associate.email}
                      </div>
                    </td>

                    {/* Status Pill */}
                    <td className="py-3.5 px-4">
                      <span
                        className={`inline-flex items-center px-3 py-1 rounded-full text-[11px] font-bold ${
                          associate.active
                            ? 'bg-amber-100/80 text-amber-900 dark:bg-amber-950/60 dark:text-amber-300 border border-amber-200/80 dark:border-amber-800/60'
                            : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400 border border-slate-200'
                        }`}
                      >
                        {associate.active ? 'Ativo' : 'Inativo'}
                      </span>
                    </td>

                    {/* Carteirinha Pill */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => handleToggleCard(associate.id, associate.cardRetrieved)}
                          className={`inline-flex items-center space-x-1.5 px-3 py-1 rounded-full text-[11px] font-extrabold transition cursor-pointer ${
                            associate.cardRetrieved
                              ? 'bg-sky-600 text-white hover:bg-sky-700 shadow-2xs'
                              : 'bg-rose-100 text-rose-700 hover:bg-rose-200 border border-rose-200'
                          }`}
                          title="Clique para alternar entrega da carteirinha"
                        >
                          {associate.cardRetrieved ? (
                            <>
                              <CheckCircle2 className="w-3 h-3" />
                              <span>Retirou</span>
                            </>
                          ) : (
                            <>
                              <Clock className="w-3 h-3 text-rose-600" />
                              <span>Pendente</span>
                            </>
                          )}
                        </button>

                        {associate.cardNumber && (
                          <span className="bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 font-mono text-[11px] font-bold px-2 py-0.5 rounded-lg border border-indigo-200 dark:border-indigo-800/60">
                            {associate.cardNumber}
                          </span>
                        )}
                      </div>
                    </td>

                    {/* Admissão */}
                    <td className="py-3.5 px-4 font-mono text-[11px] text-slate-600 dark:text-slate-400">
                      {formatDate(associate.admissionDate)}
                    </td>

                    {/* Ações */}
                    <td className="py-3.5 px-4 text-center">
                      <div className="flex items-center justify-center space-x-1.5">
                        <button
                          onClick={() => setSelectedAssociateForView(associate)}
                          className="p-1.5 rounded-full bg-sky-100 text-sky-700 hover:bg-sky-200 transition cursor-pointer"
                          title="Visualizar detalhes"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>

                        <button
                          onClick={() => {
                            setEditingAssociate(associate);
                            setIsModalOpen(true);
                          }}
                          className="p-1.5 rounded-full bg-blue-100 text-blue-700 hover:bg-blue-200 transition cursor-pointer"
                          title="Editar"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>

                        <button
                          onClick={() => handleDelete(associate.id, associate.name)}
                          className="p-1.5 rounded-full bg-rose-100 text-rose-700 hover:bg-rose-200 transition cursor-pointer"
                          title="Remover"
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

import React, { useState } from 'react';
import {
  Search,
  UserCheck,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  RotateCw,
  X,
  Users,
  Download,
} from 'lucide-react';
import { api } from '../lib/api';
import type { LdapUserSearchResult } from '../types';

interface LdapSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAssociateRegistered?: () => void;
}

export const LdapSearchModal: React.FC<LdapSearchModalProps> = ({
  isOpen,
  onClose,
  onAssociateRegistered,
}) => {
  const [activeTab, setActiveTab] = useState<'search' | 'bulk'>('search');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [searchResults, setSearchResults] = useState<LdapUserSearchResult[]>([]);
  const [hasSearched, setHasSearched] = useState(false);

  // Selected LDAP user for confirmation form
  const [selectedUser, setSelectedUser] = useState<LdapUserSearchResult | null>(null);

  // Editable confirmation form before saving into associates table
  const [confirmForm, setConfirmForm] = useState({
    name: '',
    cpf: '',
    email: '',
    phone: '',
    address: '',
    birthDate: '',
    admissionDate: '',
    associationDate: '',
    cardNumber: '',
  });

  // Bulk import state
  const [importingAll, setImportingAll] = useState(false);
  const [importStats, setImportStats] = useState<{
    totalLdap: number;
    imported: number;
    skipped: number;
    reactivated: number;
    errors: string[];
  } | null>(null);

  const [registering, setRegistering] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSearch = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!searchQuery.trim()) return;

    setLoading(true);
    setErrorMsg(null);
    setSuccessMsg(null);
    try {
      const results = await api.searchLdap(searchQuery.trim());
      setSearchResults(results);
      setHasSearched(true);
    } catch (err: any) {
      setErrorMsg(err.message || 'Erro ao realizar busca no LDAP.');
    } finally {
      setLoading(false);
    }
  };

  const handleSelectUserForConfirmation = (user: LdapUserSearchResult) => {
    const today = new Date().toISOString().substring(0, 10);
    setSelectedUser(user);
    setConfirmForm({
      name: user.nome_completo || '',
      cpf: user.cpf || '',
      email: user.email || '',
      phone: user.telefone || '',
      address: user.departamento ? `Departamento: ${user.departamento}` : 'Hospital Regional São Jerônimo',
      birthDate: '1990-01-01',
      admissionDate: today,
      associationDate: today,
      cardNumber: '',
    });
    setErrorMsg(null);
  };

  const handleConfirmRegisterAsAssociate = async () => {
    if (!selectedUser) return;

    setRegistering(true);
    setErrorMsg(null);
    setSuccessMsg(null);

    try {
      await api.createAssociate({
        name: confirmForm.name,
        cpf: confirmForm.cpf,
        email: confirmForm.email,
        phone: confirmForm.phone || undefined,
        address: confirmForm.address || 'Hospital Regional São Jerônimo',
        birthDate: confirmForm.birthDate || '1990-01-01',
        admissionDate: confirmForm.admissionDate || new Date().toISOString().substring(0, 10),
        associationDate: confirmForm.associationDate || new Date().toISOString().substring(0, 10),
        cardNumber: confirmForm.cardNumber || undefined,
        active: true,
        cardRetrieved: false,
      });

      setSuccessMsg(`Usuário "${confirmForm.name}" foi cadastrado com sucesso no Quadro de Associados!`);
      setSelectedUser(null);
      if (onAssociateRegistered) onAssociateRegistered();
    } catch (err: any) {
      setErrorMsg(err.message || 'Erro ao cadastrar membro na associação.');
    } finally {
      setRegistering(false);
    }
  };

  const handleImportAll = async () => {
    setImportingAll(true);
    setErrorMsg(null);
    setSuccessMsg(null);
    setImportStats(null);

    try {
      const stats = await api.importAllLdapUsers();
      setImportStats(stats);
      setSuccessMsg(
        `Importação concluída com sucesso! ${stats.imported} novo(s) associado(s) cadastrado(s), ${stats.skipped} mantido(s) e ${stats.reactivated} reativado(s).`
      );
      if (onAssociateRegistered) onAssociateRegistered();
    } catch (err: any) {
      setErrorMsg(err.message || 'Erro ao realizar importação em lote do LDAP.');
    } finally {
      setImportingAll(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 max-w-2xl w-full border border-slate-200 dark:border-slate-800 shadow-2xl space-y-6 my-8">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 bg-blue-100 dark:bg-blue-950/80 rounded-2xl text-blue-600 dark:text-blue-400">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-black text-slate-900 dark:text-white">
                Importar Membros do LDAP (OU=HRSJ)
              </h3>
              <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
                Consulte usuários individualmente ou importe todos os colaboradores da pasta HRSJ do LDAP em lote.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-xl cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tabs navigation (Search vs Bulk) */}
        {!selectedUser && (
          <div className="flex border-b border-slate-200 dark:border-slate-800">
            <button
              onClick={() => { setActiveTab('search'); setErrorMsg(null); setSuccessMsg(null); }}
              className={`flex items-center space-x-2 px-4 py-2.5 text-xs font-extrabold border-b-2 transition cursor-pointer ${
                activeTab === 'search'
                  ? 'border-blue-600 text-blue-600 dark:text-blue-400'
                  : 'border-transparent text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
              }`}
            >
              <Search className="w-4 h-4" />
              <span>Busca Individual</span>
            </button>

            <button
              onClick={() => { setActiveTab('bulk'); setErrorMsg(null); setSuccessMsg(null); }}
              className={`flex items-center space-x-2 px-4 py-2.5 text-xs font-extrabold border-b-2 transition cursor-pointer ${
                activeTab === 'bulk'
                  ? 'border-blue-600 text-blue-600 dark:text-blue-400'
                  : 'border-transparent text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
              }`}
            >
              <Users className="w-4 h-4" />
              <span>Importar Todos (Em Lote)</span>
            </button>
          </div>
        )}

        {/* Notifications */}
        {errorMsg && (
          <div className="flex items-center space-x-2.5 p-3.5 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/60 text-rose-700 dark:text-rose-300 rounded-2xl text-xs font-semibold">
            <AlertCircle className="w-4 h-4 flex-shrink-0 text-rose-500" />
            <span>{errorMsg}</span>
          </div>
        )}

        {successMsg && (
          <div className="flex items-center space-x-2.5 p-3.5 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900/60 text-emerald-700 dark:text-emerald-300 rounded-2xl text-xs font-semibold">
            <CheckCircle2 className="w-4 h-4 flex-shrink-0 text-emerald-500" />
            <span>{successMsg}</span>
          </div>
        )}

        {/* TAB 1: SEARCH INDIVIDUAL USER */}
        {activeTab === 'search' && !selectedUser && (
          <>
            <form onSubmit={handleSearch} className="space-y-3">
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                Informe o Nome ou o CPF do Usuário no LDAP:
              </label>
              <div className="flex items-center space-x-2">
                <div className="relative flex-1">
                  <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Ex: Fulano de Tal ou 123456 (CPF)..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-medium text-slate-800 dark:text-slate-100 focus:ring-2 focus:ring-blue-500 focus:outline-none placeholder:text-slate-400"
                  />
                </div>
                <button
                  type="submit"
                  disabled={loading || !searchQuery.trim()}
                  className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white text-xs font-extrabold rounded-xl shadow-xs transition flex items-center space-x-1.5 cursor-pointer"
                >
                  {loading ? (
                    <RotateCw className="w-4 h-4 animate-spin" />
                  ) : (
                    <Search className="w-4 h-4" />
                  )}
                  <span>Buscar no LDAP</span>
                </button>
              </div>
            </form>

            <div className="space-y-3">
              {loading ? (
                <div className="p-8 text-center text-slate-400">
                  <RotateCw className="w-6 h-6 animate-spin mx-auto mb-2 text-blue-600" />
                  <p className="text-xs font-semibold">Consultando diretório LDAP...</p>
                </div>
              ) : hasSearched && searchResults.length === 0 ? (
                <div className="p-8 text-center bg-slate-50 dark:bg-slate-800/40 rounded-2xl border border-slate-200 dark:border-slate-800">
                  <UserCheck className="w-8 h-8 mx-auto mb-2 text-slate-400" />
                  <p className="text-xs font-bold text-slate-700 dark:text-slate-300">
                    Nenhum usuário ativo com este Nome/CPF foi encontrado no LDAP.
                  </p>
                </div>
              ) : searchResults.length > 0 ? (
                <div className="space-y-3 max-h-72 overflow-y-auto pr-1">
                  <p className="text-xs font-extrabold text-slate-700 dark:text-slate-300">
                    {searchResults.length} usuário(s) ativo(s) encontrado(s):
                  </p>

                  {searchResults.map((user) => (
                    <div
                      key={user.username}
                      className="p-4 bg-slate-50/90 dark:bg-slate-800/60 rounded-2xl border border-slate-200/80 dark:border-slate-700/60 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 hover:border-blue-300 dark:hover:border-blue-700 transition"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center space-x-2">
                          <span className="font-bold text-sm text-slate-900 dark:text-white">
                            {user.nome_completo}
                          </span>
                          <span className="bg-amber-100 text-amber-800 dark:bg-amber-950/70 dark:text-amber-300 text-[10px] font-black px-2 py-0.5 rounded-md border border-amber-200 dark:border-amber-800">
                            Ativo
                          </span>
                        </div>

                        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-600 dark:text-slate-300">
                          <span><strong className="text-slate-800 dark:text-slate-200">CPF:</strong> {user.cpf}</span>
                          <span><strong className="text-slate-800 dark:text-slate-200">Username:</strong> {user.username}</span>
                          <span><strong className="text-slate-800 dark:text-slate-200">Setor/Depto:</strong> {user.departamento || '-'}</span>
                        </div>

                        <div className="text-[11px] text-slate-400">
                          {user.email} {user.telefone ? `• ${user.telefone}` : ''}
                        </div>
                      </div>

                      <button
                        onClick={() => handleSelectUserForConfirmation(user)}
                        className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-xs transition flex items-center space-x-1.5 cursor-pointer whitespace-nowrap"
                      >
                        <UserCheck className="w-3.5 h-3.5" />
                        <span>Conferir & Associar</span>
                      </button>
                    </div>
                  ))}
                </div>
              ) : null}
            </div>
          </>
        )}

        {/* TAB 2: BULK IMPORT */}
        {activeTab === 'bulk' && !selectedUser && (
          <div className="space-y-4">
            <div className="p-5 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-2xl space-y-3">
              <div className="flex items-center space-x-3 text-slate-900 dark:text-white">
                <Download className="w-5 h-5 text-blue-600" />
                <h4 className="font-extrabold text-sm">Rotina de Importação em Massa</h4>
              </div>
              
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                Esta rotina busca <strong>todos os usuários ativos da pasta HRSJ no LDAP</strong> e realiza o cadastro automático na tabela de associados.
              </p>

              <div className="bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900/60 p-3 rounded-xl space-y-1.5 text-xs text-blue-900 dark:text-blue-300">
                <p className="font-bold flex items-center space-x-1.5">
                  <CheckCircle2 className="w-4 h-4 text-blue-600" />
                  <span>Estratégia de Execução & Anti-Duplicação:</span>
                </p>
                <ul className="list-disc list-inside space-y-1 pl-1 font-medium text-[11px] text-slate-700 dark:text-slate-300">
                  <li><strong>Usuários já cadastrados (CPF/E-mail)</strong>: São mantidos sem duplicação ou alteração.</li>
                  <li><strong>Cadastros inativos com mesmo CPF</strong>: São reativados automaticamente.</li>
                  <li><strong>Setor/Departamento</strong>: Extraído automaticamente da OU no LDAP (ex: <em>Tecnologia Da Informacao</em>).</li>
                </ul>
              </div>

              <div className="pt-2 text-right">
                <button
                  onClick={handleImportAll}
                  disabled={importingAll}
                  className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white text-xs font-extrabold rounded-xl shadow-md transition flex items-center space-x-2 cursor-pointer ml-auto"
                >
                  {importingAll ? (
                    <>
                      <RotateCw className="w-4 h-4 animate-spin" />
                      <span>Processando Importação em Lote...</span>
                    </>
                  ) : (
                    <>
                      <Download className="w-4 h-4" />
                      <span>Iniciar Importação de Todos os Usuários</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Import Statistics Result */}
            {importStats && (
              <div className="p-5 bg-emerald-50/70 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-900/60 rounded-2xl space-y-3">
                <h4 className="font-black text-xs uppercase tracking-wider text-emerald-900 dark:text-emerald-300 flex items-center space-x-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Resumo do Processamento em Lote</span>
                </h4>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
                  <div className="bg-white dark:bg-slate-800 p-3 rounded-xl border border-slate-200 dark:border-slate-700">
                    <span className="block text-lg font-black text-slate-900 dark:text-white">{importStats.totalLdap}</span>
                    <span className="text-[10px] font-bold text-slate-500 uppercase">Total no LDAP</span>
                  </div>

                  <div className="bg-white dark:bg-slate-800 p-3 rounded-xl border border-emerald-200 dark:border-emerald-900">
                    <span className="block text-lg font-black text-emerald-600 dark:text-emerald-400">{importStats.imported}</span>
                    <span className="text-[10px] font-bold text-emerald-700 dark:text-emerald-300 uppercase">Novos Importados</span>
                  </div>

                  <div className="bg-white dark:bg-slate-800 p-3 rounded-xl border border-slate-200 dark:border-slate-700">
                    <span className="block text-lg font-black text-blue-600 dark:text-blue-400">{importStats.skipped}</span>
                    <span className="text-[10px] font-bold text-slate-500 uppercase">Já Existentes</span>
                  </div>

                  <div className="bg-white dark:bg-slate-800 p-3 rounded-xl border border-amber-200 dark:border-amber-900">
                    <span className="block text-lg font-black text-amber-600 dark:text-amber-400">{importStats.reactivated}</span>
                    <span className="text-[10px] font-bold text-amber-700 dark:text-amber-300 uppercase">Reativados</span>
                  </div>
                </div>

                {importStats.errors.length > 0 && (
                  <div className="mt-3 p-3 bg-rose-50 dark:bg-rose-950/40 rounded-xl text-xs text-rose-700 dark:text-rose-300">
                    <p className="font-bold mb-1">Erros Ocorridos ({importStats.errors.length}):</p>
                    <ul className="list-disc list-inside space-y-1 text-[11px]">
                      {importStats.errors.map((err, idx) => (
                        <li key={idx}>{err}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* STEP 2: Confirmation & Editing before Saving to Associates Table */}
        {selectedUser && (
          <div className="p-5 bg-blue-50/50 dark:bg-blue-950/20 border-2 border-blue-200 dark:border-blue-900/60 rounded-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-blue-200/60 dark:border-blue-900/40 pb-2.5">
              <h4 className="text-xs font-black uppercase tracking-wider text-blue-900 dark:text-blue-300 flex items-center space-x-1.5">
                <CheckCircle2 className="w-4 h-4 text-blue-600" />
                <span>Conferência dos Dados para o Quadro de Associados</span>
              </h4>
              <button
                onClick={() => setSelectedUser(null)}
                className="text-[11px] font-bold text-slate-500 hover:text-slate-700 dark:hover:text-slate-200"
              >
                Voltar
              </button>
            </div>

            <p className="text-xs font-medium text-slate-600 dark:text-slate-300">
              Confira ou edite as informações puxadas do LDAP antes de gravar o membro na tabela de associados do banco de dados:
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Nome Completo *</label>
                <input
                  type="text"
                  value={confirmForm.name}
                  onChange={(e) => setConfirmForm({ ...confirmForm, name: e.target.value })}
                  className="w-full px-3 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-bold text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">CPF *</label>
                <input
                  type="text"
                  value={confirmForm.cpf}
                  onChange={(e) => setConfirmForm({ ...confirmForm, cpf: e.target.value })}
                  className="w-full px-3 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-mono font-bold text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">E-mail *</label>
                <input
                  type="email"
                  value={confirmForm.email}
                  onChange={(e) => setConfirmForm({ ...confirmForm, email: e.target.value })}
                  className="w-full px-3 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-medium text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Telefone / WhatsApp</label>
                <input
                  type="text"
                  value={confirmForm.phone}
                  onChange={(e) => setConfirmForm({ ...confirmForm, phone: e.target.value })}
                  className="w-full px-3 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-medium text-slate-900 dark:text-white"
                  placeholder="(00) 00000-0000"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Endereço / Departamento</label>
                <input
                  type="text"
                  value={confirmForm.address}
                  onChange={(e) => setConfirmForm({ ...confirmForm, address: e.target.value })}
                  className="w-full px-3 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-medium text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Nº Carteirinha (Opcional)</label>
                <input
                  type="text"
                  value={confirmForm.cardNumber}
                  onChange={(e) => setConfirmForm({ ...confirmForm, cardNumber: e.target.value })}
                  className="w-full px-3 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-mono font-medium text-slate-900 dark:text-white"
                  placeholder="Ex: HRSJ-2026-001"
                />
              </div>
            </div>

            <div className="flex items-center justify-end space-x-3 pt-2">
              <button
                onClick={() => setSelectedUser(null)}
                className="px-4 py-2 bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-bold rounded-xl cursor-pointer hover:bg-slate-300 dark:hover:bg-slate-700 transition"
              >
                Cancelar
              </button>

              <button
                onClick={handleConfirmRegisterAsAssociate}
                disabled={registering}
                className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white text-xs font-extrabold rounded-xl shadow-md transition flex items-center space-x-1.5 cursor-pointer"
              >
                {registering ? (
                  <RotateCw className="w-4 h-4 animate-spin" />
                ) : (
                  <CheckCircle2 className="w-4 h-4" />
                )}
                <span>Salvar no Quadro de Associados</span>
              </button>
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="pt-2 text-right">
          <button
            onClick={onClose}
            className="px-5 py-2.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-bold rounded-xl transition cursor-pointer"
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
};

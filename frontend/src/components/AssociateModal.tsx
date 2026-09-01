import React, { useState, useEffect } from 'react';
import { X, UserCheck, AlertCircle, CreditCard, Mail, Phone, MapPin, User } from 'lucide-react';

import type { Associate } from '../types';

interface AssociateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: Partial<Associate>) => Promise<void>;
  associateToEdit?: Associate | null;
}

export const AssociateModal: React.FC<AssociateModalProps> = ({
  isOpen,
  onClose,
  onSave,
  associateToEdit,
}) => {
  const [formData, setFormData] = useState({
    name: '',
    cpf: '',
    email: '',
    phone: '',
    birthDate: '',
    address: '',
    admissionDate: '',
    associationDate: '',
    cardNumber: '',
    cardRetrieved: false,
    active: true,
  });

  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (associateToEdit) {
      setFormData({
        name: associateToEdit.name || '',
        cpf: associateToEdit.cpf || '',
        email: associateToEdit.email || '',
        phone: associateToEdit.phone || '',
        birthDate: associateToEdit.birthDate ? associateToEdit.birthDate.substring(0, 10) : '',
        address: associateToEdit.address || '',
        admissionDate: associateToEdit.admissionDate ? associateToEdit.admissionDate.substring(0, 10) : '',
        associationDate: associateToEdit.associationDate ? associateToEdit.associationDate.substring(0, 10) : '',
        cardNumber: associateToEdit.cardNumber || '',
        cardRetrieved: Boolean(associateToEdit.cardRetrieved),
        active: Boolean(associateToEdit.active),
      });
    } else {
      const today = new Date().toISOString().substring(0, 10);
      setFormData({
        name: '',
        cpf: '',
        email: '',
        phone: '',
        birthDate: '',
        address: '',
        admissionDate: today,
        associationDate: today,
        cardNumber: '',
        cardRetrieved: false,
        active: true,
      });
    }
    setError(null);
  }, [associateToEdit, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      await onSave(formData);
      onClose();
    } catch (err: any) {
      setError(err.message || 'Ocorreu um erro ao salvar o associado.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs transition-opacity animate-in fade-in duration-200">
      <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200/80 dark:border-slate-800 w-full max-w-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4.5 border-b border-slate-100 dark:border-slate-800/80 bg-slate-50/50 dark:bg-slate-800/40">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center border border-emerald-200/60 dark:border-emerald-800/40">
              <UserCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-extrabold text-slate-900 dark:text-white">
                {associateToEdit ? 'Editar Dados do Associado' : 'Novo Cadastro de Associado'}
              </h3>
              <p className="text-xs text-slate-400">
                {associateToEdit ? 'Atualize as informações cadastrais abaixo' : 'Preencha os campos para associar um novo funcionário'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body Form */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-5 flex-1 text-xs">
          {error && (
            <div className="p-3.5 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/60 text-rose-700 dark:text-rose-300 rounded-2xl text-xs flex items-center space-x-2.5">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
              <span className="font-medium">{error}</span>
            </div>
          )}

          {/* Seção 1: Dados Pessoais */}
          <div className="space-y-3">
            <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 flex items-center space-x-1.5">
              <User className="w-3.5 h-3.5" />
              <span>Informações Pessoais</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
              {/* Nome */}
              <div className="md:col-span-2">
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Nome Completo *
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:bg-white dark:focus:bg-slate-900 focus:outline-none text-slate-900 dark:text-white transition font-medium"
                  placeholder="Ex: Maria da Silva Santos"
                />
              </div>

              {/* CPF */}
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  CPF
                </label>
                <input
                  type="text"
                  value={formData.cpf}
                  onChange={(e) => setFormData({ ...formData, cpf: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:bg-white dark:focus:bg-slate-900 focus:outline-none text-slate-900 dark:text-white transition font-mono font-medium"
                  placeholder="000.000.000-00"
                />
              </div>

              {/* Data Nascimento */}
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Data de Nascimento
                </label>
                <input
                  type="date"
                  value={formData.birthDate}
                  onChange={(e) => setFormData({ ...formData, birthDate: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:bg-white dark:focus:bg-slate-900 focus:outline-none text-slate-900 dark:text-white transition font-medium"
                />
              </div>

              {/* E-mail */}
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  E-mail
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full pl-9 pr-3.5 py-2.5 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:bg-white dark:focus:bg-slate-900 focus:outline-none text-slate-900 dark:text-white transition font-medium"
                    placeholder="nome@exemplo.com"
                  />
                </div>
              </div>

              {/* Telefone */}
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Telefone / WhatsApp
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full pl-9 pr-3.5 py-2.5 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:bg-white dark:focus:bg-slate-900 focus:outline-none text-slate-900 dark:text-white transition font-medium"
                    placeholder="(48) 99999-9999"
                  />
                </div>
              </div>

              {/* Endereço */}
              <div className="md:col-span-2">
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Endereço / Setor
                </label>
                <div className="relative">
                  <MapPin className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    className="w-full pl-9 pr-3.5 py-2.5 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:bg-white dark:focus:bg-slate-900 focus:outline-none text-slate-900 dark:text-white transition font-medium"
                    placeholder="Setor ou Endereço"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Seção 2: Associação e Carteira */}
          <div className="space-y-3 pt-2 border-t border-slate-100 dark:border-slate-800/80">
            <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 flex items-center space-x-1.5">
              <CreditCard className="w-3.5 h-3.5" />
              <span>Vínculo e Carteirinha</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
              {/* Data Admissão HRSJ */}
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Data Admissão (HRSJ)
                </label>
                <input
                  type="date"
                  value={formData.admissionDate}
                  onChange={(e) => setFormData({ ...formData, admissionDate: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:bg-white dark:focus:bg-slate-900 focus:outline-none text-slate-900 dark:text-white transition font-medium"
                />
              </div>

              {/* Data Entrada Associação */}
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Data Entrada na Associação
                </label>
                <input
                  type="date"
                  value={formData.associationDate}
                  onChange={(e) => setFormData({ ...formData, associationDate: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:bg-white dark:focus:bg-slate-900 focus:outline-none text-slate-900 dark:text-white transition font-medium"
                />
              </div>

              {/* Nº Carteirinha */}
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Nº Carteirinha da Associação
                </label>
                <input
                  type="text"
                  value={formData.cardNumber}
                  onChange={(e) => setFormData({ ...formData, cardNumber: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:bg-white dark:focus:bg-slate-900 focus:outline-none text-slate-900 dark:text-white transition font-mono font-medium"
                  placeholder="Ex: HRSJ-2026-001"
                />
              </div>

              {/* Toggles */}
              <div className="flex flex-col justify-center space-y-2.5 pt-1">
                <label className="flex items-center space-x-2.5 cursor-pointer text-slate-700 dark:text-slate-300 font-semibold select-none">
                  <input
                    type="checkbox"
                    checked={formData.cardRetrieved}
                    onChange={(e) => setFormData({ ...formData, cardRetrieved: e.target.checked })}
                    className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500 border-slate-300 dark:border-slate-700 cursor-pointer"
                  />
                  <span>Já retirou a carteirinha física</span>
                </label>

                <label className="flex items-center space-x-2.5 cursor-pointer text-slate-700 dark:text-slate-300 font-semibold select-none">
                  <input
                    type="checkbox"
                    checked={formData.active}
                    onChange={(e) => setFormData({ ...formData, active: e.target.checked })}
                    className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500 border-slate-300 dark:border-slate-700 cursor-pointer"
                  />
                  <span>Manter cadastro ativo</span>
                </label>
              </div>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="flex items-center justify-end space-x-3 pt-4 border-t border-slate-100 dark:border-slate-800/80">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 text-xs font-bold text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition cursor-pointer"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-2.5 text-xs font-bold text-white bg-[#3b82f6] hover:bg-blue-600 rounded-xl shadow-md shadow-blue-500/20 transition disabled:opacity-50 cursor-pointer"
            >
              {isSubmitting ? 'Salvando...' : associateToEdit ? 'Salvar Alterações' : 'Confirmar Cadastro'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

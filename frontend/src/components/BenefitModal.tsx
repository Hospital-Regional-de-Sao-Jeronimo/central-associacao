import React, { useState, useEffect } from 'react';
import { X, Tag, AlertCircle, Building, MapPin, Phone, Globe, Image, Percent } from 'lucide-react';
import { BENEFIT_CATEGORY_LABELS } from '../types';
import type { BenefitCategory, PartnerBenefit } from '../types';

interface BenefitModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: Partial<PartnerBenefit>) => Promise<void>;
  benefitToEdit?: PartnerBenefit | null;
}

export const BenefitModal: React.FC<BenefitModalProps> = ({
  isOpen,
  onClose,
  onSave,
  benefitToEdit,
}) => {
  const [formData, setFormData] = useState({
    name: '',
    category: 'ALIMENTACAO' as BenefitCategory,
    discountPercentage: '',
    description: '',
    location: '',
    phone: '',
    website: '',
    imageUrl: '',
    active: true,
  });

  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (benefitToEdit) {
      setFormData({
        name: benefitToEdit.name || '',
        category: benefitToEdit.category || 'ALIMENTACAO',
        discountPercentage: benefitToEdit.discountPercentage || '',
        description: benefitToEdit.description || '',
        location: benefitToEdit.location || '',
        phone: benefitToEdit.phone || '',
        website: benefitToEdit.website || '',
        imageUrl: benefitToEdit.imageUrl || '',
        active: Boolean(benefitToEdit.active),
      });
    } else {
      setFormData({
        name: '',
        category: 'ALIMENTACAO',
        discountPercentage: '15% OFF',
        description: '',
        location: '',
        phone: '',
        website: '',
        imageUrl: '',
        active: true,
      });
    }
    setError(null);
  }, [benefitToEdit, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      await onSave(formData);
      onClose();
    } catch (err: any) {
      setError(err.message || 'Ocorreu um erro ao salvar o benefício.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs transition-opacity animate-in fade-in duration-200">
      <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200/80 dark:border-slate-800 w-full max-w-lg overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4.5 border-b border-slate-100 dark:border-slate-800/80 bg-slate-50/50 dark:bg-slate-800/40">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center border border-emerald-200/60 dark:border-emerald-800/40">
              <Tag className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-extrabold text-slate-900 dark:text-white">
                {benefitToEdit ? 'Editar Conveniado' : 'Novo Parceiro Conveniado'}
              </h3>
              <p className="text-xs text-slate-400">
                {benefitToEdit ? 'Atualize as informações do benefício' : 'Cadastre um novo parceiro para a associação'}
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
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-4 flex-1 text-xs">
          {error && (
            <div className="p-3.5 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/60 text-rose-700 dark:text-rose-300 rounded-2xl text-xs flex items-center space-x-2.5">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
              <span className="font-medium">{error}</span>
            </div>
          )}

          {/* Nome */}
          <div>
            <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
              Nome do Estabelecimento / Parceiro *
            </label>
            <div className="relative">
              <Building className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full pl-9 pr-3.5 py-2.5 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:bg-white dark:focus:bg-slate-900 focus:outline-none text-slate-900 dark:text-white transition font-medium"
                placeholder="Ex: Farmácia São José / Restaurante Sabor & Saúde"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
            {/* Categoria */}
            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                Categoria *
              </label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value as BenefitCategory })}
                className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:bg-white dark:focus:bg-slate-900 focus:outline-none text-slate-900 dark:text-white transition font-medium cursor-pointer"
              >
                {(Object.keys(BENEFIT_CATEGORY_LABELS) as BenefitCategory[]).map((catKey) => (
                  <option key={catKey} value={catKey}>
                    {BENEFIT_CATEGORY_LABELS[catKey].label}
                  </option>
                ))}
              </select>
            </div>

            {/* Desconto */}
            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                Desconto (% ou Regra) *
              </label>
              <div className="relative">
                <Percent className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-emerald-500" />
                <input
                  type="text"
                  required
                  value={formData.discountPercentage}
                  onChange={(e) => setFormData({ ...formData, discountPercentage: e.target.value })}
                  className="w-full pl-9 pr-3.5 py-2.5 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:bg-white dark:focus:bg-slate-900 focus:outline-none text-emerald-600 dark:text-emerald-400 font-extrabold transition"
                  placeholder="Ex: 20% OFF ou Até 30%"
                />
              </div>
            </div>
          </div>

          {/* Localização */}
          <div>
            <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
              Endereço / Localização *
            </label>
            <div className="relative">
              <MapPin className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                required
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                className="w-full pl-9 pr-3.5 py-2.5 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:bg-white dark:focus:bg-slate-900 focus:outline-none text-slate-900 dark:text-white transition font-medium"
                placeholder="Rua, Número - Bairro, Cidade"
              />
            </div>
          </div>

          {/* Telefone & Website */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
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

            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                Website / Rede Social
              </label>
              <div className="relative">
                <Globe className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="url"
                  value={formData.website}
                  onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                  className="w-full pl-9 pr-3.5 py-2.5 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:bg-white dark:focus:bg-slate-900 focus:outline-none text-slate-900 dark:text-white transition font-medium"
                  placeholder="https://instagram.com/parceiro"
                />
              </div>
            </div>
          </div>

          {/* Imagem / Logo */}
          <div>
            <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
              URL da Imagem / Logo
            </label>
            <div className="relative">
              <Image className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="url"
                value={formData.imageUrl}
                onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                className="w-full pl-9 pr-3.5 py-2.5 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:bg-white dark:focus:bg-slate-900 focus:outline-none text-slate-900 dark:text-white transition font-medium"
                placeholder="https://exemplo.com/logo.jpg"
              />
            </div>
          </div>

          {/* Descrição */}
          <div>
            <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
              Regras ou Descrição do Desconto
            </label>
            <textarea
              rows={3}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:bg-white dark:focus:bg-slate-900 focus:outline-none text-slate-900 dark:text-white transition font-medium"
              placeholder="Desconto válido mediante apresentação da carteirinha da associação física ou digital."
            />
          </div>

          {/* Checkbox Ativo */}
          <div className="pt-1">
            <label className="flex items-center space-x-2.5 cursor-pointer text-slate-700 dark:text-slate-300 font-semibold select-none">
              <input
                type="checkbox"
                checked={formData.active}
                onChange={(e) => setFormData({ ...formData, active: e.target.checked })}
                className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500 border-slate-300 dark:border-slate-700 cursor-pointer"
              />
              <span>Manter convênio ativo na vitrine</span>
            </label>
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
              {isSubmitting ? 'Salvando...' : benefitToEdit ? 'Salvar Alterações' : 'Confirmar Conveniado'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

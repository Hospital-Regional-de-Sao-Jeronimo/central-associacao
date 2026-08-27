import React, { useState, useEffect, useRef } from 'react';
import {
  X,
  Tag,
  AlertCircle,
  Building,
  MapPin,
  Phone,
  Globe,
  Image as ImageIcon,
  Percent,
  Upload,
  Trash2,
} from 'lucide-react';
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

  const [imageTab, setImageTab] = useState<'upload' | 'url'>('upload');
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [globalError, setGlobalError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

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
      if (benefitToEdit.imageUrl && !benefitToEdit.imageUrl.startsWith('data:')) {
        setImageTab('url');
      } else {
        setImageTab('upload');
      }
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
      setImageTab('upload');
    }
    setFieldErrors({});
    setGlobalError(null);
  }, [benefitToEdit, isOpen]);

  if (!isOpen) return null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setFieldErrors((prev) => ({
        ...prev,
        imageUrl: 'Selecione um arquivo de imagem válido (PNG, JPG, WebP).',
      }));
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setFieldErrors((prev) => ({
        ...prev,
        imageUrl: 'A imagem deve ter no máximo 5MB.',
      }));
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      const img = new Image();
      img.onload = () => {
        const MAX_WIDTH = 800;
        const MAX_HEIGHT = 800;
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > MAX_WIDTH) {
            height *= MAX_WIDTH / width;
            width = MAX_WIDTH;
          }
        } else {
          if (height > MAX_HEIGHT) {
            width *= MAX_HEIGHT / height;
            height = MAX_HEIGHT;
          }
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');

        if (ctx) {
          ctx.drawImage(img, 0, 0, width, height);
          const compressedDataUrl = canvas.toDataURL('image/jpeg', 0.85);
          setFormData((prev) => ({ ...prev, imageUrl: compressedDataUrl }));
        } else {
          setFormData((prev) => ({ ...prev, imageUrl: dataUrl }));
        }

        setFieldErrors((prev) => {
          const next = { ...prev };
          delete next.imageUrl;
          return next;
        });
      };
      img.src = dataUrl;
    };
    reader.readAsDataURL(file);
  };

  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};

    if (!formData.name.trim()) {
      errors.name = 'O nome do estabelecimento é obrigatório.';
    } else if (formData.name.trim().length < 3) {
      errors.name = 'O nome deve ter no mínimo 3 caracteres.';
    }

    if (!formData.discountPercentage.trim()) {
      errors.discountPercentage = 'O desconto ou regra é obrigatório.';
    }

    if (!formData.location.trim()) {
      errors.location = 'O endereço/localização é obrigatório.';
    } else if (formData.location.trim().length < 5) {
      errors.location = 'Informe um endereço mais detalhado.';
    }

    if (formData.website && formData.website.trim()) {
      let web = formData.website.trim();
      if (!web.startsWith('http://') && !web.startsWith('https://')) {
        web = `https://${web}`;
        setFormData((prev) => ({ ...prev, website: web }));
      }
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setGlobalError(null);

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      await onSave(formData);
      onClose();
    } catch (err: any) {
      setGlobalError(err.message || 'Ocorreu um erro ao salvar o parceiro conveniado.');
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
          
          {globalError && (
            <div className="p-3.5 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/60 text-rose-700 dark:text-rose-300 rounded-2xl text-xs flex items-center space-x-2.5">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
              <span className="font-medium">{globalError}</span>
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
                value={formData.name}
                onChange={(e) => {
                  setFormData({ ...formData, name: e.target.value });
                  if (fieldErrors.name) setFieldErrors((prev) => ({ ...prev, name: '' }));
                }}
                className={`w-full pl-9 pr-3.5 py-2.5 bg-slate-50 dark:bg-slate-800/60 border rounded-xl focus:ring-2 focus:bg-white dark:focus:bg-slate-900 focus:outline-none text-slate-900 dark:text-white transition font-medium ${
                  fieldErrors.name
                    ? 'border-rose-400 focus:ring-rose-500 bg-rose-50/20'
                    : 'border-slate-200 dark:border-slate-700 focus:ring-emerald-500'
                }`}
                placeholder="Ex: Farmácia São José / Restaurante Sabor & Saúde"
              />
            </div>
            {fieldErrors.name && (
              <span className="text-[11px] text-rose-500 font-bold mt-1 block">
                {fieldErrors.name}
              </span>
            )}
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
                  value={formData.discountPercentage}
                  onChange={(e) => {
                    setFormData({ ...formData, discountPercentage: e.target.value });
                    if (fieldErrors.discountPercentage) setFieldErrors((prev) => ({ ...prev, discountPercentage: '' }));
                  }}
                  className={`w-full pl-9 pr-3.5 py-2.5 bg-slate-50 dark:bg-slate-800/60 border rounded-xl focus:ring-2 focus:bg-white dark:focus:bg-slate-900 focus:outline-none text-emerald-600 dark:text-emerald-400 font-extrabold transition ${
                    fieldErrors.discountPercentage
                      ? 'border-rose-400 focus:ring-rose-500 bg-rose-50/20'
                      : 'border-slate-200 dark:border-slate-700 focus:ring-emerald-500'
                  }`}
                  placeholder="Ex: 15% OFF ou Até 30%"
                />
              </div>
              {fieldErrors.discountPercentage && (
                <span className="text-[11px] text-rose-500 font-bold mt-1 block">
                  {fieldErrors.discountPercentage}
                </span>
              )}
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
                value={formData.location}
                onChange={(e) => {
                  setFormData({ ...formData, location: e.target.value });
                  if (fieldErrors.location) setFieldErrors((prev) => ({ ...prev, location: '' }));
                }}
                className={`w-full pl-9 pr-3.5 py-2.5 bg-slate-50 dark:bg-slate-800/60 border rounded-xl focus:ring-2 focus:bg-white dark:focus:bg-slate-900 focus:outline-none text-slate-900 dark:text-white transition font-medium ${
                  fieldErrors.location
                    ? 'border-rose-400 focus:ring-rose-500 bg-rose-50/20'
                    : 'border-slate-200 dark:border-slate-700 focus:ring-emerald-500'
                }`}
                placeholder="Rua, Número - Bairro, Cidade"
              />
            </div>
            {fieldErrors.location && (
              <span className="text-[11px] text-rose-500 font-bold mt-1 block">
                {fieldErrors.location}
              </span>
            )}
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
                  type="text"
                  value={formData.website}
                  onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                  className="w-full pl-9 pr-3.5 py-2.5 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:bg-white dark:focus:bg-slate-900 focus:outline-none text-slate-900 dark:text-white transition font-medium"
                  placeholder="https://instagram.com/parceiro"
                />
              </div>
            </div>
          </div>

          {/* Imagem / Logo com Upload do Usuário */}
          <div className="space-y-2 pt-1 border-t border-slate-100 dark:border-slate-800/80">
            <div className="flex items-center justify-between">
              <label className="block font-bold text-slate-700 dark:text-slate-300">
                Imagem / Logo do Estabelecimento
              </label>
              
              {/* Tab Selector: File Upload vs URL */}
              <div className="flex items-center space-x-1 bg-slate-100 dark:bg-slate-800 p-0.5 rounded-lg text-[11px] font-bold">
                <button
                  type="button"
                  onClick={() => setImageTab('upload')}
                  className={`px-2.5 py-1 rounded-md transition cursor-pointer ${
                    imageTab === 'upload'
                      ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-400 shadow-2xs'
                      : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
                  }`}
                >
                  Fazer Upload
                </button>
                <button
                  type="button"
                  onClick={() => setImageTab('url')}
                  className={`px-2.5 py-1 rounded-md transition cursor-pointer ${
                    imageTab === 'url'
                      ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-400 shadow-2xs'
                      : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
                  }`}
                >
                  Link URL
                </button>
              </div>
            </div>

            {/* Upload Tab */}
            {imageTab === 'upload' && (
              <div>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  accept="image/png, image/jpeg, image/webp, image/gif"
                  className="hidden"
                />

                {formData.imageUrl ? (
                  <div className="relative rounded-2xl border border-slate-200 dark:border-slate-700 overflow-hidden bg-slate-50 dark:bg-slate-800 flex items-center justify-center p-2 group">
                    <img
                      src={formData.imageUrl}
                      alt="Preview"
                      className="max-h-32 object-contain rounded-xl"
                    />
                    <div className="absolute inset-0 bg-slate-950/40 opacity-0 group-hover:opacity-100 transition flex items-center justify-center space-x-2 backdrop-blur-2xs">
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="px-3 py-1.5 bg-white text-slate-800 text-xs font-bold rounded-xl hover:bg-slate-100 transition cursor-pointer"
                      >
                        Trocar Imagem
                      </button>
                      <button
                        type="button"
                        onClick={() => setFormData({ ...formData, imageUrl: '' })}
                        className="p-1.5 bg-rose-600 text-white rounded-xl hover:bg-rose-700 transition cursor-pointer"
                        title="Remover Imagem"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ) : (
                  <div
                    onClick={() => fileInputRef.current?.click()}
                    className="border-2 border-dashed border-slate-200 dark:border-slate-700 hover:border-blue-500 dark:hover:border-blue-500 rounded-2xl p-5 text-center cursor-pointer transition bg-slate-50/50 dark:bg-slate-800/30 hover:bg-blue-50/30 dark:hover:bg-blue-950/20 space-y-1.5"
                  >
                    <Upload className="w-7 h-7 mx-auto text-blue-500 opacity-80" />
                    <p className="font-extrabold text-slate-700 dark:text-slate-200">
                      Clique para selecionar uma imagem do computador
                    </p>
                    <p className="text-[11px] text-slate-400">
                      Formatos suportados: PNG, JPG, WebP ou GIF (máx. 5MB)
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* URL Tab */}
            {imageTab === 'url' && (
              <div>
                <div className="relative">
                  <ImageIcon className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="url"
                    value={formData.imageUrl}
                    onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                    className="w-full pl-9 pr-3.5 py-2.5 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:bg-white dark:focus:bg-slate-900 focus:outline-none text-slate-900 dark:text-white transition font-medium"
                    placeholder="https://exemplo.com/logo.jpg"
                  />
                </div>
                {formData.imageUrl && (
                  <div className="mt-2 p-2 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 flex items-center space-x-3">
                    <img src={formData.imageUrl} alt="Preview" className="w-10 h-10 object-cover rounded-lg" />
                    <span className="text-[11px] text-slate-500 truncate">Pré-visualização da URL</span>
                  </div>
                )}
              </div>
            )}

            {fieldErrors.imageUrl && (
              <span className="text-[11px] text-rose-500 font-bold mt-1 block">
                {fieldErrors.imageUrl}
              </span>
            )}
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

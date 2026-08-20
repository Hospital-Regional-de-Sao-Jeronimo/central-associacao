import React, { useState, useEffect } from 'react';
import {
  Plus,
  Search,
  MapPin,
  Phone,
  Globe,
  Tag,
  Edit3,
  Trash2,
  RotateCw,
  Sparkles,
  ExternalLink,
  Percent,
  Filter,
  X,
  Lock,
} from 'lucide-react';
import { BENEFIT_CATEGORY_LABELS } from '../types';
import type { BenefitCategory, PartnerBenefit } from '../types';
import { api } from '../lib/api';
import { BenefitModal } from './BenefitModal';

interface BenefitsPageProps {
  isAuthenticated: boolean;
  onLoginClick: () => void;
}

export const BenefitsPage: React.FC<BenefitsPageProps> = ({
  isAuthenticated,
  onLoginClick,
}) => {
  const [benefits, setBenefits] = useState<PartnerBenefit[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<BenefitCategory | 'ALL'>('ALL');

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBenefit, setEditingBenefit] = useState<PartnerBenefit | null>(null);

  const fetchBenefits = async () => {
    setLoading(true);
    try {
      const categoryParam = selectedCategory === 'ALL' ? undefined : selectedCategory;
      const data = await api.getBenefits({
        search,
        category: categoryParam,
        active: true,
      });
      setBenefits(data);
    } catch (err) {
      console.error('Erro ao buscar benefícios:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchBenefits();
    }, 250);
    return () => clearTimeout(timer);
  }, [search, selectedCategory]);

  const handleSave = async (data: Partial<PartnerBenefit>) => {
    if (editingBenefit) {
      await api.updateBenefit(editingBenefit.id, data);
    } else {
      await api.createBenefit(data);
    }
    fetchBenefits();
  };

  const handleDelete = async (id: string, name: string) => {
    if (!isAuthenticated) {
      onLoginClick();
      return;
    }
    if (window.confirm(`Tem certeza que deseja remover o conveniado "${name}"?`)) {
      try {
        await api.deleteBenefit(id);
        fetchBenefits();
      } catch (err) {
        console.error('Erro ao remover benefício:', err);
      }
    }
  };

  const clearFilters = () => {
    setSearch('');
    setSelectedCategory('ALL');
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 p-6 shadow-xs space-y-6">
      {/* Title Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-blue-600 text-xs font-extrabold uppercase tracking-wider mb-0.5">
            <Sparkles className="w-4 h-4" />
            <span>Clube de Vantagens HRSJ</span>
          </div>
          <h2 className="text-xl font-black tracking-tight text-slate-900 dark:text-white">
            Parceiros e Descontos Credenciados
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 font-medium mt-0.5">
            Aproveite vantagens exclusivas em restaurantes, lojas, farmácias e serviços para associados.
          </p>
        </div>

        {isAuthenticated ? (
          <button
            onClick={() => {
              setEditingBenefit(null);
              setIsModalOpen(true);
            }}
            className="inline-flex items-center justify-center space-x-2 px-4 py-2 text-xs font-bold text-white bg-[#3b82f6] hover:bg-blue-600 rounded-xl shadow-md shadow-blue-500/20 transition cursor-pointer shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>Cadastrar Parceiro</span>
          </button>
        ) : (
          <button
            onClick={onLoginClick}
            className="inline-flex items-center justify-center space-x-1.5 px-4 py-2 text-xs font-bold text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 rounded-xl border border-slate-200 dark:border-slate-700 transition cursor-pointer shrink-0"
          >
            <Lock className="w-3.5 h-3.5 text-amber-500" />
            <span>Login do Gestor</span>
          </button>
        )}
      </div>

      {/* Filter Card Container */}
      <div className="bg-slate-50/80 dark:bg-slate-800/40 p-4 rounded-2xl border border-slate-200/80 dark:border-slate-700/60 space-y-3">
        <div className="flex items-center justify-between">
          <div className="inline-flex items-center space-x-1.5 px-3 py-1.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-200 shadow-2xs">
            <Filter className="w-3.5 h-3.5 text-blue-600" />
            <span>Categorias de Estabelecimento</span>
          </div>

          {(selectedCategory !== 'ALL' || search) && (
            <button
              onClick={clearFilters}
              className="flex items-center space-x-1 px-3 py-1 rounded-xl text-xs font-bold text-rose-500 hover:bg-rose-50 border border-rose-200 transition cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
              <span>Limpar</span>
            </button>
          )}
        </div>

        {/* Category Pills */}
        <div className="flex items-center space-x-2 overflow-x-auto pb-1 scrollbar-none">
          <button
            onClick={() => setSelectedCategory('ALL')}
            className={`px-3.5 py-1.5 text-xs font-bold rounded-xl whitespace-nowrap transition cursor-pointer ${
              selectedCategory === 'ALL'
                ? 'bg-[#3b82f6] text-white shadow-xs'
                : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-100 border border-slate-200 dark:border-slate-700'
            }`}
          >
            Todas as Categorias
          </button>
          {(Object.keys(BENEFIT_CATEGORY_LABELS) as BenefitCategory[]).map((catKey) => (
            <button
              key={catKey}
              onClick={() => setSelectedCategory(catKey)}
              className={`px-3.5 py-1.5 text-xs font-bold rounded-xl whitespace-nowrap transition cursor-pointer ${
                selectedCategory === catKey
                  ? 'bg-[#3b82f6] text-white shadow-xs'
                  : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-100 border border-slate-200 dark:border-slate-700'
              }`}
            >
              {BENEFIT_CATEGORY_LABELS[catKey].label}
            </button>
          ))}
        </div>

        {/* Search Bar Input inside Filter */}
        <div className="relative pt-1">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Buscar por parceiro ou endereço..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-medium text-slate-800 dark:text-slate-100 focus:ring-2 focus:ring-blue-500 focus:outline-none placeholder:text-slate-400"
          />
        </div>
      </div>

      {/* Count & Refresh Bar */}
      <div className="flex items-center justify-between text-xs">
        <span className="font-extrabold text-slate-800 dark:text-slate-200">
          {benefits.length} parceiros exibidos
        </span>

        <button
          onClick={fetchBenefits}
          className="flex items-center space-x-1.5 px-3 py-1.5 bg-white dark:bg-slate-800 border border-blue-200 dark:border-blue-900/60 text-blue-600 dark:text-blue-400 hover:bg-blue-50 rounded-xl font-bold transition shadow-2xs cursor-pointer"
        >
          <RotateCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          <span>Atualizar</span>
        </button>
      </div>

      {/* Benefits Grid */}
      {loading ? (
        <div className="p-12 text-center text-slate-400 border border-slate-200/80 dark:border-slate-800 rounded-2xl">
          <RotateCw className="w-7 h-7 animate-spin mx-auto mb-2 text-blue-600" />
          <p className="text-xs font-semibold uppercase tracking-wider">Carregando parceiros...</p>
        </div>
      ) : benefits.length === 0 ? (
        <div className="p-12 text-center text-slate-500 border border-slate-200/80 dark:border-slate-800 rounded-2xl">
          <Tag className="w-10 h-10 mx-auto mb-2 text-slate-300 dark:text-slate-700" />
          <p className="text-sm font-bold text-slate-800 dark:text-slate-200">
            Nenhum parceiro encontrado
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {benefits.map((benefit) => {
            const catInfo = BENEFIT_CATEGORY_LABELS[benefit.category] || BENEFIT_CATEGORY_LABELS.OUTROS;

            return (
              <div
                key={benefit.id}
                className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800/80 shadow-2xs hover:shadow-md transition-all duration-200 flex flex-col justify-between overflow-hidden group"
              >
                <div>
                  {/* Card Header Image / Logo Placeholder */}
                  <div className="relative bg-slate-100 dark:bg-slate-800/60 h-36 flex items-center justify-center overflow-hidden border-b border-slate-100 dark:border-slate-800">
                    {benefit.imageUrl ? (
                      <img
                        src={benefit.imageUrl}
                        alt={benefit.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <div className="flex flex-col items-center justify-center text-slate-400 p-4 text-center">
                        <Percent className="w-8 h-8 mb-1 opacity-40 text-blue-600" />
                        <span className="text-xs font-bold text-slate-600 dark:text-slate-300">
                          {benefit.name}
                        </span>
                      </div>
                    )}

                    {/* Discount Badge */}
                    <div className="absolute top-3 right-3 bg-[#3b82f6] text-white font-extrabold text-xs px-3 py-1 rounded-full shadow-md border border-blue-400">
                      {benefit.discountPercentage}
                    </div>

                    {/* Category Badge */}
                    <div className="absolute bottom-3 left-3">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${catInfo.color}`}>
                        {catInfo.label}
                      </span>
                    </div>
                  </div>

                  {/* Body Content */}
                  <div className="p-4 space-y-2.5">
                    <h3 className="text-sm font-extrabold text-slate-900 dark:text-white leading-snug">
                      {benefit.name}
                    </h3>

                    <div className="flex items-start space-x-1.5 text-xs text-slate-500 dark:text-slate-400">
                      <MapPin className="w-3.5 h-3.5 text-blue-500 shrink-0 mt-0.5" />
                      <span className="line-clamp-2 leading-relaxed">{benefit.location}</span>
                    </div>

                    {benefit.description && (
                      <p className="text-xs text-slate-600 dark:text-slate-300 bg-slate-50 dark:bg-slate-800/60 p-2.5 rounded-xl border border-slate-100 dark:border-slate-800 font-medium">
                        {benefit.description}
                      </p>
                    )}
                  </div>
                </div>

                {/* Footer Action Icons */}
                <div className="p-4 pt-0 flex items-center justify-between border-t border-slate-100 dark:border-slate-800/80 mt-2 pt-3">
                  <div className="flex items-center space-x-2">
                    {benefit.phone && (
                      <a
                        href={`tel:${benefit.phone.replace(/\D/g, '')}`}
                        className="inline-flex items-center space-x-1 px-2.5 py-1 bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 hover:bg-blue-100 rounded-lg text-xs font-bold transition cursor-pointer"
                      >
                        <Phone className="w-3.5 h-3.5" />
                        <span>Contato</span>
                      </a>
                    )}

                    {benefit.website && (
                      <a
                        href={benefit.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center space-x-1 px-2 py-1 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 rounded-lg text-xs font-bold transition cursor-pointer"
                        title="Acessar site"
                      >
                        <Globe className="w-3.5 h-3.5" />
                        <ExternalLink className="w-3 h-3 text-slate-400" />
                      </a>
                    )}
                  </div>

                  {/* Admin Edit/Delete Icons */}
                  {isAuthenticated && (
                    <div className="flex items-center space-x-1.5">
                      <button
                        onClick={() => {
                          setEditingBenefit(benefit);
                          setIsModalOpen(true);
                        }}
                        className="p-1.5 rounded-full bg-blue-100 text-blue-700 hover:bg-blue-200 transition cursor-pointer"
                        title="Editar parceiro"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDelete(benefit.id, benefit.name)}
                        className="p-1.5 rounded-full bg-rose-100 text-rose-700 hover:bg-rose-200 transition cursor-pointer"
                        title="Remover parceiro"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Modal */}
      <BenefitModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingBenefit(null);
        }}
        onSave={handleSave}
        benefitToEdit={editingBenefit}
      />
    </div>
  );
};

import React from 'react';
import {
  Sparkles,
  Award,
  HeartHandshake,
  Users,
  Building2,
  ChevronRight,
  ShieldCheck,
  Cross,
} from 'lucide-react';

interface HomePageProps {
  onNavigateToBenefits: () => void;
  onNavigateToLogin: () => void;
  isAuthenticated: boolean;
}

export const HomePage: React.FC<HomePageProps> = ({
  onNavigateToBenefits,
  onNavigateToLogin,
  isAuthenticated,
}) => {
  return (
    <div className="space-y-10 pb-8 animate-in fade-in duration-300">
      {/* Hero Header Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-linear-to-r from-[#0e1a2e] via-[#1e2e4a] to-[#16243d] p-8 sm:p-12 text-white shadow-2xl border border-slate-700/60">
        <div className="relative z-10 max-w-3xl space-y-4">
          <div className="inline-flex items-center space-x-2 bg-blue-500/20 text-blue-300 border border-blue-400/30 px-3.5 py-1.5 rounded-full text-xs font-bold">
            <Cross className="w-3.5 h-3.5 stroke-[2.5]" />
            <span>Associação dos Funcionários do HRSJ</span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white leading-tight">
            União, Valorização e Benefícios para os Servidores do HRSJ
          </h1>

          <p className="text-sm sm:text-base text-slate-300 font-medium leading-relaxed max-w-2xl">
            Desde 1995, atuamos na integração, apoio social e busca contínua de vantagens exclusivas para os profissionais de saúde e colaboradores do Hospital Regional São José.
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

      {/* KPI Stats Numbers Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
              Fundação
            </span>
            <span className="text-2xl font-black text-slate-900 dark:text-white mt-1 block">
              1995
            </span>
            <span className="text-[11px] text-slate-500 font-medium">15 de Maio</span>
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
              +30 Anos
            </span>
            <span className="text-[11px] text-slate-500 font-medium">De dedicação contínua</span>
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
              +1.200
            </span>
            <span className="text-[11px] text-slate-500 font-medium">Membros ativos no HRSJ</span>
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
              +50 Conveniadas
            </span>
            <span className="text-[11px] text-slate-500 font-medium">Descontos no comércio</span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 flex items-center justify-center border border-indigo-100 dark:border-indigo-900/40">
            <Building2 className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* History & Purpose Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-slate-900 p-7 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-3">
          <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold">
            01
          </div>
          <h3 className="text-lg font-extrabold text-slate-900 dark:text-white">
            Nossa História & Fundação
          </h3>
          <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
            A Associação dos Funcionários do Hospital Regional São José foi fundada em <strong>15 de maio de 1995</strong> a partir da iniciativa de uma comissão de servidores que buscava fortalecer a união da categoria e criar uma rede de apoio mútuo entre os profissionais da saúde.
          </p>
          <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
            Ao longo de três décadas de história, a associação expandiu sua atuação, tornando-se referência na promoção de bem-estar, celebrações comunitárias e convênios na Grande Florianópolis.
          </p>
        </div>

        <div className="bg-white dark:bg-slate-900 p-7 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-3">
          <div className="w-10 h-10 rounded-xl bg-sky-50 dark:bg-sky-950/60 text-sky-600 dark:text-sky-400 flex items-center justify-center font-bold">
            02
          </div>
          <h3 className="text-lg font-extrabold text-slate-900 dark:text-white">
            Por que & Por quem fomos criados?
          </h3>
          <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
            Criada <strong>pelos próprios servidores do HRSJ</strong> (médicos, enfermeiros, técnicos, farmacêuticos, administrativos e equipe de apoio), a associação tem como missão cuidar de quem dedica a vida ao cuidado dos outros.
          </p>
          <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
            Nosso objetivo é proporcionar benefícios financeiros reais (descontos no comércio, saúde e educação), carteirinha de identificação oficial de associado e eventos sociais de integração.
          </p>
        </div>
      </div>

      {/* Current Board Management Section (Gestão Atual) */}
      <div className="bg-white dark:bg-slate-900 p-7 sm:p-8 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4 gap-2">
          <div>
            <span className="text-[11px] font-extrabold text-blue-600 dark:text-blue-400 uppercase tracking-wider">
              Liderança e Transparência
            </span>
            <h3 className="text-xl font-black text-slate-900 dark:text-white">
              Gestão Atual (Biênio 2025 / 2027)
            </h3>
          </div>
          <span className="px-3 py-1 bg-sky-50 text-sky-700 dark:bg-sky-950/60 dark:text-sky-300 border border-sky-200 dark:border-sky-800/60 rounded-full text-xs font-bold self-start">
            • Diretoria Eleita Ativa
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-800">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Presidente</span>
            <h4 className="text-sm font-extrabold text-slate-900 dark:text-white mt-1">
              Dr. Roberto Carlos Medeiros
            </h4>
            <p className="text-xs text-slate-500 mt-0.5">Corpo Médico HRSJ</p>
          </div>

          <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-800">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Vice-Presidente</span>
            <h4 className="text-sm font-extrabold text-slate-900 dark:text-white mt-1">
              Dra. Juliana Barbosa Santos
            </h4>
            <p className="text-xs text-slate-500 mt-0.5">Enfermagem Geral</p>
          </div>

          <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-800">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Tesoureiro Geral</span>
            <h4 className="text-sm font-extrabold text-slate-900 dark:text-white mt-1">
              Marcelo Oliveira Silva
            </h4>
            <p className="text-xs text-slate-500 mt-0.5">Setor Administrativo</p>
          </div>

          <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-800">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Secretária Geral</span>
            <h4 className="text-sm font-extrabold text-slate-900 dark:text-white mt-1">
              Ana Paula da Silva
            </h4>
            <p className="text-xs text-slate-500 mt-0.5">Recursos Humanos</p>
          </div>
        </div>
      </div>
    </div>
  );
};

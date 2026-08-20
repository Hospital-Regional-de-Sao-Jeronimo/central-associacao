import React from 'react';
import { Users, Sparkles, Cross } from 'lucide-react';

interface NavbarProps {
  activeTab: 'associates' | 'benefits';
  setActiveTab: (tab: 'associates' | 'benefits') => void;
}

export const Navbar: React.FC<NavbarProps> = ({ activeTab, setActiveTab }) => {
  return (
    <header className="sticky top-0 z-40 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Subtitle */}
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-linear-to-tr from-emerald-600 to-teal-500 text-white flex items-center justify-center shadow-md shadow-emerald-500/20 ring-1 ring-emerald-400/30">
              <Cross className="w-5 h-5 stroke-[2.5]" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-base font-extrabold tracking-tight text-slate-900 dark:text-white">
                  Central da Associação
                </span>
                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/50">
                  HRSJ
                </span>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">
                Hospital Regional São Jerônimo
              </p>
            </div>
          </div>

          {/* Navigation Pill Switcher */}
          <nav className="flex space-x-1 bg-slate-100 dark:bg-slate-800/80 p-1.5 rounded-2xl border border-slate-200/60 dark:border-slate-700/50">
            <button
              onClick={() => setActiveTab('associates')}
              className={`flex items-center space-x-2 px-4 py-1.5 text-xs font-bold rounded-xl transition-all duration-200 ${
                activeTab === 'associates'
                  ? 'bg-white dark:bg-slate-900 text-emerald-700 dark:text-emerald-400 shadow-sm border border-slate-200/60 dark:border-slate-800'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200/50 dark:hover:bg-slate-700/50'
              }`}
            >
              <Users className="w-4 h-4" />
              <span>Associados</span>
            </button>

            <button
              onClick={() => setActiveTab('benefits')}
              className={`flex items-center space-x-2 px-4 py-1.5 text-xs font-bold rounded-xl transition-all duration-200 ${
                activeTab === 'benefits'
                  ? 'bg-white dark:bg-slate-900 text-emerald-700 dark:text-emerald-400 shadow-sm border border-slate-200/60 dark:border-slate-800'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200/50 dark:hover:bg-slate-700/50'
              }`}
            >
              <Sparkles className="w-4 h-4" />
              <span>Clube de Benefícios</span>
            </button>
          </nav>
        </div>
      </div>
    </header>
  );
};

import React from 'react';
import { LogOut, Cross, Lock, Home, Sparkles, Users, Sun, Moon } from 'lucide-react';

interface HeaderProps {
  activeTab: 'home' | 'benefits' | 'associates';
  setActiveTab: (tab: 'home' | 'benefits' | 'associates') => void;
  user: { name: string; email: string; role?: string } | null;
  onLoginClick: () => void;
  onLogoutClick: () => void;
  theme: 'light' | 'dark';
  onToggleTheme: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  user,
  onLoginClick,
  onLogoutClick,
  theme,
  onToggleTheme,
}) => {
  return (
    <header className="bg-[#1e2e4a] text-white sticky top-0 z-40 border-b border-slate-700/50 shadow-md">
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Left Hospital & Association Logo */}
          <div className="flex items-center space-x-3 cursor-pointer" onClick={() => setActiveTab('home')}>
            <div className="w-9 h-9 rounded-xl bg-white/10 text-white flex items-center justify-center border border-white/20 shadow-inner">
              <Cross className="w-5 h-5 stroke-[2.5]" />
            </div>
            <div>
              <div className="text-[10px] uppercase font-black tracking-widest text-slate-300 leading-none">
                HOSPITAL REGIONAL SÃO JOSÉ
              </div>
              <div className="text-xs uppercase font-extrabold tracking-wider text-white leading-none mt-0.5">
                Central da Associação
              </div>
            </div>
          </div>

          {/* Center Navigation Tabs */}
          <nav className="hidden md:flex items-center space-x-1.5 bg-[#0e1a2e]/80 p-1.5 rounded-2xl border border-slate-700/70">
            {/* Início (Sobre) */}
            <button
              onClick={() => setActiveTab('home')}
              className={`flex items-center space-x-2 px-4 py-1.5 text-xs font-bold rounded-xl transition cursor-pointer ${
                activeTab === 'home'
                  ? 'bg-[#3b82f6] text-white shadow-md shadow-blue-500/20'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800'
              }`}
            >
              <Home className="w-3.5 h-3.5" />
              <span>Início</span>
            </button>

            {/* Estabelecimentos Credenciados (Clube de Benefícios) */}
            <button
              onClick={() => setActiveTab('benefits')}
              className={`flex items-center space-x-2 px-4 py-1.5 text-xs font-bold rounded-xl transition cursor-pointer ${
                activeTab === 'benefits'
                  ? 'bg-[#3b82f6] text-white shadow-md shadow-blue-500/20'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Estabelecimentos Credenciados</span>
            </button>

            {/* Quadro de Associados (EXCLUSIVO PARA LOGADOS!) */}
            {user && (
              <button
                onClick={() => setActiveTab('associates')}
                className={`flex items-center space-x-2 px-4 py-1.5 text-xs font-bold rounded-xl transition cursor-pointer ${
                  activeTab === 'associates'
                    ? 'bg-[#3b82f6] text-white shadow-md shadow-blue-500/20'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800'
                }`}
              >
                <Users className="w-3.5 h-3.5" />
                <span>Quadro de Associados</span>
                <span className="w-2 h-2 rounded-full bg-sky-400" />
              </button>
            )}
          </nav>

          {/* Right Controls: Theme Toggle + User Auth */}
          <div className="flex items-center space-x-3">
            {/* Theme Toggle Button (Light/Dark) */}
            <button
              onClick={onToggleTheme}
              className="p-2 rounded-xl text-slate-300 hover:text-white bg-[#0e1a2e] hover:bg-[#16243d] border border-slate-700 transition cursor-pointer flex items-center space-x-1.5 text-xs font-semibold"
              title={theme === 'dark' ? 'Mudar para Modo Claro' : 'Mudar para Modo Escuro'}
            >
              {theme === 'dark' ? (
                <>
                  <Sun className="w-4 h-4 text-amber-400" />
                  <span className="hidden sm:inline">Modo Claro</span>
                </>
              ) : (
                <>
                  <Moon className="w-4 h-4 text-sky-300" />
                  <span className="hidden sm:inline">Modo Escuro</span>
                </>
              )}
            </button>

            {user ? (
              <div className="flex items-center space-x-3">
                <div className="text-right hidden sm:block">
                  <div className="text-xs font-bold text-white leading-none">
                    {user.name}
                  </div>
                  <span className="text-[10px] text-sky-400 font-semibold">
                    Gestor Autenticado
                  </span>
                </div>

                <button
                  onClick={onLogoutClick}
                  className="flex items-center space-x-1.5 px-3.5 py-1.5 text-xs font-bold text-slate-200 hover:text-white bg-[#0e1a2e] hover:bg-rose-950/60 border border-slate-700 hover:border-rose-800 rounded-xl transition cursor-pointer"
                  title="Encerrar sessão"
                >
                  <span>Sair</span>
                  <LogOut className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              <button
                onClick={onLoginClick}
                className="flex items-center space-x-2 px-4 py-2 text-xs font-extrabold text-white bg-[#3b82f6] hover:bg-blue-600 rounded-xl shadow-md shadow-blue-500/20 transition cursor-pointer"
              >
                <Lock className="w-3.5 h-3.5" />
                <span>Acesso Restrito (Login)</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

import React, { useState } from 'react';
import { Cross, Mail, Lock, LogIn, AlertCircle, ArrowLeft, ShieldCheck } from 'lucide-react';
import { api } from '../lib/api';

interface LoginPageProps {
  onLoginSuccess: (user: { id: string; name: string; email: string; role: string }) => void;
  onCancel: () => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onLoginSuccess, onCancel }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await api.login({ email, password });
      localStorage.setItem('hrsj_token', res.access_token);
      localStorage.setItem('hrsj_user', JSON.stringify(res.user));
      onLoginSuccess(res.user);
    } catch (err: any) {
      setError(err.message || 'Erro ao realizar login. Verifique suas credenciais.');
    } finally {
      setLoading(false);
    }
  };

  const handleFillDemo = () => {
    setEmail('admin@hrsj.sc.gov.br');
    setPassword('123456');
  };

  return (
    <div className="min-h-screen bg-[#0e1a2e] flex flex-col items-center justify-center p-4">
      {/* Background Glow */}
      <div className="absolute w-[500px] h-[500px] bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Main Login Card Container */}
      <div className="w-full max-w-md bg-[#1e2e4a] rounded-3xl border border-slate-700/80 shadow-2xl overflow-hidden relative z-10">
        {/* Top Header Logo */}
        <div className="p-8 pb-6 text-center border-b border-slate-700/60 bg-[#16243d]/60">
          <div className="w-14 h-14 rounded-2xl bg-blue-600 text-white flex items-center justify-center mx-auto mb-3 shadow-lg shadow-blue-600/30 border border-blue-400/40">
            <Cross className="w-8 h-8 stroke-[2.5]" />
          </div>

          <div className="text-[11px] uppercase font-black tracking-widest text-slate-300">
            HOSPITAL
          </div>
          <div className="text-[10px] text-slate-400 font-serif italic my-0.5">
            — Regional de —
          </div>
          <div className="text-sm uppercase font-extrabold tracking-wider text-white">
            SÃO JERÔNIMO
          </div>

          <div className="mt-3 inline-flex items-center space-x-1.5 px-3 py-1 rounded-full text-xs font-bold bg-blue-500/20 text-blue-300 border border-blue-500/30">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Área Restrita do Gestor</span>
          </div>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-8 space-y-4">
          {error && (
            <div className="p-3.5 bg-rose-950/60 border border-rose-800 text-rose-300 rounded-2xl text-xs flex items-center space-x-2.5">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
              <span className="font-semibold">{error}</span>
            </div>
          )}

          {/* E-mail Input */}
          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1.5">
              E-mail de Acesso
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-[#0e1a2e] border border-slate-700 rounded-xl text-xs font-medium text-white focus:ring-2 focus:ring-blue-500 focus:outline-none placeholder:text-slate-500 transition"
                placeholder="admin@hrsj.sc.gov.br"
              />
            </div>
          </div>

          {/* Senha Input */}
          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1.5">
              Senha
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-[#0e1a2e] border border-slate-700 rounded-xl text-xs font-medium text-white focus:ring-2 focus:ring-blue-500 focus:outline-none placeholder:text-slate-500 transition"
                placeholder="••••••••"
              />
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-[#3b82f6] hover:bg-blue-600 text-white font-extrabold text-xs rounded-xl shadow-lg shadow-blue-500/25 transition duration-200 flex items-center justify-center space-x-2 cursor-pointer disabled:opacity-50"
          >
            {loading ? (
              <span>Autenticando...</span>
            ) : (
              <>
                <LogIn className="w-4 h-4" />
                <span>Entrar no Sistema</span>
              </>
            )}
          </button>

          {/* Demo Helper Box */}
          <div className="pt-2">
            <div className="p-3 bg-slate-800/80 rounded-2xl border border-slate-700/70 text-center space-y-1.5">
              <p className="text-[11px] text-slate-400 font-medium">
                Precisa testar o sistema?
              </p>
              <button
                type="button"
                onClick={handleFillDemo}
                className="text-xs font-bold text-blue-400 hover:text-blue-300 underline cursor-pointer"
              >
                Preencher credenciais de teste (Admin)
              </button>
            </div>
          </div>

          {/* Cancel & Back Link */}
          <div className="text-center pt-2">
            <button
              type="button"
              onClick={onCancel}
              className="inline-flex items-center space-x-1.5 text-xs font-bold text-slate-400 hover:text-white transition cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Voltar ao Clube de Benefícios (Público)</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

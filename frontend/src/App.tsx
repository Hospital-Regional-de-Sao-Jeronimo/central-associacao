import { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { HomePage } from './components/HomePage';
import { BenefitsPage } from './components/BenefitsPage';
import { AssociatesPage } from './components/AssociatesPage';
import { LoginPage } from './components/LoginPage';

export function App() {
  const [activeTab, setActiveTab] = useState<'home' | 'benefits' | 'associates'>('home');
  const [user, setUser] = useState<{ id: string; name: string; email: string; role: string } | null>(null);
  const [isLoginPageOpen, setIsLoginPageOpen] = useState(false);
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  useEffect(() => {
    // Restore user
    const storedUser = localStorage.getItem('hrsj_user');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch {
        localStorage.removeItem('hrsj_user');
      }
    }

    // Restore theme
    const storedTheme = localStorage.getItem('hrsj_theme') as 'light' | 'dark' | null;
    if (storedTheme === 'dark' || storedTheme === 'light') {
      setTheme(storedTheme);
    }
  }, []);

  useEffect(() => {
    const root = document.documentElement;
    const body = document.body;
    if (theme === 'dark') {
      root.classList.add('dark');
      body.classList.add('dark');
    } else {
      root.classList.remove('dark');
      body.classList.remove('dark');
    }
    localStorage.setItem('hrsj_theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  const handleLoginSuccess = (userData: { id: string; name: string; email: string; role: string }) => {
    setUser(userData);
    setIsLoginPageOpen(false);
    setActiveTab('associates');
  };

  const handleLogout = () => {
    localStorage.removeItem('hrsj_token');
    localStorage.removeItem('hrsj_user');
    setUser(null);
    setActiveTab('home');
  };

  // Render Login Page Fullscreen if requested
  if (isLoginPageOpen) {
    return (
      <LoginPage
        onLoginSuccess={handleLoginSuccess}
        onCancel={() => setIsLoginPageOpen(false)}
      />
    );
  }

  return (
    <div className="min-h-screen bg-[#f8fafc] dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-sans antialiased transition-colors duration-200">
      {/* Header Navigation Bar */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        user={user}
        onLoginClick={() => setIsLoginPageOpen(true)}
        onLogoutClick={handleLogout}
        theme={theme}
        onToggleTheme={toggleTheme}
      />

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* View 1: Página Inicial (Informativa / Sobre a Associação) */}
        {activeTab === 'home' && (
          <HomePage
            onNavigateToBenefits={() => setActiveTab('benefits')}
            onNavigateToLogin={() => setIsLoginPageOpen(true)}
            isAuthenticated={Boolean(user)}
          />
        )}

        {/* View 2: Estabelecimentos Credenciados (Clube de Benefícios) */}
        {activeTab === 'benefits' && (
          <BenefitsPage
            isAuthenticated={Boolean(user)}
            onLoginClick={() => setIsLoginPageOpen(true)}
          />
        )}

        {/* View 3: Quadro de Associados (SÓ DISPONÍVEL SE ESTIVER AUTENTICADO) */}
        {activeTab === 'associates' && user && <AssociatesPage />}
      </main>
    </div>
  );
}

export default App;


import React, { useState } from 'react';

interface LoginProps {
  onLogin: (username: string) => void;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Hardcoded credentials
    if (username === 'Saidmera6' && password === 'said@said') {
      onLogin(username);
    } else {
      setError('Identifiants incorrects. Veuillez réessayer.');
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-6 bg-white">
      <div className="w-full max-w-xs space-y-8">
        <div className="text-center">
          <img 
            src="icon.png" 
            alt="LocalTrack Pro Logo" 
            className="mx-auto w-28 h-28 mb-6 object-contain rounded-3xl shadow-2xl logo-glow"
            onError={(e) => {
              // Fallback if icon.png is missing
              (e.target as HTMLImageElement).style.display = 'none';
            }}
          />
          <h2 className="text-3xl font-black tracking-tight text-slate-900">LocalTrack <span className="text-blue-600">Pro</span></h2>
          <p className="mt-2 text-sm text-slate-500 font-medium tracking-tight">Accédez à vos données hors-ligne</p>
        </div>

        <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1 ml-1">Utilisateur</label>
              <input
                type="text"
                required
                className="block w-full px-5 py-4 rounded-2xl border-slate-100 bg-slate-50 border focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all font-semibold"
                placeholder="Ex: Saidmera6"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1 ml-1">Mot de passe</label>
              <input
                type="password"
                required
                className="block w-full px-5 py-4 rounded-2xl border-slate-100 bg-slate-50 border focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all font-semibold"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          {error && (
            <div className="p-4 text-xs font-bold text-red-600 bg-red-50 rounded-xl border border-red-100 animate-pulse text-center">
              {error}
            </div>
          )}

          <button
            type="submit"
            className="w-full flex justify-center py-5 px-4 border border-transparent rounded-2xl shadow-xl shadow-blue-100 text-sm font-black uppercase tracking-widest text-white bg-blue-600 hover:bg-blue-700 active:scale-[0.98] transition-all"
          >
            Se Connecter
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;


import React from 'react';
import { Route } from '../App';

interface DashboardProps {
  userName: string;
  onNavigate: (route: Route) => void;
  onLogout: () => void;
}

const Dashboard: React.FC<DashboardProps> = ({ userName, onNavigate, onLogout }) => {
  return (
    <div className="flex flex-col min-h-screen bg-slate-50">
      <header className="bg-white px-6 py-6 border-b border-slate-100 sticky top-0 z-10">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-3">
            <img 
              src="icon.png" 
              className="w-10 h-10 object-contain rounded-xl shadow-sm"
              alt="Logo"
              onError={(e) => (e.target as HTMLImageElement).style.display = 'none'}
            />
            <div>
              <h1 className="text-lg font-black text-slate-900 leading-none">LocalTrack</h1>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-0.5">Session: <span className="text-blue-600">{userName}</span></p>
            </div>
          </div>
          <button 
            onClick={onLogout}
            className="p-3 bg-slate-50 rounded-2xl hover:bg-red-50 text-slate-400 hover:text-red-600 transition-all active:scale-90"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
          </button>
        </div>
      </header>

      <main className="flex-1 px-6 py-8 space-y-4">
        <button 
          onClick={() => onNavigate(Route.ADD)}
          className="w-full group bg-white p-5 rounded-[2rem] border border-slate-100 shadow-sm hover:shadow-md transition-all text-left flex items-center gap-4"
        >
          <div className="w-14 h-14 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center transition-transform group-hover:scale-110 shadow-inner">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
            </svg>
          </div>
          <div>
            <h3 className="text-base font-black text-slate-900">Nouveau lieu</h3>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tight">Ajouter manuellement</p>
          </div>
        </button>

        <button 
          onClick={() => onNavigate(Route.SUMMARY)}
          className="w-full group bg-white p-5 rounded-[2rem] border border-slate-100 shadow-sm hover:shadow-md transition-all text-left flex items-center gap-4"
        >
          <div className="w-14 h-14 bg-purple-100 text-purple-600 rounded-2xl flex items-center justify-center transition-transform group-hover:scale-110 shadow-inner">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          </div>
          <div>
            <h3 className="text-base font-black text-slate-900">Rapports</h3>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tight">Statistiques globales</p>
          </div>
        </button>

        <button 
          onClick={() => onNavigate(Route.IMPORT)}
          className="w-full group bg-white p-5 rounded-[2rem] border border-slate-100 shadow-sm hover:shadow-md transition-all text-left flex items-center gap-4"
        >
          <div className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-2xl flex items-center justify-center transition-transform group-hover:scale-110 shadow-inner">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
            </svg>
          </div>
          <div>
            <h3 className="text-base font-black text-slate-900">Import Masse</h3>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tight">CSV / WKT / GPS List</p>
          </div>
        </button>

        <button 
          onClick={() => onNavigate(Route.LIST)}
          className="w-full group bg-white p-5 rounded-[2rem] border border-slate-100 shadow-sm hover:shadow-md transition-all text-left flex items-center gap-4"
        >
          <div className="w-14 h-14 bg-indigo-100 text-indigo-600 rounded-2xl flex items-center justify-center transition-transform group-hover:scale-110 shadow-inner">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
            </svg>
          </div>
          <div>
            <h3 className="text-base font-black text-slate-900">Mes Données</h3>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tight">Gérer et Naviguer</p>
          </div>
        </button>

        <div className="pt-6">
          <div className="p-6 bg-slate-900 rounded-[2.5rem] text-white shadow-2xl relative overflow-hidden">
            <div className="absolute -right-4 -top-4 w-24 h-24 bg-white/5 rounded-full blur-2xl"></div>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-2.5 h-2.5 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-[10px] font-black uppercase tracking-widest text-white/60">Système Local Actif</span>
            </div>
            <p className="text-xs text-white/80 leading-relaxed font-medium">
              Toutes les données sont stockées sur cet appareil. Aucune connexion internet n'est requise pour l'utilisation quotidienne.
            </p>
          </div>
        </div>
      </main>

      <footer className="p-8 text-center">
        <div className="flex items-center justify-center gap-1 opacity-20 grayscale mb-1">
           <img src="icon.png" className="w-4 h-4 object-contain" alt="" />
           <span className="text-[10px] font-black uppercase tracking-tighter">LocalTrack Pro</span>
        </div>
        <p className="text-slate-300 text-[9px] font-bold uppercase tracking-[0.2em]">Saidmera6 • Edition 2024</p>
      </footer>
    </div>
  );
};

export default Dashboard;

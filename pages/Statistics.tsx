
import React, { useState, useEffect } from 'react';
import { db } from '../db';
import { LocationEntry, DoorStatus } from '../types';
import { Route } from '../App';

interface StatisticsProps {
  onBack: () => void;
  onNavigate: (route: Route, id?: string) => void;
}

const Statistics: React.FC<StatisticsProps> = ({ onBack, onNavigate }) => {
  const [entries, setEntries] = useState<LocationEntry[]>([]);
  const [activeTab, setActiveTab] = useState<'all' | 'ok' | 'not-yet'>('all');

  useEffect(() => {
    setEntries(db.getEntries());
  }, []);

  const okEntries = entries.filter(e => e.doorStatus === DoorStatus.OK);
  const notYetEntries = entries.filter(e => e.doorStatus === DoorStatus.NOT_YET);

  const displayedEntries = 
    activeTab === 'ok' ? okEntries : 
    activeTab === 'not-yet' ? notYetEntries : 
    entries;

  return (
    <div className="flex flex-col min-h-screen bg-slate-50">
      <header className="bg-white px-6 py-6 border-b border-slate-100 sticky top-0 z-20">
        <div className="flex items-center gap-3">
          <button onClick={onBack} className="p-2 -ml-2 text-slate-600 rounded-full hover:bg-slate-50 transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <h1 className="text-xl font-bold text-slate-900">Statistiques</h1>
        </div>
      </header>

      <main className="flex-1 p-6 space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <div 
            onClick={() => setActiveTab('ok')}
            className={`p-6 rounded-[2.5rem] flex flex-col items-center justify-center transition-all cursor-pointer ${activeTab === 'ok' ? 'bg-green-600 text-white shadow-xl scale-[1.02]' : 'bg-white border border-slate-100'}`}
          >
            <span className={`text-3xl font-black mb-1 ${activeTab === 'ok' ? 'text-white' : 'text-green-600'}`}>{okEntries.length}</span>
            <span className={`text-[10px] font-bold uppercase tracking-widest ${activeTab === 'ok' ? 'opacity-80' : 'text-slate-400'}`}>Portes OK</span>
          </div>
          
          <div 
            onClick={() => setActiveTab('not-yet')}
            className={`p-6 rounded-[2.5rem] flex flex-col items-center justify-center transition-all cursor-pointer ${activeTab === 'not-yet' ? 'bg-amber-500 text-white shadow-xl scale-[1.02]' : 'bg-white border border-slate-100'}`}
          >
            <span className={`text-3xl font-black mb-1 ${activeTab === 'not-yet' ? 'text-white' : 'text-amber-600'}`}>{notYetEntries.length}</span>
            <span className={`text-[10px] font-bold uppercase tracking-widest ${activeTab === 'not-yet' ? 'opacity-80' : 'text-slate-400'}`}>Not Yet</span>
          </div>
        </div>

        <div 
          onClick={() => setActiveTab('all')}
          className={`w-full p-4 rounded-3xl border transition-all cursor-pointer flex justify-between items-center ${activeTab === 'all' ? 'bg-slate-900 text-white border-slate-900' : 'bg-white border-slate-100'}`}
        >
          <span className="text-xs font-bold uppercase tracking-widest ml-2">Total Emplacements</span>
          <span className="text-xl font-black mr-2">{entries.length}</span>
        </div>

        <div className="space-y-4 pt-2">
          <div className="flex items-center justify-between px-2">
            <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
              {activeTab === 'all' ? 'Tous les lieux' : activeTab === 'ok' ? 'Lieux terminés' : 'Lieux en attente'}
            </h3>
            <span className="text-[10px] font-bold text-slate-300">({displayedEntries.length})</span>
          </div>

          <div className="space-y-3">
            {displayedEntries.length === 0 ? (
              <div className="bg-white rounded-3xl p-8 text-center border border-dashed border-slate-200">
                <p className="text-xs text-slate-400 font-medium">Aucun emplacement trouvé dans cette catégorie.</p>
              </div>
            ) : (
              displayedEntries.map(entry => (
                <div 
                  key={entry.id} 
                  onClick={() => onNavigate(Route.EDIT, entry.id)}
                  className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex items-center justify-between active:scale-[0.98] transition-all"
                >
                  <div className="flex-1 overflow-hidden pr-4">
                    <h4 className="font-bold text-slate-800 text-sm truncate">{entry.name}</h4>
                    <p className="text-[9px] font-mono text-slate-400 mt-0.5">{entry.gps}</p>
                  </div>
                  <div className={`w-3 h-3 rounded-full shrink-0 ${entry.doorStatus === DoorStatus.OK ? 'bg-green-500' : 'bg-amber-400'}`}></div>
                </div>
              ))
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Statistics;


import React, { useState, useEffect, useMemo } from 'react';
import { db } from '../db';
import { LocationEntry, DoorStatus } from '../types';
import { Route } from '../App';

interface LocationListProps {
  onNavigate: (route: Route, id?: string) => void;
  onBack: () => void;
}

const LocationList: React.FC<LocationListProps> = ({ onNavigate, onBack }) => {
  const [entries, setEntries] = useState<LocationEntry[]>([]);
  const [showConfirm, setShowConfirm] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    setEntries(db.getEntries());
  }, []);

  const filteredEntries = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return entries;
    return entries.filter(e => e.name.toLowerCase().includes(q) || e.gps.includes(q));
  }, [entries, searchQuery]);

  const handleDelete = (id: string) => {
    db.deleteEntry(id);
    setEntries(db.getEntries());
    setShowConfirm(null);
  };

  const toggleDoorStatus = (id: string, currentStatus: DoorStatus) => {
    const newStatus = currentStatus === DoorStatus.OK ? DoorStatus.NOT_YET : DoorStatus.OK;
    db.updateDoorStatus(id, newStatus);
    setEntries(db.getEntries());
  };

  const openInMaps = (gps: string) => {
    // Standard coordinates handling for maps
    const coords = gps.replace(/\s/g, '');
    const url = `https://www.google.com/maps/search/?api=1&query=${coords}`;
    window.open(url, '_blank');
  };

  const exportToExcel = () => {
    if (entries.length === 0) {
      alert("Aucune donnée à exporter.");
      return;
    }

    const data = entries.map(e => ({
      'Nom de l’emplacement': e.name,
      'Coordination GPS': e.gps,
      'Les portes': e.doorStatus,
      'Date d’enregistrement': new Date(e.createdAt).toLocaleString('fr-FR')
    }));

    const XLSX = (window as any).XLSX;
    if (XLSX) {
      const worksheet = XLSX.utils.json_to_sheet(data);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Emplacements");
      XLSX.writeFile(workbook, `LocalTrack_Export_${Date.now()}.xlsx`);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-slate-50">
      <header className="bg-white px-6 pt-6 pb-4 border-b border-slate-100 sticky top-0 z-20">
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center gap-3">
            <button onClick={onBack} className="p-2 -ml-2 text-slate-600 hover:bg-slate-50 rounded-full transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <h1 className="text-xl font-bold text-slate-900">Mes Lieux</h1>
          </div>
          <button 
            onClick={exportToExcel}
            className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white text-xs font-black rounded-xl shadow-lg shadow-green-100 hover:bg-green-700 transition-all active:scale-95"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            EXPORT
          </button>
        </div>

        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <input
            type="text"
            placeholder="Rechercher un lieu ou GPS..."
            className="w-full bg-slate-50 border border-slate-100 py-3 pl-11 pr-4 rounded-2xl text-sm focus:bg-white focus:ring-2 focus:ring-blue-500/20 outline-none transition-all"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </header>

      <main className="flex-1 px-4 py-6">
        {filteredEntries.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-slate-300 text-center">
            <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              </svg>
            </div>
            <p className="text-sm font-bold text-slate-400">Aucun résultat</p>
            <p className="text-xs opacity-60 mt-1">Essayez un autre nom ou importez des données.</p>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="px-2 flex justify-between items-center mb-2">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{filteredEntries.length} Emplacements</span>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Trié par date</span>
            </div>
            {filteredEntries.sort((a,b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).map((entry) => (
              <div key={entry.id} className="bg-white rounded-[2rem] p-5 border border-slate-100 shadow-sm relative transition-all">
                <div className="flex justify-between items-start mb-2">
                  <div className="flex-1 pr-4">
                    <h3 className="font-extrabold text-slate-900 text-base leading-tight">{entry.name}</h3>
                    <div className="flex items-center gap-1 mt-1">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <p className="text-[9px] font-bold text-slate-400 uppercase tracking-tighter">
                        Màj: {new Date(entry.updatedAt).toLocaleDateString('fr-FR')} {new Date(entry.updatedAt).toLocaleTimeString('fr-FR', {hour: '2-digit', minute:'2-digit'})}
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-1 shrink-0">
                    <button 
                      onClick={() => onNavigate(Route.EDIT, entry.id)}
                      className="p-2.5 bg-blue-50 text-blue-600 rounded-2xl hover:bg-blue-100 transition-colors"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                      </svg>
                    </button>
                    <button 
                      onClick={() => setShowConfirm(entry.id)}
                      className="p-2.5 bg-red-50 text-red-500 rounded-2xl hover:bg-red-100 transition-colors"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-4v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </div>

                <div className="mt-4 flex flex-col gap-2">
                  <div className="flex items-center justify-between gap-2 text-[11px] text-slate-500 bg-slate-50 px-3 py-2.5 rounded-2xl border border-slate-100">
                    <div className="flex items-center gap-2 overflow-hidden">
                      <div className="bg-white p-1 rounded-md shadow-sm shrink-0">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        </svg>
                      </div>
                      <span className="truncate font-mono font-bold tracking-tight">{entry.gps}</span>
                    </div>
                    <button 
                      onClick={() => openInMaps(entry.gps)}
                      className="shrink-0 flex items-center gap-1 bg-white px-2 py-1 rounded-lg border border-slate-200 text-blue-600 font-bold text-[9px] uppercase active:scale-95 transition-all shadow-sm"
                    >
                      NAVIGUER
                    </button>
                  </div>

                  <button 
                    onClick={() => toggleDoorStatus(entry.id, entry.doorStatus)}
                    className={`w-full flex items-center justify-between py-4 px-5 rounded-2xl font-black text-xs uppercase tracking-widest transition-all ${entry.doorStatus === DoorStatus.OK ? 'bg-green-600 text-white shadow-lg shadow-green-100' : 'bg-amber-500 text-white shadow-lg shadow-amber-100'}`}
                  >
                    <span>Portes: {entry.doorStatus}</span>
                    <div className="bg-white/20 p-1 rounded-lg">
                      {entry.doorStatus === DoorStatus.OK ? (
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                        </svg>
                      ) : (
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      )}
                    </div>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {showConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-[2.5rem] p-8 w-full max-w-xs shadow-2xl scale-in-center">
            <div className="w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <h3 className="text-xl font-black text-slate-900 mb-2 text-center">Supprimer ?</h3>
            <p className="text-slate-500 text-xs mb-8 text-center px-2">Cette action supprimera définitivement cet emplacement de votre base de données locale.</p>
            <div className="flex flex-col gap-2">
              <button onClick={() => handleDelete(showConfirm)} className="w-full py-4 bg-red-600 text-white font-black rounded-2xl shadow-lg shadow-red-100 active:scale-95 transition-all">Supprimer</button>
              <button onClick={() => setShowConfirm(null)} className="w-full py-4 bg-slate-100 text-slate-600 font-black rounded-2xl active:scale-95 transition-all">Annuler</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LocationList;

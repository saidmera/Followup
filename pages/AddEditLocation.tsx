
import React, { useState, useEffect } from 'react';
import { db } from '../db';
import { LocationEntry, DoorStatus } from '../types';

interface AddEditLocationProps {
  id?: string;
  onBack: () => void;
  onSuccess: () => void;
}

const AddEditLocation: React.FC<AddEditLocationProps> = ({ id, onBack, onSuccess }) => {
  const [name, setName] = useState('');
  const [gps, setGps] = useState('');
  const [doorStatus, setDoorStatus] = useState<DoorStatus>(DoorStatus.NOT_YET);
  const [loadingLocation, setLoadingLocation] = useState(false);

  useEffect(() => {
    if (id) {
      const entry = db.getEntryById(id);
      if (entry) {
        setName(entry.name);
        setGps(entry.gps);
        setDoorStatus(entry.doorStatus);
      }
    }
  }, [id]);

  const handlePasteAnywhere = (text: string) => {
    // Helper to auto-extract if the user pastes a URL in any field or a special "Helper" field
    const coordRegex = /@(-?\d+\.\d+),(-?\d+\.\d+)/;
    const match = text.match(coordRegex);
    if (match) {
      setGps(`${match[1]}, ${match[2]}`);
      
      if (!name && text.includes('/maps/place/')) {
        const namePart = text.split('/maps/place/')[1]?.split('/')[0];
        if (namePart) {
          setName(decodeURIComponent(namePart.replace(/\+/g, ' ')));
        }
      }
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const now = new Date().toISOString();
    const entry: LocationEntry = {
      id: id || crypto.randomUUID(),
      name,
      gps,
      doorStatus,
      createdAt: id ? (db.getEntryById(id)?.createdAt || now) : now,
      updatedAt: now
    };
    db.saveEntry(entry);
    onSuccess();
  };

  const getMyLocation = () => {
    setLoadingLocation(true);
    if (!navigator.geolocation) {
      alert("La géolocalisation n'est pas supportée.");
      setLoadingLocation(false);
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setGps(`${position.coords.latitude.toFixed(6)}, ${position.coords.longitude.toFixed(6)}`);
        setLoadingLocation(false);
      },
      () => {
        alert("Erreur de localisation.");
        setLoadingLocation(false);
      },
      { enableHighAccuracy: true }
    );
  };

  return (
    <div className="flex flex-col min-h-screen">
      <header className="bg-white px-6 py-6 border-b border-slate-100">
        <div className="flex items-center gap-3">
          <button onClick={onBack} className="p-2 -ml-2 text-slate-600 rounded-full">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <h1 className="text-xl font-bold text-slate-900">{id ? 'Modifier' : 'Ajouter'}</h1>
        </div>
      </header>

      <main className="flex-1 px-6 py-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1 ml-1">Lien ou Aide (Optionnel)</label>
              <input
                type="text"
                placeholder="Collez un lien Maps pour auto-remplir"
                className="w-full px-4 py-3 rounded-2xl bg-white border border-dashed border-slate-300 text-xs italic outline-none focus:border-blue-400"
                onChange={(e) => handlePasteAnywhere(e.target.value)}
              />
            </div>

            <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1 uppercase tracking-tight">Nom</label>
                <input
                  type="text"
                  required
                  className="w-full px-4 py-4 rounded-2xl bg-slate-50 border border-transparent focus:border-blue-500 focus:bg-white outline-none transition-all"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>

              <div>
                <div className="flex justify-between mb-1">
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-tight">GPS</label>
                  <button type="button" onClick={getMyLocation} className="text-[10px] font-bold text-blue-600 flex items-center gap-1">
                    {loadingLocation ? '...' : 'MA POSITION'}
                  </button>
                </div>
                <input
                  type="text"
                  required
                  placeholder="48.8584, 2.2945"
                  className="w-full px-4 py-4 rounded-2xl bg-slate-50 border border-transparent focus:border-blue-500 focus:bg-white outline-none transition-all font-mono text-sm"
                  value={gps}
                  onChange={(e) => setGps(e.target.value)}
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-2 uppercase tracking-tight">Status Portes</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setDoorStatus(DoorStatus.OK)}
                    className={`py-4 rounded-2xl font-bold text-xs uppercase transition-all ${doorStatus === DoorStatus.OK ? 'bg-green-600 text-white shadow-lg' : 'bg-slate-50 text-slate-500'}`}
                  >
                    OK
                  </button>
                  <button
                    type="button"
                    onClick={() => setDoorStatus(DoorStatus.NOT_YET)}
                    className={`py-4 rounded-2xl font-bold text-xs uppercase transition-all ${doorStatus === DoorStatus.NOT_YET ? 'bg-amber-500 text-white shadow-lg' : 'bg-slate-50 text-slate-500'}`}
                  >
                    Not Yet
                  </button>
                </div>
              </div>
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-5 bg-blue-600 text-white font-bold rounded-3xl shadow-xl shadow-blue-100 active:scale-95 transition-all text-lg"
          >
            Confirmer
          </button>
        </form>
      </main>
    </div>
  );
};

export default AddEditLocation;


import React, { useState } from 'react';
import { db } from '../db';
import { LocationEntry, DoorStatus } from '../types';

interface ImportLocationsProps {
  onBack: () => void;
  onSuccess: () => void;
}

const ImportLocations: React.FC<ImportLocationsProps> = ({ onBack, onSuccess }) => {
  const [inputText, setInputText] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const parseText = () => {
    setIsProcessing(true);
    
    const lines = inputText.split(/\r?\n/).filter(line => line.trim() !== '');
    const now = new Date().toISOString();
    let importCount = 0;

    lines.forEach(line => {
      const trimmedLine = line.trim();
      
      // Skip headers
      if (trimmedLine.toLowerCase().startsWith('wkt') || trimmedLine.toLowerCase().includes('coordonnées gps')) {
        return;
      }

      let lat: string | null = null;
      let lon: string | null = null;
      let name = "";

      // 1. Check for WKT POINT format: POINT (lon lat)
      // Usually provided as: "POINT (-7.4907 33.6107)",Name,Details
      const wktRegex = /POINT\s*\(\s*(-?\d+\.\d+)\s+(-?\d+\.\d+)\s*\)/i;
      const wktMatch = trimmedLine.match(wktRegex);

      if (wktMatch) {
        // In WKT, the first number is Longitude (X) and the second is Latitude (Y)
        lon = wktMatch[1];
        lat = wktMatch[2];
        
        // Extract name: everything after the point part
        const parts = trimmedLine.split('",');
        if (parts.length > 1) {
          // The name is typically the first part after the point
          const infoParts = parts[1].split(',');
          name = infoParts[0].trim();
          
          // If the name is too short or just a number, take a bit more context
          if (name.length < 3 && infoParts.length > 1) {
            name = infoParts.slice(0, 2).join(', ').trim();
          }
        } else {
           // Fallback if no quotes used
           const afterPoint = trimmedLine.split(')')[1];
           if (afterPoint) {
             name = afterPoint.replace(/^["\s,]+/, '').split(',')[0].trim();
           }
        }
      } 
      // 2. Fallback to Google Maps URL or decimal lat,lng
      else {
        const coordRegex = /(-?\d+\.\d+),\s*(-?\d+\.\d+)/;
        const match = trimmedLine.match(coordRegex);
        if (match) {
          lat = match[1];
          lon = match[2];
          
          if (trimmedLine.includes('/maps/place/')) {
            const namePart = trimmedLine.split('/maps/place/')[1]?.split('/')[0];
            if (namePart) name = decodeURIComponent(namePart.replace(/\+/g, ' '));
          } else {
            name = trimmedLine.split('http')[0].split(match[0])[0].replace(/["',]+$/, '').replace(/^["',]+/, '').trim();
          }
        }
      }

      if (lat && lon) {
        if (!name || name === '""') name = `Toilette ${importCount + 1}`;
        
        db.saveEntry({
          id: crypto.randomUUID(),
          name: name.length > 120 ? name.substring(0, 120) + '...' : name,
          gps: `${lat}, ${lon}`,
          doorStatus: DoorStatus.NOT_YET,
          createdAt: now,
          updatedAt: now
        });
        importCount++;
      }
    });

    setIsProcessing(false);
    if (importCount > 0) {
      onSuccess();
    } else {
      alert("Aucun emplacement valide n'a été détecté. Vérifiez que vous avez copié les lignes contenant 'POINT' ou des coordonnées.");
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-slate-50">
      <header className="bg-white px-6 py-6 border-b border-slate-100 sticky top-0 z-20">
        <div className="flex items-center gap-3">
          <button onClick={onBack} className="p-2 -ml-2 text-slate-600 rounded-full hover:bg-slate-50 transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <h1 className="text-xl font-bold text-slate-900">Importation Masse</h1>
        </div>
      </header>

      <main className="flex-1 p-6 space-y-6">
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
          <h2 className="text-sm font-black text-slate-800 mb-2 uppercase tracking-tight">Format supporté</h2>
          <p className="text-[11px] text-slate-500 leading-relaxed">
            Vous pouvez coller directement le contenu de votre fichier CSV.
            Le système détecte les formats <code className="bg-slate-100 px-1 rounded">POINT (X Y)</code> et extrait les noms des lieux automatiquement.
          </p>
        </div>

        <div className="space-y-2">
          <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-2">Coller les données</label>
          <textarea
            className="w-full h-80 p-5 rounded-3xl bg-white border border-slate-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-50/50 outline-none transition-all font-mono text-[10px] shadow-inner leading-relaxed"
            placeholder='Exemple: "POINT (-7.49 33.61)", Parc sportif al qods...'
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
          ></textarea>
        </div>

        <button
          onClick={parseText}
          disabled={!inputText.trim() || isProcessing}
          className="w-full py-5 bg-slate-900 text-white font-black rounded-3xl shadow-xl hover:bg-slate-800 disabled:opacity-50 transition-all active:scale-[0.98] flex items-center justify-center gap-2"
        >
          {isProcessing ? 'Importation en cours...' : `Importer les emplacements`}
        </button>
      </main>
    </div>
  );
};

export default ImportLocations;

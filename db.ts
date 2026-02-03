
import { LocationEntry, DoorStatus } from './types';

const STORAGE_KEY = 'location_data_store';

export const db = {
  getEntries: (): LocationEntry[] => {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  },

  saveEntry: (entry: LocationEntry): void => {
    const entries = db.getEntries();
    const existingIndex = entries.findIndex(e => e.id === entry.id);
    
    if (existingIndex > -1) {
      entries[existingIndex] = entry;
    } else {
      entries.push(entry);
    }
    
    localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
  },

  updateDoorStatus: (id: string, status: DoorStatus): void => {
    const entries = db.getEntries();
    const index = entries.findIndex(e => e.id === id);
    if (index > -1) {
      entries[index].doorStatus = status;
      entries[index].updatedAt = new Date().toISOString();
      localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
    }
  },

  deleteEntry: (id: string): void => {
    const entries = db.getEntries();
    const filtered = entries.filter(e => e.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
  },

  getEntryById: (id: string): LocationEntry | undefined => {
    return db.getEntries().find(e => e.id === id);
  }
};

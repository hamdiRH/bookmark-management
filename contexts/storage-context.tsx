"use client";

import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { StorageType } from '@/lib/storage/types';

interface StorageContextType {
  storageType: StorageType;
  setStorageType: (type: StorageType) => void;
}

const StorageContext = createContext<StorageContextType>({
  storageType: 'mongodb',
  setStorageType: () => {},
});

export function StorageProvider({ children }: { children: React.ReactNode }) {
  const [storageType, setStorageTypeState] = useState<StorageType>('mongodb');
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    const savedType = localStorage.getItem('storageType') as StorageType;
    if (savedType && (savedType === 'mongodb' || savedType === 'json')) {
      setStorageTypeState(savedType);
    }
    setIsInitialized(true);
  }, []);

  const setStorageType = useCallback((type: StorageType) => {
    setStorageTypeState(type);
    localStorage.setItem('storageType', type);
  }, []);

  if (!isInitialized) {
    return null;
  }

  return (
    <StorageContext.Provider value={{ storageType, setStorageType }}>
      {children}
    </StorageContext.Provider>
  );
}

export function useStorage() {
  const context = useContext(StorageContext);
  return context;
}
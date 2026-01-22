"use client";

import { useState, useEffect } from 'react';
import { X, Check, AlertCircle, RefreshCw } from 'lucide-react';

export default function ConnectApisModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const [loading, setLoading] = useState(true);
  const [keys, setKeys] = useState<any>({});

  // Verifica chaves ao abrir
  useEffect(() => {
    if (isOpen) checkKeys();
  }, [isOpen]);

  const checkKeys = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/status');
      const data = await res.json();
      setKeys(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[99999] flex items-center justify-center bg-black/90 backdrop-blur-md p-4">
      <div className="w-full max-w-2xl bg-[#09090b] border border-zinc-800 rounded-xl text-white shadow-2xl">
        <div className="flex items-center justify-between p-6 border-b border-zinc-800">
          <h2 className="text-xl font-bold">Conexões de API (Servidor)</h2>
          <button onClick={onClose} className="p-2 hover:bg-zinc-800 rounded-full text-white cursor-pointer">
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6 space-y-3 max-h-[60vh] overflow-y-auto">
          {loading ? (
             <div className="text-center py-10 text-zinc-500 flex flex-col items-center gap-2">
               <RefreshCw className="animate-spin w-8 h-8" />
               <p>Verificando Vercel...</p>
             </div>
          ) : (
            Object.entries(keys).map(([key, isActive]) => (
              <div key={key} className="flex items-center justify-between p-4 border border-zinc-800 rounded-lg bg-zinc-900/50">
                <span className="capitalize font-medium text-zinc-200">{key.replace('_', ' ')}</span>
                <div className="flex items-center gap-2">
                  {isActive ? (
                    <span className="flex items-center gap-1 text-green-500 font-bold text-sm bg-green-500/10 px-3 py-1 rounded-full">
                      <Check className="w-4 h-4" /> CONECTADO
                    </span>
                  ) : (
                    <span className="flex items-center gap-1 text-red-500 font-bold text-sm bg-red-500/10 px-3 py-1 rounded-full">
                      <AlertCircle className="w-4 h-4" /> AUSENTE
                    </span>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
        
        <div className="p-6 border-t border-zinc-800 flex justify-end gap-3 bg-zinc-900/30">
          <button onClick={checkKeys} className="px-4 py-2 text-zinc-300 hover:bg-zinc-800 rounded-md border border-zinc-700 cursor-pointer">
            Recarregar
          </button>
          <button onClick={onClose} className="px-6 py-2 bg-white text-black font-bold rounded-md hover:bg-zinc-200 cursor-pointer">
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
}

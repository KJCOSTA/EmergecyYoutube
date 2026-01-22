"use client";

import { useState, useEffect } from 'react';
import { 
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription 
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CheckCircle2, XCircle, Loader2, Key } from 'lucide-react';

interface ApiStatus {
  [key: string]: boolean;
}

export function ConnectApisModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const [loading, setLoading] = useState(true);
  const [serverKeys, setServerKeys] = useState<ApiStatus>({});

  // Verifica as chaves no servidor assim que abre
  useEffect(() => {
    if (isOpen) {
      checkServerKeys();
    }
  }, [isOpen]);

  const checkServerKeys = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/status');
      const data = await res.json();
      setServerKeys(data);
    } catch (error) {
      console.error("Erro ao verificar chaves:", error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (keyName: string) => {
    if (serverKeys[keyName]) return <CheckCircle2 className="w-5 h-5 text-green-500" />;
    return <XCircle className="w-5 h-5 text-red-500" />;
  };

  const getStatusText = (keyName: string) => {
    if (serverKeys[keyName]) return <span className="text-green-500 text-sm">Conectado via Variável de Ambiente</span>;
    return <span className="text-red-500 text-sm">Chave ausente no Servidor</span>;
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl bg-zinc-950 border-zinc-800 text-white">
        <DialogHeader>
          <DialogTitle>Status das Conexões (Server-Side)</DialogTitle>
          <DialogDescription>
            O sistema verifica automaticamente se as chaves estão configuradas no Vercel.
          </DialogDescription>
        </DialogHeader>

        {loading ? (
          <div className="flex justify-center p-8"><Loader2 className="animate-spin" /></div>
        ) : (
          <div className="grid gap-4 py-4">
            {/* Lista de APIs */}
            {[
              { id: 'openai', label: 'OpenAI (GPT-4)' },
              { id: 'gemini', label: 'Google Gemini' },
              { id: 'anthropic', label: 'Anthropic Claude' },
              { id: 'tavily', label: 'Tavily (Pesquisa)' },
              { id: 'youtube', label: 'YouTube API' },
              { id: 'pexels', label: 'Pexels Media' },
              { id: 'elevenlabs', label: 'ElevenLabs Voz' }
            ].map((api) => (
              <div key={api.id} className="flex items-center justify-between p-3 border border-zinc-800 rounded-lg bg-zinc-900/50">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-zinc-800 rounded-md">
                    <Key className="w-4 h-4 text-zinc-400" />
                  </div>
                  <div>
                    <h4 className="font-medium">{api.label}</h4>
                    {getStatusText(api.id)}
                  </div>
                </div>
                {getStatusIcon(api.id)}
              </div>
            ))}
          </div>
        )}
        
        <div className="flex justify-end gap-2">
           <Button variant="outline" onClick={checkServerKeys}>Recarregar Status</Button>
           <Button onClick={onClose}>Fechar</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
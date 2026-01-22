"use client";

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import ConnectApisModal from "@/components/ConnectApisModal"; // Importação direta
import { Upload, Youtube, Wifi } from "lucide-react";

export default function InputPage() {
  // Estado que controla a janela
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="space-y-6 p-6 max-w-6xl mx-auto">
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-bold text-white">Menu de Entrada</h1>
        <p className="text-zinc-400">Configure o contexto inicial para a produção do seu vídeo.</p>
      </div>

      {/* BANNER DE CONEXÃO (Onde estava o problema) */}
      <div className="bg-indigo-950/30 border border-indigo-500/30 p-6 rounded-xl flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-indigo-500/20 rounded-lg">
            <Wifi className="w-6 h-6 text-indigo-400" />
          </div>
          <div>
            <h3 className="font-medium text-white">Configure suas conexões</h3>
            <p className="text-sm text-indigo-300">Conecte APIs de IA, YouTube e outras integrações</p>
          </div>
        </div>
        
        {/* O BOTÃO QUE FUNCIONA */}
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-indigo-600 hover:bg-indigo-500 text-white px-6 py-3 rounded-lg font-bold shadow-lg transition-all active:scale-95 flex items-center gap-2"
        >
          <Wifi className="w-4 h-4" />
          Conectar APIs
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Card de Upload */}
        <Card className="p-6 bg-zinc-900 border-zinc-800">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-zinc-800 rounded">
              <Upload className="w-5 h-5 text-zinc-400" />
            </div>
            <h3 className="font-semibold text-white">Upload de Métricas</h3>
          </div>
          <div className="border-2 border-dashed border-zinc-800 rounded-lg p-8 flex flex-col items-center justify-center text-zinc-500 hover:bg-zinc-800/50 transition-colors cursor-pointer">
            <p>Arraste o CSV do YouTube Studio aqui</p>
            <span className="text-xs mt-2 text-zinc-600">Ou clique para selecionar</span>
          </div>
        </Card>

        {/* Card do YouTube */}
        <Card className="p-6 bg-zinc-900 border-zinc-800">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-zinc-800 rounded">
              <Youtube className="w-5 h-5 text-red-500" />
            </div>
            <h3 className="font-semibold text-white">Sincronizar Canal</h3>
          </div>
          <div className="bg-yellow-900/20 border border-yellow-700/30 rounded-lg p-4">
            <p className="text-yellow-500 text-sm font-medium">YouTube API necessária</p>
            <p className="text-yellow-600/80 text-xs mt-1">Use o botão "Conectar APIs" acima para configurar.</p>
          </div>
        </Card>
      </div>

      {/* A Janela Modal fica aqui, esperando o estado mudar */}
      <ConnectApisModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
}

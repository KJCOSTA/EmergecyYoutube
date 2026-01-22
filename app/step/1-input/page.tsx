"use client";

import { useState } from 'react';
import ConnectApisModal from '@/components/ConnectApisModal';
import { Upload, Youtube, Wifi, FileText, Sparkles } from "lucide-react";

export default function InputPage() {
  const [showModal, setShowModal] = useState(false);

  return (
    <div className="space-y-6 p-6 max-w-7xl mx-auto animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-zinc-900/50 p-6 rounded-xl border border-zinc-800 shadow-sm">
        <div>
          <h1 className="text-2xl font-bold text-white mb-2">Menu de Entrada</h1>
          <p className="text-zinc-400">Configure o contexto inicial para a produção do seu vídeo.</p>
        </div>
        <button 
          onClick={() => setShowModal(true)}
          className="bg-indigo-600 hover:bg-indigo-500 text-white px-6 py-3 rounded-lg font-bold shadow-lg shadow-indigo-500/20 flex items-center gap-2 transition-all active:scale-95 whitespace-nowrap cursor-pointer hover:shadow-indigo-500/40"
        >
          <Wifi className="w-4 h-4" />
          Conectar APIs
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Card Upload */}
        <div className="bg-zinc-950 border border-zinc-800 rounded-xl p-6 hover:border-zinc-700 transition-colors shadow-sm">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-blue-500/10 rounded-lg">
              <Upload className="w-5 h-5 text-blue-500" />
            </div>
            <h3 className="font-semibold text-white">Upload de Métricas</h3>
          </div>
          <div className="border-2 border-dashed border-zinc-800 rounded-xl h-48 flex flex-col items-center justify-center text-zinc-500 hover:bg-zinc-900/50 hover:border-zinc-600 transition-all cursor-pointer group">
            <div className="p-4 bg-zinc-900 rounded-full mb-3 group-hover:scale-110 transition-transform shadow-inner">
              <FileText className="w-6 h-6 text-zinc-400" />
            </div>
            <p className="font-medium text-zinc-400 group-hover:text-white transition-colors">Arraste o CSV do YouTube Studio</p>
            <p className="text-xs text-zinc-600 mt-1">Tamanho máximo: 10MB</p>
          </div>
        </div>

        {/* Card YouTube */}
        <div className="bg-zinc-950 border border-zinc-800 rounded-xl p-6 hover:border-zinc-700 transition-colors shadow-sm">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-red-500/10 rounded-lg">
              <Youtube className="w-5 h-5 text-red-500" />
            </div>
            <h3 className="font-semibold text-white">Sincronizar Canal</h3>
          </div>
          <div className="bg-zinc-900/30 border border-zinc-800 rounded-xl h-48 flex flex-col items-center justify-center p-6 text-center relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-b from-transparent to-red-500/5 pointer-events-none" />
            <div className="p-3 bg-zinc-900 rounded-full mb-3 border border-zinc-800 relative z-10">
              <Youtube className="w-8 h-8 text-red-500" />
            </div>
            <h4 className="text-white font-medium mb-1 relative z-10">Conexão Necessária</h4>
            <p className="text-zinc-500 text-sm mb-4 max-w-xs relative z-10">Conecte a API do YouTube para obter dados em tempo real.</p>
            <button 
              onClick={() => setShowModal(true)} 
              className="relative z-10 text-xs bg-zinc-800 hover:bg-zinc-700 text-white px-4 py-2 rounded-md transition-colors border border-zinc-700 cursor-pointer"
            >
              Configurar Agora
            </button>
          </div>
        </div>
      </div>

      {/* Definição de Tema */}
      <div className="bg-zinc-950 border border-zinc-800 rounded-xl p-6 shadow-sm">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-amber-500/10 rounded-lg">
            <Sparkles className="w-5 h-5 text-amber-500" />
          </div>
          <h3 className="font-semibold text-white">Definição de Tema</h3>
        </div>
        <div className="space-y-4">
          <div>
            <label className="text-sm text-zinc-400 mb-2 block">Tema do Vídeo</label>
            <input 
              type="text" 
              placeholder="Ex: Oração da Manhã Espírita..." 
              className="w-full bg-zinc-900 border border-zinc-800 rounded-lg p-3 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all placeholder:text-zinc-600" 
            />
          </div>
        </div>
      </div>

      <ConnectApisModal isOpen={showModal} onClose={() => setShowModal(false)} />
    </div>
  );
}

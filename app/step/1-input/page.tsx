"use client";

import { useState } from 'react';
import ConnectApisModal from '@/components/ConnectApisModal';
import { Upload, Youtube, Wifi, FileText, Sparkles, Zap } from "lucide-react";

export default function InputPage() {
  const [showModal, setShowModal] = useState(false);

  return (
    <div className="h-full w-full overflow-y-auto p-6 md:p-8 space-y-8 animate-in fade-in duration-500">
      
      {/* Cabeçalho */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-zinc-800 pb-6">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight">Menu de Entrada</h1>
          <p className="text-zinc-400 mt-1">Configure o contexto inicial para a produção do seu vídeo.</p>
        </div>
        
        <button 
          onClick={() => setShowModal(true)}
          className="bg-indigo-600 hover:bg-indigo-500 text-white px-5 py-2.5 rounded-lg font-semibold shadow-lg shadow-indigo-500/20 flex items-center gap-2 transition-all active:scale-95 whitespace-nowrap cursor-pointer hover:ring-2 hover:ring-indigo-500/50"
        >
          <Wifi className="w-4 h-4" />
          Conectar APIs
        </button>
      </div>

      {/* Grid de Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Card 1: Upload */}
        <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-6 hover:border-zinc-700 transition-all group">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2.5 bg-blue-500/10 rounded-lg group-hover:bg-blue-500/20 transition-colors">
              <Upload className="w-5 h-5 text-blue-500" />
            </div>
            <div>
              <h3 className="font-semibold text-white text-lg">Upload de Métricas</h3>
              <p className="text-xs text-zinc-500">Dados históricos do canal</p>
            </div>
          </div>
          
          <div className="border-2 border-dashed border-zinc-800 rounded-xl h-40 flex flex-col items-center justify-center text-zinc-500 hover:bg-zinc-800/50 hover:border-zinc-600 transition-all cursor-pointer">
            <div className="p-3 bg-zinc-800 rounded-full mb-3 shadow-inner">
              <FileText className="w-6 h-6 text-zinc-400" />
            </div>
            <p className="font-medium text-zinc-300">Arraste o CSV aqui</p>
            <p className="text-xs text-zinc-500 mt-1">YouTube Studio Export</p>
          </div>
        </div>

        {/* Card 2: YouTube Sync */}
        <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-6 hover:border-zinc-700 transition-all group">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2.5 bg-red-500/10 rounded-lg group-hover:bg-red-500/20 transition-colors">
              <Youtube className="w-5 h-5 text-red-500" />
            </div>
            <div>
              <h3 className="font-semibold text-white text-lg">Sincronização</h3>
              <p className="text-xs text-zinc-500">Conexão em tempo real</p>
            </div>
          </div>

          <div className="bg-gradient-to-br from-zinc-900 to-zinc-950 border border-zinc-800 rounded-xl h-40 flex flex-col items-center justify-center p-6 text-center relative overflow-hidden">
            <div className="z-10 flex flex-col items-center gap-3">
              <div className="flex items-center gap-2 text-zinc-300">
                <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                <span className="text-sm font-medium">API Necessária</span>
              </div>
              <button 
                onClick={() => setShowModal(true)}
                className="text-xs bg-zinc-800 hover:bg-zinc-700 text-white px-4 py-2 rounded-md border border-zinc-700 transition-colors"
              >
                Configurar Acesso
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Tema */}
      <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2.5 bg-amber-500/10 rounded-lg">
            <Sparkles className="w-5 h-5 text-amber-500" />
          </div>
          <div>
            <h3 className="font-semibold text-white text-lg">Definição de Tema</h3>
            <p className="text-xs text-zinc-500">O que vamos criar hoje?</p>
          </div>
        </div>
        
        <div className="relative">
          <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
            <Zap className="h-5 w-5 text-zinc-500" />
          </div>
          <input 
            type="text" 
            placeholder="Ex: Oração da Manhã, Notícias sobre IA, Review de Tech..." 
            className="w-full bg-black/50 border border-zinc-700 rounded-xl py-4 pl-10 pr-4 text-white placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all" 
          />
        </div>
      </div>

      {/* Modal de Conexões */}
      <ConnectApisModal isOpen={showModal} onClose={() => setShowModal(false)} />
    </div>
  );
}

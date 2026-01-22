"use client";

import { useState } from 'react';
import ConnectApisModal from '@/components/ConnectApisModal';
import { Upload, Youtube, Wifi } from "lucide-react";

export default function InputPage() {
  const [showModal, setShowModal] = useState(false);

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-8">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold text-white">Setup do Canal</h1>
        <p className="text-zinc-400">Configure as conexões antes de começar.</p>
      </div>

      {/* BOTÃO PRINCIPAL DE CONEXÃO */}
      <div className="bg-indigo-900/20 border border-indigo-500/30 p-8 rounded-2xl flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="p-4 bg-indigo-600 rounded-xl shadow-lg shadow-indigo-500/20">
            <Wifi className="w-8 h-8 text-white" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-white">Central de Conexões</h3>
            <p className="text-indigo-200">Verifique se as IAs e o YouTube estão ativos.</p>
          </div>
        </div>
        
        <button 
          onClick={() => setShowModal(true)}
          className="w-full md:w-auto bg-indigo-600 hover:bg-indigo-500 text-white px-8 py-4 rounded-xl font-bold text-lg shadow-xl hover:shadow-indigo-500/20 transition-all active:scale-95 flex items-center justify-center gap-2 cursor-pointer"
        >
          <Wifi className="w-5 h-5" />
          ABRIR CONEXÕES
        </button>
      </div>

      <div className="grid md:grid-cols-2 gap-6 opacity-50 pointer-events-none grayscale">
        <div className="p-6 border border-zinc-800 rounded-xl bg-zinc-900/50">
          <h3 className="font-bold text-zinc-400 mb-2">Upload (Em breve)</h3>
          <div className="h-32 border-2 border-dashed border-zinc-800 rounded-lg flex items-center justify-center">
            <Upload className="text-zinc-600" />
          </div>
        </div>
        <div className="p-6 border border-zinc-800 rounded-xl bg-zinc-900/50">
          <h3 className="font-bold text-zinc-400 mb-2">YouTube (Em breve)</h3>
          <div className="h-32 bg-zinc-800/50 rounded-lg flex items-center justify-center">
            <Youtube className="text-zinc-600" />
          </div>
        </div>
      </div>

      {/* MODAL */}
      <ConnectApisModal isOpen={showModal} onClose={() => setShowModal(false)} />
    </div>
  );
}

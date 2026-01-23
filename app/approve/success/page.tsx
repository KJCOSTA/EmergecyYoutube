"use client";

import { CheckCircle2, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default function ApprovalSuccessPage() {
  return (
    <div className="min-h-screen bg-zinc-950 flex items-center justify-center p-4">
      <div className="bg-zinc-900 border border-green-500/30 rounded-2xl p-8 max-w-md text-center">
        <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle2 className="w-10 h-10 text-green-500" />
        </div>

        <h1 className="text-2xl font-bold text-white mb-2">
          Roteiro Aprovado!
        </h1>

        <p className="text-zinc-400 mb-6">
          O workflow continuara automaticamente.
          Voce recebera um email quando o video estiver pronto.
        </p>

        <div className="bg-zinc-800 rounded-xl p-4 mb-6">
          <p className="text-sm text-zinc-400">Proximos passos:</p>
          <ul className="text-left text-sm text-zinc-300 mt-2 space-y-1">
            <li>1. Geracao do storyboard</li>
            <li>2. Renderizacao do video</li>
            <li>3. Upload para YouTube</li>
          </ul>
        </div>

        <Link
          href="/"
          className="inline-flex items-center gap-2 px-6 py-3 bg-violet-600 hover:bg-violet-500 text-white font-semibold rounded-xl transition-all"
        >
          Voltar ao Dashboard
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
}

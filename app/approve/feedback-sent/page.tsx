"use client";

import { MessageSquare, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default function FeedbackSentPage() {
  return (
    <div className="min-h-screen bg-zinc-950 flex items-center justify-center p-4">
      <div className="bg-zinc-900 border border-amber-500/30 rounded-2xl p-8 max-w-md text-center">
        <div className="w-20 h-20 bg-amber-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
          <MessageSquare className="w-10 h-10 text-amber-500" />
        </div>

        <h1 className="text-2xl font-bold text-white mb-2">
          Feedback Enviado!
        </h1>

        <p className="text-zinc-400 mb-6">
          Seu feedback foi registrado.
          O roteiro sera revisado e voce recebera um novo email para aprovacao.
        </p>

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

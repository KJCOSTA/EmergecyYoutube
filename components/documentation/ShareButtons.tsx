"use client";

import { useState } from "react";
import { Share2, Link2, Check, MessageCircle, Mail, X } from "lucide-react";
import { useShare } from "@/lib/share-context";

export default function ShareButtons() {
  const { canShare, generateShareLink } = useShare();
  const [showModal, setShowModal] = useState(false);
  const [shareUrl, setShareUrl] = useState("");
  const [copied, setCopied] = useState(false);

  if (!canShare) return null;

  const handleShare = () => {
    const url = generateShareLink();
    setShareUrl(url);
    setShowModal(true);
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  const shareViaWhatsApp = () => {
    const text = encodeURIComponent(
      `Confira a documentação do Emergency YouTube: ${shareUrl}`
    );
    window.open(`https://wa.me/?text=${text}`, "_blank");
  };

  const shareViaEmail = () => {
    const subject = encodeURIComponent("Documentação Emergency YouTube");
    const body = encodeURIComponent(
      `Olá!\n\nConfira a documentação do Emergency YouTube:\n${shareUrl}\n\nAtenciosamente.`
    );
    window.open(`mailto:?subject=${subject}&body=${body}`, "_blank");
  };

  return (
    <>
      <button
        onClick={handleShare}
        className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 rounded-lg text-white text-sm font-medium transition-all shadow-lg shadow-green-500/20"
      >
        <Share2 className="w-4 h-4" />
        Compartilhar
      </button>

      {/* Modal de Compartilhamento */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 max-w-md w-full shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Share2 className="w-5 h-5 text-green-400" />
                Compartilhar Documentação
              </h3>
              <button
                onClick={() => setShowModal(false)}
                className="p-1.5 hover:bg-zinc-800 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-zinc-400" />
              </button>
            </div>

            <p className="text-zinc-400 text-sm mb-4">
              Quem receber este link poderá visualizar a documentação, mas{" "}
              <strong className="text-amber-400">não poderá copiar conteúdos nem compartilhar novamente</strong>.
            </p>

            {/* Link Display */}
            <div className="bg-zinc-800/50 border border-zinc-700 rounded-xl p-3 mb-4">
              <p className="text-xs text-zinc-500 mb-2">Link de Compartilhamento:</p>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={shareUrl}
                  readOnly
                  className="flex-1 bg-transparent text-zinc-300 text-sm outline-none truncate"
                />
                <button
                  onClick={copyToClipboard}
                  className={`p-2 rounded-lg transition-all ${
                    copied
                      ? "bg-green-500/20 text-green-400"
                      : "bg-zinc-700 text-zinc-400 hover:bg-zinc-600 hover:text-white"
                  }`}
                  title={copied ? "Copiado!" : "Copiar link"}
                >
                  {copied ? <Check className="w-4 h-4" /> : <Link2 className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Share Options */}
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={shareViaWhatsApp}
                className="flex items-center justify-center gap-2 px-4 py-3 bg-green-600 hover:bg-green-500 rounded-xl text-white font-medium transition-all"
              >
                <MessageCircle className="w-5 h-5" />
                WhatsApp
              </button>
              <button
                onClick={shareViaEmail}
                className="flex items-center justify-center gap-2 px-4 py-3 bg-blue-600 hover:bg-blue-500 rounded-xl text-white font-medium transition-all"
              >
                <Mail className="w-5 h-5" />
                Email
              </button>
            </div>

            {/* Info Box */}
            <div className="mt-4 p-3 bg-amber-500/10 border border-amber-500/20 rounded-xl">
              <p className="text-xs text-amber-300">
                <strong>Proteções ativas:</strong> O link compartilhado terá proteção contra cópia de texto,
                seleção de conteúdo e não mostrará opções de compartilhamento para o visitante.
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

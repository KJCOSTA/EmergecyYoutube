"use client";

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import {
  CheckCircle2,
  XCircle,
  MessageSquare,
  FileText,
  Clock,
  Loader2,
  AlertTriangle,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';

interface ProjectData {
  project: {
    id: string;
    name: string;
    topic: string;
    status: string;
  };
  script: {
    title: string;
    content: string;
    sections: {
      hook?: string;
      body?: string[];
      cta?: string;
    };
  } | null;
  research: {
    summary: string;
  } | null;
  workflow: {
    currentStep: string;
    approvalSentAt: string;
  };
}

export default function ApprovalPage() {
  const params = useParams();
  const router = useRouter();
  const token = params.token as string;

  const [data, setData] = useState<ProjectData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);
  const [feedback, setFeedback] = useState('');
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    script: true,
    research: false,
  });

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch(`/api/approve?token=${token}`);
        if (!response.ok) {
          const err = await response.json();
          throw new Error(err.error || 'Failed to load project');
        }
        const projectData = await response.json();
        setData(projectData);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load project');
      } finally {
        setLoading(false);
      }
    }

    if (token) {
      fetchData();
    }
  }, [token]);

  const handleApprove = async () => {
    setSubmitting(true);
    try {
      const response = await fetch('/api/approve', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, action: 'approve' }),
      });

      if (!response.ok) {
        throw new Error('Failed to approve');
      }

      router.push('/approve/success');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to approve');
    } finally {
      setSubmitting(false);
    }
  };

  const handleRequestChanges = async () => {
    if (!feedback.trim()) {
      setError('Please provide feedback for changes');
      return;
    }

    setSubmitting(true);
    try {
      const response = await fetch('/api/approve', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, action: 'request_changes', feedback }),
      });

      if (!response.ok) {
        throw new Error('Failed to submit feedback');
      }

      router.push('/approve/feedback-sent');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to submit feedback');
    } finally {
      setSubmitting(false);
    }
  };

  const toggleSection = (section: string) => {
    setExpandedSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-violet-500 animate-spin mx-auto mb-4" />
          <p className="text-zinc-400">Carregando roteiro...</p>
        </div>
      </div>
    );
  }

  if (error && !data) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center p-4">
        <div className="bg-zinc-900 border border-red-500/30 rounded-2xl p-8 max-w-md text-center">
          <AlertTriangle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h1 className="text-xl font-bold text-white mb-2">Erro ao carregar</h1>
          <p className="text-zinc-400">{error}</p>
        </div>
      </div>
    );
  }

  if (!data) return null;

  const isAwaitingApproval = data.project.status === 'AWAITING_APPROVAL';

  return (
    <div className="min-h-screen bg-zinc-950 p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 mb-6">
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-2xl font-bold text-white mb-2">
                Aprovacao de Roteiro
              </h1>
              <p className="text-zinc-400">{data.project.name}</p>
            </div>
            <div className="flex items-center gap-2 px-3 py-1.5 bg-amber-500/20 rounded-full">
              <Clock className="w-4 h-4 text-amber-500" />
              <span className="text-sm text-amber-500">Aguardando Aprovacao</span>
            </div>
          </div>
        </div>

        {/* Error message */}
        {error && (
          <div className="bg-red-500/20 border border-red-500/30 rounded-xl p-4 mb-6">
            <p className="text-red-400">{error}</p>
          </div>
        )}

        {/* Script Section */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl mb-6 overflow-hidden">
          <button
            onClick={() => toggleSection('script')}
            className="w-full flex items-center justify-between p-6 text-left hover:bg-zinc-800/50 transition-colors"
          >
            <div className="flex items-center gap-3">
              <FileText className="w-5 h-5 text-violet-500" />
              <span className="text-lg font-semibold text-white">Roteiro</span>
            </div>
            {expandedSections.script ? (
              <ChevronUp className="w-5 h-5 text-zinc-400" />
            ) : (
              <ChevronDown className="w-5 h-5 text-zinc-400" />
            )}
          </button>

          {expandedSections.script && data.script && (
            <div className="px-6 pb-6 border-t border-zinc-800 pt-4">
              <h2 className="text-xl font-bold text-white mb-4">
                {data.script.title}
              </h2>

              {data.script.sections?.hook && (
                <div className="mb-6">
                  <h3 className="text-sm font-medium text-violet-400 mb-2">HOOK</h3>
                  <p className="text-zinc-300 whitespace-pre-wrap">
                    {data.script.sections.hook}
                  </p>
                </div>
              )}

              {data.script.sections?.body?.map((section, index) => (
                <div key={index} className="mb-6">
                  <h3 className="text-sm font-medium text-violet-400 mb-2">
                    SECAO {index + 1}
                  </h3>
                  <p className="text-zinc-300 whitespace-pre-wrap">{section}</p>
                </div>
              ))}

              {data.script.sections?.cta && (
                <div className="mb-6">
                  <h3 className="text-sm font-medium text-violet-400 mb-2">CTA</h3>
                  <p className="text-zinc-300 whitespace-pre-wrap">
                    {data.script.sections.cta}
                  </p>
                </div>
              )}

              {data.script.content && !data.script.sections?.hook && (
                <div className="prose prose-invert max-w-none">
                  <p className="text-zinc-300 whitespace-pre-wrap">
                    {data.script.content}
                  </p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Research Summary */}
        {data.research && (
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl mb-6 overflow-hidden">
            <button
              onClick={() => toggleSection('research')}
              className="w-full flex items-center justify-between p-6 text-left hover:bg-zinc-800/50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <MessageSquare className="w-5 h-5 text-blue-500" />
                <span className="text-lg font-semibold text-white">
                  Resumo da Pesquisa
                </span>
              </div>
              {expandedSections.research ? (
                <ChevronUp className="w-5 h-5 text-zinc-400" />
              ) : (
                <ChevronDown className="w-5 h-5 text-zinc-400" />
              )}
            </button>

            {expandedSections.research && (
              <div className="px-6 pb-6 border-t border-zinc-800 pt-4">
                <p className="text-zinc-300 whitespace-pre-wrap">
                  {data.research.summary}
                </p>
              </div>
            )}
          </div>
        )}

        {/* Feedback Section */}
        {showFeedback && (
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 mb-6">
            <h3 className="text-lg font-semibold text-white mb-4">
              Solicitar Alteracoes
            </h3>
            <textarea
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              placeholder="Descreva as alteracoes necessarias..."
              className="w-full h-32 bg-zinc-800 border border-zinc-700 rounded-xl p-4 text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-violet-500 resize-none"
            />
          </div>
        )}

        {/* Action Buttons */}
        {isAwaitingApproval && (
          <div className="flex flex-col sm:flex-row gap-4">
            <button
              onClick={handleApprove}
              disabled={submitting}
              className="flex-1 flex items-center justify-center gap-2 px-6 py-4 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 text-white font-semibold rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {submitting ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <CheckCircle2 className="w-5 h-5" />
              )}
              Aprovar Roteiro
            </button>

            {!showFeedback ? (
              <button
                onClick={() => setShowFeedback(true)}
                className="flex-1 flex items-center justify-center gap-2 px-6 py-4 bg-zinc-800 hover:bg-zinc-700 text-white font-semibold rounded-xl transition-all"
              >
                <XCircle className="w-5 h-5" />
                Solicitar Alteracoes
              </button>
            ) : (
              <button
                onClick={handleRequestChanges}
                disabled={submitting || !feedback.trim()}
                className="flex-1 flex items-center justify-center gap-2 px-6 py-4 bg-amber-600 hover:bg-amber-500 text-white font-semibold rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {submitting ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <MessageSquare className="w-5 h-5" />
                )}
                Enviar Feedback
              </button>
            )}
          </div>
        )}

        {!isAwaitingApproval && (
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 text-center">
            <p className="text-zinc-400">
              Este roteiro ja foi processado. Status atual:{' '}
              <span className="text-white font-medium">{data.project.status}</span>
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

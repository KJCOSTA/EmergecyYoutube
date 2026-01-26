'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Card } from '@/components/ui/Card';
import { StreamingText } from '@/components/ui/StreamingText';
import { AIModelSelector } from '@/components/AIModelSelector';

export default function AITestPage() {
  const [provider, setProvider] = useState('google');
  const [model, setModel] = useState('gemini-1.5-flash');
  const [apiKey, setApiKey] = useState('');
  const [prompt, setPrompt] = useState('Explique a importância da velocidade de um site para o SEO.');
  const [response, setResponse] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setResponse(null);

    try {
      const res = await fetch('/api/test/ai', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ provider, model, apiKey, prompt }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.details || 'An error occurred');
      }

      const data = await res.json();
      setResponse(data);
    } catch (error) {
      setResponse({ error: error.message });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-layer-1 text-foreground p-4 sm:p-6 lg:p-8">
      <div className="max-w-4xl mx-auto">
        <header className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-blue-400 to-purple-500 text-transparent bg-clip-text pb-2">
            AI Model Test Suite
          </h1>
          <p className="text-muted-foreground mt-2">
            Teste a integração com diferentes provedores e modelos de IA diretamente.
          </p>
        </header>

        <Card className="bg-layer-2 border-border-subtle p-6 rounded-lg shadow-lg mb-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <AIModelSelector 
                provider={provider}
                setProvider={setProvider}
                model={model}
                setModel={setModel}
              />
            </div>

            <div>
              <Input 
                type="password"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder="Sua API Key"
                className="w-full bg-layer-3 border-border-subtle"
              />
            </div>

            <div>
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Digite seu prompt"
                className="w-full bg-layer-3 border-border-subtle rounded-md p-3 h-32 text-sm"
              />
            </div>

            <div className="flex justify-end">
              <Button type="submit" isLoading={isLoading} className="bg-blue-600 hover:bg-blue-700 text-white">
                {isLoading ? 'Testando...' : 'Testar Modelo'}
              </Button>
            </div>
          </form>
        </Card>

        {response && (
          <Card className="bg-layer-2 border-border-subtle p-6 rounded-lg shadow-lg">
            <h2 className="text-xl font-semibold mb-4">Resultado</h2>
            {response.error ? (
              <div className="text-red-400 bg-red-900/20 p-4 rounded-md">
                <p className="font-bold">Erro no Teste:</p>
                <p>{response.error}</p>
              </div>
            ) : (
              <div className="space-y-4">
                <div>
                  <strong className="text-muted-foreground">Provedor:</strong> {response.provider}
                </div>
                <div>
                  <strong className="text-muted-foreground">Modelo:</strong> {response.model}
                </div>
                <div className="border-t border-border-subtle pt-4 mt-4">
                  <StreamingText text={response.text} />
                </div>
              </div>
            )}
          </Card>
        )}
      </div>
    </div>
  );
}

'use client';

import { useState } from 'react';
import { CodeInput } from '@/components/CodeInput';
import { Visualizer } from '@/components/Visualizer';
import type { AlgoTrace } from '@/types/visualization';
import { Code2, Sparkles } from 'lucide-react';

export default function Home() {
  const [trace, setTrace] = useState<AlgoTrace | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleVisualize = async (code: string) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/visualize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to generate visualization');
      }

      setTrace(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
      setTrace(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="h-screen flex flex-col p-4 gap-4">
      <header className="flex items-center gap-2">
        <Code2 className="h-6 w-6 text-primary" />
        <h1 className="text-xl font-semibold">Algorithm Visualizer</h1>
      </header>

      <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-4 min-h-0">
        <CodeInput onSubmit={handleVisualize} loading={loading} />

        {trace ? (
          <Visualizer trace={trace} />
        ) : (
          <div className="flex flex-col items-center justify-center border rounded-lg bg-card text-muted-foreground">
            {error ? (
              <div className="text-center p-8">
                <div className="text-destructive font-medium mb-2">Error</div>
                <p className="text-sm">{error}</p>
              </div>
            ) : (
              <div className="text-center p-8">
                <Sparkles className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p className="text-lg font-medium mb-2">No visualization yet</p>
                <p className="text-sm">
                  Paste your Python code and click &quot;Visualize&quot; to see
                  how your algorithm works step by step.
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </main>
  );
}

'use client';

import { useState, useCallback } from 'react';
import { proofreadText, createOpenAIClient } from '@/lib/api';
import { CheckCircle, Loader2, AlertCircle, Copy, ArrowRight } from 'lucide-react';

interface ProofreadingToolProps {
  apiKey: string;
  university: string;
  citationStyle: string;
}

export function ProofreadingTool({ apiKey, university }: ProofreadingToolProps) {
  const [text, setText] = useState('');
  const [correctedText, setCorrectedText] = useState('');
  const [corrections, setCorrections] = useState<Array<{ original: string; corrected: string; type: string; explanation: string }>>([]);
  const [score, setScore] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [selectedCorrection, setSelectedCorrection] = useState<number | null>(null);

  const handleProofread = useCallback(async () => {
    if (!apiKey) {
      setError('Please add your API key in Settings first');
      return;
    }
    if (!text.trim()) {
      setError('Please enter some text to proofread');
      return;
    }

    setLoading(true);
    setError('');
    setCorrections([]);
    setScore(0);
    setCorrectedText('');

    try {
      const client = createOpenAIClient(apiKey);
      const result = await proofreadText(client, text);
      setCorrections(result.corrections);
      setScore(result.score);

      // Build corrected text
      let corrected = text;
      result.corrections.forEach(c => {
        corrected = corrected.replace(c.original, c.corrected);
      });
      setCorrectedText(corrected);
    } catch (err: any) {
      setError(err.message || 'Failed to proofread text');
    } finally {
      setLoading(false);
    }
  }, [apiKey, text]);

  const typeColors: Record<string, string> = {
    grammar: 'bg-red-100 text-red-700 border-red-200',
    spelling: 'bg-orange-100 text-orange-700 border-orange-200',
    punctuation: 'bg-yellow-100 text-yellow-700 border-yellow-200',
    phrasing: 'bg-blue-100 text-blue-700 border-blue-200',
    word_choice: 'bg-purple-100 text-purple-700 border-purple-200',
    consistency: 'bg-indigo-100 text-indigo-700 border-indigo-200',
  };

  const scoreColor = (s: number) => {
    if (s >= 90) return 'text-green-600';
    if (s >= 70) return 'text-amber-600';
    if (s >= 50) return 'text-orange-600';
    return 'text-red-600';
  };

  const scoreLabel = (s: number) => {
    if (s >= 95) return 'Excellent';
    if (s >= 85) return 'Very Good';
    if (s >= 70) return 'Good';
    if (s >= 50) return 'Needs Work';
    return 'Significant Revision Needed';
  };

  return (
    <div className="p-6 max-w-7xl mx-auto animate-fade-in">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-1">Proofreading Tool</h1>
        <p className="text-secondary">Comprehensive grammar, spelling, and style checking for academic writing</p>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm flex items-center gap-2">
          <AlertCircle size={16} />
          {error}
        </div>
      )}

      {/* Score Banner */}
      {score > 0 && (
        <div className={`mb-6 p-4 rounded-xl border ${score >= 85 ? 'bg-green-50 border-green-200' : score >= 70 ? 'bg-amber-50 border-amber-200' : 'bg-red-50 border-red-200'}`}>
          <div className="flex items-center gap-4">
            <div className={`text-4xl font-bold ${scoreColor(score)}`}>{score}</div>
            <div>
              <p className="font-medium">Quality Score: {scoreLabel(score)}</p>
              <p className="text-sm text-secondary">{corrections.length} {corrections.length === 1 ? 'issue' : 'issues'} found</p>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Input Panel */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium">Original Text</label>
            <button
              onClick={handleProofread}
              disabled={loading}
              className="px-4 py-2 bg-primary text-white rounded-lg text-sm font-medium hover:bg-primary-hover disabled:opacity-50 flex items-center gap-2"
            >
              {loading ? (
                <><Loader2 size={16} className="animate-spin" /> Checking...</>
              ) : (
                <><CheckCircle size={16} /> Proofread</>
              )}
            </button>
          </div>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Paste your text here for proofreading..."
            className="w-full h-64 p-4 border border-card-border rounded-xl bg-card resize-none text-sm leading-relaxed focus:outline-none focus:ring-2 focus:ring-primary"
          />
          <div className="text-xs text-muted text-right">
            {text.split(/\s+/).filter(Boolean).length} words · {text.length} characters
          </div>
        </div>

        {/* Corrected Text Panel */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium">Corrected Text</label>
            {correctedText && (
              <button
                onClick={() => navigator.clipboard.writeText(correctedText)}
                className="p-1.5 hover:bg-muted-bg rounded text-secondary"
                title="Copy corrected text"
              >
                <Copy size={14} />
              </button>
            )}
          </div>
          <div className="w-full h-64 p-4 border border-card-border rounded-xl bg-muted-bg overflow-y-auto text-sm leading-relaxed">
            {correctedText || <span className="text-muted">Corrected text will appear here</span>}
          </div>
          {corrections.length > 0 && (
            <div className="text-xs text-muted text-right">
              {corrections.length} corrections applied
            </div>
          )}
        </div>
      </div>

      {/* Corrections List */}
      {corrections.length > 0 && (
        <div className="mt-6">
          <h3 className="text-sm font-medium mb-3">Detailed Corrections</h3>
          <div className="space-y-3">
            {corrections.map((c, i) => (
              <div
                key={i}
                className={`p-4 rounded-xl border transition-all cursor-pointer ${
                  selectedCorrection === i
                    ? 'border-primary bg-primary-light'
                    : 'border-card-border bg-card hover:border-primary/50'
                }`}
                onClick={() => setSelectedCorrection(selectedCorrection === i ? null : i)}
              >
                <div className="flex items-start justify-between gap-2 mb-2">
                  <span className={`text-xs px-2 py-0.5 rounded-full border ${typeColors[c.type] || 'bg-gray-100 text-gray-700 border-gray-200'}`}>
                    {c.type.replace('_', ' ')}
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-4 mb-2">
                  <div>
                    <p className="text-xs text-muted mb-1">Original:</p>
                    <p className="text-sm line-through text-red-600">{c.original}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted mb-1">Corrected:</p>
                    <p className="text-sm text-green-600 flex items-center gap-1">
                      <ArrowRight size={12} /> {c.corrected}
                    </p>
                  </div>
                </div>
                {selectedCorrection === i && (
                  <div className="mt-2 pt-2 border-t border-primary/20 animate-fade-in">
                    <p className="text-xs font-medium text-muted mb-1">Explanation:</p>
                    <p className="text-sm">{c.explanation}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tips */}
      <div className="mt-6 p-4 bg-muted-bg rounded-xl">
        <p className="text-sm font-medium mb-2">Proofreading Tips</p>
        <ul className="text-xs text-secondary space-y-1">
          <li>• Read your text aloud before submitting — it catches issues automated tools miss</li>
          <li>• Check for consistency in spelling (British vs American English)</li>
          <li>• Ensure consistent tense usage throughout sections</li>
          <li>• Verify that abbreviations are defined on first use</li>
          <li>• Always review AI corrections — you know your intended meaning best</li>
        </ul>
      </div>
    </div>
  );
}

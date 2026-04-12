'use client';

import { useState, useCallback } from 'react';
import { analyzeWriting, createOpenAIClient } from '@/lib/api';
import { AISuggestion } from '@/lib/types';
import { PenTool, Loader2, AlertCircle, CheckCircle2, ArrowRight, BookOpen } from 'lucide-react';

interface WritingToolProps {
  apiKey: string;
  university: string;
  citationStyle: string;
}

export function WritingTool({ apiKey, university, citationStyle }: WritingToolProps) {
  const [text, setText] = useState('');
  const [suggestions, setSuggestions] = useState<AISuggestion[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [selectedSuggestion, setSelectedSuggestion] = useState<AISuggestion | null>(null);
  const [context, setContext] = useState<'academic' | 'essay' | 'report' | 'literature_review'>('academic');

  const handleAnalyze = useCallback(async () => {
    if (!apiKey) {
      setError('Please add your API key in Settings first');
      return;
    }
    if (!text.trim()) {
      setError('Please enter some text to analyze');
      return;
    }

    setLoading(true);
    setError('');
    setSuggestions([]);
    setSelectedSuggestion(null);

    try {
      const client = createOpenAIClient(apiKey);
      const results = await analyzeWriting(client, text, context);
      setSuggestions(results);
    } catch (err: any) {
      setError(err.message || 'Failed to analyze text');
    } finally {
      setLoading(false);
    }
  }, [apiKey, text, context]);

  const severityColors = {
    low: 'bg-blue-100 text-blue-700 border-blue-200',
    medium: 'bg-amber-100 text-amber-700 border-amber-200',
    high: 'bg-red-100 text-red-700 border-red-200',
  };

  const typeIcons = {
    clarity: BookOpen,
    structure: AlertCircle,
    tone: CheckCircle2,
    vocabulary: PenTool,
    flow: ArrowRight,
  };

  return (
    <div className="p-6 max-w-7xl mx-auto animate-fade-in h-full flex flex-col">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-1">Writing Improvement Tool</h1>
        <p className="text-secondary">Paste your writing and get actionable suggestions with explanations</p>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm flex items-center gap-2">
          <AlertCircle size={16} />
          {error}
        </div>
      )}

      <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-6 min-h-0">
        {/* Input Panel */}
        <div className="flex flex-col">
          <div className="flex items-center justify-between mb-3">
            <label className="text-sm font-medium">Your Writing</label>
            <div className="flex items-center gap-3">
              <select 
                value={context} 
                onChange={(e) => setContext(e.target.value as any)}
                className="text-sm px-2 py-1 rounded-lg border border-card-border bg-card"
              >
                <option value="academic">Academic General</option>
                <option value="essay">Essay</option>
                <option value="report">Report</option>
                <option value="literature_review">Literature Review</option>
              </select>
              <button
                onClick={handleAnalyze}
                disabled={loading}
                className="px-4 py-2 bg-primary text-white rounded-lg text-sm font-medium hover:bg-primary-hover disabled:opacity-50 flex items-center gap-2"
              >
                {loading ? (
                  <><Loader2 size={16} className="animate-spin" /> Analyzing...</>
                ) : (
                  <><PenTool size={16} /> Analyze</>
                )}
              </button>
            </div>
          </div>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Paste your academic writing here..."
            className="flex-1 p-4 border border-card-border rounded-xl bg-card resize-none text-sm leading-relaxed focus:outline-none focus:ring-2 focus:ring-primary"
          />
          <div className="mt-2 text-xs text-muted text-right">
            {text.split(/\s+/).filter(Boolean).length} words
          </div>
        </div>

        {/* Suggestions Panel */}
        <div className="flex flex-col overflow-hidden">
          <label className="text-sm font-medium mb-3">
            Suggestions {suggestions.length > 0 && `(${suggestions.length})`}
          </label>
          
          {loading ? (
            <div className="flex-1 flex items-center justify-center text-secondary">
              <div className="text-center">
                <Loader2 size={32} className="animate-spin mx-auto mb-3" />
                <p className="text-sm">Analyzing your writing...</p>
              </div>
            </div>
          ) : suggestions.length === 0 ? (
            <div className="flex-1 flex items-center justify-center text-muted text-sm">
              {text ? 'Click Analyze to get suggestions' : 'Enter text to analyze'}
            </div>
          ) : (
            <div className="flex-1 overflow-y-auto space-y-3 pr-2">
              {suggestions.map((s) => {
                const TypeIcon = typeIcons[s.type];
                return (
                  <button
                    key={s.id}
                    onClick={() => setSelectedSuggestion(selectedSuggestion?.id === s.id ? null : s)}
                    className={`w-full text-left p-4 rounded-xl border transition-all ${
                      selectedSuggestion?.id === s.id 
                        ? 'border-primary bg-primary-light' 
                        : 'border-card-border bg-card hover:border-primary/50'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <div className="flex items-center gap-2">
                        <TypeIcon size={16} className="text-secondary" />
                        <span className="text-xs font-medium uppercase tracking-wide text-muted">{s.type}</span>
                      </div>
                      <span className={`text-xs px-2 py-0.5 rounded-full border ${severityColors[s.severity]}`}>
                        {s.severity}
                      </span>
                    </div>
                    <p className="text-sm text-muted line-clamp-2 mb-1">"{s.original}"</p>
                    {selectedSuggestion?.id === s.id && (
                      <div className="mt-3 pt-3 border-t border-primary/20 space-y-3 animate-fade-in">
                        <div>
                          <p className="text-xs font-medium text-muted mb-1">Suggestion:</p>
                          <p className="text-sm text-primary bg-primary-light/50 p-2 rounded">{s.suggestion}</p>
                        </div>
                        <div>
                          <p className="text-xs font-medium text-muted mb-1">Why this helps:</p>
                          <p className="text-sm">{s.explanation}</p>
                        </div>
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

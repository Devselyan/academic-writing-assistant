'use client';

import { useState, useCallback } from 'react';
import { formatCitation, createOpenAIClient } from '@/lib/api';
import { CITATION_STYLES } from '@/lib/types';
import { BookOpen, Loader2, AlertCircle, Copy, Plus, Trash2 } from 'lucide-react';

interface CitationToolProps {
  apiKey: string;
  university: string;
  citationStyle: string;
}

interface CitationEntry {
  id: string;
  sourceInfo: string;
  formatted: string;
  inText: string;
}

export function CitationTool({ apiKey, university, citationStyle }: CitationToolProps) {
  const [activeTab, setActiveTab] = useState<'generator' | 'bibliography'>('generator');
  const [sourceInput, setSourceInput] = useState('');
  const [selectedStyle, setSelectedStyle] = useState(citationStyle);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [citations, setCitations] = useState<CitationEntry[]>([]);
  const [lastCitation, setLastCitation] = useState<{ formatted: string; inText: string } | null>(null);

  const handleGenerate = useCallback(async () => {
    if (!apiKey) {
      setError('Please add your API key in Settings first');
      return;
    }
    if (!sourceInput.trim()) {
      setError('Please enter source information');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const client = createOpenAIClient(apiKey);
      const result = await formatCitation(client, sourceInput, selectedStyle);
      
      try {
        const parsed = JSON.parse(result);
        setLastCitation({ formatted: parsed.reference || result, inText: parsed.inText || '' });
      } catch {
        setLastCitation({ formatted: result, inText: '' });
      }
    } catch (err: any) {
      setError(err.message || 'Failed to generate citation');
    } finally {
      setLoading(false);
    }
  }, [apiKey, sourceInput, selectedStyle]);

  const addToBibliography = () => {
    if (!lastCitation) return;
    const newCitation: CitationEntry = {
      id: Date.now().toString(),
      sourceInfo: sourceInput,
      formatted: lastCitation.formatted,
      inText: lastCitation.inText,
    };
    setCitations([...citations, newCitation]);
    setSourceInput('');
    setLastCitation(null);
  };

  const removeCitation = (id: string) => {
    setCitations(citations.filter(c => c.id !== id));
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const exportBibliography = () => {
    const text = citations.map(c => c.formatted).join('\n\n');
    copyToClipboard(text);
  };

  return (
    <div className="p-6 max-w-5xl mx-auto animate-fade-in">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-1">Citations & Formatting</h1>
        <p className="text-secondary">Generate perfectly formatted citations for your academic work</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6">
        <button
          onClick={() => setActiveTab('generator')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            activeTab === 'generator' ? 'bg-primary text-white' : 'bg-muted-bg text-secondary hover:bg-card-border'
          }`}
        >
          Citation Generator
        </button>
        <button
          onClick={() => setActiveTab('bibliography')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            activeTab === 'bibliography' ? 'bg-primary text-white' : 'bg-muted-bg text-secondary hover:bg-card-border'
          }`}
        >
          Bibliography ({citations.length})
        </button>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm flex items-center gap-2">
          <AlertCircle size={16} />
          {error}
        </div>
      )}

      {activeTab === 'generator' && (
        <div className="space-y-6">
          {/* Style Selector */}
          <div className="flex items-center gap-4">
            <label className="text-sm font-medium">Citation Style:</label>
            <select
              value={selectedStyle}
              onChange={(e) => setSelectedStyle(e.target.value)}
              className="px-3 py-2 rounded-lg border border-card-border bg-card text-sm"
            >
              {Object.entries(CITATION_STYLES).map(([key, style]) => (
                <option key={key} value={key}>{style.name}</option>
              ))}
            </select>
            {university && (
              <span className="text-xs text-muted bg-muted-bg px-2 py-1 rounded">
                University default: {university}
              </span>
            )}
          </div>

          {/* Source Input */}
          <div className="space-y-3">
            <label className="text-sm font-medium">Source Information</label>
            <textarea
              value={sourceInput}
              onChange={(e) => setSourceInput(e.target.value)}
              placeholder={`Enter source details, e.g.:
- Book: Author name, title, publisher, year, ISBN
- Journal: Authors, article title, journal name, volume, issue, pages, DOI
- Website: Author/title, URL, access date
- Or paste a DOI/URL and I'll extract the metadata`}
              className="w-full h-32 p-4 border border-card-border rounded-xl bg-card resize-none text-sm leading-relaxed focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <button
              onClick={handleGenerate}
              disabled={loading}
              className="px-4 py-2 bg-primary text-white rounded-lg text-sm font-medium hover:bg-primary-hover disabled:opacity-50 flex items-center gap-2"
            >
              {loading ? (
                <><Loader2 size={16} className="animate-spin" /> Generating...</>
              ) : (
                <><BookOpen size={16} /> Generate Citation</>
              )}
            </button>
          </div>

          {/* Result */}
          {lastCitation && (
            <div className="p-4 bg-card border border-card-border rounded-xl space-y-3 animate-fade-in">
              <div>
                <p className="text-xs font-medium text-muted mb-2">In-text citation:</p>
                <div className="flex items-center justify-between p-3 bg-muted-bg rounded-lg">
                  <code className="text-sm">{lastCitation.inText || 'N/A'}</code>
                  <button onClick={() => copyToClipboard(lastCitation.inText)} className="p-1 hover:bg-card-border rounded">
                    <Copy size={14} />
                  </button>
                </div>
              </div>
              <div>
                <p className="text-xs font-medium text-muted mb-2">Full reference:</p>
                <div className="flex items-start justify-between p-3 bg-muted-bg rounded-lg">
                  <p className="text-sm flex-1 pr-2">{lastCitation.formatted}</p>
                  <button onClick={() => copyToClipboard(lastCitation.formatted)} className="p-1 hover:bg-card-border rounded flex-shrink-0">
                    <Copy size={14} />
                  </button>
                </div>
              </div>
              <button
                onClick={addToBibliography}
                className="flex items-center gap-2 text-sm text-primary hover:underline"
              >
                <Plus size={14} /> Add to Bibliography
              </button>
            </div>
          )}

          {/* Quick Tips */}
          <div className="p-4 bg-muted-bg rounded-xl">
            <p className="text-sm font-medium mb-2">Tips for best results:</p>
            <ul className="text-xs text-secondary space-y-1">
              <li>• Include as much detail as possible (authors, title, year, publisher, DOI/URL)</li>
              <li>• For DOIs, just paste the DOI number (e.g., 10.1038/nature12373)</li>
              <li>• For websites, include the access date and full URL</li>
              <li>• Always verify AI-generated citations against the official style guide</li>
            </ul>
          </div>
        </div>
      )}

      {activeTab === 'bibliography' && (
        <div className="space-y-4">
          {citations.length === 0 ? (
            <div className="text-center py-12 text-muted">
              <BookOpen size={48} className="mx-auto mb-3 opacity-50" />
              <p>No citations in bibliography yet</p>
              <p className="text-sm">Generate citations and add them here</p>
            </div>
          ) : (
            <>
              <div className="flex justify-end">
                <button
                  onClick={exportBibliography}
                  className="px-3 py-1.5 text-sm bg-primary text-white rounded-lg hover:bg-primary-hover flex items-center gap-2"
                >
                  <Copy size={14} /> Copy All
                </button>
              </div>
              <div className="space-y-3">
                {citations.map((citation) => (
                  <div key={citation.id} className="p-3 bg-card border border-card-border rounded-lg group">
                    <div className="flex items-start justify-between gap-2">
                      <p className="text-sm flex-1">{citation.formatted}</p>
                      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button 
                          onClick={() => copyToClipboard(citation.formatted)}
                          className="p-1 hover:bg-muted-bg rounded"
                          title="Copy"
                        >
                          <Copy size={14} />
                        </button>
                        <button 
                          onClick={() => removeCitation(citation.id)}
                          className="p-1 hover:bg-red-100 rounded text-red-500"
                          title="Remove"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                    {citation.inText && (
                      <p className="text-xs text-muted mt-2">In-text: {citation.inText}</p>
                    )}
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}

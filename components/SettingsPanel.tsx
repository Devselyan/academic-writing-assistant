'use client';

import { useState } from 'react';
import { Settings, Save, AlertCircle, CheckCircle, Key, Building, BookOpen } from 'lucide-react';
import { DEFAULT_UNIVERSITIES, CITATION_STYLES } from '@/lib/types';

interface SettingsPanelProps {
  onSave: (settings: { apiKey: string; university: string; citationStyle: string }) => void;
  initialSettings: { apiKey: string; university: string; citationStyle: string };
}

export function SettingsPanel({ onSave, initialSettings }: SettingsPanelProps) {
  const [apiKey, setApiKey] = useState(initialSettings.apiKey);
  const [university, setUniversity] = useState(initialSettings.university);
  const [citationStyle, setCitationStyle] = useState(initialSettings.citationStyle);
  const [saved, setSaved] = useState(false);
  const [showApiKey, setShowApiKey] = useState(false);

  const handleSave = () => {
    onSave({ apiKey, university, citationStyle });
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const selectedUniversity = university ? DEFAULT_UNIVERSITIES[university as keyof typeof DEFAULT_UNIVERSITIES] : null;

  return (
    <div className="p-6 max-w-4xl mx-auto animate-fade-in">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-1">Settings</h1>
        <p className="text-secondary">Configure your API key, university, and citation preferences</p>
      </div>

      {saved && (
        <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg text-green-700 text-sm flex items-center gap-2">
          <CheckCircle size={16} />
          Settings saved successfully!
        </div>
      )}

      <div className="space-y-6">
        {/* API Key */}
        <div className="p-6 bg-card border border-card-border rounded-xl">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-primary/10 rounded-lg">
              <Key size={20} className="text-primary" />
            </div>
            <div>
              <h2 className="font-semibold">OpenAI API Key</h2>
              <p className="text-xs text-secondary">Your key is stored only in your browser's localStorage</p>
            </div>
          </div>
          <div className="space-y-3">
            <div className="relative">
              <input
                type={showApiKey ? 'text' : 'password'}
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder="sk-..."
                className="w-full px-3 py-2 pr-20 border border-card-border rounded-lg bg-background text-sm font-mono focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <button
                onClick={() => setShowApiKey(!showApiKey)}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-xs text-secondary hover:text-foreground px-2 py-1"
              >
                {showApiKey ? 'Hide' : 'Show'}
              </button>
            </div>
            <div className="p-3 bg-muted-bg rounded-lg text-xs text-secondary space-y-1">
              <p className="font-medium text-foreground">How to get an API key:</p>
              <ol className="list-decimal list-inside space-y-1">
                <li>Go to <a href="https://platform.openai.com/api-keys" target="_blank" rel="noopener noreferrer" className="text-primary underline">platform.openai.com/api-keys</a></li>
                <li>Sign in or create an account</li>
                <li>Click "Create new secret key"</li>
                <li>Copy and paste it here</li>
              </ol>
              <p className="mt-2 text-amber-600">Note: OpenAI API usage is billed per token. For a thesis, expect $2-10 depending on length.</p>
            </div>
          </div>
        </div>

        {/* University */}
        <div className="p-6 bg-card border border-card-border rounded-xl">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-emerald-500/10 rounded-lg">
              <Building size={20} className="text-emerald-500" />
            </div>
            <div>
              <h2 className="font-semibold">University</h2>
              <p className="text-xs text-secondary">Select your institution for guidelines-compliant formatting</p>
            </div>
          </div>
          <select
            value={university}
            onChange={(e) => setUniversity(e.target.value)}
            className="w-full px-3 py-2 border border-card-border rounded-lg bg-background text-sm"
          >
            <option value="">Custom / Not Listed</option>
            {Object.entries(DEFAULT_UNIVERSITIES).map(([key, val]) => (
              <option key={key} value={key}>{val.name}</option>
            ))}
          </select>

          {selectedUniversity && (
            <div className="mt-4 p-4 bg-muted-bg rounded-lg space-y-3">
              <h3 className="text-sm font-medium">{selectedUniversity.name} — Guidelines</h3>
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div>
                  <span className="text-muted">Citation Style:</span>
                  <p className="font-medium">{selectedUniversity.citationStyle.toUpperCase()}</p>
                </div>
                <div>
                  <span className="text-muted">Font:</span>
                  <p className="font-medium">{selectedUniversity.font} {selectedUniversity.fontSize}pt</p>
                </div>
                <div>
                  <span className="text-muted">Line Spacing:</span>
                  <p className="font-medium">{selectedUniversity.lineSpacing}</p>
                </div>
                <div>
                  <span className="text-muted">Margins:</span>
                  <p className="font-medium">
                    T:{selectedUniversity.margins.top} B:{selectedUniversity.margins.bottom} L:{selectedUniversity.margins.left} R:{selectedUniversity.margins.right} cm
                  </p>
                </div>
              </div>
              <div>
                <span className="text-muted text-xs">Required Structure:</span>
                <div className="flex flex-wrap gap-1 mt-1">
                  {selectedUniversity.structure.map((s, i) => (
                    <span key={i} className="text-xs px-2 py-0.5 bg-card border border-card-border rounded">{s}</span>
                  ))}
                </div>
              </div>
              <div>
                <span className="text-muted text-xs">Additional Rules:</span>
                <ul className="mt-1 space-y-1">
                  {selectedUniversity.additionalRules.map((rule, i) => (
                    <li key={i} className="text-xs">• {rule}</li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </div>

        {/* Citation Style */}
        <div className="p-6 bg-card border border-card-border rounded-xl">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-violet-500/10 rounded-lg">
              <BookOpen size={20} className="text-violet-500" />
            </div>
            <div>
              <h2 className="font-semibold">Default Citation Style</h2>
              <p className="text-xs text-secondary">Used in the Citation Generator and Thesis Export</p>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {Object.entries(CITATION_STYLES).map(([key, style]) => (
              <button
                key={key}
                onClick={() => setCitationStyle(key)}
                className={`p-3 rounded-lg border text-left transition-all ${
                  citationStyle === key
                    ? 'border-primary bg-primary-light'
                    : 'border-card-border bg-background hover:border-primary/50'
                }`}
              >
                <p className="text-sm font-medium">{style.name}</p>
                <p className="text-xs text-muted mt-1">In-text: {style.inText}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Save Button */}
        <button
          onClick={handleSave}
          className="w-full px-4 py-3 bg-primary text-white rounded-lg font-medium hover:bg-primary-hover flex items-center justify-center gap-2"
        >
          <Save size={18} /> Save Settings
        </button>
      </div>
    </div>
  );
}

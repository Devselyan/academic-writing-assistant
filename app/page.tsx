'use client';

import { useState, useEffect } from 'react';
import { Dashboard } from '@/components/Dashboard';
import { WritingTool } from '@/components/WritingTool';
import { CitationTool } from '@/components/CitationTool';
import { ProofreadingTool } from '@/components/ProofreadingTool';
import { ThesisTool } from '@/components/ThesisTool';
import { SettingsPanel } from '@/components/SettingsPanel';
import { 
  LayoutDashboard, 
  PenTool, 
  BookOpen, 
  CheckCircle, 
  FileText, 
  Settings,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';

type ToolType = 'dashboard' | 'writing' | 'citation' | 'proofreading' | 'thesis' | 'settings';

export default function Home() {
  const [activeTool, setActiveTool] = useState<ToolType>('dashboard');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [apiKey, setApiKey] = useState('');
  const [university, setUniversity] = useState('');
  const [citationStyle, setCitationStyle] = useState('apa');

  useEffect(() => {
    const saved = localStorage.getItem('awa-settings');
    if (saved) {
      const parsed = JSON.parse(saved);
      if (parsed.apiKey) setApiKey(parsed.apiKey);
      if (parsed.university) setUniversity(parsed.university);
      if (parsed.citationStyle) setCitationStyle(parsed.citationStyle);
    }
  }, []);

  const saveSettings = (settings: { apiKey?: string; university?: string; citationStyle?: string }) => {
    const newSettings = { 
      apiKey: settings.apiKey ?? apiKey, 
      university: settings.university ?? university, 
      citationStyle: settings.citationStyle ?? citationStyle 
    };
    localStorage.setItem('awa-settings', JSON.stringify(newSettings));
    if (settings.apiKey) setApiKey(settings.apiKey);
    if (settings.university) setUniversity(settings.university);
    if (settings.citationStyle) setCitationStyle(settings.citationStyle);
  };

  const navItems = [
    { id: 'dashboard' as const, label: 'Dashboard', icon: LayoutDashboard },
    { id: 'writing' as const, label: 'Writing Assistant', icon: PenTool },
    { id: 'citation' as const, label: 'Citations & Formatting', icon: BookOpen },
    { id: 'proofreading' as const, label: 'Proofreading', icon: CheckCircle },
    { id: 'thesis' as const, label: 'Thesis Generator', icon: FileText },
    { id: 'settings' as const, label: 'Settings', icon: Settings },
  ];

  const renderTool = () => {
    const props = { apiKey, university, citationStyle };
    switch (activeTool) {
      case 'dashboard': return <Dashboard />;
      case 'writing': return <WritingTool {...props} />;
      case 'citation': return <CitationTool {...props} />;
      case 'proofreading': return <ProofreadingTool {...props} />;
      case 'thesis': return <ThesisTool {...props} />;
      case 'settings': return <SettingsPanel onSave={saveSettings} initialSettings={{ apiKey, university, citationStyle }} />;
      default: return <Dashboard />;
    }
  };

  return (
    <div className="flex h-screen bg-background text-foreground">
      {/* Sidebar */}
      <aside 
        className={`flex flex-col border-r border-sidebar-border bg-sidebar transition-all duration-300 ${
          sidebarCollapsed ? 'w-16' : 'w-64'
        }`}
      >
        <div className="flex items-center justify-between p-4 border-b border-sidebar-border">
          {!sidebarCollapsed && (
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <PenTool className="w-4 h-4 text-white" />
              </div>
              <span className="font-bold text-sm">Academic WA</span>
            </div>
          )}
          <button 
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            className="p-1.5 rounded-lg hover:bg-muted-bg transition-colors"
          >
            {sidebarCollapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
          </button>
        </div>

        <nav className="flex-1 p-2 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTool(item.id)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all text-sm font-medium ${
                  activeTool === item.id 
                    ? 'bg-primary text-white' 
                    : 'text-secondary hover:bg-muted-bg'
                }`}
                title={sidebarCollapsed ? item.label : undefined}
              >
                <Icon size={20} />
                {!sidebarCollapsed && <span>{item.label}</span>}
              </button>
            );
          })}
        </nav>

        {!sidebarCollapsed && (
          <div className="p-4 border-t border-sidebar-border">
            <p className="text-xs text-muted">Academic Writing Assistant</p>
            <p className="text-xs text-muted mt-1">For legitimate academic improvement</p>
          </div>
        )}
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        {renderTool()}
      </main>
    </div>
  );
}

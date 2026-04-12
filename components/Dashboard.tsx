'use client';

import { PenTool, BookOpen, CheckCircle, FileText, Sparkles, Lightbulb, BookOpenCheck, GraduationCap } from 'lucide-react';

interface DashboardProps {}

export function Dashboard({}: DashboardProps) {
  const tools = [
    {
      id: 'writing',
      title: 'Writing Improvement Tool',
      icon: PenTool,
      color: 'bg-blue-500',
      description: 'Get AI-powered suggestions to improve your academic writing. Learn why changes matter with clear explanations.',
      features: ['Clarity analysis', 'Structure feedback', 'Tone assessment', 'Vocabulary suggestions', 'Flow improvements'],
    },
    {
      id: 'citation',
      title: 'Citations & Formatting',
      icon: BookOpen,
      color: 'bg-emerald-500',
      description: 'Generate perfectly formatted citations and ensure your document meets university-specific formatting requirements.',
      features: ['APA, MLA, Chicago, Harvard, IEEE, Oxford', 'University-specific templates', 'Bibliography generation', 'Format validation'],
    },
    {
      id: 'proofreading',
      title: 'Proofreading Tool',
      icon: CheckCircle,
      color: 'bg-violet-500',
      description: 'Comprehensive grammar, spelling, and style checking designed specifically for academic writing.',
      features: ['Grammar correction', 'Spelling check', 'Academic style guide', 'Consistency checking', 'Quality scoring'],
    },
    {
      id: 'thesis',
      title: 'Thesis Generator',
      icon: FileText,
      color: 'bg-amber-500',
      description: 'Structure and draft your thesis with university-compliant templates. Export to Word with perfect formatting.',
      features: ['Custom thesis structure', 'Section-by-section drafting', 'Word document export', 'University guidelines compliance'],
    },
  ];

  const quickTips = [
    { icon: Lightbulb, tip: 'Always write your first draft yourself, then use tools to improve' },
    { icon: BookOpenCheck, tip: 'Verify all AI-suggested citations against original sources' },
    { icon: GraduationCap, tip: 'Check your university\'s specific guidelines before final submission' },
    { icon: Sparkles, tip: 'Use the Writing Assistant to learn, not just to fix text' },
  ];

  return (
    <div className="p-8 max-w-7xl mx-auto animate-fade-in">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Academic Writing Assistant</h1>
        <p className="text-secondary text-lg">Legitimate tools to improve your academic writing skills</p>
      </div>

      {/* Tips Banner */}
      <div className="mb-8 p-4 bg-primary-light rounded-xl border border-primary/20">
        <h3 className="font-semibold text-primary mb-3">Best Practices</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {quickTips.map((item, i) => (
            <div key={i} className="flex items-start gap-2 text-sm">
              <item.icon size={16} className="text-primary mt-0.5 flex-shrink-0" />
              <span className="text-secondary">{item.tip}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Tools Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {tools.map((tool) => {
          const Icon = tool.icon;
          return (
            <div 
              key={tool.id}
              className="p-6 bg-card border border-card-border rounded-xl hover:shadow-lg transition-all group"
            >
              <div className="flex items-start gap-4 mb-4">
                <div className={`p-3 rounded-lg ${tool.color} text-white`}>
                  <Icon size={24} />
                </div>
                <div>
                  <h2 className="text-xl font-semibold">{tool.title}</h2>
                  <p className="text-sm text-secondary mt-1">{tool.description}</p>
                </div>
              </div>
              <div className="space-y-2">
                <p className="text-xs font-medium text-muted uppercase tracking-wide">Features:</p>
                <div className="flex flex-wrap gap-2">
                  {tool.features.map((f, i) => (
                    <span key={i} className="text-xs px-2 py-1 bg-muted-bg rounded-md text-secondary">
                      {f}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Getting Started */}
      <div className="mt-8 p-6 bg-muted-bg rounded-xl">
        <h2 className="text-lg font-semibold mb-3">Getting Started</h2>
        <ol className="space-y-2 text-secondary">
          <li className="flex items-start gap-2">
            <span className="flex-shrink-0 w-6 h-6 bg-primary text-white rounded-full flex items-center justify-center text-xs font-bold">1</span>
            <span>Go to <strong className="text-foreground">Settings</strong> and add your OpenAI API key</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="flex-shrink-0 w-6 h-6 bg-primary text-white rounded-full flex items-center justify-center text-xs font-bold">2</span>
            <span>Select your university or enter your institution's guidelines</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="flex-shrink-0 w-6 h-6 bg-primary text-white rounded-full flex items-center justify-center text-xs font-bold">3</span>
            <span>Choose a tool from the sidebar and paste your writing</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="flex-shrink-0 w-6 h-6 bg-primary text-white rounded-full flex items-center justify-center text-xs font-bold">4</span>
            <span>Review suggestions and learn from the explanations</span>
          </li>
        </ol>
      </div>
    </div>
  );
}

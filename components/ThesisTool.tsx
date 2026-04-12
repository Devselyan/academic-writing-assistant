'use client';

import { useState, useCallback } from 'react';
import { generateThesisStructure, expandThesisContent, createOpenAIClient } from '@/lib/api';
import { DEFAULT_UNIVERSITIES } from '@/lib/types';
import { FileText, Loader2, AlertCircle, Download, Plus, ChevronDown, ChevronUp, Save } from 'lucide-react';
import { Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType, PageBreak } from 'docx';

interface ThesisToolProps {
  apiKey: string;
  university: string;
  citationStyle: string;
}

interface ThesisSection {
  id: string;
  title: string;
  description: string;
  wordCount: number;
  subsections: string[];
  content: string;
  notes: string;
  expanded: boolean;
}

export function ThesisTool({ apiKey, university, citationStyle }: ThesisToolProps) {
  const [step, setStep] = useState<'setup' | 'structure' | 'draft'>('setup');
  const [topic, setTopic] = useState('');
  const [degree, setDegree] = useState('');
  const [department, setDepartment] = useState('');
  const [selectedUniversity, setSelectedUniversity] = useState(university || '');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [sections, setSections] = useState<ThesisSection[]>([]);
  const [totalWords, setTotalWords] = useState(0);
  const [currentSection, setCurrentSection] = useState<string | null>(null);
  const [generatingContent, setGeneratingContent] = useState(false);

  const universities = Object.entries(DEFAULT_UNIVERSITIES).map(([key, val]) => ({
    key,
    ...val,
  }));

  const handleGenerateStructure = useCallback(async () => {
    if (!apiKey) {
      setError('Please add your API key in Settings first');
      return;
    }
    if (!topic || !degree) {
      setError('Please fill in at least the topic and degree');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const client = createOpenAIClient(apiKey);
      const result = await generateThesisStructure(
        client,
        topic,
        selectedUniversity || 'Custom University',
        degree,
        department || 'General'
      );

      const thesisSections: ThesisSection[] = result.structure.map((s, i) => ({
        id: `section-${i}`,
        title: s.title,
        description: s.description,
        wordCount: s.wordCount,
        subsections: s.subsections,
        content: '',
        notes: '',
        expanded: i === 0,
      }));

      setSections(thesisSections);
      setTotalWords(result.totalWords);
      setStep('structure');
    } catch (err: any) {
      setError(err.message || 'Failed to generate structure');
    } finally {
      setLoading(false);
    }
  }, [apiKey, topic, degree, department, selectedUniversity]);

  const handleExpandSection = async (sectionId: string) => {
    const section = sections.find(s => s.id === sectionId);
    if (!section || !apiKey) return;

    setGeneratingContent(true);
    setCurrentSection(sectionId);
    setError('');

    try {
      const client = createOpenAIClient(apiKey);
      const content = await expandThesisContent(
        client,
        section.title,
        section.description,
        topic,
        section.notes || `Write comprehensive content covering: ${section.subsections.join(', ')}`,
        'academic'
      );

      setSections(sections.map(s =>
        s.id === sectionId ? { ...s, content, expanded: true } : s
      ));
    } catch (err: any) {
      setError(err.message || 'Failed to generate content');
    } finally {
      setGeneratingContent(false);
      setCurrentSection(null);
    }
  };

  const toggleSection = (sectionId: string) => {
    setSections(sections.map(s =>
      s.id === sectionId ? { ...s, expanded: !s.expanded } : s
    ));
  };

  const updateSectionNotes = (sectionId: string, notes: string) => {
    setSections(sections.map(s =>
      s.id === sectionId ? { ...s, notes } : s
    ));
  };

  const updateSectionContent = (sectionId: string, content: string) => {
    setSections(sections.map(s =>
      s.id === sectionId ? { ...s, content } : s
    ));
  };

  const addCustomSection = () => {
    const newSection: ThesisSection = {
      id: `custom-${Date.now()}`,
      title: 'New Section',
      description: 'Custom section',
      wordCount: 1000,
      subsections: [],
      content: '',
      notes: '',
      expanded: true,
    };
    setSections([...sections, newSection]);
  };

  const exportToWord = async () => {
    if (sections.length === 0) return;

    const doc = new Document({
      sections: [{
        properties: {},
        children: sections.flatMap((section, idx) => {
          const children: any[] = [];

          // Section heading
          children.push(
            new Paragraph({
              heading: HeadingLevel.HEADING_1,
              alignment: AlignmentType.LEFT,
              children: [
                new TextRun({
                  text: section.title,
                  bold: true,
                  size: 28,
                  font: 'Times New Roman',
                }),
              ],
            })
          );

          // Subsection headings
          section.subsections.forEach(sub => {
            children.push(
              new Paragraph({
                heading: HeadingLevel.HEADING_2,
                children: [
                  new TextRun({
                    text: sub,
                    bold: true,
                    size: 24,
                    font: 'Times New Roman',
                  }),
                ],
              })
            );
          });

          // Content paragraphs
          if (section.content) {
            const paragraphs = section.content.split('\n\n').filter(Boolean);
            paragraphs.forEach(para => {
              const trimmed = para.trim();
              if (trimmed) {
                // Check if it's a heading (starts with # or **)
                if (trimmed.startsWith('##') || trimmed.startsWith('# ')) {
                  const text = trimmed.replace(/^#+\s*/, '').replace(/\*\*/g, '');
                  children.push(
                    new Paragraph({
                      heading: HeadingLevel.HEADING_2,
                      spacing: { before: 200, after: 100 },
                      children: [
                        new TextRun({
                          text,
                          bold: true,
                          size: 24,
                          font: 'Times New Roman',
                        }),
                      ],
                    })
                  );
                } else {
                  children.push(
                    new Paragraph({
                      spacing: { after: 120, line: 360 },
                      children: [
                        new TextRun({
                          text: trimmed,
                          size: 24,
                          font: 'Times New Roman',
                        }),
                      ],
                    })
                  );
                }
              }
            });
          }

          // Page break between major sections (not after last)
          if (idx < sections.length - 1) {
            children.push(new Paragraph({ children: [new PageBreak()] }));
          }

          return children;
        }),
      }],
    });

    const blob = await Packer.toBlob(doc);
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${topic.replace(/[^a-z0-9]/gi, '_').substring(0, 30)}_thesis.docx`;
    a.click();
    URL.revokeObjectURL(url);
  };

  if (step === 'setup') {
    return (
      <div className="p-6 max-w-3xl mx-auto animate-fade-in">
        <div className="mb-6">
          <h1 className="text-2xl font-bold mb-1">Thesis Generator</h1>
          <p className="text-secondary">Structure and draft your thesis with university-compliant templates</p>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm flex items-center gap-2">
            <AlertCircle size={16} />
            {error}
          </div>
        )}

        <div className="space-y-6 bg-card border border-card-border rounded-xl p-6">
          <div>
            <label className="block text-sm font-medium mb-2">Thesis Topic / Title</label>
            <input
              type="text"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="e.g., The Impact of Social Media on Mental Health Among Adolescents"
              className="w-full px-3 py-2 border border-card-border rounded-lg bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Degree Level</label>
              <select
                value={degree}
                onChange={(e) => setDegree(e.target.value)}
                className="w-full px-3 py-2 border border-card-border rounded-lg bg-background text-sm"
              >
                <option value="">Select...</option>
                <option value="Bachelor">Bachelor's</option>
                <option value="Master">Master's</option>
                <option value="PhD">PhD / Doctoral</option>
                <option value="MPhil">MPhil</option>
                <option value="MRes">MRes</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Department / Field</label>
              <input
                type="text"
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                placeholder="e.g., Psychology"
                className="w-full px-3 py-2 border border-card-border rounded-lg bg-background text-sm"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">University</label>
            <select
              value={selectedUniversity}
              onChange={(e) => setSelectedUniversity(e.target.value)}
              className="w-full px-3 py-2 border border-card-border rounded-lg bg-background text-sm"
            >
              <option value="">Custom / Not Listed</option>
              {universities.map(u => (
                <option key={u.key} value={u.key}>{u.name}</option>
              ))}
            </select>
            {selectedUniversity && DEFAULT_UNIVERSITIES[selectedUniversity as keyof typeof DEFAULT_UNIVERSITIES] && (
              <div className="mt-2 p-3 bg-muted-bg rounded-lg text-xs text-secondary">
                <p className="font-medium text-foreground mb-1">University Guidelines:</p>
                <ul className="space-y-1">
                  {DEFAULT_UNIVERSITIES[selectedUniversity as keyof typeof DEFAULT_UNIVERSITIES].additionalRules.map((rule, i) => (
                    <li key={i}>• {rule}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          <button
            onClick={handleGenerateStructure}
            disabled={loading}
            className="w-full px-4 py-3 bg-primary text-white rounded-lg font-medium hover:bg-primary-hover disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {loading ? (
              <><Loader2 size={18} className="animate-spin" /> Generating Structure...</>
            ) : (
              <><FileText size={18} /> Generate Thesis Structure</>
            )}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-6xl mx-auto animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold mb-1">Thesis: {topic}</h1>
          <p className="text-secondary">{degree} · {department || 'General'} · {selectedUniversity || 'Custom'}</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={addCustomSection}
            className="px-3 py-2 text-sm border border-card-border rounded-lg hover:bg-muted-bg flex items-center gap-2"
          >
            <Plus size={14} /> Add Section
          </button>
          <button
            onClick={exportToWord}
            className="px-3 py-2 text-sm bg-primary text-white rounded-lg hover:bg-primary-hover flex items-center gap-2"
          >
            <Download size={14} /> Export to Word
          </button>
        </div>
      </div>

      {/* Progress */}
      <div className="mb-6 p-4 bg-muted-bg rounded-xl">
        <div className="flex items-center justify-between text-sm mb-2">
          <span className="font-medium">Progress</span>
          <span className="text-secondary">
            {sections.filter(s => s.content.length > 0).length} / {sections.length} sections drafted
          </span>
        </div>
        <div className="w-full bg-card-border rounded-full h-2">
          <div
            className="bg-primary h-2 rounded-full transition-all"
            style={{ width: `${(sections.filter(s => s.content.length > 0).length / sections.length) * 100}%` }}
          />
        </div>
        <p className="text-xs text-muted mt-2">Estimated total: ~{totalWords.toLocaleString()} words</p>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm flex items-center gap-2">
          <AlertCircle size={16} />
          {error}
        </div>
      )}

      {/* Sections */}
      <div className="space-y-3">
        {sections.map((section) => (
          <div key={section.id} className="border border-card-border rounded-xl bg-card overflow-hidden">
            <button
              onClick={() => toggleSection(section.id)}
              className="w-full flex items-center justify-between p-4 hover:bg-muted-bg transition-colors"
            >
              <div className="flex items-center gap-3 text-left">
                {section.expanded ? <ChevronDown size={18} /> : <ChevronUp size={18} />}
                <div>
                  <h3 className="font-medium">{section.title}</h3>
                  <p className="text-xs text-secondary">~{section.wordCount.toLocaleString()} words</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {section.content && (
                  <span className="text-xs px-2 py-1 bg-green-100 text-green-700 rounded-full">Drafted</span>
                )}
                {!section.content && (
                  <span className="text-xs px-2 py-1 bg-muted-bg text-muted rounded-full">Empty</span>
                )}
              </div>
            </button>

            {section.expanded && (
              <div className="p-4 border-t border-card-border space-y-4 animate-fade-in">
                {/* Description */}
                <div>
                  <p className="text-xs font-medium text-muted mb-1">What this section should cover:</p>
                  <p className="text-sm text-secondary">{section.description}</p>
                </div>

                {/* Subsections */}
                {section.subsections.length > 0 && (
                  <div>
                    <p className="text-xs font-medium text-muted mb-2">Subsections:</p>
                    <div className="flex flex-wrap gap-2">
                      {section.subsections.map((sub, i) => (
                        <span key={i} className="text-xs px-2 py-1 bg-muted-bg rounded">{sub}</span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Notes Input */}
                <div>
                  <label className="text-xs font-medium text-muted mb-1 block">Your Notes & Arguments:</label>
                  <textarea
                    value={section.notes}
                    onChange={(e) => updateSectionNotes(section.id, e.target.value)}
                    placeholder="Add your key points, arguments, and notes for this section..."
                    className="w-full h-24 p-3 border border-card-border rounded-lg bg-background resize-none text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>

                {/* Content */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-xs font-medium text-muted">Section Content:</label>
                    <button
                      onClick={() => handleExpandSection(section.id)}
                      disabled={generatingContent}
                      className="text-xs px-3 py-1 bg-primary text-white rounded hover:bg-primary-hover disabled:opacity-50 flex items-center gap-1"
                    >
                      {generatingContent && currentSection === section.id ? (
                        <><Loader2 size={12} className="animate-spin" /> Generating...</>
                      ) : (
                        <><SparklesIcon size={12} /> {section.content ? 'Regenerate' : 'Generate'}</>
                      )}
                    </button>
                  </div>
                  <textarea
                    value={section.content}
                    onChange={(e) => updateSectionContent(section.id, e.target.value)}
                    placeholder="Generated content will appear here, or write manually..."
                    className="w-full h-48 p-3 border border-card-border rounded-lg bg-background resize-none text-sm leading-relaxed focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                  <p className="text-xs text-muted mt-1">{section.content.split(/\s+/).filter(Boolean).length} words</p>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

function SparklesIcon({ size }: { size: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z" />
      <path d="M5 3v4" />
      <path d="M19 17v4" />
      <path d="M3 5h4" />
      <path d="M17 19h4" />
    </svg>
  );
}

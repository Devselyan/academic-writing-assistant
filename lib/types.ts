export interface AISuggestion {
  id: string;
  original: string;
  suggestion: string;
  explanation: string;
  type: 'clarity' | 'structure' | 'tone' | 'vocabulary' | 'flow';
  severity: 'low' | 'medium' | 'high';
}

export interface UniversityGuidelines {
  name: string;
  url?: string;
  citationStyle: string;
  font: string;
  fontSize: number;
  lineSpacing: number;
  margins: { top: number; bottom: number; left: number; right: number };
  structure: string[];
  additionalRules: string[];
}

export const DEFAULT_UNIVERSITIES: Record<string, UniversityGuidelines> = {
  'oxford': {
    name: 'University of Oxford',
    citationStyle: 'oscola',
    font: 'Times New Roman',
    fontSize: 12,
    lineSpacing: 1.5,
    margins: { top: 2.54, bottom: 2.54, left: 2.54, right: 2.54 },
    structure: ['Title Page', 'Abstract', 'Table of Contents', 'Introduction', 'Literature Review', 'Methodology', 'Results', 'Discussion', 'Conclusion', 'References', 'Appendices'],
    additionalRules: ['Use British English spelling', 'Footnotes for citations', 'Bibliography separate from footnotes'],
  },
  'cambridge': {
    name: 'University of Cambridge',
    citationStyle: 'harvard',
    font: 'Times New Roman',
    fontSize: 12,
    lineSpacing: 1.5,
    margins: { top: 2.54, bottom: 2.54, left: 2.54, right: 2.54 },
    structure: ['Title Page', 'Abstract', 'Acknowledgements', 'Table of Contents', 'List of Figures', 'Introduction', 'Literature Review', 'Methodology', 'Results', 'Discussion', 'Conclusion', 'References', 'Appendices'],
    additionalRules: ['Use British English spelling', 'Harvard referencing style', 'Word count must be stated'],
  },
  'harvard': {
    name: 'Harvard University',
    citationStyle: 'apa',
    font: 'Times New Roman',
    fontSize: 12,
    lineSpacing: 2,
    margins: { top: 2.54, bottom: 2.54, left: 2.54, right: 2.54 },
    structure: ['Title Page', 'Abstract', 'Main Body', 'References', 'Appendices'],
    additionalRules: ['Running head on all pages', 'Page numbers in top right', 'APA 7th edition format'],
  },
  'stanford': {
    name: 'Stanford University',
    citationStyle: 'apa',
    font: 'Times New Roman',
    fontSize: 12,
    lineSpacing: 2,
    margins: { top: 2.54, bottom: 2.54, left: 3.18, right: 2.54 },
    structure: ['Title Page', 'Abstract', 'Table of Contents', 'Introduction', 'Literature Review', 'Methodology', 'Results', 'Discussion', 'Conclusion', 'References', 'Appendices'],
    additionalRules: ['1-inch margins minimum', 'Double-spaced throughout', 'APA or Chicago style acceptable'],
  },
  'mit': {
    name: 'Massachusetts Institute of Technology',
    citationStyle: 'ieee',
    font: 'Times New Roman',
    fontSize: 12,
    lineSpacing: 1.5,
    margins: { top: 2.54, bottom: 2.54, left: 2.54, right: 2.54 },
    structure: ['Title Page', 'Abstract', 'Introduction', 'Background', 'Methodology', 'Results', 'Discussion', 'Conclusion', 'References', 'Appendices'],
    additionalRules: ['IEEE citation style preferred for technical work', 'Clear section numbering'],
  },
};

export const CITATION_STYLES = {
  apa: { name: 'APA 7th Edition', inText: '(Author, Year)', reference: 'Author, A. A. (Year). Title. Publisher.' },
  mla: { name: 'MLA 9th Edition', inText: '(Author Page)', reference: 'Author, First Name. Title. Publisher, Year.' },
  chicago: { name: 'Chicago 17th Edition', inText: 'Author Year, Page', reference: 'Author, First Name. Title. Place: Publisher, Year.' },
  harvard: { name: 'Harvard', inText: '(Author, Year)', reference: 'Author, A. (Year) Title. Place: Publisher.' },
  ieee: { name: 'IEEE', inText: '[1]', reference: '[1] A. Author, Title. Place: Publisher, Year.' },
  oxford: { name: 'Oxford', inText: 'Footnote¹', reference: '¹Author, Title (Place: Publisher, Year), page.' },
  vancouver: { name: 'Vancouver', inText: '(1)', reference: '1. Author AA. Title. Place: Publisher; Year.' },
};

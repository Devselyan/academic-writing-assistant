# Academic Writing Assistant

A professional, client-side web application providing legitimate tools for improving academic writing, managing citations, proofreading, and planning thesis structure — all compliant with university-specific formatting guidelines.

> **Purpose:** Help students learn to write better through AI-powered suggestions with clear explanations — not replace the writing process. Every tool is designed to improve the student's own work, not generate submissions from scratch.

**[Live Demo](#)** · **[Report Bug](https://github.com/Devselyan/academic-writing-assistant/issues)** · **[Request Feature](https://github.com/Devselyan/academic-writing-assistant/issues)**

---

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Usage](#usage)
- [Configuration](#configuration)
- [API Usage & Costs](#api-usage--costs)
- [Supported Universities](#supported-universities)
- [Supported Citation Styles](#supported-citation-styles)
- [Privacy & Data Handling](#privacy--data-handling)
- [Legal & Ethical Disclaimer](#legal--ethical-disclaimer)
- [License](#license)
- [Contributing](#contributing)
- [Acknowledgements](#acknowledgements)

---

## Features

### 1. Writing Improvement Tool
- Paste any academic text and receive **actionable, explained suggestions**
- Categorised by type: Clarity, Structure, Tone, Vocabulary, Flow
- Severity levels (Low / Medium / High) for prioritisation
- Context modes: Academic General, Essay, Report, Literature Review
- Every suggestion includes a **clear explanation** of the writing principle involved so the student learns *why* the change matters

### 2. Citations & Formatting
- Generate perfectly formatted citations from source details or DOIs/URLs
- **7 citation styles**: APA 7th, MLA 9th, Chicago 17th, Harvard, IEEE, Oxford, Vancouver
- **Bibliography builder** — collect citations across a session and export all at once
- Copy individual citations or the entire bibliography with one click
- University-specific defaults applied automatically

### 3. Proofreading Tool
- Comprehensive checking for grammar, spelling, punctuation, phrasing, word choice, and consistency
- Side-by-side **original vs. corrected** view
- Quality score (0–100) with descriptive assessment
- Each correction includes an **explanation of the rule or principle** violated
- Designed for academic writing conventions, not generic prose

### 4. Thesis Generator
- Enter topic, degree level, department, and university → receive a **complete thesis structure** with chapters, subsections, and word-count targets
- Add your own notes and arguments per section
- Optionally generate draft content based on your notes (all claims marked `[CITATION NEEDED]` for student verification)
- **Progress tracker** across all sections
- **Export to Word (.docx)** with proper formatting: Times New Roman, heading hierarchy, page breaks, line spacing

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | [Next.js 16](https://nextjs.org/) (App Router, React 19) |
| Language | TypeScript |
| Styling | Tailwind CSS 4 |
| AI | OpenAI GPT-4o (via official SDK) |
| Document Generation | [docx](https://github.com/dolanmiu/docx) |
| Icons | [Lucide React](https://lucide.dev/) |
| State | React hooks + `localStorage` |
| Build | Turbopack |

---

## Prerequisites

- **Node.js** ≥ 20.0.0
- **npm** ≥ 10.0.0 (or yarn / pnpm)
- An **OpenAI API key** ([get one here](https://platform.openai.com/api-keys))

---

## Installation

```bash
# Clone the repository
git clone https://github.com/Devselyan/academic-writing-assistant.git
cd academic-writing-assistant

# Install dependencies
npm install

# Start the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Production Build

```bash
npm run build
npm start
```

---

## Usage

1. **Add your API key** — Navigate to **Settings** and paste your OpenAI API key (stored in your browser's `localStorage` only; never sent anywhere except OpenAI's API).
2. **Select your university** (optional) — Choose from the pre-configured list or leave as Custom. This sets default citation style, font, margins, and structure.
3. **Choose a tool** from the sidebar and start.

---

## Configuration

All settings are saved in the browser's `localStorage` and persist between sessions.

| Setting | Description | Default |
|---|---|---|
| **API Key** | OpenAI secret key for GPT-4o access | _(required)_ |
| **University** | Institution whose guidelines to follow | Custom |
| **Citation Style** | Default format for citation generation | APA |

To clear all settings, open your browser's developer tools → Application → Local Storage → delete `awa-settings`.

---

## API Usage & Costs

This application uses **OpenAI's GPT-4o** model. You are billed directly by OpenAI based on token usage. Approximate costs:

| Action | Tokens (est.) | Cost (est.) |
|---|---|---|
| Analyse a 500-word essay | ~1,500 | ~$0.004 |
| Proofread 1,000 words | ~2,000 | ~$0.005 |
| Generate a citation | ~500 | ~$0.001 |
| Generate one thesis section (~1,000 words) | ~3,000 | ~$0.008 |
| Full thesis draft (15,000 words) | ~40,000 | ~$0.10 |

> Costs are approximate based on GPT-4o pricing as of April 2026 ($2.50 / 1M input tokens, $10.00 / 1M output tokens). Check [OpenAI pricing](https://openai.com/api/pricing/) for current rates.

**You control all costs** — no requests are made without your explicit action.

---

## Supported Universities

The following universities come pre-configured with their formatting guidelines:

| University | Citation Style | Font | Spacing |
|---|---|---|---|
| University of Oxford | OSCOLA | Times New Roman 12pt | 1.5 |
| University of Cambridge | Harvard | Times New Roman 12pt | 1.5 |
| Harvard University | APA 7th | Times New Roman 12pt | 2.0 |
| Stanford University | APA 7th | Times New Roman 12pt | 2.0 |
| MIT | IEEE | Times New Roman 12pt | 1.5 |

Adding support for additional universities is tracked in [this issue](https://github.com/Devselyan/academic-writing-assistant/issues).

---

## Supported Citation Styles

- **APA 7th Edition** — American Psychological Association
- **MLA 9th Edition** — Modern Language Association
- **Chicago 17th Edition** — Notes & Bibliography
- **Harvard** — Author–Date
- **IEEE** — Numbered (technical/engineering)
- **Oxford** — Footnotes
- **Vancouver** — Numbered (medical/scientific)

---

## Privacy & Data Handling

- **No backend server.** This is a fully client-side application.
- Your **API key** is stored in your browser's `localStorage` and is **never transmitted to any server except OpenAI's API**.
- Your **writing samples** are sent only to OpenAI's API as part of completion requests. They are not stored, logged, or forwarded anywhere else.
- **No analytics, no tracking, no cookies, no telemetry.**
- Thesis documents are generated in the browser and downloaded directly — no file is uploaded to any server.

For full details, see OpenAI's [Privacy Policy](https://openai.com/policies/privacy-policy) and [Data Usage Policies](https://openai.com/policies/usage-policies).

---

## Legal & Ethical Disclaimer

### Intended Use

This tool is designed to **assist students in improving their own academic writing**. It provides:

- Suggestions for clearer expression and better structure
- Citation formatting according to established style guides
- Grammar and style corrections
- Thesis planning and organisational support

### Academic Integrity

- **Students are expected to write their own work.** This tool should be used to review, refine, and learn from — not to generate submissions from scratch.
- All content generated by the Thesis Generator's "Generate" feature includes `[CITATION NEEDED]` markers where the student **must** verify facts and add real, verifiable sources.
- Users are responsible for ensuring their final submission complies with their institution's academic integrity policies.
- Many universities require students to declare the use of AI-assisted tools. Check your institution's policy.

### No Warranty

This software is provided "as is", without warranty of any kind, express or implied. See the [License](#license) section below.

### AI-Generated Content

AI-generated text may contain inaccuracies, fabricated citations, or outdated information. **Always verify all facts, citations, and claims independently.** The authors of this project assume no responsibility for errors in AI-generated content.

### Compliance

This project does not:
- Circumvent, bypass, or evade plagiarism detection systems
- Claim to guarantee any particular result on academic integrity checks
- Store, distribute, or sell user data
- Provide guarantees of academic compliance

---

## License

This project is licensed under the **MIT License** — see the [`LICENSE`](LICENSE) file for details.

```
MIT License

Copyright (c) 2026 Devselyan

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

---

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request. For major changes, please open an issue first to discuss what you would like to change.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'feat: add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## Acknowledgements

- [OpenAI](https://openai.com/) for the GPT-4o model and API
- [Next.js](https://nextjs.org/) by Vercel
- [Tailwind CSS](https://tailwindcss.com/)
- [docx](https://github.com/dolanmiu/docx) library for Word document generation
- [Lucide](https://lucide.dev/) for the icon set

---

<p align="center">
  Built with care for students, by students.
</p>

import React, { useState } from 'react';
import {
  Download,
  X,
  FileText,
  Printer,
  Copy,
  Check,
  Award,
  Layers,
  Sparkles,
} from 'lucide-react';
import { PitchProject } from '../types/pitch';

interface ExportModalProps {
  project: PitchProject;
  onClose: () => void;
}

export const ExportModal: React.FC<ExportModalProps> = ({ project, onClose }) => {
  const [activeTab, setActiveTab] = useState<'print' | 'markdown' | 'onepager' | 'json'>('print');
  const [copied, setCopied] = useState(false);

  // Generate Markdown representation
  const generateMarkdown = () => {
    let md = `# ${project.intake.startupName} - Investor Pitch Deck\n`;
    md += `**Tagline:** ${project.intake.tagline || 'N/A'}\n`;
    md += `**Stage:** ${project.intake.stage} | **Score:** ${project.score?.overallScore || 'N/A'}/100 (${project.score?.tier || 'Draft'})\n\n`;
    md += `## 10-Slide Pitch Outline\n\n`;

    project.slides.forEach((s) => {
      md += `### Slide ${s.slideNumber}: ${s.title} (${s.category.toUpperCase()})\n`;
      md += `**1-Second Takeaway:** ${s.headline}\n\n`;
      md += `**Slide Content:**\n`;
      s.bullets.forEach((b) => {
        md += `- ${b}\n`;
      });
      md += `\n**Key Metrics & Data Points:**\n`;
      s.keyDataPoints.forEach((dp) => {
        md += `- ${dp.label}: ${dp.value} [${dp.status.toUpperCase()}]\n`;
      });
      md += `\n**Speaker Script:**\n> ${s.speakerNotes}\n\n`;
      md += `**Visual Recommendation:** ${s.visualRecommendation.description}\n\n`;
      md += `---\n\n`;
    });

    if (project.critique) {
      md += `## AI Investor Review (60-Second Test)\n`;
      md += `- **Verdict:** ${project.critique.sixtySecondVerdict}\n`;
      md += `- **Strongest Part:** ${project.critique.strongestPart}\n`;
      md += `- **Weakest Part:** ${project.critique.weakestPart}\n`;
      md += `- **Biggest Unanswered Question:** ${project.critique.biggestUnansweredQuestion}\n`;
      md += `- **Existential Risk:** ${project.critique.biggestInvestmentRisk}\n`;
    }

    return md;
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div className="max-w-4xl w-full rounded-2xl border border-zinc-800 bg-zinc-950 p-6 shadow-2xl space-y-5 animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
              <Download className="h-4 w-4" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">Export Investor Pitch Package</h2>
              <p className="text-xs text-zinc-400">
                Print, share, or export your 10-slide deck, speaker notes, and AI investor critique.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-zinc-400 hover:bg-zinc-800 hover:text-white"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Tab Controls */}
        <div className="flex items-center gap-2 border-b border-zinc-800 pb-2">
          <button
            onClick={() => setActiveTab('print')}
            className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition-all ${
              activeTab === 'print'
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            🖨️ Printable Slide Deck View
          </button>
          <button
            onClick={() => setActiveTab('onepager')}
            className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition-all ${
              activeTab === 'onepager'
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            📄 1-Page Executive Memo
          </button>
          <button
            onClick={() => setActiveTab('markdown')}
            className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition-all ${
              activeTab === 'markdown'
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            📝 Markdown / Text
          </button>
          <button
            onClick={() => setActiveTab('json')}
            className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition-all ${
              activeTab === 'json'
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            ⚙️ JSON Data
          </button>
        </div>

        {/* Tab Content */}
        <div className="max-h-96 overflow-y-auto pr-1">
          {activeTab === 'print' && (
            <div className="space-y-6 p-4 rounded-xl bg-zinc-900/50 border border-zinc-800">
              <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
                <div>
                  <h3 className="text-base font-extrabold text-white">
                    {project.intake.startupName} (10-Slide Investor Deck)
                  </h3>
                  <p className="text-xs text-zinc-400">
                    Formatted for browser print-to-PDF.
                  </p>
                </div>
                <button
                  onClick={handlePrint}
                  className="flex items-center gap-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold px-4 py-2 text-xs transition-all shadow"
                >
                  <Printer className="h-4 w-4" /> Print / Save as PDF
                </button>
              </div>

              <div className="space-y-4">
                {project.slides.map((s) => (
                  <div
                    key={s.slideNumber}
                    className="rounded-xl border border-zinc-800 bg-zinc-950 p-4 space-y-2"
                  >
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-amber-400">
                        Slide {s.slideNumber}: {s.title}
                      </span>
                      <span className="text-zinc-500 uppercase">{s.category}</span>
                    </div>
                    <p className="text-sm font-semibold text-white">{s.headline}</p>
                    <ul className="text-xs text-zinc-300 space-y-1 pl-4 list-disc">
                      {s.bullets.map((b, i) => (
                        <li key={i}>{b}</li>
                      ))}
                    </ul>
                    <div className="pt-2 text-[11px] text-zinc-400 border-t border-zinc-900">
                      <strong>Speaker Note:</strong> {s.speakerNotes}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'onepager' && (
            <div className="rounded-xl bg-zinc-900/50 border border-zinc-800 p-6 space-y-4 text-xs">
              <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
                <div>
                  <h3 className="text-lg font-bold text-white">{project.intake.startupName}</h3>
                  <p className="text-xs text-zinc-300">{project.intake.tagline}</p>
                </div>
                <span className="rounded-full bg-amber-500/20 px-3 py-1 text-xs font-bold text-amber-400 border border-amber-500/40">
                  {project.intake.stage} • {project.score?.overallScore || 'Evaluated'}/100
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <strong className="text-amber-400 block mb-1">Problem & Pain:</strong>
                  <p className="text-zinc-300">{project.analysis?.coreProblem || project.intake.problem}</p>
                </div>
                <div>
                  <strong className="text-emerald-400 block mb-1">Solution & Moat:</strong>
                  <p className="text-zinc-300">{project.analysis?.valueProposition || project.intake.solution}</p>
                </div>
                <div>
                  <strong className="text-indigo-400 block mb-1">Business Model:</strong>
                  <p className="text-zinc-300">{project.analysis?.businessModel || project.intake.businessModel}</p>
                </div>
                <div>
                  <strong className="text-cyan-400 block mb-1">Target Market:</strong>
                  <p className="text-zinc-300">{project.analysis?.targetCustomer || project.intake.targetCustomer}</p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'markdown' && (
            <div className="space-y-3">
              <div className="flex justify-end">
                <button
                  onClick={() => handleCopy(generateMarkdown())}
                  className="flex items-center gap-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 px-3 py-1.5 text-xs text-white border border-zinc-700 transition-colors"
                >
                  {copied ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
                  <span>{copied ? 'Copied!' : 'Copy Markdown'}</span>
                </button>
              </div>
              <textarea
                readOnly
                rows={12}
                value={generateMarkdown()}
                className="w-full rounded-xl border border-zinc-800 bg-zinc-950 p-4 text-xs text-zinc-300 font-mono focus:outline-none"
              />
            </div>
          )}

          {activeTab === 'json' && (
            <div className="space-y-3">
              <div className="flex justify-end">
                <button
                  onClick={() => handleCopy(JSON.stringify(project, null, 2))}
                  className="flex items-center gap-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 px-3 py-1.5 text-xs text-white border border-zinc-700 transition-colors"
                >
                  {copied ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
                  <span>{copied ? 'Copied!' : 'Copy JSON'}</span>
                </button>
              </div>
              <textarea
                readOnly
                rows={12}
                value={JSON.stringify(project, null, 2)}
                className="w-full rounded-xl border border-zinc-800 bg-zinc-950 p-4 text-xs text-amber-300/80 font-mono focus:outline-none"
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

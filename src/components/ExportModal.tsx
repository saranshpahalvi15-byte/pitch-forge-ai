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
  CheckCircle2,
  FileSpreadsheet,
  Settings2,
  HelpCircle,
  Eye,
  Info,
  FileDown,
  Globe,
  Loader2,
} from 'lucide-react';
import { PitchProject } from '../types/pitch';
import {
  downloadPitchDeckPdf,
  downloadStandaloneHtmlPresentation,
} from '../services/pdfExportService';

interface ExportModalProps {
  project: PitchProject;
  onClose: () => void;
}

export const ExportModal: React.FC<ExportModalProps> = ({ project, onClose }) => {
  const [activeTab, setActiveTab] = useState<'print' | 'markdown' | 'onepager' | 'json'>('print');
  const [copied, setCopied] = useState(false);
  const [includeSpeakerNotes, setIncludeSpeakerNotes] = useState(true);
  const [includeScorecard, setIncludeScorecard] = useState(true);
  const [includeVisualGuidance, setIncludeVisualGuidance] = useState(true);

  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);
  const [pdfSuccess, setPdfSuccess] = useState(false);
  const [exportError, setExportError] = useState<string | null>(null);

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
      if (includeSpeakerNotes) {
        md += `\n**Speaker Script:**\n> ${s.speakerNotes}\n\n`;
      }
      if (includeVisualGuidance) {
        md += `**Visual Recommendation:** ${s.visualRecommendation.description}\n\n`;
      }
      md += `---\n\n`;
    });

    if (project.critique && includeScorecard) {
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

  // Direct .PDF File Generation & Download
  const handleDirectPdfDownload = async () => {
    setIsGeneratingPdf(true);
    setExportError(null);
    try {
      await downloadPitchDeckPdf(project, {
        includeSpeakerNotes,
        includeScorecard,
        includeVisualGuidance,
      });
      setPdfSuccess(true);
      setTimeout(() => setPdfSuccess(false), 3000);
    } catch (err: any) {
      console.error('PDF Generation error:', err);
      setExportError(err.message || 'Failed to generate PDF. Please try again.');
    } finally {
      setIsGeneratingPdf(false);
    }
  };

  // Standalone HTML Presentation Download
  const handleDownloadHtml = () => {
    try {
      downloadStandaloneHtmlPresentation(project);
    } catch (err: any) {
      console.error('HTML Export error:', err);
      setExportError(err.message || 'Failed to export HTML presentation.');
    }
  };

  // Browser Print Dialog
  const handlePrint = () => {
    try {
      window.print();
    } catch (err: any) {
      console.warn('Direct print blocked, downloading PDF instead:', err);
      handleDirectPdfDownload();
    }
  };

  const formattedDate = new Date().toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 print:p-0 print:bg-white print:static">
      <div className="max-w-4xl w-full rounded-2xl border border-zinc-800 bg-zinc-950 p-6 shadow-2xl space-y-5 animate-in fade-in zoom-in-95 duration-200 print:max-w-none print:w-full print:border-none print:shadow-none print:p-0 print:bg-white">
        {/* Modal Header - Hidden on Print */}
        <div className="flex items-center justify-between border-b border-zinc-800 pb-3 no-print">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
              <Download className="h-4 w-4" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">Export Investor Pitch Deck</h2>
              <p className="text-xs text-zinc-400">
                Download as direct vector PDF, print to PDF, or export HTML presentation and speaker notes.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-zinc-400 hover:bg-zinc-800 hover:text-white transition-colors cursor-pointer"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Tab Controls - Hidden on Print */}
        <div className="flex items-center gap-2 border-b border-zinc-800 pb-2 no-print overflow-x-auto">
          <button
            onClick={() => setActiveTab('print')}
            className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
              activeTab === 'print'
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            <FileDown className="h-3.5 w-3.5 text-amber-400" /> PDF & Slide Deck
          </button>
          <button
            onClick={() => setActiveTab('onepager')}
            className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
              activeTab === 'onepager'
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            <FileText className="h-3.5 w-3.5" /> 1-Page Executive Memo
          </button>
          <button
            onClick={() => setActiveTab('markdown')}
            className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
              activeTab === 'markdown'
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            📝 Markdown / Text
          </button>
          <button
            onClick={() => setActiveTab('json')}
            className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
              activeTab === 'json'
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            ⚙️ JSON Data
          </button>
        </div>

        {/* Tab Content Area */}
        <div className="max-h-[70vh] overflow-y-auto pr-1 print:max-h-none print:overflow-visible print:pr-0">
          {/* TAB 1: PDF EXPORT & PRINT */}
          {activeTab === 'print' && (
            <div className="space-y-6">
              {/* Export Action Controls - Hidden on Print */}
              <div className="no-print rounded-xl bg-zinc-900/90 border border-zinc-800 p-4 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <h3 className="text-sm font-bold text-white flex items-center gap-2">
                      <FileDown className="h-4 w-4 text-amber-400" />
                      Download 10-Slide Investor Deck (.PDF)
                    </h3>
                    <p className="text-xs text-zinc-400 mt-0.5">
                      Direct vector 16:9 PDF file download with cover, all 10 slides, KPIs, and VC review.
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    {/* PRIMARY ACTION: DIRECT PDF DOWNLOAD */}
                    <button
                      onClick={handleDirectPdfDownload}
                      disabled={isGeneratingPdf}
                      className="flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-zinc-950 font-extrabold px-5 py-2.5 text-xs shadow-lg shadow-amber-500/20 active:scale-95 transition-all cursor-pointer disabled:opacity-50"
                    >
                      {isGeneratingPdf ? (
                        <>
                          <Loader2 className="h-4 w-4 animate-spin text-zinc-950" />
                          <span>Generating PDF...</span>
                        </>
                      ) : pdfSuccess ? (
                        <>
                          <CheckCircle2 className="h-4 w-4 text-zinc-950" />
                          <span>PDF Downloaded!</span>
                        </>
                      ) : (
                        <>
                          <Download className="h-4 w-4" />
                          <span>Download .PDF Deck</span>
                        </>
                      )}
                    </button>

                    {/* SECONDARY ACTION: PRINT DIALOG */}
                    <button
                      onClick={handlePrint}
                      title="Trigger Browser Print Dialog"
                      className="flex items-center justify-center gap-1.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 border border-zinc-700 px-3.5 py-2.5 text-xs font-semibold active:scale-95 transition-all cursor-pointer"
                    >
                      <Printer className="h-3.5 w-3.5 text-zinc-400" />
                      <span className="hidden sm:inline">Print Dialog</span>
                    </button>

                    {/* TERTIARY ACTION: STANDALONE HTML */}
                    <button
                      onClick={handleDownloadHtml}
                      title="Download offline HTML presentation package"
                      className="flex items-center justify-center gap-1.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 border border-zinc-700 px-3 py-2.5 text-xs font-semibold active:scale-95 transition-all cursor-pointer"
                    >
                      <Globe className="h-3.5 w-3.5 text-indigo-400" />
                      <span className="hidden md:inline">.HTML Deck</span>
                    </button>
                  </div>
                </div>

                {/* PDF Configuration Options */}
                <div className="pt-3 border-t border-zinc-800 flex flex-wrap items-center gap-4 text-xs">
                  <span className="text-zinc-400 font-medium text-[11px] flex items-center gap-1">
                    <Settings2 className="h-3 w-3 text-zinc-500" /> PDF Options:
                  </span>

                  <label className="flex items-center gap-1.5 text-zinc-300 hover:text-white cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={includeSpeakerNotes}
                      onChange={(e) => setIncludeSpeakerNotes(e.target.checked)}
                      className="rounded border-zinc-700 bg-zinc-800 text-amber-500 focus:ring-0 cursor-pointer"
                    />
                    <span>Include Founder Speaker Scripts</span>
                  </label>

                  <label className="flex items-center gap-1.5 text-zinc-300 hover:text-white cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={includeScorecard}
                      onChange={(e) => setIncludeScorecard(e.target.checked)}
                      className="rounded border-zinc-700 bg-zinc-800 text-amber-500 focus:ring-0 cursor-pointer"
                    />
                    <span>Include VC Scorecard & Critique</span>
                  </label>

                  <label className="flex items-center gap-1.5 text-zinc-300 hover:text-white cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={includeVisualGuidance}
                      onChange={(e) => setIncludeVisualGuidance(e.target.checked)}
                      className="rounded border-zinc-700 bg-zinc-800 text-amber-500 focus:ring-0 cursor-pointer"
                    />
                    <span>Include Visual Suggestions</span>
                  </label>
                </div>

                {exportError && (
                  <div className="rounded-lg bg-rose-500/10 border border-rose-500/30 p-2.5 text-xs text-rose-300">
                    ⚠️ {exportError}
                  </div>
                )}
              </div>

              {/* PRINTABLE DECK DOCUMENT (Visible in preview and in print) */}
              <div className="pitch-print-container space-y-6 print:space-y-0">
                {/* 1. COVER PAGE / EXECUTIVE HEADER */}
                <div className="print-page-break rounded-2xl border border-zinc-800 bg-zinc-900/60 p-6 sm:p-8 space-y-6 print:border-2 print:border-zinc-300 print:bg-white print:p-8 print:mb-0 print:min-h-[85vh] print:flex print:flex-col print:justify-between">
                  <div className="flex items-start justify-between border-b border-zinc-800 pb-4 print:border-b-2 print:border-zinc-200">
                    <div>
                      <div className="inline-flex items-center gap-1.5 rounded-md bg-amber-500/20 border border-amber-500/30 px-2.5 py-1 text-xs font-bold text-amber-400 print:bg-zinc-100 print:border-zinc-300 print:text-zinc-800 mb-2">
                        10-Slide Investor Deck • Version {project.currentVersion}
                      </div>
                      <h1 className="text-3xl font-extrabold text-white print:text-zinc-950">
                        {project.intake.startupName}
                      </h1>
                      <p className="text-sm font-medium text-amber-300/90 print:text-zinc-700 mt-1 max-w-2xl">
                        {project.intake.tagline || project.intake.rawIdea.slice(0, 140)}
                      </p>
                    </div>

                    {project.score && (
                      <div className="text-right">
                        <div className="inline-flex flex-col items-end rounded-xl bg-zinc-950 p-3 border border-zinc-800 print:bg-zinc-50 print:border-zinc-300">
                          <span className="text-[10px] uppercase font-bold text-zinc-400 print:text-zinc-600">
                            VC Quality Score
                          </span>
                          <span className="text-2xl font-black text-emerald-400 print:text-zinc-900">
                            {project.score.overallScore}
                            <span className="text-xs text-zinc-500 font-normal">/100</span>
                          </span>
                          <span className="text-[10px] font-bold text-amber-400 print:text-zinc-800">
                            {project.score.tier}
                          </span>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Metadata Matrix */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs print:grid-cols-4">
                    <div className="rounded-xl bg-zinc-950/80 p-3 border border-zinc-800/80 print:bg-zinc-50 print:border-zinc-200 space-y-1">
                      <span className="text-[10px] uppercase font-bold text-zinc-500 print:text-zinc-500">Stage</span>
                      <p className="font-bold text-white print:text-zinc-900">{project.intake.stage}</p>
                    </div>
                    <div className="rounded-xl bg-zinc-950/80 p-3 border border-zinc-800/80 print:bg-zinc-50 print:border-zinc-200 space-y-1">
                      <span className="text-[10px] uppercase font-bold text-zinc-500 print:text-zinc-500">Market / Region</span>
                      <p className="font-bold text-white print:text-zinc-900">{project.intake.geography || 'Global'}</p>
                    </div>
                    <div className="rounded-xl bg-zinc-950/80 p-3 border border-zinc-800/80 print:bg-zinc-50 print:border-zinc-200 space-y-1">
                      <span className="text-[10px] uppercase font-bold text-zinc-500 print:text-zinc-500">Business Model</span>
                      <p className="font-bold text-white print:text-zinc-900">{project.intake.businessModel}</p>
                    </div>
                    <div className="rounded-xl bg-zinc-950/80 p-3 border border-zinc-800/80 print:bg-zinc-50 print:border-zinc-200 space-y-1">
                      <span className="text-[10px] uppercase font-bold text-zinc-500 print:text-zinc-500">Export Date</span>
                      <p className="font-bold text-white print:text-zinc-900">{formattedDate}</p>
                    </div>
                  </div>

                  {/* Executive Narrative Snapshot */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs pt-2 print:grid-cols-2">
                    <div className="rounded-xl bg-zinc-950/60 p-4 border border-zinc-800/80 print:bg-zinc-50 print:border-zinc-200 space-y-1.5">
                      <span className="text-[10px] font-extrabold uppercase text-amber-400 print:text-zinc-800 tracking-wider">
                        Core Problem
                      </span>
                      <p className="text-zinc-200 print:text-zinc-800 leading-relaxed">
                        {project.analysis?.coreProblem || project.intake.problem}
                      </p>
                    </div>
                    <div className="rounded-xl bg-zinc-950/60 p-4 border border-zinc-800/80 print:bg-zinc-50 print:border-zinc-200 space-y-1.5">
                      <span className="text-[10px] font-extrabold uppercase text-emerald-400 print:text-zinc-800 tracking-wider">
                        Value Proposition
                      </span>
                      <p className="text-zinc-200 print:text-zinc-800 leading-relaxed">
                        {project.analysis?.valueProposition || project.intake.solution}
                      </p>
                    </div>
                  </div>

                  {/* Footer */}
                  <div className="flex items-center justify-between text-[11px] text-zinc-500 border-t border-zinc-800/80 pt-3 print:border-t print:border-zinc-200">
                    <span>PitchForge AI • Pitch Strategy Studio</span>
                    <span>Confidential • Investor Briefing</span>
                  </div>
                </div>

                {/* 2. THE 10 SLIDES */}
                {project.slides.map((s) => (
                  <div
                    key={s.slideNumber}
                    className="print-page-break rounded-2xl border border-zinc-800 bg-zinc-950 p-6 sm:p-8 space-y-5 print:border-2 print:border-zinc-300 print:bg-white print:p-8 print:min-h-[85vh] print:flex print:flex-col print:justify-between"
                  >
                    {/* Slide Top Header */}
                    <div className="space-y-2 border-b border-zinc-800/80 pb-3 print:border-zinc-200">
                      <div className="flex items-center justify-between">
                        <span className="rounded-full bg-amber-500/20 border border-amber-500/30 px-3 py-0.5 text-xs font-bold text-amber-400 print:bg-zinc-100 print:border-zinc-300 print:text-zinc-800">
                          Slide {s.slideNumber} of 10 • {s.category.toUpperCase().replace('_', ' ')}
                        </span>
                        <span className="text-xs font-bold text-zinc-400 print:text-zinc-600">
                          {project.intake.startupName}
                        </span>
                      </div>

                      <h2 className="text-xl sm:text-2xl font-black text-white print:text-zinc-950">
                        {s.title}
                      </h2>
                      <p className="text-sm font-semibold text-amber-300/90 print:text-zinc-800 leading-snug">
                        "{s.headline}"
                      </p>
                    </div>

                    {/* Slide Core Content Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-auto pt-2 print:grid-cols-2">
                      {/* Left: Bullet Points */}
                      <div className="space-y-3">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 print:text-zinc-600">
                          Key Argument & Narrative Points
                        </span>
                        <div className="space-y-2.5">
                          {s.bullets.map((b, idx) => (
                            <div key={idx} className="flex items-start gap-2.5 text-xs">
                              <span className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-amber-500/20 text-amber-400 print:bg-zinc-200 print:text-zinc-900 text-[10px] font-bold mt-0.5">
                                ✓
                              </span>
                              <p className="text-zinc-200 print:text-zinc-800 leading-relaxed">{b}</p>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Right: Key Data Points & Metrics */}
                      <div className="space-y-3">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 print:text-zinc-600">
                          Key Evidence & Quantitative Metrics
                        </span>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                          {s.keyDataPoints.map((dp, idx) => (
                            <div
                              key={idx}
                              className="rounded-xl bg-zinc-900/90 p-3 border border-zinc-800 print:bg-zinc-50 print:border-zinc-200 space-y-1"
                            >
                              <span className="text-[10px] font-semibold text-zinc-400 print:text-zinc-500 block truncate">
                                {dp.label}
                              </span>
                              <span className="text-sm font-extrabold text-white print:text-zinc-950 block">
                                {dp.value}
                              </span>
                              <span
                                className={`inline-block text-[8px] font-bold uppercase rounded px-1.5 py-0.5 border ${
                                  dp.status === 'validated'
                                    ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40 print:bg-emerald-50 print:text-emerald-800 print:border-emerald-300'
                                    : dp.status === 'assumption'
                                    ? 'bg-amber-500/20 text-amber-300 border-amber-500/40 print:bg-amber-50 print:text-amber-800 print:border-amber-300'
                                    : 'bg-indigo-500/20 text-indigo-300 border-indigo-500/40 print:bg-indigo-50 print:text-indigo-800 print:border-indigo-300'
                                }`}
                              >
                                {dp.status}
                              </span>
                            </div>
                          ))}
                        </div>

                        {/* Visual Recommendation */}
                        {includeVisualGuidance && (
                          <div className="rounded-xl bg-zinc-900/50 p-2.5 border border-zinc-800/80 print:bg-zinc-50 print:border-zinc-200 text-[11px]">
                            <span className="text-[9px] font-bold uppercase text-indigo-400 print:text-zinc-600 block">
                              Visual Layout Guidance:
                            </span>
                            <p className="text-zinc-300 print:text-zinc-700 mt-0.5">
                              {s.visualRecommendation.description}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Speaker Script Section */}
                    {includeSpeakerNotes && (
                      <div className="rounded-xl bg-zinc-900/60 p-3.5 border border-zinc-800 text-xs space-y-1 print:bg-zinc-50 print:border-zinc-200">
                        <span className="text-[10px] font-bold uppercase text-amber-400 print:text-zinc-800 block">
                          Founder Speaker Script (60-90s per slide):
                        </span>
                        <p className="text-zinc-300 print:text-zinc-800 italic leading-relaxed text-[11px]">
                          "{s.speakerNotes}"
                        </p>
                      </div>
                    )}

                    {/* Slide Footer */}
                    <div className="flex items-center justify-between text-[10px] text-zinc-500 border-t border-zinc-800/80 pt-3 print:border-t print:border-zinc-200">
                      <span>PitchForge AI • {project.intake.startupName}</span>
                      <span>Slide {s.slideNumber} of {project.slides.length}</span>
                    </div>
                  </div>
                ))}

                {/* 3. VC SCORECARD & INVESTOR CRITIQUE PAGE */}
                {includeScorecard && (project.score || project.critique) && (
                  <div className="print-page-break rounded-2xl border border-zinc-800 bg-zinc-900/60 p-6 sm:p-8 space-y-6 print:border-2 print:border-zinc-300 print:bg-white print:p-8 print:min-h-[85vh] print:flex print:flex-col print:justify-between">
                    <div className="border-b border-zinc-800 pb-3 print:border-zinc-200">
                      <div className="inline-flex items-center gap-1.5 rounded-md bg-indigo-500/20 border border-indigo-500/30 px-2.5 py-1 text-xs font-bold text-indigo-400 print:bg-zinc-100 print:border-zinc-300 print:text-zinc-800 mb-2">
                        Investment Committee Assessment
                      </div>
                      <h2 className="text-2xl font-black text-white print:text-zinc-950">
                        VC Quality Scorecard & 60-Second Investor Critique
                      </h2>
                    </div>

                    {/* Scorecard Breakdown */}
                    {project.score && (
                      <div className="space-y-3">
                        <span className="text-xs font-bold uppercase tracking-wider text-zinc-400 print:text-zinc-600">
                          Rubric Dimension Ratings
                        </span>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-xs print:grid-cols-4">
                          {Object.entries(project.score.categories).map(([catKey, catVal]: [string, any]) => (
                            <div
                              key={catKey}
                              className="rounded-xl bg-zinc-950 p-3 border border-zinc-800 print:bg-zinc-50 print:border-zinc-200 space-y-1"
                            >
                              <span className="text-[10px] font-semibold text-zinc-400 print:text-zinc-500 block capitalize">
                                {catKey.replace(/([A-Z])/g, ' $1')}
                              </span>
                              <div className="flex items-center justify-between">
                                <span className="font-extrabold text-white print:text-zinc-950 text-sm">
                                  {catVal.score}/10
                                </span>
                                <span
                                  className={`text-[9px] font-bold uppercase px-1.5 py-0.5 rounded ${
                                    catVal.score >= 8
                                      ? 'text-emerald-400 bg-emerald-500/10'
                                      : catVal.score >= 6
                                      ? 'text-amber-400 bg-amber-500/10'
                                      : 'text-rose-400 bg-rose-500/10'
                                  }`}
                                >
                                  {catVal.rating}
                                </span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* AI Investor Critique Highlights */}
                    {project.critique && (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs print:grid-cols-2">
                        <div className="rounded-xl bg-zinc-950 p-4 border border-zinc-800 print:bg-zinc-50 print:border-zinc-200 space-y-2">
                          <span className="text-[10px] font-extrabold uppercase text-amber-400 print:text-zinc-800 tracking-wider">
                            60-Second Investor Verdict
                          </span>
                          <p className="text-zinc-200 print:text-zinc-800 leading-relaxed font-semibold">
                            "{project.critique.sixtySecondVerdict}"
                          </p>
                          <div className="pt-2 border-t border-zinc-900 print:border-zinc-200 text-[11px] text-zinc-400 print:text-zinc-600">
                            <strong>Strongest Asset:</strong> {project.critique.strongestPart}
                          </div>
                        </div>

                        <div className="rounded-xl bg-zinc-950 p-4 border border-zinc-800 print:bg-zinc-50 print:border-zinc-200 space-y-2">
                          <span className="text-[10px] font-extrabold uppercase text-rose-400 print:text-zinc-800 tracking-wider">
                            Biggest Unanswered Question & Risk
                          </span>
                          <p className="text-zinc-200 print:text-zinc-800 leading-relaxed">
                            {project.critique.biggestUnansweredQuestion}
                          </p>
                          <div className="pt-2 border-t border-zinc-900 print:border-zinc-200 text-[11px] text-zinc-400 print:text-zinc-600">
                            <strong>Existential Risk:</strong> {project.critique.biggestInvestmentRisk}
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Footer */}
                    <div className="flex items-center justify-between text-[10px] text-zinc-500 border-t border-zinc-800/80 pt-3 print:border-t print:border-zinc-200">
                      <span>PitchForge AI • Pitch Readiness Scorecard</span>
                      <span>Evaluated with Gemini 3.7 Flash</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 2: 1-PAGE EXECUTIVE MEMO */}
          {activeTab === 'onepager' && (
            <div className="space-y-4">
              <div className="flex justify-end no-print gap-2">
                <button
                  onClick={handleDirectPdfDownload}
                  className="flex items-center gap-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold px-4 py-2 text-xs transition-colors cursor-pointer"
                >
                  <Download className="h-3.5 w-3.5" /> Download Full Deck (.PDF)
                </button>
                <button
                  onClick={handlePrint}
                  className="flex items-center gap-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-200 border border-zinc-700 px-4 py-2 text-xs font-semibold transition-colors cursor-pointer"
                >
                  <Printer className="h-3.5 w-3.5" /> Print Memo
                </button>
              </div>

              <div className="rounded-2xl bg-zinc-900/50 border border-zinc-800 p-6 space-y-5 text-xs print:bg-white print:border-2 print:border-zinc-300">
                <div className="flex items-center justify-between border-b border-zinc-800 pb-3 print:border-zinc-200">
                  <div>
                    <h3 className="text-xl font-bold text-white print:text-zinc-950">{project.intake.startupName}</h3>
                    <p className="text-xs text-zinc-300 print:text-zinc-600">{project.intake.tagline}</p>
                  </div>
                  <span className="rounded-full bg-amber-500/20 px-3 py-1 text-xs font-bold text-amber-400 border border-amber-500/40 print:bg-zinc-100 print:text-zinc-900 print:border-zinc-300">
                    {project.intake.stage} • {project.score?.overallScore || 'Evaluated'}/100
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="p-3 rounded-xl bg-zinc-950 print:bg-zinc-50 border border-zinc-800 print:border-zinc-200">
                    <strong className="text-amber-400 print:text-zinc-800 block mb-1">Problem & Pain:</strong>
                    <p className="text-zinc-300 print:text-zinc-700">{project.analysis?.coreProblem || project.intake.problem}</p>
                  </div>
                  <div className="p-3 rounded-xl bg-zinc-950 print:bg-zinc-50 border border-zinc-800 print:border-zinc-200">
                    <strong className="text-emerald-400 print:text-zinc-800 block mb-1">Solution & Moat:</strong>
                    <p className="text-zinc-300 print:text-zinc-700">{project.analysis?.valueProposition || project.intake.solution}</p>
                  </div>
                  <div className="p-3 rounded-xl bg-zinc-950 print:bg-zinc-50 border border-zinc-800 print:border-zinc-200">
                    <strong className="text-indigo-400 print:text-zinc-800 block mb-1">Business Model:</strong>
                    <p className="text-zinc-300 print:text-zinc-700">{project.analysis?.businessModel || project.intake.businessModel}</p>
                  </div>
                  <div className="p-3 rounded-xl bg-zinc-950 print:bg-zinc-50 border border-zinc-800 print:border-zinc-200">
                    <strong className="text-cyan-400 print:text-zinc-800 block mb-1">Target Market:</strong>
                    <p className="text-zinc-300 print:text-zinc-700">{project.analysis?.targetCustomer || project.intake.targetCustomer}</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: MARKDOWN */}
          {activeTab === 'markdown' && (
            <div className="space-y-3">
              <div className="flex justify-end no-print">
                <button
                  onClick={() => handleCopy(generateMarkdown())}
                  className="flex items-center gap-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 px-3 py-1.5 text-xs text-white border border-zinc-700 transition-colors cursor-pointer"
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

          {/* TAB 4: JSON */}
          {activeTab === 'json' && (
            <div className="space-y-3">
              <div className="flex justify-end no-print">
                <button
                  onClick={() => handleCopy(JSON.stringify(project, null, 2))}
                  className="flex items-center gap-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 px-3 py-1.5 text-xs text-white border border-zinc-700 transition-colors cursor-pointer"
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

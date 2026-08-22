import React from 'react';
import {
  ShieldAlert,
  Sparkles,
  ArrowRight,
  HelpCircle,
  AlertTriangle,
  CheckCircle2,
  Layers,
  Award,
  Zap,
  TrendingUp,
  RefreshCw,
} from 'lucide-react';
import { InvestorCritique, PitchProject } from '../types/pitch';

interface InvestorCritiqueViewProps {
  critique: InvestorCritique;
  project: PitchProject;
  onImprovePitch: () => void;
  onOpenStudio: () => void;
  onOpenScore: () => void;
  isImproving: boolean;
}

export const InvestorCritiqueView: React.FC<InvestorCritiqueViewProps> = ({
  critique,
  project,
  onImprovePitch,
  onOpenStudio,
  onOpenScore,
  isImproving,
}) => {
  const getVerdictBadge = (val: string) => {
    switch (val) {
      case 'yes':
        return {
          text: 'PASSES (Clear in Under 60 Seconds)',
          color: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40',
        };
      case 'moderate':
        return {
          text: 'MODERATE (Requires Minor Narrative Clarification)',
          color: 'bg-amber-500/20 text-amber-300 border-amber-500/40',
        };
      default:
        return {
          text: 'FAILS (Narrative Arc Needs Sharpening)',
          color: 'bg-rose-500/20 text-rose-300 border-rose-500/40',
        };
    }
  };

  const badge = getVerdictBadge(critique.understoodIn60Seconds);

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-800 pb-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-rose-500/20 text-rose-400 text-xs font-bold border border-rose-500/30">
              VC
            </span>
            <h1 className="text-2xl font-extrabold text-white">
              AI Investor Review: The 60-Second Test
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-zinc-400 mt-1">
            Simulated institutional VC partner stress test on narrative punch, moats, and risk factors.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={onOpenStudio}
            className="flex items-center gap-1.5 rounded-lg border border-zinc-700 bg-zinc-800 hover:bg-zinc-700 px-3.5 py-2 text-xs font-medium text-zinc-300 transition-colors"
          >
            <Layers className="h-3.5 w-3.5" />
            Pitch Studio
          </button>

          {project.score && (
            <button
              onClick={onOpenScore}
              className="flex items-center gap-1.5 rounded-lg border border-amber-500/30 bg-amber-500/10 hover:bg-amber-500/20 px-3.5 py-2 text-xs font-semibold text-amber-300 transition-colors"
            >
              <Award className="h-3.5 w-3.5 text-amber-400" />
              Scorecard ({project.score.overallScore}/100)
            </button>
          )}
        </div>
      </div>

      {/* Hero 60-Second Verdict Card */}
      <div className="relative overflow-hidden rounded-2xl border border-zinc-800 bg-gradient-to-br from-zinc-900 via-zinc-900/80 to-zinc-950 p-6 sm:p-8 shadow-xl space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-zinc-400">
            <ShieldAlert className="h-4 w-4 text-rose-400" />
            The 60-Second VC Test Question:
          </div>
          <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-extrabold border ${badge.color}`}>
            {badge.text}
          </span>
        </div>

        <h2 className="text-xl sm:text-2xl font-bold text-white leading-snug">
          "Would an institutional investor understand this startup within 60 seconds?"
        </h2>

        <p className="text-sm text-zinc-300 leading-relaxed pt-1">
          {critique.sixtySecondVerdict}
        </p>

        {/* 1-Click Refine Callout */}
        <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-4 rounded-xl border border-amber-500/30 bg-amber-500/10 p-4">
          <div>
            <span className="text-xs font-bold text-amber-400 block">
              Automated Narrative Refinement Engine
            </span>
            <p className="text-xs text-zinc-300 mt-0.5">
              Let Gemini revise weak slides, address unanswered questions, and sharpen investor claims.
            </p>
          </div>

          <button
            type="button"
            onClick={onImprovePitch}
            disabled={isImproving}
            className="w-full sm:w-auto shrink-0 flex items-center justify-center gap-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold px-6 py-2.5 text-xs sm:text-sm transition-all shadow-lg shadow-amber-500/25 active:scale-95 cursor-pointer"
          >
            {isImproving ? (
              <>
                <RefreshCw className="h-4 w-4 animate-spin text-zinc-950" />
                <span>Improving Pitch Deck...</span>
              </>
            ) : (
              <>
                <Sparkles className="h-4 w-4 stroke-[2.5]" />
                <span>Improve My Pitch</span>
                <ArrowRight className="h-4 w-4" />
              </>
            )}
          </button>
        </div>
      </div>

      {/* Grid of Key Findings */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Strongest Part */}
        <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-6 space-y-3">
          <div className="flex items-center gap-2 text-emerald-400 text-xs font-bold uppercase tracking-wider">
            <CheckCircle2 className="h-4 w-4" /> Strongest Part of the Story
          </div>
          <p className="text-sm text-zinc-200 leading-relaxed font-medium">
            {critique.strongestPart}
          </p>
        </div>

        {/* Weakest Part */}
        <div className="rounded-2xl border border-rose-500/20 bg-rose-500/5 p-6 space-y-3">
          <div className="flex items-center gap-2 text-rose-400 text-xs font-bold uppercase tracking-wider">
            <AlertTriangle className="h-4 w-4" /> Weakest Part / Missing Link
          </div>
          <p className="text-sm text-zinc-200 leading-relaxed font-medium">
            {critique.weakestPart}
          </p>
        </div>

        {/* Biggest Unanswered Question */}
        <div className="rounded-2xl border border-amber-500/20 bg-amber-500/5 p-6 space-y-3">
          <div className="flex items-center gap-2 text-amber-400 text-xs font-bold uppercase tracking-wider">
            <HelpCircle className="h-4 w-4" /> Biggest Unanswered Question
          </div>
          <p className="text-sm text-zinc-200 leading-relaxed font-medium">
            {critique.biggestUnansweredQuestion}
          </p>
        </div>

        {/* Biggest Investment Risk */}
        <div className="rounded-2xl border border-indigo-500/20 bg-indigo-500/5 p-6 space-y-3">
          <div className="flex items-center gap-2 text-indigo-400 text-xs font-bold uppercase tracking-wider">
            <ShieldAlert className="h-4 w-4" /> Existential Investment Risk
          </div>
          <p className="text-sm text-zinc-200 leading-relaxed font-medium">
            {critique.biggestInvestmentRisk}
          </p>
        </div>
      </div>

      {/* Highest Leverage Single Edit */}
      <div className="rounded-2xl border border-zinc-800 bg-zinc-900/50 p-6 space-y-3">
        <div className="flex items-center gap-2 text-cyan-400 text-xs font-bold uppercase tracking-wider">
          <Zap className="h-4 w-4" /> Most Important Single Improvement
        </div>
        <p className="text-sm text-white font-semibold leading-relaxed">
          {critique.mostImportantImprovement}
        </p>
      </div>

      {/* Step-by-Step Suggested Revision Plan */}
      <div className="rounded-2xl border border-zinc-800 bg-zinc-900/40 p-6 space-y-4">
        <h2 className="text-sm font-bold text-white uppercase tracking-wider">
          Recommended Pitch Revision Roadmap
        </h2>

        <div className="space-y-2.5">
          {critique.suggestedRevisionPlan.map((step, idx) => (
            <div
              key={idx}
              className="flex items-start gap-3 rounded-xl border border-zinc-800 bg-zinc-950/60 p-3.5 text-xs text-zinc-200"
            >
              <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-amber-500/20 text-amber-400 text-[10px] font-bold border border-amber-500/30">
                {idx + 1}
              </span>
              <span className="leading-relaxed">{step}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom CTA Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-zinc-800">
        <button
          onClick={onOpenStudio}
          className="text-xs text-zinc-400 hover:text-white"
        >
          ← Return to Slide Editor
        </button>

        <button
          type="button"
          onClick={onImprovePitch}
          disabled={isImproving}
          className="w-full sm:w-auto flex items-center justify-center gap-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold px-8 py-3.5 text-sm transition-all shadow-xl shadow-amber-500/25 active:scale-95 cursor-pointer"
        >
          {isImproving ? (
            <>
              <RefreshCw className="h-4 w-4 animate-spin text-zinc-950" />
              <span>Refining 10-Slide Deck...</span>
            </>
          ) : (
            <>
              <Sparkles className="h-4 w-4 stroke-[2.5]" />
              <span>Apply AI Investor Revisions</span>
              <ArrowRight className="h-4 w-4" />
            </>
          )}
        </button>
      </div>
    </div>
  );
};

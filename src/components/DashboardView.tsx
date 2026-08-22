import React from 'react';
import {
  Sparkles,
  ArrowRight,
  TrendingUp,
  Award,
  Layers,
  Clock,
  Plus,
  CheckCircle2,
  AlertCircle,
  FileText,
  Trash2,
} from 'lucide-react';
import { PitchProject } from '../types/pitch';

interface DashboardViewProps {
  projects: PitchProject[];
  onNewPitch: () => void;
  onOpenProject: (project: PitchProject) => void;
  onDeleteProject: (id: string, e: React.MouseEvent) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  projects,
  onNewPitch,
  onOpenProject,
  onDeleteProject,
}) => {
  // Compute Dashboard Statistics
  const totalPitches = projects.length;
  const pitchesGenerated = projects.filter(p => p.slides && p.slides.length > 0).length;
  
  const scoredProjects = projects.filter(p => p.score?.overallScore);
  const avgScore = scoredProjects.length > 0
    ? Math.round(scoredProjects.reduce((acc, p) => acc + (p.score?.overallScore || 0), 0) / scoredProjects.length)
    : 0;

  const lastEditedProject = projects.length > 0
    ? projects.slice().sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())[0]
    : null;

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 space-y-10">
      {/* Hero Section */}
      <div className="relative overflow-hidden rounded-2xl border border-zinc-800 bg-gradient-to-b from-zinc-900/90 via-zinc-900/40 to-zinc-950 p-6 sm:p-10 shadow-2xl">
        <div className="absolute top-0 right-0 -mt-12 -mr-12 h-96 w-96 rounded-full bg-gradient-to-br from-amber-500/10 via-orange-500/5 to-transparent blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 -mb-12 h-64 w-64 rounded-full bg-indigo-500/5 blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-3xl space-y-5">
          <div className="inline-flex items-center gap-2 rounded-full border border-amber-500/30 bg-amber-500/10 px-3 py-1 text-xs font-medium text-amber-300">
            <Sparkles className="h-3.5 w-3.5 text-amber-400" />
            <span>AI Pitch Strategist for Founders</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white leading-tight">
            Build a pitch{' '}
            <span className="bg-gradient-to-r from-amber-400 via-orange-400 to-rose-400 bg-clip-text text-transparent">
              investors understand.
            </span>
          </h1>

          <p className="text-base sm:text-lg text-zinc-300 leading-relaxed font-normal">
            Turn an unstructured startup idea into a clear, evidence-oriented investor story with Gemini.
            Identify unverified assumptions, map a cohesive 10-slide narrative arc, and pass the 60-second VC test.
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            <button
              onClick={onNewPitch}
              className="flex items-center gap-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold px-5 py-3 text-sm transition-all shadow-lg shadow-amber-500/20 active:scale-95 cursor-pointer"
            >
              <Plus className="h-4 w-4 stroke-[3]" />
              Create New Pitch
            </button>
          </div>
        </div>
      </div>

      {/* Statistics Section */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1 */}
        <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-5 shadow-sm hover:border-zinc-700 transition-colors">
          <div className="flex items-center justify-between text-zinc-400 text-xs font-medium">
            <span>Total Pitches</span>
            <Layers className="h-4 w-4 text-indigo-400" />
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-bold text-white">{totalPitches}</span>
            <span className="text-xs text-zinc-400">projects</span>
          </div>
        </div>

        {/* Metric 2 */}
        <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-5 shadow-sm hover:border-zinc-700 transition-colors">
          <div className="flex items-center justify-between text-zinc-400 text-xs font-medium">
            <span>Pitches Generated</span>
            <CheckCircle2 className="h-4 w-4 text-emerald-400" />
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-bold text-white">{pitchesGenerated}</span>
            <span className="text-xs text-zinc-400">10-slide decks</span>
          </div>
        </div>

        {/* Metric 3 */}
        <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-5 shadow-sm hover:border-zinc-700 transition-colors">
          <div className="flex items-center justify-between text-zinc-400 text-xs font-medium">
            <span>Avg Investor Score</span>
            <Award className="h-4 w-4 text-amber-400" />
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-bold text-amber-400">
              {avgScore > 0 ? `${avgScore}/100` : '—'}
            </span>
            <span className="text-xs text-zinc-400">
              {avgScore >= 80 ? 'Seed Ready' : avgScore >= 65 ? 'Pre-Seed Ready' : 'Evaluated'}
            </span>
          </div>
        </div>

        {/* Metric 4 */}
        <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-5 shadow-sm hover:border-zinc-700 transition-colors">
          <div className="flex items-center justify-between text-zinc-400 text-xs font-medium">
            <span>Last Edited</span>
            <Clock className="h-4 w-4 text-rose-400" />
          </div>
          <div className="mt-3 truncate">
            <span className="text-sm font-semibold text-white truncate block">
              {lastEditedProject ? lastEditedProject.intake.startupName || 'Untitled Pitch' : 'No projects yet'}
            </span>
            <span className="text-xs text-zinc-400">
              {lastEditedProject ? new Date(lastEditedProject.updatedAt).toLocaleDateString() : 'Ready to build'}
            </span>
          </div>
        </div>
      </div>

      {/* Projects Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-white">My Pitch Projects</h2>
            <p className="text-xs text-zinc-400">Manage, edit, and iterate on your investor decks</p>
          </div>
          {projects.length > 0 && (
            <button
              onClick={onNewPitch}
              className="flex items-center gap-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-semibold px-3 py-1.5 border border-zinc-700 transition-all cursor-pointer"
            >
              <Plus className="h-3.5 w-3.5" />
              New Pitch
            </button>
          )}
        </div>

        {projects.length === 0 ? (
          /* Empty State */
          <div className="rounded-2xl border border-dashed border-zinc-800 bg-zinc-900/20 p-10 text-center space-y-4">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-zinc-800/80 text-amber-400 border border-zinc-700">
              <FileText className="h-7 w-7" />
            </div>
            <div className="max-w-md mx-auto space-y-1">
              <h3 className="text-base font-semibold text-white">No pitch projects yet</h3>
              <p className="text-xs text-zinc-400">
                Create a new pitch from a raw idea to begin analyzing your problem, market, and 10-slide deck.
              </p>
            </div>
            <div className="flex justify-center gap-3 pt-2">
              <button
                onClick={onNewPitch}
                className="rounded-lg bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold px-4 py-2 text-xs shadow cursor-pointer"
              >
                + Create First Pitch
              </button>
            </div>
          </div>
        ) : (
          /* Project Grid */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {projects.map((project) => {
              const hasScore = project.score?.overallScore !== undefined;
              const hasSlides = project.slides && project.slides.length > 0;
              const score = project.score?.overallScore || 0;

              return (
                <div
                  key={project.id}
                  onClick={() => onOpenProject(project)}
                  className="group relative flex flex-col justify-between rounded-xl border border-zinc-800 bg-zinc-900/50 hover:bg-zinc-900/90 hover:border-zinc-700 p-5 shadow-sm hover:shadow-xl transition-all cursor-pointer"
                >
                  <div className="space-y-3">
                    {/* Header: Name + Badge */}
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h3 className="text-base font-bold text-white group-hover:text-amber-400 transition-colors">
                          {project.intake.startupName || 'Untitled Pitch'}
                        </h3>
                        <p className="text-xs text-zinc-400 line-clamp-1">
                          {project.intake.tagline || project.intake.rawIdea?.slice(0, 70) || 'Early-stage startup'}
                        </p>
                      </div>

                      {hasScore ? (
                        <div
                          className={`shrink-0 flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-bold border ${
                            score >= 80
                              ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                              : score >= 65
                              ? 'bg-amber-500/10 text-amber-400 border-amber-500/30'
                              : 'bg-rose-500/10 text-rose-400 border-rose-500/30'
                          }`}
                        >
                          <Award className="h-3 w-3" />
                          <span>{score}/100</span>
                        </div>
                      ) : (
                        <span className="shrink-0 rounded-full bg-zinc-800 px-2 py-0.5 text-[10px] font-medium text-zinc-400 border border-zinc-700">
                          {project.status.toUpperCase()}
                        </span>
                      )}
                    </div>

                    {/* Metadata tags */}
                    <div className="flex flex-wrap items-center gap-1.5 text-[11px] text-zinc-400">
                      <span className="rounded bg-zinc-800/80 px-2 py-0.5 border border-zinc-700/60">
                        {project.intake.stage || 'Idea'}
                      </span>
                      {hasSlides && (
                        <span className="rounded bg-indigo-500/10 text-indigo-300 px-2 py-0.5 border border-indigo-500/20">
                          10 Slides Ready
                        </span>
                      )}
                      <span className="text-zinc-500">• v{project.currentVersion}</span>
                    </div>

                    {/* Problem / Solution preview */}
                    <p className="text-xs text-zinc-400 line-clamp-2 leading-relaxed">
                      {project.analysis?.valueProposition || project.intake.problem || project.intake.rawIdea || 'No description provided.'}
                    </p>
                  </div>

                  {/* Footer Action */}
                  <div className="mt-5 pt-3 border-t border-zinc-800/80 flex items-center justify-between text-xs">
                    <span className="text-[11px] text-zinc-500">
                      Edited {new Date(project.updatedAt).toLocaleDateString()}
                    </span>

                    <div className="flex items-center gap-1">
                      <button
                        onClick={(e) => onDeleteProject(project.id, e)}
                        title="Delete project"
                        className="rounded p-1.5 text-zinc-500 hover:bg-zinc-800 hover:text-rose-400 transition-colors"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                      <span className="flex items-center gap-1 font-semibold text-amber-400 group-hover:translate-x-0.5 transition-transform">
                        Open Studio <ArrowRight className="h-3.5 w-3.5" />
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};


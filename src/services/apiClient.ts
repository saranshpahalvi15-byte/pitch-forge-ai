import {
  StartupIntake,
  StartupAnalysis,
  SlideData,
  PitchScore,
  InvestorCritique,
} from '../types/pitch';

export async function analyzeStartupApi(intake: StartupIntake): Promise<StartupAnalysis> {
  const res = await fetch('/api/analyze-startup', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ intake }),
  });
  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.error || 'Failed to analyze startup with Gemini');
  }
  return res.json();
}

export async function generatePitchApi(
  intake: StartupIntake,
  analysis?: StartupAnalysis
): Promise<SlideData[]> {
  const res = await fetch('/api/generate-pitch', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ intake, analysis }),
  });
  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.error || 'Failed to generate 10-slide pitch with Gemini');
  }
  const data = await res.json();
  return data.slides;
}

export async function scorePitchApi(
  intake: StartupIntake,
  slides: SlideData[],
  analysis?: StartupAnalysis
): Promise<PitchScore> {
  const res = await fetch('/api/score-pitch', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ intake, slides, analysis }),
  });
  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.error || 'Failed to score pitch deck');
  }
  return res.json();
}

export async function critiquePitchApi(
  intake: StartupIntake,
  slides: SlideData[]
): Promise<InvestorCritique> {
  const res = await fetch('/api/critique-pitch', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ intake, slides }),
  });
  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.error || 'Failed to run AI investor critique');
  }
  return res.json();
}

export async function improveSlideApi(
  slide: SlideData,
  instruction: 'improve' | 'concise' | 'strengthen_investor_arg' | 'find_unsupported' | 'suggest_layout' | 'explain_why_matters' | 'custom',
  customPrompt?: string,
  startupContext?: string
): Promise<{
  improvedSlide: SlideData;
  explanation: string;
  changesSummary: string[];
}> {
  const res = await fetch('/api/improve-slide', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ slide, instruction, customPrompt, startupContext }),
  });
  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.error || 'Failed to improve slide with AI');
  }
  return res.json();
}

export async function improvePitchApi(
  intake: StartupIntake,
  slides: SlideData[],
  critique: InvestorCritique
): Promise<{
  improvedSlides: SlideData[];
  improvementLog: string[];
}> {
  const res = await fetch('/api/improve-pitch', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ intake, slides, critique }),
  });
  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.error || 'Failed to refine pitch with AI');
  }
  return res.json();
}

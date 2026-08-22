import { PitchProject, StartupIntake } from '../types/pitch';

const STORAGE_KEY_PROJECTS = 'pitchforge_projects';

export function getStoredProjects(): PitchProject[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_PROJECTS);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch (e) {
    console.error('Failed to load stored projects:', e);
    return [];
  }
}

export function saveProject(project: PitchProject): void {
  try {
    const projects = getStoredProjects();
    const existingIndex = projects.findIndex(p => p.id === project.id);
    if (existingIndex >= 0) {
      projects[existingIndex] = {
        ...project,
        updatedAt: new Date().toISOString(),
      };
    } else {
      projects.unshift(project);
    }
    localStorage.setItem(STORAGE_KEY_PROJECTS, JSON.stringify(projects));
  } catch (e) {
    console.error('Failed to save project:', e);
  }
}

export function deleteProject(id: string): void {
  try {
    const projects = getStoredProjects().filter(p => p.id !== id);
    localStorage.setItem(STORAGE_KEY_PROJECTS, JSON.stringify(projects));
  } catch (e) {
    console.error('Failed to delete project:', e);
  }
}


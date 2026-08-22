import {
  collection,
  doc,
  setDoc,
  deleteDoc,
  query,
  where,
  onSnapshot,
  getDocs,
} from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../firebase';
import { PitchProject } from '../types/pitch';

// Clean all undefined values to ensure Firestore compatibility
function sanitizeForFirestore(obj: any): any {
  if (obj === undefined) return null;
  if (obj === null) return null;
  if (Array.isArray(obj)) {
    return obj.map(sanitizeForFirestore);
  }
  if (typeof obj === 'object') {
    const res: Record<string, any> = {};
    for (const key of Object.keys(obj)) {
      const val = obj[key];
      if (val !== undefined) {
        res[key] = sanitizeForFirestore(val);
      }
    }
    return res;
  }
  return obj;
}

/**
 * Subscribe to all pitch projects owned by the authenticated user in real-time.
 */
export function subscribeUserProjects(
  userId: string,
  onProjectsChange: (projects: PitchProject[]) => void,
  onError?: (error: any) => void
): () => void {
  const path = 'projects';
  try {
    const q = query(collection(db, path), where('ownerId', '==', userId));
    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const projects: PitchProject[] = [];
        snapshot.forEach((docSnap) => {
          const data = docSnap.data() as any;
          projects.push({
            id: data.id || docSnap.id,
            createdAt: data.createdAt || new Date().toISOString(),
            updatedAt: data.updatedAt || new Date().toISOString(),
            intake: data.intake || {
              startupName: data.startupName || 'Untitled Startup',
              rawIdea: '',
              problem: '',
              targetCustomer: '',
              solution: '',
              businessModel: '',
              stage: 'Idea',
              geography: 'United States / Global',
              existingTraction: '',
              competitors: '',
              competitiveAdvantage: '',
              revenueModel: '',
              teamInfo: '',
              additionalContext: '',
            },
            analysis: data.analysis || undefined,
            slides: Array.isArray(data.slides) ? data.slides : [],
            currentVersion: typeof data.currentVersion === 'number' ? data.currentVersion : 1,
            versions: Array.isArray(data.versions) ? data.versions : [],
            score: data.score || undefined,
            critique: data.critique || undefined,
            status: data.status || 'draft',
          });
        });

        // Sort newest first by updatedAt
        projects.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
        onProjectsChange(projects);
      },
      (error) => {
        console.error('Firestore subscription error:', error);
        if (onError) onError(error);
        handleFirestoreError(error, OperationType.GET, path);
      }
    );
    return unsubscribe;
  } catch (error) {
    console.error('Failed to initialize Firestore query:', error);
    if (onError) onError(error);
    handleFirestoreError(error, OperationType.GET, path);
  }
}

/**
 * Persist a pitch project to Firestore with all nested fields, slides, analysis, scores, and version history.
 */
export async function saveProjectToFirestore(
  project: PitchProject,
  userId: string,
  userEmail?: string | null
): Promise<void> {
  const path = `projects/${project.id}`;
  try {
    const rawPayload = {
      id: project.id,
      ownerId: userId,
      ownerEmail: userEmail || '',
      startupName: project.intake.startupName || 'Untitled Startup',
      status: project.status || 'draft',
      currentVersion: project.currentVersion || 1,
      intake: project.intake,
      analysis: project.analysis || null,
      slides: project.slides || [],
      score: project.score || null,
      critique: project.critique || null,
      versions: project.versions || [],
      createdAt: project.createdAt || new Date().toISOString(),
      updatedAt: project.updatedAt || new Date().toISOString(),
    };

    const cleanPayload = sanitizeForFirestore(rawPayload);
    await setDoc(doc(db, 'projects', project.id), cleanPayload, { merge: true });
  } catch (error) {
    console.error('Error saving pitch to Firestore:', error);
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

/**
 * Delete a pitch project from Firestore.
 */
export async function deleteProjectFromFirestore(projectId: string): Promise<void> {
  const path = `projects/${projectId}`;
  try {
    await deleteDoc(doc(db, 'projects', projectId));
  } catch (error) {
    console.error('Error deleting pitch from Firestore:', error);
    handleFirestoreError(error, OperationType.DELETE, path);
  }
}

/**
 * Synchronize local offline pitch projects to Firestore when a user authenticates.
 */
export async function syncLocalProjectsToFirestore(
  localProjects: PitchProject[],
  userId: string,
  userEmail?: string | null
): Promise<void> {
  if (!localProjects || localProjects.length === 0) return;

  for (const project of localProjects) {
    try {
      await saveProjectToFirestore(project, userId, userEmail);
    } catch (err) {
      console.warn(`Could not sync project ${project.id} to Firestore:`, err);
    }
  }
}

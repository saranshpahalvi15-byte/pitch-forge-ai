import {
  collection,
  doc,
  setDoc,
  deleteDoc,
  query,
  where,
  onSnapshot,
} from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../firebase';
import { PitchProject } from '../types/pitch';

export function subscribeUserProjects(
  userId: string,
  onProjectsChange: (projects: PitchProject[]) => void
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
            createdAt: data.createdAt,
            updatedAt: data.updatedAt,
            intake: data.intake,
            analysis: data.analysis,
            slides: data.slides || [],
            currentVersion: data.currentVersion || 1,
            versions: data.versions || [],
            score: data.score,
            critique: data.critique,
            status: data.status || 'draft',
          });
        });
        // Sort newest first
        projects.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
        onProjectsChange(projects);
      },
      (error) => {
        handleFirestoreError(error, OperationType.GET, path);
      }
    );
    return unsubscribe;
  } catch (error) {
    handleFirestoreError(error, OperationType.GET, path);
  }
}

export async function saveProjectToFirestore(project: PitchProject, userId: string, userEmail?: string | null): Promise<void> {
  const path = `projects/${project.id}`;
  try {
    const payload = {
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

    // Clean undefined fields before writing to Firestore
    const cleanPayload = JSON.parse(JSON.stringify(payload));
    await setDoc(doc(db, 'projects', project.id), cleanPayload);
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

export async function deleteProjectFromFirestore(projectId: string): Promise<void> {
  const path = `projects/${projectId}`;
  try {
    await deleteDoc(doc(db, 'projects', projectId));
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, path);
  }
}

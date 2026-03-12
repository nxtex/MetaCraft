import {
  collection, addDoc, getDocs, deleteDoc, doc,
  query, where, orderBy, serverTimestamp, Timestamp,
} from 'firebase/firestore';
import { db } from './firebase';

export interface FileRecord {
  id: string;
  userId: string;
  originalName: string;
  mimeType: string;
  sizeBytes: number;
  metadata: Record<string, unknown>;
  createdAt: Timestamp;
}

export async function saveFileRecord(
  userId: string,
  data: Omit<FileRecord, 'id' | 'createdAt'>,
): Promise<string> {
  const ref = await addDoc(collection(db, 'files'), {
    ...data,
    userId,
    createdAt: serverTimestamp(),
  });
  return ref.id;
}

export async function getUserFiles(userId: string): Promise<FileRecord[]> {
  const q = query(
    collection(db, 'files'),
    where('userId', '==', userId),
    orderBy('createdAt', 'desc'),
  );
  const snap = await getDocs(q);
  return snap.docs.map(d => ({ id: d.id, ...d.data() } as FileRecord));
}

export async function deleteFileRecord(fileId: string): Promise<void> {
  await deleteDoc(doc(db, 'files', fileId));
}

import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { storage } from './firebase';

export async function uploadFile(
  userId: string,
  file: File,
  onProgress?: (pct: number) => void,
): Promise<{ storagePath: string; downloadURL: string }> {
  const storagePath = `users/${userId}/${Date.now()}_${file.name}`;
  const storageRef = ref(storage, storagePath);

  // Simulate progress (Firebase SDK v9 uploadBytes is atomic)
  if (onProgress) {
    let p = 0;
    const t = setInterval(() => {
      p = Math.min(p + 15, 85);
      onProgress(p);
    }, 100);
    await uploadBytes(storageRef, file);
    clearInterval(t);
    onProgress(100);
  } else {
    await uploadBytes(storageRef, file);
  }

  const downloadURL = await getDownloadURL(storageRef);
  return { storagePath, downloadURL };
}

export async function deleteStorageFile(storagePath: string): Promise<void> {
  await deleteObject(ref(storage, storagePath));
}

export async function getFileURL(storagePath: string): Promise<string> {
  return getDownloadURL(ref(storage, storagePath));
}

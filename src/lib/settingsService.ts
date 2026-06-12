import { doc, getDoc, setDoc, onSnapshot } from 'firebase/firestore';
import { db } from './firebase';
import type { SiteSettings } from '../store/useStore';

const SETTINGS_ID = 'site';

export async function loadSettings(): Promise<Partial<SiteSettings> | null> {
  const docRef = doc(db, 'settings', SETTINGS_ID);
  const docSnap = await getDoc(docRef);

  if (docSnap.exists()) {
    return docSnap.data() as Partial<SiteSettings>;
  }
  return null;
}

export async function saveSettings(settings: Partial<SiteSettings>): Promise<void> {
  const docRef = doc(db, 'settings', SETTINGS_ID);
  await setDoc(docRef, settings, { merge: true });
}

export function subscribeSettings(callback: (settings: Partial<SiteSettings>) => void): () => void {
  const docRef = doc(db, 'settings', SETTINGS_ID);
  return onSnapshot(docRef, (docSnap) => {
    if (docSnap.exists()) {
      callback(docSnap.data() as Partial<SiteSettings>);
    }
  });
}

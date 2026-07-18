import { doc, getDoc, setDoc, onSnapshot } from 'firebase/firestore';
import { db } from './firebase';
import type { SiteSettings } from '../store/useStore';

const SETTINGS_ID = 'site';

export async function loadSettings(): Promise<Partial<SiteSettings> | null> {
  try {
    const docRef = doc(db, 'settings', SETTINGS_ID);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      console.log('✅ Firebase: settings loaded');
      return docSnap.data() as Partial<SiteSettings>;
    }
    console.log('ℹ️ Firebase: no settings doc yet');
    return null;
  } catch (err) {
    console.error('❌ Firebase: loadSettings error', err);
    return null;
  }
}

export async function saveSettings(settings: Partial<SiteSettings>): Promise<void> {
  try {
    const docRef = doc(db, 'settings', SETTINGS_ID);
    await setDoc(docRef, settings, { merge: true });
    console.log('✅ Firebase: settings saved');
  } catch (err) {
    console.error('❌ Firebase: saveSettings error', err);
  }
}

export function subscribeSettings(callback: (settings: Partial<SiteSettings>) => void): () => void {
  const docRef = doc(db, 'settings', SETTINGS_ID);
  return onSnapshot(
    docRef,
    (docSnap) => {
      if (docSnap.exists()) {
        console.log('🔄 Firebase: real-time update received');
        callback(docSnap.data() as Partial<SiteSettings>);
      }
    },
    (error) => {
      console.error('❌ Firebase: onSnapshot settings ERROR', error);
    }
  );
}

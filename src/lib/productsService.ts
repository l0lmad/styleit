import { doc, setDoc, getDoc, onSnapshot } from 'firebase/firestore';
import { db } from './firebase';
import type { Product } from '../store/useStore';

export async function saveAllProducts(products: Product[]): Promise<void> {
  const docRef = doc(db, 'data', 'products');
  await setDoc(docRef, { products });
}

export function listenProducts(callback: (products: Product[]) => void): () => void {
  const docRef = doc(db, 'data', 'products');
  return onSnapshot(docRef, (snap) => {
    if (snap.exists()) {
      const data = snap.data();
      if (data.products) callback(data.products as Product[]);
    }
  });
}

export async function loadAllProducts(): Promise<Product[] | null> {
  const docRef = doc(db, 'data', 'products');
  const snap = await getDoc(docRef);
  if (snap.exists()) {
    const data = snap.data();
    return (data.products as Product[]) || null;
  }
  return null;
}

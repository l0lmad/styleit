import { doc, setDoc, getDoc, onSnapshot } from 'firebase/firestore';
import { db } from './firebase';
import type { Product } from '../store/useStore';

export interface ProductsData {
  products: Product[];
  updatedAt: number;
}

export async function saveAllProducts(products: Product[]): Promise<void> {
  const docRef = doc(db, 'data', 'products');
  await setDoc(docRef, { products, updatedAt: Date.now() });
}

export function listenProducts(callback: (data: ProductsData) => void): () => void {
  const docRef = doc(db, 'data', 'products');
  return onSnapshot(docRef, (snap) => {
    if (snap.exists()) {
      const data = snap.data() as ProductsData;
      if (data.products) callback(data);
    }
  });
}

export async function loadAllProducts(): Promise<ProductsData | null> {
  const docRef = doc(db, 'data', 'products');
  const snap = await getDoc(docRef);
  if (snap.exists()) {
    return snap.data() as ProductsData;
  }
  return null;
}

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
  console.log('✅ Firestore: products saved', products.length, 'products');
}

export function listenProducts(callback: (data: ProductsData) => void): () => void {
  const docRef = doc(db, 'data', 'products');
  return onSnapshot(
    docRef,
    (snap) => {
      if (snap.exists()) {
        const data = snap.data() as ProductsData;
        if (data.products) {
          console.log('🔄 Firestore: products update received, ts:', data.updatedAt);
          callback(data);
        }
      } else {
        console.log('ℹ️ Firestore: products doc does not exist yet');
      }
    },
    (error) => {
      console.error('❌ Firestore: onSnapshot products ERROR', error);
    }
  );
}

export async function loadAllProducts(): Promise<ProductsData | null> {
  try {
    const docRef = doc(db, 'data', 'products');
    const snap = await getDoc(docRef);
    if (snap.exists()) {
      console.log('✅ Firestore: products loaded');
      return snap.data() as ProductsData;
    }
    console.log('ℹ️ Firestore: no products doc yet');
    return null;
  } catch (err) {
    console.error('❌ Firestore: loadAllProducts ERROR', err);
    return null;
  }
}

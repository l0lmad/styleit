import { doc, setDoc, getDoc, onSnapshot } from 'firebase/firestore';
import { db } from './firebase';
import { normalizeProducts, type Product } from '../store/useStore';

export interface ProductsData {
  products: Product[];
  updatedAt: number;
}

export async function saveAllProducts(products: Product[]): Promise<void> {
  const docRef = doc(db, 'data', 'products');
  await setDoc(docRef, { products: normalizeProducts(products), updatedAt: Date.now() });
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
          callback({ products: normalizeProducts(data.products), updatedAt: data.updatedAt });
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
      const data = snap.data() as ProductsData;
      return { products: normalizeProducts(data.products), updatedAt: data.updatedAt };
    }
    console.log('ℹ️ Firestore: no products doc yet');
    return null;
  } catch (err) {
    console.error('❌ Firestore: loadAllProducts ERROR', err);
    return null;
  }
}

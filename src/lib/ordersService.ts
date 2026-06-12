import { doc, getDoc, setDoc, collection, onSnapshot, query } from 'firebase/firestore';
import { db } from './firebase';
import type { Order } from '../store/useStore';

export async function saveOrderToFirestore(order: Order): Promise<void> {
  const docRef = doc(db, 'orders', order.id);
  await setDoc(docRef, order);
}

export async function saveUnreadIdsToFirestore(ids: string[]): Promise<void> {
  const docRef = doc(db, 'unread', 'ids');
  await setDoc(docRef, { ids });
}

export async function loadAllOrdersFromFirestore(): Promise<Order[]> {
  const snapshot = await getDocs(query(collection(db, 'orders')));
  const orders: Order[] = [];
  snapshot.forEach((d) => orders.push(d.data() as Order));
  return orders;
}

export async function loadUnreadIdsFromFirestore(): Promise<string[]> {
  const docRef = doc(db, 'unread', 'ids');
  const snap = await getDoc(docRef);
  if (snap.exists()) {
    return snap.data().ids || [];
  }
  return [];
}

export function listenOrders(callback: (orders: Order[]) => void): () => void {
  const q = query(collection(db, 'orders'));
  return onSnapshot(q, (snapshot) => {
    const orders: Order[] = [];
    snapshot.forEach((d) => orders.push(d.data() as Order));
    callback(orders);
  });
}

export function listenUnreadIds(callback: (ids: string[]) => void): () => void {
  const docRef = doc(db, 'unread', 'ids');
  return onSnapshot(docRef, (snap) => {
    if (snap.exists()) {
      callback(snap.data().ids || []);
    }
  });
}

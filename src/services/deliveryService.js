import {
  addDoc,
  collection,
  Timestamp,
  query,
  orderBy,
  getDocs,
} from "firebase/firestore";
import { db } from "../firebase/firebase";

const deliveryRef = collection(db, "deliveries");

export async function addDelivery(data) {
  return await addDoc(deliveryRef, {
    ...data,
    createdAt: Timestamp.now(),
  });
}

export async function getDeliveries() {
  const q = query(deliveryRef, orderBy("createdAt", "desc"));
  const snapshot = await getDocs(q);

  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data(),
  }));
}
import {
  addDoc,
  collection,
  Timestamp,
} from "firebase/firestore";

import { db } from "../firebase/firebase";

const inventoryRef = collection(db, "inventory_logs");

export async function addInventoryLog(data) {
  return await addDoc(inventoryRef, {
    ...data,
    createdAt: Timestamp.now(),
  });
}
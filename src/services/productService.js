import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  orderBy,
  query,
  Timestamp,
  updateDoc,
} from "firebase/firestore";

import { db } from "../firebase/firebase";

const productRef = collection(db, "products");

export async function getProducts() {
  const q = query(productRef, orderBy("createdAt", "desc"));

  const snapshot = await getDocs(q);

  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));
}

export async function addProduct(data) {
  return await addDoc(productRef, {
    ...data,
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
    status: "Active",
    isArchived: false,
  });
}

export async function updateProduct(id, data) {
  return await updateDoc(doc(db, "products", id), {
    ...data,
    updatedAt: Timestamp.now(),
  });
}

export async function deleteProduct(id) {
  return await deleteDoc(doc(db, "products", id));
}

export async function updateProductQuantity(id, quantity) {
  return await updateDoc(doc(db, "products", id), {
    quantity,
    updatedAt: Timestamp.now(),
  });
}

const handleStockIn = async (product) => {

  const amount = Number(
    prompt(`Add stock for ${product.productName}`)
  );


  if (!amount || amount <= 0) return;


  const newQuantity = product.quantity + amount;


  await updateProductQuantity(
    product.id,
    newQuantity
  );


  loadData();

};



const handleStockOut = async (product) => {

  const amount = Number(
    prompt(`Remove stock for ${product.productName}`)
  );


  if (!amount || amount <= 0) return;


  if (amount > product.quantity) {
    alert("Not enough stock available");
    return;
  }


  const newQuantity = product.quantity - amount;


  await updateProductQuantity(
    product.id,
    newQuantity
  );


  loadData();

};
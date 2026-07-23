import {
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  updateDoc,
  doc,
  query,
  orderBy,
  Timestamp,
} from "firebase/firestore";

import { db } from "../firebase/firebase";


const columnRef = collection(db, "columns");



// Get all columns
export async function getColumns() {

  const q = query(
    columnRef,
    orderBy("order")
  );


  const snapshot = await getDocs(q);


  return snapshot.docs.map((doc) => ({

    id: doc.id,

    ...doc.data(),

  }));

}




// Add a new column
export async function addColumn(column) {


  const field = column.label
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "_")
    .replace(/[^a-z0-9_]/g, "");



  return await addDoc(columnRef, {


    label: column.label,


    field,


    type: column.type,


    required: column.required,


    visible: column.visible,


    order: column.order,


    createdAt: Timestamp.now(),


    updatedAt: Timestamp.now(),


  });

}






// Update existing column
export async function updateColumn(id, data) {


  return await updateDoc(

    doc(db, "columns", id),

    {

      ...data,


      updatedAt: Timestamp.now(),

    }

  );

}







// Delete a column
export async function deleteColumn(id) {


  return await deleteDoc(

    doc(db, "columns", id)

  );

}
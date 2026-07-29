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
  writeBatch,
} from "firebase/firestore";

import { db } from "../firebase/firebase";


const columnRef = collection(
  db,
  "columns"
);



export async function getColumns() {

  try {

    const q = query(
      columnRef,
      orderBy("order")
    );


    const snapshot = await getDocs(q);


    return snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));


  } catch (error) {

    console.error(
      "Error fetching columns:",
      error
    );

    return [];

  }

}




export async function addColumn(column) {

  return addDoc(columnRef, {

    label: column.label,

    type: column.type,

    required: column.required ?? false,

    visible: column.visible ?? true,

    // controls drag order only
    order: column.order ?? 0,


    createdAt: Timestamp.now(),

    updatedAt: Timestamp.now(),

  });

}




export async function updateColumn(
  id,
  data
) {

  return updateDoc(
    doc(db, "columns", id),
    {

      label: data.label,

      type: data.type,

      required: data.required ?? false,

      visible: data.visible ?? true,


      updatedAt: Timestamp.now(),

    }
  );

}




// Save drag and drop order
export async function updateColumnArrangement(
  columns
) {

  const batch = writeBatch(db);


  columns.forEach(
    (column, index) => {

      const columnRef = doc(
        db,
        "columns",
        column.id
      );


      batch.update(
        columnRef,
        {
          order: index,
          updatedAt: Timestamp.now(),
        }
      );

    }
  );


  return batch.commit();

}




export async function deleteColumn(id) {

  return deleteDoc(
    doc(db, "columns", id)
  );

}
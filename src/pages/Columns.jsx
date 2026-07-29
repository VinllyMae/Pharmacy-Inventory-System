import { useEffect, useState } from "react";
import ColumnForm from "../components/columns/ColumnForm";
import ColumnTable from "../components/columns/ColumnTable";

import {
  getColumns,
  addColumn,
  deleteColumn,
  updateColumn,
  updateColumnArrangement,
} from "../services/columnService";

import { arrayMove } from "@dnd-kit/sortable";

export default function Columns() {
  const [columns, setColumns] = useState([]);

  const [label, setLabel] = useState("");
  const [type, setType] = useState("text");
  const [required, setRequired] = useState(false);
  const [visible, setVisible] = useState(true);

  const [selectedColumn, setSelectedColumn] = useState(null);


  useEffect(() => {
    loadColumns();
  }, []);


  async function loadColumns() {
    try {
      const data = await getColumns();

      // Sort only by stored order if available
      const sorted = [...data].sort(
        (a, b) => (a.order ?? 0) - (b.order ?? 0)
      );

      setColumns(sorted);

    } catch (error) {
      console.error(
        "Failed loading columns:",
        error
      );
    }
  }


  async function handleAdd() {
    if (!label.trim()) return;


    try {
      const columnData = {
        label: label.trim(),
        type,
        required,
        visible,
      };


      if (selectedColumn) {

        await updateColumn(
          selectedColumn.id,
          columnData
        );

      } else {

        await addColumn({
          ...columnData,
          order: columns.length,
        });

      }


      resetForm();
      await loadColumns();


    } catch (error) {
      console.error(
        "Saving column failed:",
        error
      );
    }
  }



  function handleEdit(column) {

    setSelectedColumn(column);

    setLabel(column.label || "");
    setType(column.type || "text");
    setRequired(column.required || false);
    setVisible(
      column.visible !== false
    );
  }



  async function handleDelete(id) {

    try {

      await deleteColumn(id);

      await loadColumns();

    } catch (error) {

      console.error(
        "Delete failed:",
        error
      );

    }
  }



  async function handleDragEnd(event) {

    const {
      active,
      over
    } = event;


    if (
      !over ||
      active.id === over.id
    ) {
      return;
    }


    const oldIndex =
      columns.findIndex(
        column =>
          column.id === active.id
      );


    const newIndex =
      columns.findIndex(
        column =>
          column.id === over.id
      );


    const reordered =
      arrayMove(
        columns,
        oldIndex,
        newIndex
      );


    // update local display immediately
    setColumns(reordered);


    // save order to firebase
    await updateColumnArrangement(
      reordered
    );
  }



  function resetForm() {

    setLabel("");
    setType("text");
    setRequired(false);
    setVisible(true);

    setSelectedColumn(null);
  }



  return (

    <div className="flex flex-col gap-3">

      <ColumnForm

        label={label}
        setLabel={setLabel}

        type={type}
        setType={setType}

        required={required}
        setRequired={setRequired}

        visible={visible}
        setVisible={setVisible}

        handleAdd={handleAdd}

        editing={selectedColumn}

        cancelEdit={resetForm}

      />



      <ColumnTable

        columns={columns}

        handleEdit={handleEdit}

        handleDelete={handleDelete}

        handleDragEnd={handleDragEnd}

      />

    </div>

  );
}
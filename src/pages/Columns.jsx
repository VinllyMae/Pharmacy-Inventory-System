import { useEffect, useState } from "react";

import ColumnForm from "../components/columns/ColumnForm";
import ColumnTable from "../components/columns/ColumnTable";

import {
  getColumns,
  addColumn,
  deleteColumn,
  updateColumn,
} from "../services/columnService";


export default function Columns() {


  const [columns, setColumns] = useState([]);


  const [label, setLabel] = useState("");

  const [type, setType] = useState("text");

  const [required, setRequired] = useState(false);

  const [visible, setVisible] = useState(true);


  const [selectedColumn, setSelectedColumn] = useState(null);






  async function loadColumns() {

    const data = await getColumns();

    setColumns(data);

  }






  useEffect(() => {

    loadColumns();

  }, []);








  async function handleAdd() {


    if (!label.trim()) {

      return;

    }



    try {


      if (selectedColumn) {


        // UPDATE EXISTING COLUMN

        await updateColumn(

          selectedColumn.id,

          {
            label,
            type,
            required,
            visible,
          }

        );


      } else {



        // ADD NEW COLUMN

        await addColumn({

          label,

          type,

          required,

          visible,

          order: columns.length + 1,

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


    setLabel(column.label);

    setType(column.type);

    setRequired(column.required);

    setVisible(column.visible);


  }









  async function handleDelete(id) {


    try {


      await deleteColumn(id);


      await loadColumns();



    } catch(error) {


      console.error(
        "Delete failed:",
        error
      );


    }


  }









  function resetForm() {


    setLabel("");

    setType("text");

    setRequired(false);

    setVisible(true);

    setSelectedColumn(null);


  }









  return (


    <div className="space-y-6">



      <div className="
        flex
        justify-between
        items-center
      ">



        <h1 className="
          text-3xl
          font-bold
          text-slate-800
        ">

          Product Columns

        </h1>



      </div>







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


      />




    </div>


  );

}
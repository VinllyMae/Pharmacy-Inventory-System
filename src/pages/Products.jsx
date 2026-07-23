import { useEffect, useState } from "react";

import Button from "../components/ui/Button";
import Modal from "../components/ui/Modal";
import ProductForm from "../components/products/ProductForm";
import ProductTable from "../components/products/ProductTable";

import {
  getProducts,
  updateProductQuantity
} from "../services/productService";

import { getColumns } from "../services/columnService";


export default function Products() {


  const [open, setOpen] = useState(false);

  const [selectedProduct, setSelectedProduct] = useState(null);


  const [products, setProducts] = useState([]);

  const [columns, setColumns] = useState([]);



  async function loadData() {

    const [
      productData,
      columnData
    ] = await Promise.all([
      getProducts(),
      getColumns(),
    ]);


    setProducts(productData);

    setColumns(
      columnData.filter(
        (c) => c.visible
      )
    );

  }




  useEffect(() => {

    loadData();

  }, []);






  const handleAdd = () => {

    setSelectedProduct(null);

    setOpen(true);

  };





  const handleEdit = (product) => {

    setSelectedProduct(product);

    setOpen(true);

  };






  // STOCK IN

  const handleStockIn = async (product) => {


    const amount = Number(
      prompt(
        `Add stock quantity for ${product.productName}`
      )
    );



    if (!amount || amount <= 0) {

      return;

    }




    await updateProductQuantity(
      product.id,
      product.quantity + amount
    );



    loadData();

  };







  // STOCK OUT

  const handleStockOut = async (product) => {


    const amount = Number(
      prompt(
        `Remove stock quantity for ${product.productName}`
      )
    );



    if (!amount || amount <= 0) {

      return;

    }





    if (amount > product.quantity) {


      alert(
        "Stock quantity is not enough"
      );


      return;

    }





    await updateProductQuantity(
      product.id,
      product.quantity - amount
    );



    loadData();

  };







  return (

    <div
      className="
                space-y-6
            "
    >



      {/* HEADER */}

      <div
        className="
                    flex
                    justify-between
                    items-center
                "
      >


        <div>

          <h1
            className="
                            text-3xl
                            font-bold
                            text-slate-800
                        "
          >
            Products
          </h1>


          <p
            className="
                            text-gray-500
                            mt-1
                        "
          >
            Manage pharmacy inventory and stock levels.
          </p>


        </div>





        <Button
          className="
                        bg-blue-600
                        text-white
                        hover:bg-blue-700
                    "
          onClick={handleAdd}
        >

          + Add Product

        </Button>


      </div>









      {/* TABLE */}


      <ProductTable

        products={products}

        columns={columns}

        onEdit={handleEdit}

        onStockIn={handleStockIn}

        onStockOut={handleStockOut}

      />









      {/* MODAL */}


      <Modal

        open={open}

        title={
           "Product Information"
        }


        onClose={() => {

          setOpen(false);

          setSelectedProduct(null);

        }}

      >


        <ProductForm

          product={selectedProduct}


          onSuccess={() => {

            setOpen(false);

            setSelectedProduct(null);

            loadData();

          }}

        />


      </Modal>



    </div>

  );

}
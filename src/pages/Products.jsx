import { useEffect, useState } from "react";

import Button from "../components/ui/Button";
import Modal from "../components/ui/Modal";
import ProductForm from "../components/products/ProductForm";
import ProductTable from "../components/products/ProductTable";

import {
  getProducts,
  updateProductQuantity,
} from "../services/productService";

import { getColumns } from "../services/columnService";

export default function Products() {
  const [open, setOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [products, setProducts] = useState([]);
  const [columns, setColumns] = useState([]);
  const [loading, setLoading] = useState(false);

  async function loadData() {
    try {
      setLoading(true);

      const [productData, columnData] = await Promise.all([
        getProducts(),
        getColumns(),
      ]);

      setProducts(productData || []);

      setColumns(
        (columnData || []).filter((column) => column.visible)
      );
    } catch (error) {
      console.error("Failed loading products:", error);
    } finally {
      setLoading(false);
    }
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

  const getProductName = (product) => {
    return (
      product.productName ||
      product.name ||
      product.product ||
      "Product"
    );
  };

  const handleStockIn = async (product) => {
    console.log("product", product);
    const amount = Number(
      prompt(`Add stock quantity for ${getProductName(product)}`)
    );

    if (!amount || amount <= 0) return;

    try {
      await updateProductQuantity(
        product.id,
        Number(product.quantity || 0) + amount
      );

      loadData();
    } catch (error) {
      console.error("Stock in failed:", error);
    }
  };

  const handleStockOut = async (product) => {
    const amount = Number(
      prompt(`Remove stock quantity for ${getProductName(product)}`)
    );

    if (!amount || amount <= 0) return;

    const currentQuantity = Number(product.quantity || 0);

    if (amount > currentQuantity) {
      alert("Stock quantity is not enough");
      return;
    }

    try {
      await updateProductQuantity(
        product.id,
        currentQuantity - amount
      );

      loadData();
    } catch (error) {
      console.error("Stock out failed:", error);
    }
  };

  const closeModal = () => {
    setOpen(false);
    setSelectedProduct(null);
  };

  return (
    <div className="space-y-6 w-full min-w-0">
      <div className="w-full overflow-hidden">
        {loading ? (
          <div className="flex justify-center items-center py-20 text-slate-500">
            Loading products...
          </div>
        ) : (
          <ProductTable
            products={products}
            columns={columns}
            onEdit={handleEdit}
            onStockIn={handleStockIn}
            onStockOut={handleStockOut}
            onAdd={handleAdd}
          />
        )}
      </div>

      <Modal
        open={open}
        title="Product Information"
        onClose={closeModal}
      >
        <ProductForm
          product={selectedProduct}
          onSuccess={() => {
            closeModal();
            loadData();
          }}
        />
      </Modal>
    </div>
  );
}
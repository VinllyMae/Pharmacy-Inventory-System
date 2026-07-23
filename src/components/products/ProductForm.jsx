import { useEffect, useState } from "react";
import {
  addProduct,
  updateProduct,
} from "../../services/productService";
import { getColumns } from "../../services/columnService";

import Input from "../ui/Input";
import Button from "../ui/Button";

export default function ProductForm({
  product,
  onSuccess,
}) {
  const [columns, setColumns] = useState([]);

  const [productName, setProductName] = useState("");
  const [quantity, setQuantity] = useState("");
  const [expiryDate, setExpiryDate] = useState("");

  const [customFields, setCustomFields] = useState({});

  useEffect(() => {
    async function loadColumns() {
      const data = await getColumns();
      setColumns(data.filter((c) => c.visible));
    }

    loadColumns();
  }, []);

  useEffect(() => {
    if (product) {
      setProductName(product.productName || "");
      setQuantity(product.quantity || "");
      setExpiryDate(product.expiryDate || "");
      setCustomFields(product.customFields || {});
    } else {
      setProductName("");
      setQuantity("");
      setExpiryDate("");
      setCustomFields({});
    }
  }, [product]);

  async function handleSubmit(e) {
    e.preventDefault();

    const payload = {
      productName,
      quantity: Number(quantity),
      expiryDate,
      customFields,
    };

    if (product) {
      await updateProduct(product.id, payload);
    } else {
      await addProduct(payload);
    }

    if (onSuccess) onSuccess();
  }

  return (
    <form onSubmit={handleSubmit}>

      <Input
        label="Product Name"
        value={productName}
        onChange={(e) => setProductName(e.target.value)}
      />

      <Input
        label="Quantity"
        type="number"
        value={quantity}
        onChange={(e) => setQuantity(e.target.value)}
      />

      <Input
        label="Expiry Date"
        type="date"
        value={expiryDate}
        onChange={(e) => setExpiryDate(e.target.value)}
      />

      {columns.map((column) => (
        <Input
          key={column.id}
          label={column.label}
          type={column.type}
          value={customFields[column.field] || ""}
          onChange={(e) =>
            setCustomFields((prev) => ({
              ...prev,
              [column.field]: e.target.value,
            }))
          }
        />
      ))}

      <div className="flex justify-end mt-6">
        <Button
          type="submit"
          className="bg-green-600 text-white hover:bg-green-700"
        >
          {product ? "Update Product" : "Save Product"}
        </Button>
      </div>

    </form>
  );
}
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
  const [formData, setFormData] = useState({});

  useEffect(() => {
    async function loadColumns() {
      const data = await getColumns();

      setColumns(
        data.filter((column) =>
          column.visible &&
          column.label.toLowerCase() !== "status"
        )
      );
    }

    loadColumns();
  }, []);

  useEffect(() => {
    if (!columns.length) return;

    const values = {};

    columns.forEach((column) => {
      values[column.id] =
        product?.customFields?.[column.id] || "";
    });

    setFormData(values);
  }, [product, columns]);

  function handleChange(field, value) {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  }

  async function handleSubmit(e) {
    e.preventDefault();

    const payload = {
      customFields: {
        ...formData,
      },
    };

    if (product) {
      await updateProduct(product.id, payload);
    } else {
      await addProduct(payload);
    }

    onSuccess?.();
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="flex h-full flex-col"
    >
      <div className="flex-1 overflow-y-auto pr-2 space-y-4 max-h-[65vh]">
        {columns.map((column) => (
          <Input
            key={column.id}
            label={column.label}
            type={column.type}
            required={column.required}
            value={formData[column.id] || ""}
            onChange={(e) =>
              handleChange(
                column.id,
                e.target.value
              )
            }
          />
        ))}
      </div>

      <div className="sticky bottom-0 mt-6 border-t bg-white pt-4">
        <div className="flex justify-end">
          <Button
            type="submit"
            className="bg-green-600 text-white hover:bg-green-700"
          >
            {product
              ? "Update Product"
              : "Save Product"}
          </Button>
        </div>
      </div>
    </form>
  );
}
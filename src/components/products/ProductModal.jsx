import { useMemo, useState } from "react";
import Button from "../ui/Button";
import Input from "../ui/Input";

export default function StockModal({
  title,
  product,
  columns,
  onSubmit,
}) {
  const [quantity, setQuantity] = useState("");
  const [remarks, setRemarks] = useState("");

  const displayName = useMemo(() => {
    if (!product) return "";

    const nameColumn =
      columns?.find(
        (column) =>
          column.field === "productName" ||
          column.label.toLowerCase() === "product name"
      ) || null;

    if (nameColumn?.field === "productName") {
      return product.productName;
    }

    return (
      product.customFields?.[nameColumn?.field] ||
      product.productName ||
      "Unnamed Product"
    );
  }, [product, columns]);

  function handleSubmit(e) {
    e.preventDefault();

    if (!quantity || Number(quantity) <= 0) return;

    onSubmit({
      quantity: Number(quantity),
      remarks: remarks.trim(),
    });

    setQuantity("");
    setRemarks("");
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <h2 className="text-xl font-bold text-slate-800">
          {title}
        </h2>

        <p className="mt-2 text-sm text-slate-600">
          Product:
          <span className="ml-2 font-semibold text-slate-900">
            {displayName}
          </span>
        </p>
      </div>

      <Input
        label="Quantity"
        type="number"
        min="1"
        value={quantity}
        onChange={(e) => setQuantity(e.target.value)}
      />

      <Input
        label="Remarks"
        value={remarks}
        onChange={(e) => setRemarks(e.target.value)}
        placeholder="Optional remarks"
      />

      <div className="flex justify-end">
        <Button type="submit">
          Save
        </Button>
      </div>
    </form>
  );
}
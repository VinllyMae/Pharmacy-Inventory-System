import { useState } from "react";

import Button from "../ui/Button";
import Input from "../ui/Input";

export default function StockModal({
  title,
  product,
  onSubmit,
}) {
  const [quantity, setQuantity] = useState("");
  const [remarks, setRemarks] = useState("");

  function handleSubmit(e) {
    e.preventDefault();

    onSubmit({
      quantity: Number(quantity),
      remarks,
    });

    setQuantity("");
    setRemarks("");
  }

  return (
    <form onSubmit={handleSubmit}>

      <h2 className="text-xl font-bold mb-5">
        {title}
      </h2>

      <p className="mb-4">
        Product:
        <strong> {product?.productName}</strong>
      </p>

      <Input
        label="Quantity"
        type="number"
        value={quantity}
        onChange={(e) => setQuantity(e.target.value)}
      />

      <Input
        label="Remarks"
        value={remarks}
        onChange={(e) => setRemarks(e.target.value)}
      />

      <div className="flex justify-end mt-5">
        <Button type="submit">
          Save
        </Button>
      </div>

    </form>
  );
}
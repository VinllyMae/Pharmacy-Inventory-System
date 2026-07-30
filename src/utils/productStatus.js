export function getProductStatus(product, columns = []) {
  const expiryColumn = columns.find(
    (c) => c.label.trim().toLowerCase() === "expiry"
  );

  const expiryValue = product.customFields?.[expiryColumn?.id];

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  if (!expiryColumn || !expiryValue) {
    return {
      text: product.quantity <= 10 ? "Low Stock" : "Good",
      color: product.quantity <= 10 ? "bg-yellow-500" : "bg-green-600",
    };
  }

  const expiry = new Date(expiryValue);
  expiry.setHours(0, 0, 0, 0);

  if (expiry < today) {
    return {
      text: "Expired",
      color: "bg-red-500",
    };
  }

  const daysRemaining = (expiry - today) / (1000 * 60 * 60 * 24);

  const expiryDaysColumn = columns.find(
    (c) => c.label.trim().toLowerCase() === "expiry days"
  );

  const productThreshold = Number(
    product.customFields?.[expiryDaysColumn?.id]
  );

  const threshold =
    Number.isFinite(productThreshold) && productThreshold > 0
      ? productThreshold
      : 30;

  if (daysRemaining <= threshold) {
    return {
      text: "Expiring Soon",
      color: "bg-orange-500",
    };
  }

  if (product.quantity <= 10) {
    return {
      text: "Low Stock",
      color: "bg-yellow-500",
    };
  }

  return {
    text: "Good",
    color: "bg-green-600",
  };
}
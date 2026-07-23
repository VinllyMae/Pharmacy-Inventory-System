export function getProductStatus(product) {
  const today = new Date();
  const expiry = new Date(product.expiryDate);

  // Normalize to date only (ignore time)
  today.setHours(0, 0, 0, 0);
  expiry.setHours(0, 0, 0, 0);

  if (expiry < today) {
    return {
      text: "Expired",
      color: "bg-red-500",
    };
  }

  const daysRemaining =
    (expiry - today) / (1000 * 60 * 60 * 24);

  if (daysRemaining <= 30) {
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
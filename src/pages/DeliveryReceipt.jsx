import React from "react";

export default function DeliveryReceipt({ delivery, onRemoveItem }) {
    if (!delivery) return null;

    const {
        customerName,
        address,
        siNo,
        date,
        paymentDue,
        items = [],
        totalQuantity = 0,
        grandTotal = 0,

        preparedSoBy,
        checkedBy,
        deliveredBy,
        preparedStocksBy,
        releasedBy,
        receivedBy,
    } = delivery;

    return (
        <>
            <style>{`
        @media print {
          body * {
            visibility: hidden;
          }

          #delivery-receipt,
          #delivery-receipt * {
            visibility: visible;
          }

          #delivery-receipt {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            border: none !important;
            border-radius: 0 !important;
            box-shadow: none !important;
            max-height: none !important;
            padding: 0 !important;
          }

          #delivery-receipt-scroll {
            overflow: visible !important;
            max-height: none !important;
          }

          .no-print {
            display: none !important;
          }
        }
      `}</style>

            <div
                id="delivery-receipt"
                className="bg-white rounded-2xl shadow-sm border flex flex-col max-h-[85vh]"
            >
                <div
                    id="delivery-receipt-scroll"
                    className="overflow-y-auto p-8 pt-4"
                >
                    {/* ================= HEADER ================= */}

                    <div className="text-center border-b pb-4 mb-4">
                        <h2 className="text-xl font-bold text-blue-700">
                            GenRX
                        </h2>

                        <p className="text-xs text-slate-500">
                            Pharmaceutical Distribution
                        </p>

                        <p className="text-xs text-slate-400">
                            Miraverde, Tuktukan, Guiguinto, Bulacan
                        </p>
                    </div>

                    {/* ================= CUSTOMER ================= */}

                    <div className="flex justify-between items-start mb-4">
                        <div className="text-sm">
                            <p>
                                <span className="font-semibold">
                                    Customer name:
                                </span>{" "}
                                {customerName || "-"}
                            </p>

                            <p>
                                <span className="font-semibold">
                                    Address:
                                </span>{" "}
                                {address || "-"}
                            </p>
                        </div>

                        <div className="text-right">
                            <p className="font-bold text-lg">
                                Delivery Receipt
                            </p>

                            <p className="text-sm text-slate-500">
                                SI No. {siNo || "-"}
                            </p>
                        </div>
                    </div>

                    <div className="flex justify-between text-sm mb-4">
                        <p>
                            <span className="font-semibold">
                                Date:
                            </span>{" "}
                            {date || "-"}
                        </p>

                        <p>
                            <span className="font-semibold">
                                Payment due:
                            </span>{" "}
                            {paymentDue || "-"}
                        </p>
                    </div>

                    {/* ================= ITEMS ================= */}

                    <table className="w-full text-sm border-t border-b mb-4">
                        <thead>
                            <tr className="border-b text-slate-600">
                                <th className="text-left py-2">
                                    No.
                                </th>

                                <th className="text-left py-2">
                                    Description
                                </th>

                                <th className="text-center py-2">
                                    Batch No.
                                </th>

                                <th className="text-center py-2">
                                    Qty
                                </th>

                                <th className="text-center py-2">
                                    Expiry
                                </th>

                                <th className="text-right py-2">
                                    Price
                                </th>

                                <th className="text-right py-2">
                                    Total
                                </th>

                                {onRemoveItem && (
                                    <th className="no-print"></th>
                                )}
                            </tr>
                        </thead>

                        <tbody>
                            {items.length === 0 ? (
                                <tr>
                                    <td
                                        colSpan={onRemoveItem ? 8 : 7}
                                        className="text-center py-6 text-gray-400"
                                    >
                                        No items added yet.
                                    </td>
                                </tr>
                            ) : (
                                items.map((item, index) => (
                                    <tr
                                        key={item.id ?? index}
                                        className="border-b last:border-0"
                                    >
                                        <td className="py-2">
                                            {index + 1}
                                        </td>

                                        <td className="py-2">
                                            {item.productName}
                                        </td>

                                        <td className="text-center py-2">
                                            {item.batchNo}
                                        </td>

                                        <td className="text-center py-2">
                                            {item.quantity}
                                        </td>

                                        <td className="text-center py-2">
                                            {item.expiryDate || "-"}
                                        </td>

                                        <td className="text-right py-2">
                                            ₱
                                            {Number(item.price).toFixed(2)}
                                        </td>

                                        <td className="text-right py-2">
                                            ₱
                                            {(
                                                Number(item.price) *
                                                Number(item.quantity)
                                            ).toFixed(2)}
                                        </td>

                                        {onRemoveItem && (
                                            <td className="pl-2 no-print">
                                                <button
                                                    onClick={() =>
                                                        onRemoveItem(item.id)
                                                    }
                                                    className="text-red-500 text-xs hover:underline"
                                                >
                                                    Remove
                                                </button>
                                            </td>
                                        )}
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                    {/* ================= TOTALS ================= */}

                    <div className="flex justify-between text-sm mb-2">
                        <span className="font-semibold">
                            Total quantity:
                        </span>

                        <span>{totalQuantity}</span>
                    </div>

                    <div className="flex justify-between text-lg font-bold border-t pt-3 mb-6">
                        <span>Grand Total</span>

                        <span>
                            ₱{Number(grandTotal).toFixed(2)}
                        </span>
                    </div>

                    {/* ================= SIGNATORIES ================= */}

                    <div className="grid grid-cols-3 gap-x-6 gap-y-4 text-xs text-slate-600 mb-8">

                        <div>
                            <p className="border-t pt-2">
                                Prepared SO by:
                            </p>

                            <p className="font-medium text-slate-800 mt-1">
                                {preparedSoBy || "-"}
                            </p>
                        </div>

                        <div>
                            <p className="border-t pt-2">
                                Checked by:
                            </p>

                            <p className="font-medium text-slate-800 mt-1">
                                {checkedBy || "-"}
                            </p>
                        </div>

                        <div>
                            <p className="border-t pt-2">
                                Delivered by:
                            </p>

                            <p className="font-medium text-slate-800 mt-1">
                                {deliveredBy || "-"}
                            </p>
                        </div>

                        <div>
                            <p className="border-t pt-2">
                                Prepared stocks by:
                            </p>

                            <p className="font-medium text-slate-800 mt-1">
                                {preparedStocksBy || "-"}
                            </p>
                        </div>

                        <div>
                            <p className="border-t pt-2">
                                Released by:
                            </p>

                            <p className="font-medium text-slate-800 mt-1">
                                {releasedBy || "-"}
                            </p>
                        </div>

                        <div>
                            <p className="border-t pt-2">
                                Received in good condition by:
                            </p>

                            <p className="font-medium text-slate-800 mt-1">
                                {receivedBy || "-"}
                            </p>
                        </div>

                    </div>

                    {/* ================= TERMS ================= */}

                    <div className="border-t pt-4 text-[11px] leading-relaxed text-slate-500 space-y-1">

                        <p className="font-semibold text-slate-600">
                            Terms and Conditions
                        </p>

                        <ol className="list-decimal list-inside space-y-1">

                            <li>
                                All products must be stored at the required temperature
                                and protected from light and heat. Any loss and damage
                                caused by improper storing shall not be the responsibility
                                of GenRX Pharmaceutical Products Distribution.
                            </li>

                            <li>
                                Goods are shipped at customer's risk and the seller's
                                responsibility ceases upon delivery of goods to carrier.
                                Seller is not responsible for any loss or damage due to
                                leakage, breakage or other cause after delivery.
                            </li>

                            <li>
                                Venue for any legal action arising out of this transaction
                                is vested in the proper courts in Manila City. Customer
                                will be charged a 2% penalty fee per month from the due
                                date until fully paid plus attorney's fees.
                            </li>

                        </ol>

                        <p>
                            ALL <span className="font-semibold underline">APPROVED</span>
                            {" "}RETURN/EXCHANGE MUST BE RECEIVED WITHIN 30 DAYS
                            UPON PURCHASE.
                        </p>

                        <p>
                            STRICTLY{" "}
                            <span className="font-semibold underline">
                                NO
                            </span>{" "}
                            RETURN/EXCHANGE FOR{" "}
                            <span className="font-semibold italic">
                                REFRIGERATED ITEMS
                            </span>.
                        </p>

                        <p>
                            ALL CHECKS MUST BE PAYABLE TO{" "}
                            <span className="font-semibold italic">
                                GENRX PHARMACEUTICAL PRODUCTS DISTRIBUTION
                            </span>
                        </p>

                    </div>

                </div>
            </div>
        </>
    );
}
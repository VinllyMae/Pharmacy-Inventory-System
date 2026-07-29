import React from "react";
import genrxLogo from "../assets/genrx-logo.png";
export default function DeliveryReceipt({ delivery, onRemoveItem, columns }) {
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

  const getColumnValue = (item, label) => {
    const column = columns?.find((column) =>
      column.label.trim().toLowerCase().includes(label.toLowerCase())
    );

    if (!column) return "-";

    return item.customFields?.[column.id] || "-";
  };

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

          table {
            page-break-inside: auto;
          }

          thead {
            display: table-header-group;
          }

          tr {
            page-break-inside: avoid;
            break-inside: avoid;
          }
        }
      `}</style>

      <div
        id="delivery-receipt"
        className="
          bg-white
          rounded-2xl
          shadow-sm
          border
          flex
          flex-col
          max-h-[85vh]
        "
      >
        <div
          id="delivery-receipt-scroll"
          className="overflow-y-auto p-6 pt-3"
        >
          {/* ================= HEADER ================= */}

          <div className="text-center border-b pb-3 mb-3">
            <img
              src={genrxLogo}
              alt="GenRX Pharmaceutical Distribution"
              className="h-1/2 mx-auto mb-1"
            />

            <p className="text-[10px] text-slate-400">
              Miraverde, Tuktukan, Guiguinto, Bulacan
            </p>
          </div>

          {/* ================= CUSTOMER ================= */}

          <div className="mb-3">
            <div className="text-right mb-2">
              <p className="font-bold text-base">Delivery Receipt</p>

              <p className="text-xs text-slate-500">SI No. {siNo || "-"}</p>
            </div>

            <div className="text-xs">
              <p>
                <span className="font-semibold">Customer name:</span>{" "}
                {customerName || "-"}
              </p>

              <p>
                <span className="font-semibold">Address:</span>{" "}
                {address || "-"}
              </p>
            </div>
          </div>

          <div className="flex justify-between text-xs mb-3">
            <p>
              <span className="font-semibold">Date:</span> {date || "-"}
            </p>

            <p>
              <span className="font-semibold">Payment due:</span>{" "}
              {paymentDue || "-"}
            </p>
          </div>

          {/* ================= ITEMS ================= */}

          <table className="w-full text-xs border border-slate-400 border-collapse mb-3">
            <thead>
              <tr className="text-slate-700">
                <th className="border border-slate-400 text-left py-1 px-2">No.</th>

                <th className="border border-slate-400 text-left py-1 px-2">Description</th>

                <th className="border border-slate-400 text-center py-1 px-2">Batch No.</th>

                <th className="border border-slate-400 text-center py-1 px-2">Qty</th>

                <th className="border border-slate-400 text-center py-1 px-2">Expiry</th>

                <th className="border border-slate-400 text-right py-1 px-2">Price</th>

                <th className="border border-slate-400 text-right py-1 px-2">Total</th>

                {onRemoveItem && <th className="no-print"></th>}
              </tr>
            </thead>

            <tbody>
              {items.length === 0 ? (
                <tr>
                  <td
                    colSpan={onRemoveItem ? 8 : 7}
                    className="border border-slate-400 text-center py-4 text-gray-400"
                  >
                    No items added yet.
                  </td>
                </tr>
              ) : (
                items.map((item, index) => {
                  const price = Number(getColumnValue(item, "Price")) || 0;
                  const total = price * Number(item.quantity || 0);

                  return (
                    <tr key={item.id ?? index}>
                      <td className="border border-slate-400 py-1 px-2">
                        {index + 1}
                      </td>

                      <td className="border border-slate-400 py-1 px-2">
                        {item.productName}
                      </td>

                      <td className="border border-slate-400 text-center py-1 px-2">
                        {getColumnValue(item, "Batch No")}
                      </td>

                      <td className="border border-slate-400 text-center py-1 px-2">
                        {item.quantity}
                      </td>

                      <td className="border border-slate-400 text-center py-1 px-2">
                        {getColumnValue(item, "Expiry")}
                      </td>

                      <td className="border border-slate-400 text-right py-1 px-2">
                        ₱{price.toFixed(2)}
                      </td>

                      <td className="border border-slate-400 text-right py-1 px-2">
                        ₱{total.toFixed(2)}
                      </td>

                      {onRemoveItem && (
                        <td className="pl-2 no-print">
                          <button
                            onClick={() => onRemoveItem(item.id)}
                            className="text-red-500 text-[10px] hover:underline"
                          >
                            Remove
                          </button>
                        </td>
                      )}
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>

          {/* ================= TOTALS ================= */}

          <div className="flex justify-between text-xs mb-1">
            <span className="font-semibold">Total quantity:</span>

            <span>{totalQuantity}</span>
          </div>

          <div className="flex justify-between text-sm font-bold border-t pt-2 mb-4">
            <span>Grand Total</span>

            <span>₱{(Number(grandTotal) || 0).toFixed(2)}</span>
          </div>

          {/* ================= SIGNATORIES ================= */}

          <table className="w-full border border-slate-400 border-collapse text-[10px] text-slate-600 mb-6">
            <tbody>
              <tr>
                <td className="border border-slate-400 p-1.5 align-top">
                  Prepared SO by:
                  <p className="font-medium text-slate-800 mt-1">
                    {preparedSoBy || "-"}
                  </p>
                </td>

                <td className="border border-slate-400 p-1.5 align-top">
                  Checked by:
                  <p className="font-medium text-slate-800 mt-1">
                    {checkedBy || "-"}
                  </p>
                </td>

                <td className="border border-slate-400 p-1.5 align-top">
                  Delivered by:
                  <p className="font-medium text-slate-800 mt-1">
                    {deliveredBy || "-"}
                  </p>
                </td>
              </tr>

              <tr>
                <td className="border border-slate-400 p-1.5 align-top">
                  Prepared stocks by:
                  <p className="font-medium text-slate-800 mt-1">
                    {preparedStocksBy || "-"}
                  </p>
                </td>

                <td className="border border-slate-400 p-1.5 align-top">
                  Released by:
                  <p className="font-medium text-slate-800 mt-1">
                    {releasedBy || "-"}
                  </p>
                </td>

                <td className="border border-slate-400 p-1.5 align-top">
                  Received in good condition by:
                  <p className="font-medium text-slate-800 mt-1">
                    {receivedBy || "-"}
                  </p>
                </td>
              </tr>
            </tbody>
          </table>

          {/* ================= TERMS ================= */}

          <div className="border-t pt-3 text-[9px] leading-snug text-slate-500 space-y-0.5">
            <p className="font-semibold text-slate-600">
              Terms and Conditions
            </p>

            <ol className="list-decimal pl-6 space-y-0.5">
              <li className="pl-1 text-justify">
                All products must be stored at the required temperature and
                protected from light and heat. Any loss and damage caused by
                improper storing shall not be the responsibility of GenRX
                Pharmaceutical Products Distribution.
              </li>

              <li className="pl-1 text-justify">
                Goods are shipped at customer's risk and the seller's
                responsibility ceases upon delivery of goods to carrier.
                Seller is not responsible for any loss or damage due to
                leakage, breakage or other cause after delivery.
              </li>

              <li className="pl-1 text-justify">
                Venue for any legal action arising out of this transaction is
                vested in the proper courts in Manila City, to the exclusion
                of other courts. Customer will be charged a 2% penalty fee
                per month from the due date until fully paid plus cost of
                collection and attorney's fees in the sum of 150% of the
                total amount due.
              </li>
            </ol>

            <p>
              ALL <span className="font-semibold underline">APPROVED</span>{" "}
              RETURN/EXCHANGE MUST BE RECEIVED WITHIN 30 DAYS UPON PURCHASE.
            </p>

            <p>
              STRICTLY <span className="font-semibold underline">NO</span>{" "}
              RETURN/EXCHANGE FOR{" "}
              <span className="font-semibold italic">REFRIGERATED ITEMS</span>.{" "}
              PLEASE SEE GENRX PHARMACEUTICAL RETURN GOODS POLICY.
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
import { useEffect, useMemo, useState } from "react";

import Modal from "../components/ui/Modal";
import DeliveryReceipt from "./DeliveryReceipt"
import {
    getProducts,
    updateProductQuantity,
} from "../services/productService";
import { getColumns } from "../services/columnService";
import { addDelivery, generateSiNumber } from "../services/deliveryService";
import Button from "../components/ui/Button";


export default function Delivery() {
    const [products, setProducts] = useState([]);
    const [columns, setColumns] = useState([]);
    const [loading, setLoading] = useState(true);
    const [exporting, setExporting] = useState(false);
    const [saved, setSaved] = useState(false);
    const [searchProduct, setSearchProduct] = useState("");
    const [selectedProductId, setSelectedProductId] = useState("");
    const [quantity, setQuantity] = useState(1);
    const [items, setItems] = useState([]);

    const [customerName, setCustomerName] = useState("");
    const [address, setAddress] = useState("");
    const [siNo, setSiNo] = useState("");
    const [date, setDate] = useState("");
    const [paymentDue, setPaymentDue] = useState("");

    const [signatoriesOpen, setSignatoriesOpen] = useState(false);
    const [showProductList, setShowProductList] = useState(false);
    const [preparedSoBy, setPreparedSoBy] = useState("");
    const [checkedBy, setCheckedBy] = useState("");
    const [deliveredBy, setDeliveredBy] = useState("");
    const [preparedStocksBy, setPreparedStocksBy] = useState("");
    const [releasedBy, setReleasedBy] = useState("");
    const [receivedBy, setReceivedBy] = useState("");

    async function loadData() {
        const [productData, columnData] = await Promise.all([
            getProducts(),
            getColumns(),
        ]);

        setProducts(productData);
        setColumns(columnData);
        setLoading(false);
    }

    async function loadSiNumber() {
        const number = await generateSiNumber();
        setSiNo(number);
    }

    useEffect(() => {
        loadData();
        loadSiNumber();
    }, []);

    const priceColumn = columns.find(
        (c) => c.label.trim().toLowerCase() === "price"
    );

    const batchColumn = columns.find(
        (c) => c.label.trim().toLowerCase() === "batch no"
    );

    const getPrice = (product) =>
        Number(product?.customFields?.[priceColumn?.id]) || 0;

    const getBatchNo = (product) =>
        product?.customFields?.[batchColumn?.id] || "-";

    const selectedProduct = products.find((p) => p.id === selectedProductId);

    const handleAddItem = () => {
        if (!selectedProduct || quantity < 1) return;

        const existing = items.find((item) => item.id === selectedProduct.id);
        const alreadyAdded = existing ? existing.quantity : 0;

        if (alreadyAdded + quantity > selectedProduct.quantity) {
            alert(
                `Only ${selectedProduct.quantity} in stock for ${formatProductName(selectedProduct)} (${alreadyAdded} already added).`
            );
            return;
        }

        setItems((prev) => {
            if (existing) {
                return prev.map((item) =>
                    item.id === selectedProduct.id
                        ? { ...item, quantity: item.quantity + quantity }
                        : item
                );
            }

            return [
                ...prev,
                {
                    id: selectedProduct.id,

                    productName: formatProductName(selectedProduct),

                    // keep the whole product fields
                    customFields: selectedProduct.customFields,

                    quantity,
                },
            ];
        });

        setQuantity(1);
        setSaved(false);
    };

    const handleRemoveItem = (id) => {
        setItems((prev) => prev.filter((item) => item.id !== id));
        setSaved(false);
    };

    const totalQuantity = useMemo(
        () => items.reduce((sum, item) => sum + item.quantity, 0),
        [items]
    );

    const getItemPrice = (item) =>
        Number(item?.customFields?.[priceColumn?.id]) || 0;

    const grandTotal = useMemo(
        () =>
            items.reduce(
                (sum, item) => sum + getItemPrice(item) * item.quantity,
                0
            ),
        [items, priceColumn]
    );

    const signatoriesFilledCount = [
        preparedSoBy,
        checkedBy,
        deliveredBy,
        preparedStocksBy,
        releasedBy,
        receivedBy,
    ].filter((v) => v.trim()).length;

    const handleExportPdf = async () => {
        if (items.length === 0) {
            alert("Add at least one item before exporting.");
            return;
        }

        // Already saved (e.g. exporting again for a reprint) — just print.
        if (saved) {
            window.print();
            return;
        }

        setExporting(true);

        try {
            await addDelivery({
                customerName,
                address,
                siNo,
                date,
                paymentDue,
                items,
                totalQuantity,
                grandTotal,
                preparedSoBy,
                checkedBy,
                deliveredBy,
                preparedStocksBy,
                releasedBy,
                receivedBy,
            });

            await Promise.all(
                items.map((item) => {
                    const product = products.find((p) => p.id === item.id);

                    if (!product) return Promise.resolve();

                    const newQuantity = Math.max(0, product.quantity - item.quantity);

                    return updateProductQuantity(item.id, newQuantity);
                })
            );

            await loadData();
            setSaved(true);

            window.print();

            await resetForm();
        } catch (error) {
            console.error("Saving delivery failed:", error);

            alert("Failed to save delivery.");
        } finally {
            setExporting(false);
        }
    };

    const resetForm = async () => {
        setSelectedProductId("");
        setQuantity(1);
        setItems([]);

        setCustomerName("");
        setAddress("");
        setDate("");
        setPaymentDue("");

        setPreparedSoBy("");
        setCheckedBy("");
        setDeliveredBy("");
        setPreparedStocksBy("");
        setReleasedBy("");
        setReceivedBy("");

        setSaved(false);

        await loadSiNumber();
    };

    if (loading) {
        return <div className="p-6 text-gray-500">Loading...</div>;
    }

    const formatProductName = (product) => {
        if (!product.customFields) {
            return "Unnamed Product";
        }

        const values = columns
            .filter((column) => column.visible)
            .slice(0, 5)
            .map((column, index) => {

                let value = product.customFields[column.id];

                if (!value) return null;

                value = String(value).trim();

                // 3rd column = Mg
                if (index === 2) {
                    value = `${value}MG`;
                }

                // 5th column = Pack Size
                if (index === 4) {
                    value = `${value}'S`;
                }

                return value;

            })
            .filter(Boolean);

        return values.join(" ");
    };
    return (
        <div>
            <div className="flex justify-end p-1 no-print">
                <button
                    onClick={handleExportPdf}
                    disabled={exporting}
                    className="bg-slate-800 text-white rounded-lg px-5 py-2.5 text-sm font-semibold hover:bg-slate-900 disabled:opacity-50 transition"
                >
                    {exporting ? "Saving..." : "Export to PDF"}
                </button>
            </div>
            <style>{`
        @media print {
          body * {
            visibility: hidden;
          }
          #delivery-receipt, #delivery-receipt * {
            visibility: visible;
          }
          #delivery-receipt {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            max-height: none !important;
            border: none !important;
            box-shadow: none !important;
            border-radius: 0 !important;
            padding: 0 !important;
          }
          #delivery-receipt-scroll {
            max-height: none !important;
            overflow: visible !important;
          }
          #delivery-receipt .no-print {
            display: none !important;
          }
        }
      `}</style>
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">

                {/* LEFT: FORM */}
                <div className="lg:col-span-4 space-y-6">
                    {/* Delivery info */}
                    <div className="bg-white rounded-2xl shadow-sm border p-6 space-y-4">
                        <div className="flex items-center justify-between">
                            <h2 className="text-lg font-semibold text-slate-800">
                                Delivery info
                            </h2>

                            <button
                                onClick={() => setSignatoriesOpen(true)}
                                className="text-sm text-blue-600 hover:underline"
                            >
                                Edit signatories ({signatoriesFilledCount}/6)
                            </button>
                        </div>

                        {saved && (
                            <div className="bg-green-50 text-green-700 text-sm rounded-md px-3 py-2">
                                Saved and exported.
                            </div>
                        )}

                        <div className="grid grid-cols-2 gap-4">
                            <div className="col-span-2">
                                <label className="block text-sm font-medium mb-1">
                                    Customer name
                                </label>
                                <input
                                    className="w-full border rounded-md px-3 py-2"
                                    value={customerName}
                                    onChange={(e) => setCustomerName(e.target.value)}
                                    placeholder="Company Name"
                                />
                            </div>

                            <div className="col-span-2">
                                <label className="block text-sm font-medium mb-1">
                                    Address
                                </label>
                                <input
                                    className="w-full border rounded-md px-3 py-2"
                                    value={address}
                                    onChange={(e) => setAddress(e.target.value)}
                                    placeholder="Delivery address"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-1">
                                    SI No.
                                </label>

                                <input
                                    className="w-full border rounded-md px-3 py-2 bg-slate-100"
                                    value={siNo}
                                    readOnly
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">
                                    Date
                                </label>
                                <input
                                    type="date"
                                    className="w-full border rounded-md px-3 py-2"
                                    value={date}
                                    onChange={(e) => setDate(e.target.value)}
                                />
                            </div>

                            <div className="col-span-2">
                                <label className="block text-sm font-medium mb-1">
                                    Payment due
                                </label>
                                <input
                                    type="date"
                                    className="w-full border rounded-md px-3 py-2"
                                    value={paymentDue}
                                    onChange={(e) => setPaymentDue(e.target.value)}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Add item */}
                    {/* Add item */}
                    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 space-y-5">

                        <div>
                            <h2 className="text-lg font-semibold text-slate-800">
                                Add Item
                            </h2>

                            <p className="text-sm text-slate-500">
                                Select products from inventory
                            </p>
                        </div>


                        {/* Product Search */}
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">
                                Product
                            </label>

                            <div className="relative">

                                <input
                                    type="text"
                                    placeholder="Search product..."
                                    value={searchProduct}
                                    onChange={(e) => {
                                        setSearchProduct(e.target.value);
                                        setShowProductList(true);
                                        setSelectedProductId("");
                                    }}
                                    onFocus={() => setShowProductList(true)}
                                    className="
                    w-full
                    rounded-xl
                    border
                    border-slate-200
                    px-4
                    py-2.5
                    outline-none
                    focus:ring-2
                    focus:ring-blue-500
                "
                                />


                                {showProductList && searchProduct.trim() !== "" && (

                                    <div
                                        className="
                        absolute
                        z-30
                        mt-2
                        w-full
                        bg-white
                        border
                        border-slate-200
                        rounded-xl
                        shadow-lg
                        max-h-60
                        overflow-y-auto
                    "
                                    >

                                        {products
                                            .filter((product) =>
                                                formatProductName(product)
                                                    .toLowerCase()
                                                    .includes(searchProduct.toLowerCase())
                                            )
                                            .map((product) => (

                                                <button
                                                    key={product.id}
                                                    type="button"
                                                    onClick={() => {

                                                        setSelectedProductId(product.id);

                                                        setSearchProduct(
                                                            formatProductName(product)
                                                        );

                                                        setShowProductList(false);

                                                        setQuantity(1);
                                                    }}

                                                    className="
                                    w-full
                                    text-left
                                    px-4
                                    py-3
                                    hover:bg-slate-50
                                    transition
                                "
                                                >

                                                    <div className="font-medium text-slate-800">
                                                        {formatProductName(product)}
                                                    </div>


                                                    <div className="text-sm text-slate-500">
                                                        {product.quantity} in stock
                                                    </div>

                                                </button>

                                            ))}


                                        {products.filter((product) =>
                                            formatProductName(product)
                                                .toLowerCase()
                                                .includes(searchProduct.toLowerCase())
                                        ).length === 0 && (

                                                <div className="
                            px-4
                            py-3
                            text-sm
                            text-slate-500
                        ">
                                                    No product found
                                                </div>

                                            )}

                                    </div>

                                )}

                            </div>
                        </div>



                        {/* Quantity */}
                        <div>

                            <label className="block text-sm font-medium text-slate-700 mb-2">
                                Quantity
                            </label>


                            <input
                                type="number"
                                min={1}
                                max={selectedProduct?.quantity || 1}
                                value={quantity}

                                onChange={(e) => {

                                    let value = Number(e.target.value);

                                    if (value < 1) value = 1;

                                    if (
                                        selectedProduct &&
                                        value > selectedProduct.quantity
                                    ) {
                                        value = selectedProduct.quantity;
                                    }

                                    setQuantity(value);

                                }}

                                className="
                w-full
                rounded-xl
                border
                border-slate-200
                px-4
                py-2.5
                outline-none
                focus:ring-2
                focus:ring-blue-500
            "
                            />

                        </div>



                        {/* Add Button */}
                        <button
                            onClick={handleAddItem}
                            disabled={!selectedProduct}
                            className="
            w-full
            bg-blue-600
            text-white
            rounded-xl
            py-3
            font-medium
            hover:bg-blue-700
            transition
            disabled:opacity-50
            disabled:cursor-not-allowed
        "
                        >
                            Add to Receipt
                        </button>



                        {!priceColumn && (

                            <p
                                className="
                text-xs
                text-amber-600
                bg-amber-50
                rounded-lg
                p-3
            "
                            >
                                No column labeled "Price" was found. Prices will default to ₱0.
                            </p>

                        )}

                    </div>
                </div>

                {/* RIGHT: RECEIPT */}
                <div className="lg:col-span-8 min-w-0">
                    <div
                        id="delivery-receipt"
                        className="bg-white rounded-2xl shadow-sm border w-full"
                    >


                        <DeliveryReceipt
                            delivery={{
                                customerName,
                                address,
                                siNo,
                                date,
                                paymentDue,
                                items,
                                totalQuantity,
                                grandTotal,
                                preparedSoBy,
                                checkedBy,
                                deliveredBy,
                                preparedStocksBy,
                                releasedBy,
                                receivedBy,
                            }}
                            onRemoveItem={handleRemoveItem}
                            columns={columns}
                        />
                    </div>
                </div>
            </div>
            {/* Signatories modal */}
            <Modal
                open={signatoriesOpen}
                title="Signatories"
                onClose={() => setSignatoriesOpen(false)}
            >
                <div className="space-y-3">
                    <div>
                        <label className="block text-sm font-medium mb-1">
                            Prepared SO by
                        </label>
                        <input
                            className="w-full border rounded-md px-3 py-2"
                            value={preparedSoBy}
                            onChange={(e) => setPreparedSoBy(e.target.value)}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-1">
                            Checked by
                        </label>
                        <input
                            className="w-full border rounded-md px-3 py-2"
                            value={checkedBy}
                            onChange={(e) => setCheckedBy(e.target.value)}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-1">
                            Delivered by
                        </label>
                        <input
                            className="w-full border rounded-md px-3 py-2"
                            value={deliveredBy}
                            onChange={(e) => setDeliveredBy(e.target.value)}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-1">
                            Prepared stocks by
                        </label>
                        <input
                            className="w-full border rounded-md px-3 py-2"
                            value={preparedStocksBy}
                            onChange={(e) => setPreparedStocksBy(e.target.value)}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-1">
                            Released by
                        </label>
                        <input
                            className="w-full border rounded-md px-3 py-2"
                            value={releasedBy}
                            onChange={(e) => setReleasedBy(e.target.value)}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-1">
                            Received in good condition by
                        </label>
                        <input
                            className="w-full border rounded-md px-3 py-2"
                            value={receivedBy}
                            onChange={(e) => setReceivedBy(e.target.value)}
                        />
                    </div>

                    <button
                        onClick={() => setSignatoriesOpen(false)}
                        className="w-full bg-blue-600 text-white rounded-md py-2 font-medium hover:bg-blue-700 mt-2"
                    >
                        Done
                    </button>
                </div>
            </Modal>
        </div>
    );
}
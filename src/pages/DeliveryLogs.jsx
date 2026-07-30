import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import * as XLSX from "xlsx";
import {
    FaEye,
    FaPrint,
    FaPlus,
    FaSearch,
    FaChevronLeft,
    FaChevronRight,
    FaFileExcel,
} from "react-icons/fa";

import Modal from "../components/ui/Modal";
import DeliveryReceipt from "./DeliveryReceipt";
import { getDeliveries } from "../services/deliveryService";
import { getProducts } from "../services/productService";
import { getColumns } from "../services/columnService";

const ITEMS_PER_PAGE = 5;

export default function DeliveryLogs() {
    const [deliveries, setDeliveries] = useState([]);
    const [filtered, setFiltered] = useState([]);
    const [loading, setLoading] = useState(true);
    const [exporting, setExporting] = useState(false);

    const [search, setSearch] = useState("");
    const [currentPage, setCurrentPage] = useState(1);

    const [selectedDelivery, setSelectedDelivery] = useState(null);
    const [openReceipt, setOpenReceipt] = useState(false);

    const navigate = useNavigate();

    useEffect(() => {
        loadDeliveries();
    }, []);

    useEffect(() => {
        const keyword = search.toLowerCase();

        setFiltered(
            deliveries.filter(
                (d) =>
                    d.customerName?.toLowerCase().includes(keyword) ||
                    d.siNo?.toLowerCase().includes(keyword)
            )
        );

        setCurrentPage(1);
    }, [search, deliveries]);

    async function loadDeliveries() {
        try {
            const data = await getDeliveries();

            setDeliveries(data);
            setFiltered(data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    }

    function handleView(delivery) {
        setSelectedDelivery(delivery);
        setOpenReceipt(true);
    }

    function handleReprint(delivery) {
        setSelectedDelivery(delivery);
        setOpenReceipt(true);

        setTimeout(() => {
            window.print();
        }, 300);
    }

    async function handleExportExcel() {
    setExporting(true);

    try {
        const [deliveries, products, columns] = await Promise.all([
            getDeliveries(),
            getProducts(),
            getColumns(),
        ]);

        const workbook = XLSX.utils.book_new();

        const formatValue = (value) => {
            if (value == null) return "";

            if (value?.toDate) {
                return value.toDate().toLocaleString("en-PH");
            }

            if (value?.seconds) {
                return new Date(value.seconds * 1000).toLocaleString("en-PH");
            }

            if (
                typeof value === "string" &&
                /^\d{4}-\d{2}-\d{2}/.test(value)
            ) {
                return new Date(value).toLocaleDateString("en-PH");
            }

            return value;
        };

        const flattenObject = (obj, prefix = "") => {
            const result = {};

            Object.entries(obj || {}).forEach(([key, value]) => {
                const newKey = prefix ? `${prefix}.${key}` : key;

                if (
                    value &&
                    typeof value === "object" &&
                    !Array.isArray(value) &&
                    !value.toDate &&
                    !value.seconds
                ) {
                    Object.assign(result, flattenObject(value, newKey));
                } else {
                    result[newKey] = formatValue(value);
                }
            });

            return result;
        };

        // =========================
        // Deliveries
        // =========================
        const deliveryRows = deliveries.map((delivery) => {
            const { items, ...rest } = delivery;
            return flattenObject(rest);
        });

        XLSX.utils.book_append_sheet(
            workbook,
            XLSX.utils.json_to_sheet(deliveryRows),
            "Deliveries"
        );

        // =========================
        // Delivery Items
        // =========================
        const itemRows = [];

        console.log("================================");
        console.log("Total Deliveries:", deliveries.length);

        deliveries.forEach((delivery) => {
            console.log(
                `${delivery.siNo} -> ${
                    Array.isArray(delivery.items)
                        ? delivery.items.length
                        : 0
                } items`
            );

            const items = Array.isArray(delivery.items)
                ? delivery.items
                : [];

            items.forEach((item, index) => {
                const row = {};

                Object.entries(delivery).forEach(([key, value]) => {
                    if (key === "items") return;
                    row[key] = formatValue(value);
                });

                row.itemNumber = index + 1;

                Object.entries(item).forEach(([key, value]) => {
                    if (key === "customFields") return;
                    row[key] = formatValue(value);
                });

                Object.entries(item.customFields || {}).forEach(
                    ([columnId, value]) => {
                        const column = columns.find(
                            (c) => c.id === columnId
                        );

                        row[column?.label || columnId] =
                            formatValue(value);
                    }
                );

                itemRows.push(row);
            });
        });

        console.log("================================");
        console.log("Total Export Rows:", itemRows.length);
        console.table(itemRows);

        XLSX.utils.book_append_sheet(
            workbook,
            XLSX.utils.json_to_sheet(itemRows),
            "Delivery Items"
        );

        // =========================
        // Products
        // =========================
        const productRows = products.map((product) => {
            const row = {};

            Object.entries(product).forEach(([key, value]) => {
                if (key !== "customFields") {
                    row[key] = formatValue(value);
                }
            });

            Object.entries(product.customFields || {}).forEach(
                ([columnId, value]) => {
                    const column = columns.find(
                        (c) => c.id === columnId
                    );

                    row[column?.label || columnId] =
                        formatValue(value);
                }
            );

            return row;
        });

        XLSX.utils.book_append_sheet(
            workbook,
            XLSX.utils.json_to_sheet(productRows),
            "Products"
        );

        // =========================
        // Columns
        // =========================
        const columnRows = columns.map((column) =>
            flattenObject(column)
        );

        XLSX.utils.book_append_sheet(
            workbook,
            XLSX.utils.json_to_sheet(columnRows),
            "Columns"
        );

        const today = new Date().toISOString().slice(0, 10);

        XLSX.writeFile(
            workbook,
            `full-backup-${today}.xlsx`
        );
    } catch (error) {
        console.error(error);
        alert("Failed to export data.");
    } finally {
        setExporting(false);
    }
}

    const totalPages = Math.max(
        1,
        Math.ceil(filtered.length / ITEMS_PER_PAGE)
    );

    const paginatedDeliveries = filtered.slice(
        (currentPage - 1) * ITEMS_PER_PAGE,
        currentPage * ITEMS_PER_PAGE
    );

    function goToPage(page) {
        if (page < 1 || page > totalPages) return;
        setCurrentPage(page);
    }

    if (loading) {
        return <div className="p-6">Loading...</div>;
    }

    return (
        <>
            <div className="p-6">

                <div className="flex justify-between items-center mb-6">

                    <div>

                    </div>

                    <div className="flex items-center gap-2">

                        <button
                            onClick={handleExportExcel}
                            disabled={exporting}
                            className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-xl flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <FaFileExcel />
                            {exporting ? "Exporting..." : "Export to Excel"}
                        </button>

                        <button
                            onClick={() => navigate("/delivery")}
                            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl flex items-center gap-2"
                        >
                            <FaPlus />
                            New Delivery
                        </button>

                    </div>

                </div>

                <div className="bg-white rounded-xl shadow border p-4 mb-6">

                    <div className="relative">

                        <FaSearch className="absolute left-3 top-3 text-gray-400" />

                        <input
                            className="w-full border rounded-lg pl-10 pr-4 py-2"
                            placeholder="Search customer or SI No..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />

                    </div>

                </div>

                <div className="bg-white rounded-xl shadow border overflow-hidden">

                    <table className="w-full">

                        <thead className="bg-slate-100">

                            <tr>
                                <th className="text-left p-4">SI No.</th>
                                <th className="text-left p-4">Customer</th>
                                <th className="text-left p-4">Date</th>
                                <th className="text-left p-4">Items</th>
                                <th className="text-right p-4">Total</th>
                                <th className="text-center p-4">Actions</th>
                            </tr>

                        </thead>

                        <tbody>

                            {paginatedDeliveries.map((delivery) => (

                                <tr
                                    key={delivery.id}
                                    className="border-t hover:bg-slate-50"
                                >

                                    <td className="p-4">{delivery.siNo}</td>

                                    <td className="p-4">
                                        {delivery.customerName}
                                    </td>

                                    <td className="p-4">
                                        {delivery.date}
                                    </td>

                                    <td className="p-4">
                                        {delivery.totalQuantity}
                                    </td>

                                    <td className="p-4 text-right">
                                        ₱
                                        {Number(delivery.grandTotal).toLocaleString()}
                                    </td>

                                    <td className="p-4">

                                        <div className="flex justify-center gap-2">

                                            <button
                                                onClick={() => handleView(delivery)}
                                                className="bg-blue-100 text-blue-700 hover:bg-blue-200 px-3 py-2 rounded-lg"
                                            >
                                                <FaEye />
                                            </button>

                                            <button
                                                onClick={() => handleReprint(delivery)}
                                                className="bg-green-100 text-green-700 hover:bg-green-200 px-3 py-2 rounded-lg"
                                            >
                                                <FaPrint />
                                            </button>

                                        </div>

                                    </td>

                                </tr>

                            ))}

                        </tbody>

                    </table>

                    {filtered.length === 0 && (

                        <div className="text-center py-10 text-gray-500">
                            No deliveries found.
                        </div>

                    )}

                    {filtered.length > 0 && (

                        <div className="flex items-center justify-between border-t px-4 py-3">

                            <p className="text-sm text-slate-500">
                                Showing{" "}
                                {(currentPage - 1) * ITEMS_PER_PAGE + 1}
                                {"–"}
                                {Math.min(
                                    currentPage * ITEMS_PER_PAGE,
                                    filtered.length
                                )}{" "}
                                of {filtered.length}
                            </p>

                            <div className="flex items-center gap-1">

                                <button
                                    onClick={() => goToPage(currentPage - 1)}
                                    disabled={currentPage === 1}
                                    className="
                                        p-2
                                        rounded-lg
                                        text-slate-600
                                        hover:bg-slate-100
                                        disabled:opacity-40
                                        disabled:cursor-not-allowed
                                    "
                                >
                                    <FaChevronLeft size={12} />
                                </button>

                                {Array.from(
                                    { length: totalPages },
                                    (_, i) => i + 1
                                ).map((page) => (

                                    <button
                                        key={page}
                                        onClick={() => goToPage(page)}
                                        className={`
                                            w-8
                                            h-8
                                            rounded-lg
                                            text-sm
                                            font-medium
                                            ${page === currentPage
                                                ? "bg-blue-600 text-white"
                                                : "text-slate-600 hover:bg-slate-100"
                                            }
                                        `}
                                    >
                                        {page}
                                    </button>

                                ))}

                                <button
                                    onClick={() => goToPage(currentPage + 1)}
                                    disabled={currentPage === totalPages}
                                    className="
                                        p-2
                                        rounded-lg
                                        text-slate-600
                                        hover:bg-slate-100
                                        disabled:opacity-40
                                        disabled:cursor-not-allowed
                                    "
                                >
                                    <FaChevronRight size={12} />
                                </button>

                            </div>

                        </div>

                    )}

                </div>

            </div>

            <Modal
                open={openReceipt}
                title="Delivery Receipt"
                onClose={() => setOpenReceipt(false)}
                size="3xl"
            >
                <DeliveryReceipt
                    delivery={selectedDelivery}
                />
            </Modal>
        </>
    );
}
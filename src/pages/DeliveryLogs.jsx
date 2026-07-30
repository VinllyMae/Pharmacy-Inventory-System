import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
    FaEye,
    FaPrint,
    FaPlus,
    FaSearch,
    FaChevronLeft,
    FaChevronRight,
} from "react-icons/fa";

import Modal from "../components/ui/Modal";
import DeliveryReceipt from "./DeliveryReceipt";
import { getDeliveries } from "../services/deliveryService";

const ITEMS_PER_PAGE = 5;

export default function DeliveryLogs() {
    const [deliveries, setDeliveries] = useState([]);
    const [filtered, setFiltered] = useState([]);
    const [loading, setLoading] = useState(true);

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

                    <button
                        onClick={() => navigate("/delivery")}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl flex items-center gap-2"
                    >
                        <FaPlus />
                        New Delivery
                    </button>

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
                                            ${
                                                page === currentPage
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
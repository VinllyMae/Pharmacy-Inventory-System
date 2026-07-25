import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
    FaEye,
    FaPrint,
    FaPlus,
    FaSearch,
} from "react-icons/fa";

import Modal from "../components/ui/Modal";
import DeliveryReceipt from "./DeliveryReceipt";
import { getDeliveries } from "../services/deliveryService";

export default function DeliveryLogs() {
    const [deliveries, setDeliveries] = useState([]);
    const [filtered, setFiltered] = useState([]);
    const [loading, setLoading] = useState(true);

    const [search, setSearch] = useState("");

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

    if (loading) {
        return <div className="p-6">Loading...</div>;
    }

    return (
        <>
            <div className="p-6">

                <div className="flex justify-between items-center mb-6">

                    <div>
                        <h1 className="text-3xl font-bold text-slate-800">
                            Delivery Logs
                        </h1>

                        <p className="text-slate-500">
                            View all exported delivery receipts
                        </p>
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

                            {filtered.map((delivery) => (

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
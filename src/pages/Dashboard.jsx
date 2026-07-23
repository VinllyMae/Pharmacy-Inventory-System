import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
} from "recharts";

import {
    Pill,
    AlertTriangle,
    Package,
    TrendingUp,
    Activity,
    Clock
} from "lucide-react";


export default function Dashboard() {


    const weeklyData = [
        { day: "Mon", received: 120, dispensed: 80 },
        { day: "Tue", received: 150, dispensed: 95 },
        { day: "Wed", received: 90, dispensed: 110 },
        { day: "Thu", received: 180, dispensed: 130 },
        { day: "Fri", received: 220, dispensed: 160 },
        { day: "Sat", received: 140, dispensed: 100 },
        { day: "Sun", received: 80, dispensed: 60 },
    ];



    const cards = [
        {
            title: "Total Medicines",
            value: "2,450",
            description: "Active inventory items",
            icon: Pill,
            color: "bg-blue-50 text-blue-600"
        },
        {
            title: "Low Stock Items",
            value: "38",
            description: "Needs replenishment",
            icon: AlertTriangle,
            color: "bg-red-50 text-red-600"
        },
        {
            title: "Inventory Value",
            value: "₱485,000",
            description: "Current stock worth",
            icon: Package,
            color: "bg-emerald-50 text-emerald-600"
        },
        {
            title: "Today's Sales",
            value: "₱32,450",
            description: "Medicine transactions",
            icon: TrendingUp,
            color: "bg-purple-50 text-purple-600"
        }
    ];



    return (

        <div
            className="
                space-y-6
                p-2
                max-w-[1600px]
                mx-auto
            "
        >


            {/* HEADER */}

            <div
                className="
                    flex
                    flex-col
                    lg:flex-row
                    lg:items-center
                    lg:justify-between
                    gap-4
                "
            >

                <div>

                    <h1
                        className="
                            text-4xl
                            font-bold
                            text-slate-800
                        "
                    >
                        Pharmacy Dashboard
                    </h1>


                    <p
                        className="
                            text-slate-500
                            mt-2
                        "
                    >
                        Monitor medicine inventory, stock movement,
                        and pharmacy performance.
                    </p>

                </div>




                <div
                    className="
                        bg-white
                        border
                        rounded-2xl
                        px-5
                        py-3
                        flex
                        items-center
                        gap-3
                        shadow-sm
                    "
                >

                    <Activity
                        className="text-green-600"
                    />


                    <div>

                        <p className="text-sm text-gray-500">
                            System Status
                        </p>


                        <p
                            className="
                                font-semibold
                                text-green-600
                            "
                        >
                            Online
                        </p>

                    </div>

                </div>


            </div>








            {/* SUMMARY CARDS */}


            <div
                className="
                    grid
                    grid-cols-1
                    sm:grid-cols-2
                    xl:grid-cols-4
                    gap-5
                "
            >


                {
                    cards.map((card,index)=>{


                        const Icon = card.icon;


                        return (

                            <div
                                key={index}
                                className="
                                    bg-white
                                    rounded-3xl
                                    border
                                    border-slate-100
                                    p-6
                                    shadow-sm
                                    hover:shadow-md
                                    transition
                                "
                            >


                                <div
                                    className="
                                        flex
                                        items-start
                                        justify-between
                                    "
                                >

                                    <div>


                                        <p
                                            className="
                                                text-sm
                                                text-slate-500
                                            "
                                        >
                                            {card.title}
                                        </p>


                                        <h2
                                            className="
                                                text-3xl
                                                font-bold
                                                text-slate-800
                                                mt-2
                                            "
                                        >
                                            {card.value}
                                        </h2>


                                        <p
                                            className="
                                                text-xs
                                                text-slate-400
                                                mt-2
                                            "
                                        >
                                            {card.description}
                                        </p>


                                    </div>




                                    <div
                                        className={`
                                            p-3
                                            rounded-2xl
                                            ${card.color}
                                        `}
                                    >

                                        <Icon size={28}/>

                                    </div>


                                </div>


                            </div>

                        );

                    })
                }


            </div>









            {/* INVENTORY MOVEMENT */}


            <div
                className="
                    bg-white
                    rounded-3xl
                    border
                    border-slate-100
                    p-6
                    shadow-sm
                "
            >


                <div
                    className="
                        flex
                        flex-col
                        md:flex-row
                        md:items-center
                        md:justify-between
                        gap-3
                        mb-5
                    "
                >


                    <div>

                        <h2
                            className="
                                text-2xl
                                font-bold
                                text-slate-800
                            "
                        >
                            Weekly Inventory Movement
                        </h2>


                        <p
                            className="
                                text-sm
                                text-slate-500
                                mt-1
                            "
                        >
                            Medicines received versus medicines dispensed.
                        </p>

                    </div>





                    <div
                        className="
                            flex
                            items-center
                            gap-2
                            bg-green-50
                            text-green-700
                            px-4
                            py-2
                            rounded-full
                            text-sm
                            font-medium
                        "
                    >

                        <Clock size={16}/>

                        This Week

                    </div>


                </div>






                <ResponsiveContainer
                    width="100%"
                    height={320}
                >

                    <LineChart data={weeklyData}>


                        <CartesianGrid
                            strokeDasharray="5 5"
                            vertical={false}
                        />


                        <XAxis
                            dataKey="day"
                        />


                        <YAxis />


                        <Tooltip />



                        <Line
                            type="monotone"
                            dataKey="received"
                            stroke="#16a34a"
                            strokeWidth={3}
                            dot={{ r: 5 }}
                            name="Stock Received"
                        />



                        <Line
                            type="monotone"
                            dataKey="dispensed"
                            stroke="#ef4444"
                            strokeWidth={3}
                            dot={{ r: 5 }}
                            name="Dispensed"
                        />


                    </LineChart>


                </ResponsiveContainer>


            </div>


        </div>

    );

}
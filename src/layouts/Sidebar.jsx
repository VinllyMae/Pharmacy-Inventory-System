import {
    FaCapsules,
    FaHome,
    FaBoxes,
    FaColumns,
    FaSignOutAlt,
} from "react-icons/fa";

import {
    NavLink,
    useNavigate
} from "react-router-dom";

import {
    logout
} from "../services/authService";



export default function Sidebar() {


    const navigate = useNavigate();




    const menu = [

        {
            name: "Dashboard",
            path: "/dashboard",
            icon: <FaHome />,
        },

        {
            name: "Products",
            path: "/products",
            icon: <FaBoxes />,
        },

        {
            name: "Table Data",
            path: "/columns",
            icon: <FaColumns />,
        },

    ];







    async function handleLogout(){


        try {


            await logout();


            navigate("/login");



        } catch(error){


            console.error(
                "Logout failed:",
                error
            );


        }


    }








    return (

        <aside className="
            w-64
            h-screen
            bg-white
            text-slate-700
            border-r
            border-slate-200
            shadow-sm
            relative
            flex
            flex-col
        ">





            {/* BRAND */}


            <div className="
                flex
                items-center
                gap-4
                p-6
                border-b
                border-slate-200
            ">


                <div className="
                    bg-blue-50
                    text-blue-600
                    p-3
                    rounded-2xl
                ">

                    <FaCapsules size={28}/>

                </div>





                <div>


                    <h1 className="
                        text-2xl
                        font-bold
                        text-slate-800
                    ">

                        MedTrack

                    </h1>



                    <p className="
                        text-sm
                        text-slate-500
                    ">

                        Pharmacy Inventory

                    </p>


                </div>



            </div>









            {/* MENU */}



            <nav className="
                mt-5
                px-3
                space-y-2
            ">


                {
                    menu.map((item)=>(


                        <NavLink

                            key={item.path}

                            to={item.path}


                            className={({isActive}) =>

                                `
                                flex
                                items-center
                                gap-4
                                px-4
                                py-3.5
                                rounded-xl
                                transition
                                font-medium

                                ${
                                    isActive

                                    ?

                                    "bg-blue-50 text-blue-600"

                                    :

                                    "text-slate-600 hover:bg-slate-100"

                                }

                                `

                            }


                        >


                            <span className="text-lg">

                                {item.icon}

                            </span>



                            {item.name}



                        </NavLink>


                    ))
                }


            </nav>









            {/* LOGOUT */}



            <div className="
                absolute
                bottom-0
                w-full
                p-3
            ">


                <button


                    onClick={handleLogout}



                    className="
                        w-full
                        flex
                        items-center
                        gap-4
                        px-4
                        py-3.5
                        rounded-xl
                        text-slate-600
                        hover:bg-red-50
                        hover:text-red-600
                        transition
                        font-medium
                    "


                >


                    <FaSignOutAlt className="text-lg"/>


                    Logout



                </button>



            </div>






        </aside>

    );

}
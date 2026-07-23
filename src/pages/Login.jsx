import { useState } from "react";
import { login } from "../services/authService";
import { useNavigate } from "react-router-dom";

import {
    Pill,
    ShieldCheck,
    PackageCheck,
    Activity
} from "lucide-react";


export default function Login() {


    const navigate = useNavigate();


    const [email,setEmail] = useState("");

    const [password,setPassword] = useState("");





    const handleLogin = async(e)=>{


        e.preventDefault();


        try {


            await login(
                email,
                password
            );


            alert("Login Successful!");


            navigate("/dashboard");



        }catch(error){


            alert(error.message);


        }


    };






    return (

        <div className="
            min-h-screen
            flex
            bg-slate-50
        ">



            {/* LEFT SECTION */}


            <div className="
                hidden
                lg:flex
                w-1/2
                bg-white
                border-r
                border-slate-200
                flex-col
                justify-center
                px-20
            ">


                <div className="
                    max-w-lg
                ">



                    <div className="
                        flex
                        items-center
                        gap-5
                        mb-8
                    ">


                        <div className="
                            bg-blue-50
                            text-blue-600
                            p-5
                            rounded-3xl
                        ">

                            <Pill size={45}/>

                        </div>



                        <h1 className="
                            text-5xl
                            font-bold
                            text-slate-800
                        ">

                            MedTrack

                        </h1>


                    </div>






                    <p className="
                        text-xl
                        text-slate-500
                        leading-relaxed
                    ">

                        Smart pharmacy inventory management
                        system designed to monitor medicines,
                        stocks, and daily operations.

                    </p>








                    <div className="
                        mt-10
                        space-y-5
                    ">


                        <Feature
                            icon={<PackageCheck/>}
                            title="Inventory Monitoring"
                            description="Track medicine availability in real-time"
                        />



                        <Feature
                            icon={<ShieldCheck/>}
                            title="Secure Access"
                            description="Protected pharmacy records"
                        />



                    </div>









                    <div className="
                        mt-12
                        bg-green-50
                        border
                        border-green-100
                        rounded-2xl
                        p-5
                        w-fit
                    ">


                        <div className="
                            flex
                            items-center
                            gap-3
                        ">


                            <div className="
                                w-3
                                h-3
                                bg-green-500
                                rounded-full
                            " />



                            <div>

                                <p className="
                                    text-sm
                                    text-slate-500
                                ">
                                    System Status
                                </p>


                                <p className="
                                    font-semibold
                                    text-green-600
                                ">
                                    Inventory System Online
                                </p>


                            </div>


                        </div>



                    </div>



                </div>



            </div>









            {/* LOGIN */}


            <div className="
                flex-1
                flex
                items-center
                justify-center
                p-6
            ">



                <form

                    onSubmit={handleLogin}

                    className="
                        bg-white
                        w-full
                        max-w-md
                        rounded-3xl
                        border
                        border-slate-200
                        shadow-xl
                        p-10
                    "

                >




                    <div className="
                        text-center
                        mb-8
                    ">


                        <div className="
                            mx-auto
                            w-16
                            h-16
                            rounded-2xl
                            bg-blue-50
                            text-blue-600
                            flex
                            items-center
                            justify-center
                            mb-5
                        ">

                            <Pill size={32}/>

                        </div>





                        <h2 className="
                            text-3xl
                            font-bold
                            text-slate-800
                        ">

                            Welcome Back

                        </h2>




                        <p className="
                            text-slate-500
                            mt-2
                        ">

                            Login to your pharmacy dashboard

                        </p>



                    </div>









                    <div className="space-y-5">


                        <div>


                            <label className="
                                text-sm
                                font-medium
                                text-slate-700
                            ">

                                Email Address

                            </label>



                            <input

                                type="email"

                                placeholder="admin@medtrack.com"


                                value={email}

                                onChange={(e)=>
                                    setEmail(e.target.value)
                                }


                                className="
                                    mt-2
                                    w-full
                                    px-4
                                    py-3.5
                                    rounded-xl
                                    border
                                    border-slate-200
                                    bg-slate-50
                                    focus:bg-white
                                    focus:border-blue-500
                                    focus:ring-4
                                    focus:ring-blue-100
                                    transition
                                "

                            />



                        </div>









                        <div>


                            <label className="
                                text-sm
                                font-medium
                                text-slate-700
                            ">

                                Password

                            </label>



                            <input

                                type="password"

                                placeholder="Enter your password"



                                value={password}


                                onChange={(e)=>
                                    setPassword(e.target.value)
                                }



                                className="
                                    mt-2
                                    w-full
                                    px-4
                                    py-3.5
                                    rounded-xl
                                    border
                                    border-slate-200
                                    bg-slate-50
                                    focus:bg-white
                                    focus:border-blue-500
                                    focus:ring-4
                                    focus:ring-blue-100
                                    transition
                                "

                            />



                        </div>







                        <button

                            className="
                                w-full
                                bg-blue-600
                                hover:bg-blue-700
                                text-white
                                font-semibold
                                py-3.5
                                rounded-xl
                                transition
                                shadow-lg
                                shadow-blue-200
                            "

                        >

                            Login


                        </button>



                    </div>








                    <div className="
                        flex
                        justify-center
                        items-center
                        gap-2
                        mt-8
                        text-sm
                        text-slate-400
                    ">


                        <Activity size={15}/>


                        © 2026 MedTrack Pharmacy System



                    </div>




                </form>



            </div>



        </div>

    );

}








function Feature({
    icon,
    title,
    description
}){


    return (

        <div className="
            flex
            items-center
            gap-4
        ">


            <div className="
                bg-blue-50
                text-blue-600
                p-3
                rounded-xl
            ">

                {icon}

            </div>




            <div>


                <h3 className="
                    font-semibold
                    text-slate-800
                ">

                    {title}

                </h3>



                <p className="
                    text-sm
                    text-slate-500
                ">

                    {description}

                </p>



            </div>



        </div>

    );

}
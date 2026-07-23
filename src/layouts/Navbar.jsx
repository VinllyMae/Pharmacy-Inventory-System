import { FaUserCircle } from "react-icons/fa";
import { useEffect, useState } from "react";

import { auth } from "../firebase/firebase";


export default function Navbar() {


  const [user, setUser] = useState(null);



  useEffect(()=>{


    const unsubscribe = auth.onAuthStateChanged(
      (currentUser)=>{

        setUser(currentUser);

      }
    );


    return ()=>unsubscribe();


  },[]);





  return (

    <header className="
      bg-white
      shadow-sm
      border-b
      border-slate-200
      h-16
      px-8
      flex
      items-center
      justify-between
    ">


      <h1 className="
        text-xl
        font-semibold
        text-slate-700
      ">

        Pharmacy Dashboard

      </h1>





      <div className="
        flex
        items-center
        gap-3
      ">


        <FaUserCircle

          className="text-blue-600"

          size={34}

        />



        <div>


          <p className="
            font-semibold
            text-slate-800
          ">

            {
              user?.displayName ||
              user?.email ||
              "Administrator"
            }


          </p>




          <small className="
            text-green-600
          ">

            Online

          </small>



        </div>



      </div>



    </header>

  );

}
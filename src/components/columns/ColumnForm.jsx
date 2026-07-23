export default function ColumnForm({
    label,
    setLabel,
    type,
    setType,
    required,
    setRequired,
    visible,
    setVisible,
    handleAdd,
    editing,
    cancelEdit
}) {


    return (

        <div className="
            bg-white
            p-6
            rounded-2xl
            shadow-sm
            border
            border-slate-200
        ">


            <div className="
                grid
                grid-cols-1
                md:grid-cols-2
                gap-5
            ">


                {/* LABEL */}

                <div>

                    <label className="
                        block
                        text-sm
                        font-medium
                        text-slate-600
                        mb-2
                    ">

                        Column Name

                    </label>


                    <input

                        value={label}

                        onChange={(e)=>
                            setLabel(e.target.value)
                        }

                        placeholder="Example: Supplier"

                        className="
                            w-full
                            border
                            border-slate-200
                            rounded-xl
                            px-4
                            py-3
                            bg-slate-50
                            focus:bg-white
                            focus:border-blue-500
                            focus:ring-4
                            focus:ring-blue-100
                            transition
                        "

                    />

                </div>







                {/* TYPE */}

                <div>


                    <label className="
                        block
                        text-sm
                        font-medium
                        text-slate-600
                        mb-2
                    ">

                        Data Type

                    </label>



                    <select

                        value={type}

                        onChange={(e)=>
                            setType(e.target.value)
                        }


                        className="
                            w-full
                            border
                            border-slate-200
                            rounded-xl
                            px-4
                            py-3
                            bg-slate-50
                            focus:bg-white
                            focus:border-blue-500
                        "

                    >


                        <option value="text">
                            Text
                        </option>


                        <option value="number">
                            Number
                        </option>


                        <option value="date">
                            Date
                        </option>


                    </select>



                </div>


            </div>









            {/* OPTIONS */}


            <div className="
                flex
                flex-wrap
                gap-6
                mt-6
            ">



                <label className="
                    flex
                    items-center
                    gap-3
                    cursor-pointer
                ">


                    <input

                        type="checkbox"

                        checked={required}

                        onChange={(e)=>
                            setRequired(e.target.checked)
                        }

                        className="
                            w-5
                            h-5
                            accent-blue-600
                        "

                    />


                    <span className="text-slate-600">

                        Required

                    </span>


                </label>







                <label className="
                    flex
                    items-center
                    gap-3
                    cursor-pointer
                ">


                    <input

                        type="checkbox"

                        checked={visible}

                        onChange={(e)=>
                            setVisible(e.target.checked)
                        }

                        className="
                            w-5
                            h-5
                            accent-blue-600
                        "

                    />


                    <span className="text-slate-600">

                        Visible

                    </span>


                </label>



            </div>









            {/* BUTTONS */}


            <div className="
                flex
                justify-end
                gap-3
                mt-6
            ">


                {
                    editing && (

                        <button

                            onClick={cancelEdit}

                            className="
                                px-5
                                py-2.5
                                rounded-xl
                                bg-slate-100
                                text-slate-600
                                hover:bg-slate-200
                            "

                        >

                            Cancel

                        </button>

                    )
                }






                <button

                    onClick={handleAdd}

                    className="
                        px-6
                        py-2.5
                        rounded-xl
                        bg-blue-600
                        text-white
                        hover:bg-blue-700
                        transition
                        shadow-sm
                    "

                >

                    {
                        editing
                        ? "Save Changes"
                        : "Add Column"
                    }


                </button>


            </div>



        </div>

    );

}
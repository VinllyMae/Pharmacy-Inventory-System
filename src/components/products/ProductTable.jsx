import { useEffect, useState } from "react";

import { getProductStatus } from "../../utils/productStatus";

const PAGE_SIZE = 10;

export default function ProductTable({
  products,
  columns,
  onEdit,
  onStockIn,
  onStockOut,
  onHistory,
  onArchive,
}) {

  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    setCurrentPage(1);
  }, [products]);

  const totalPages = Math.max(1, Math.ceil(products.length / PAGE_SIZE));

  const startIndex = (currentPage - 1) * PAGE_SIZE;

  const paginatedProducts = products.slice(startIndex, startIndex + PAGE_SIZE);

  const handlePrev = () => {
    setCurrentPage((prev) => Math.max(1, prev - 1));
  };

  const handleNext = () => {
    setCurrentPage((prev) => Math.min(totalPages, prev + 1));
  };

  return (

    <div className="
            bg-white
            rounded-2xl
            shadow-sm
            border
        ">

      <div className="overflow-x-auto">

        <table className="min-w-full">


          <thead className="bg-blue-600 text-white">

            <tr>

              <th className="p-4 text-left">
                Product
              </th>

              <th className="p-4 text-center">
                Quantity
              </th>

              <th className="p-4 text-center">
                Expiry
              </th>

              <th className="p-4 text-center">
                Status
              </th>


              {columns.map((column) => (
                <th
                  key={column.id}
                  className="p-4 text-center"
                >
                  {column.label}
                </th>
              ))}


              <th className="p-4 text-center">
                Actions
              </th>


            </tr>

          </thead>




          <tbody>


            {
              paginatedProducts.length === 0 ? (

                <tr>

                  <td
                    colSpan={columns.length + 5}
                    className="
                                      text-center
                                      p-8
                                      text-gray-500
                                  "
                  >
                    No products found.
                  </td>

                </tr>


              ) : (


                paginatedProducts.map((product) => {


                  const status = getProductStatus(product);



                  return (

                    <tr
                      key={product.id}
                      className="
                                          border-b
                                          hover:bg-gray-50
                                      "
                    >


                      <td className="
                                          p-4
                                          font-medium
                                      ">
                        {product.productName}
                      </td>




                      <td className="text-center">
                        {product.quantity}
                      </td>




                      <td className="text-center">
                        {product.expiryDate}
                      </td>




                      <td className="text-center">

                        <span
                          className={`
                                                  ${status.color}
                                                  text-white
                                                  px-3
                                                  py-1
                                                  rounded-full
                                                  text-xs
                                                  font-semibold
                                              `}
                        >

                          {status.text}

                        </span>

                      </td>





                      {
                        columns.map((column) => (

                          <td
                            key={column.id}
                            className="text-center"
                          >

                            {
                              product.customFields?.[column.field]
                              || "-"
                            }

                          </td>

                        ))
                      }





                      <td className="p-4">

                        <div className="
                                              flex
                                              flex-wrap
                                              justify-center
                                              gap-2
                                          ">


                          <button
                            onClick={() =>
                              onEdit(product)
                            }
                            className="
                                                      bg-yellow-500
                                                      hover:bg-yellow-600
                                                      text-white
                                                      px-3
                                                      py-1
                                                      rounded-lg
                                                      text-sm
                                                  "
                          >
                            Edit/View
                          </button>




                          <button
                            onClick={() =>
                              onStockIn(product)
                            }
                            className="
                                                      bg-green-600
                                                      hover:bg-green-700
                                                      text-white
                                                      px-3
                                                      py-1
                                                      rounded-lg
                                                      text-sm
                                                  "
                          >
                            Stock In
                          </button>





                          <button
                            onClick={() =>
                              onStockOut(product)
                            }
                            className="
                                                      bg-orange-500
                                                      hover:bg-orange-600
                                                      text-white
                                                      px-3
                                                      py-1
                                                      rounded-lg
                                                      text-sm
                                                  "
                          >
                            Stock Out
                          </button>

                        </div>

                      </td>


                    </tr>

                  );

                })


              )
            }


          </tbody>


        </table>

      </div>

      {/* PAGINATION */}

      {products.length > 0 && (

        <div className="
              flex
              items-center
              justify-between
              px-4
              py-3
              border-t
          ">

          <p className="text-sm text-gray-500">
            Showing {startIndex + 1}-{Math.min(startIndex + PAGE_SIZE, products.length)} of {products.length}
          </p>

          <div className="flex items-center gap-2">

            <button
              onClick={handlePrev}
              disabled={currentPage === 1}
              className="
                  px-3
                  py-1.5
                  rounded-lg
                  text-sm
                  border
                  disabled:opacity-40
                  disabled:cursor-not-allowed
                  hover:bg-slate-50
              "
            >
              Prev
            </button>

            <span className="text-sm text-slate-600">
              Page {currentPage} of {totalPages}
            </span>

            <button
              onClick={handleNext}
              disabled={currentPage === totalPages}
              className="
                  px-3
                  py-1.5
                  rounded-lg
                  text-sm
                  border
                  disabled:opacity-40
                  disabled:cursor-not-allowed
                  hover:bg-slate-50
              "
            >
              Next
            </button>

          </div>

        </div>

      )}

    </div>

  );

}
import { useEffect, useMemo, useState } from "react";
import {
  Search,
  Eye,
  ArrowDownToLine,
  ArrowUpFromLine,
  History,
  Archive,
  X,
} from "lucide-react";

import { getProductStatus } from "../../utils/productStatus";
import Button from "../ui/Button";
const PAGE_SIZE = 10;
const MAX_COLUMNS = 11;

export default function ProductTable({
  products,
  columns,
  onEdit,
  onStockIn,
  onStockOut,
  onHistory,
  onArchive,
  onAdd,
}) {
  const [search, setSearch] = useState("");
  const [searchColumn, setSearchColumn] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedProduct, setSelectedProduct] = useState(null);


  const visibleColumns = useMemo(() => {
    return [...columns]
      .filter((column) => column.visible)
      .sort(
        (a, b) =>
          Number(a.order ?? 0) -
          Number(b.order ?? 0)
      );
  }, [columns]);


  const displayedColumns = useMemo(() => {
    return visibleColumns.slice(0, MAX_COLUMNS);
  }, [visibleColumns]);


  const hasMoreColumns =
    visibleColumns.length > MAX_COLUMNS;


  const filteredProducts = useMemo(() => {
    const keyword =
      search.trim().toLowerCase();

    if (!keyword) return products;


    return products.filter((product) => {

      const status = getProductStatus(
        product,
        columns
      );


      if (searchColumn === "status") {
        return status.text
          .toLowerCase()
          .includes(keyword);
      }


      if (searchColumn !== "all") {
        return String(
          product.customFields?.[searchColumn] || ""
        )
          .toLowerCase()
          .includes(keyword);
      }


      return [
        ...columns.map(
          (column) =>
            product.customFields?.[column.id] || ""
        ),
        status.text,
      ].some((value) =>
        String(value)
          .toLowerCase()
          .includes(keyword)
      );

    });

  }, [
    products,
    search,
    searchColumn,
    columns,
  ]);


  useEffect(() => {
    setCurrentPage(1);
  }, [
    search,
    searchColumn,
    products,
  ]);


  const totalPages = Math.max(
    1,
    Math.ceil(
      filteredProducts.length / PAGE_SIZE
    )
  );


  const startIndex =
    (currentPage - 1) * PAGE_SIZE;


  const paginatedProducts =
    filteredProducts.slice(
      startIndex,
      startIndex + PAGE_SIZE
    );


  function handlePrev() {
    setCurrentPage((page) =>
      Math.max(1, page - 1)
    );
  }


  function handleNext() {
    setCurrentPage((page) =>
      Math.min(totalPages, page + 1)
    );
  }


  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">

      {/* SEARCH */}

      <div className="p-4 border-b flex gap-3 items-center">

        <select
          value={searchColumn}
          onChange={(e) =>
            setSearchColumn(e.target.value)
          }
          className="w-48 rounded-xl border border-slate-200 px-4 py-2.5 text-sm outline-none"
        >
          <option value="all">
            All Columns
          </option>

          {visibleColumns.map((column) => (
            <option
              key={column.id}
              value={column.id}
            >
              {column.label}
            </option>
          ))}

          <option value="status">
            Status
          </option>
        </select>

        <div className="relative w-72">
          <Search
            size={18}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
          />

          <input
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
            placeholder="Search products..."
            className="w-full rounded-xl border border-slate-200 py-2.5 pl-10 pr-4 outline-none"
          />
        </div>

        <Button
          className="ml-auto bg-blue-600 text-white hover:bg-blue-700 px-5 py-2.5 rounded-xl whitespace-nowrap"
          onClick={onAdd}
        >
          + Add Product
        </Button>

      </div>
      {/* TABLE */}
      <div className="overflow-x-auto">

        <table className="min-w-full">

          <thead className="bg-blue-600 text-white">

            <tr>

              {displayedColumns.map((column) => (
                <th
                  key={column.id}
                  className="p-4 text-center whitespace-nowrap"
                >
                  {column.label}
                </th>
              ))}


              {hasMoreColumns && (
                <th className="p-4 text-center">
                  View
                </th>
              )}


              <th className="p-4 text-center">
                Actions
              </th>

            </tr>

          </thead>


          <tbody>

            {paginatedProducts.length === 0 ? (

              <tr>
                <td
                  colSpan={
                    displayedColumns.length +
                    (hasMoreColumns ? 1 : 0) +
                    1
                  }
                  className="p-8 text-center text-slate-500"
                >
                  No products found.
                </td>
              </tr>

            ) : (

              paginatedProducts.map((product) => {

                const status =
                  getProductStatus(
                    product,
                    columns
                  );


                return (

                  <tr
                    key={product.id}
                    className="border-b hover:bg-slate-50"
                  >

                    {displayedColumns.map((column) => {

                      const isStatus =
                        column.label
                          .trim()
                          .toLowerCase() === "status";


                      return (

                        <td
                          key={column.id}
                          className="p-4 text-center whitespace-nowrap"
                        >

                          {isStatus ? (

                            <span
                              className={`${status.color} text-white px-3 py-1 rounded-full text-xs`}
                            >
                              {status.text}
                            </span>

                          ) : (

                            product.customFields?.[
                            column.id
                            ] || "-"

                          )}

                        </td>

                      );

                    })}


                    {hasMoreColumns && (

                      <td className="p-4 text-center">

                        <button
                          title="View all fields"
                          onClick={() =>
                            setSelectedProduct(product)
                          }
                          className="p-2 rounded-lg bg-slate-600 hover:bg-slate-700 text-white"
                        >
                          <Eye size={16} />
                        </button>

                      </td>

                    )}


                    <td className="p-4">

                      <div className="flex justify-center gap-1">

                        <button
                          title="Edit/View"
                          onClick={() =>
                            onEdit(product)
                          }
                          className="p-2 rounded-lg bg-yellow-500 text-white"
                        >
                          <Eye size={16} />
                        </button>


                        <button
                          title="Stock In"
                          onClick={() =>
                            onStockIn(product)
                          }
                          className="p-2 rounded-lg bg-green-600 text-white"
                        >
                          <ArrowDownToLine size={16} />
                        </button>


                        <button
                          title="Stock Out"
                          onClick={() =>
                            onStockOut(product)
                          }
                          className="p-2 rounded-lg bg-orange-500 text-white"
                        >
                          <ArrowUpFromLine size={16} />
                        </button>


                        {onHistory && (
                          <button
                            title="History"
                            onClick={() =>
                              onHistory(product)
                            }
                            className="p-2 rounded-lg bg-blue-600 text-white"
                          >
                            <History size={16} />
                          </button>
                        )}


                        {onArchive && (
                          <button
                            title="Archive"
                            onClick={() =>
                              onArchive(product)
                            }
                            className="p-2 rounded-lg bg-red-600 text-white"
                          >
                            <Archive size={16} />
                          </button>
                        )}

                      </div>

                    </td>


                  </tr>

                );

              })

            )}

          </tbody>

        </table>

      </div>


      {/* DETAILS MODAL */}
      {selectedProduct && (

        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">

          <div className="bg-white rounded-2xl w-full max-w-lg p-6">

            <div className="flex justify-between mb-4">

              <h2 className="text-xl font-bold">
                Product Details
              </h2>

              <button
                onClick={() =>
                  setSelectedProduct(null)
                }
              >
                <X />
              </button>

            </div>


            <div className="space-y-3 max-h-[70vh] overflow-y-auto">

              {visibleColumns.map((column) => {

                const isStatus =
                  column.label
                    .toLowerCase() === "status";


                return (

                  <div
                    key={column.id}
                    className="flex justify-between border-b pb-2"
                  >

                    <span className="font-medium">
                      {column.label}
                    </span>


                    {isStatus ? (

                      <span
                        className={`${getProductStatus(selectedProduct, columns).color} text-white px-2 py-1 rounded-full text-xs`}
                      >
                        {
                          getProductStatus(
                            selectedProduct,
                            columns
                          ).text
                        }
                      </span>

                    ) : (

                      <span>
                        {
                          selectedProduct.customFields?.[
                          column.id
                          ] || "-"
                        }
                      </span>

                    )}

                  </div>

                );

              })}

            </div>

          </div>

        </div>

      )}


      {/* PAGINATION */}
      {filteredProducts.length > 0 && (

        <div className="flex items-center justify-between px-4 py-3 border-t">

          <p className="text-sm text-slate-500">
            Showing {startIndex + 1} -{" "}
            {Math.min(
              startIndex + PAGE_SIZE,
              filteredProducts.length
            )}
            {" of "}
            {filteredProducts.length}
          </p>


          <div className="flex gap-2">

            <button
              onClick={handlePrev}
              disabled={currentPage === 1}
              className="px-3 py-1 border rounded-lg disabled:opacity-40"
            >
              Prev
            </button>


            <span className="text-sm">
              Page {currentPage} of {totalPages}
            </span>


            <button
              onClick={handleNext}
              disabled={currentPage === totalPages}
              className="px-3 py-1 border rounded-lg disabled:opacity-40"
            >
              Next
            </button>

          </div>

        </div>

      )}

    </div>
  );
}
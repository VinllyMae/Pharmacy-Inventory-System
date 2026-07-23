export default function ColumnRow({ column, handleEdit, handleDelete }) {
  return (
    <tr className="border-b">

      <td className="p-3">
        {column.label}
      </td>

      <td>
        {column.field}
      </td>

      <td>
        {column.type}
      </td>

      <td>
        {column.required ? "Yes" : "No"}
      </td>

      <td>
        {column.visible ? "Yes" : "No"}
      </td>


      <td>

        <div className="flex gap-2 justify-center">

          <button
            onClick={() => handleEdit(column)}
            className="
              bg-yellow-500
              text-white
              px-4
              py-2
              rounded
              hover:bg-yellow-600
            "
          >
            Edit
          </button>


          <button
            onClick={() => handleDelete(column.id)}
            className="
              bg-red-500
              text-white
              px-4
              py-2
              rounded
              hover:bg-red-600
            "
          >
            Delete
          </button>

        </div>

      </td>

    </tr>
  );
}
import ColumnRow from "./ColumnRow";

export default function ColumnTable({
  columns,
  handleDelete,
  handleEdit
}) {
  return (
    <table className="bg-white shadow rounded-lg w-full overflow-hidden">

      <thead>

        <tr className="bg-blue-600 text-white">

          <th className="p-3 text-left">Label</th>

          <th className="text-left">Field</th>

          <th>Type</th>

          <th>Required</th>

          <th>Visible</th>

          <th>Action</th>

        </tr>

      </thead>

      <tbody>

        {columns.length === 0 ? (

          <tr>

            <td
              colSpan="6"
              className="text-center p-5"
            >
              No columns created.
            </td>

          </tr>

        ) : (

          columns.map((column) => (
            <ColumnRow
              column={column}
              handleEdit={handleEdit}
              handleDelete={handleDelete}
            />
          ))

        )}

      </tbody>

    </table>
  );
}
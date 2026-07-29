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
  cancelEdit,
}) {
  return (
    <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200">

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">

        <div>
          <label className="block text-sm font-medium text-slate-600 mb-1">
            Column Name
          </label>

          <input
            value={label}
            onChange={(e) => setLabel(e.target.value)}
            placeholder="Example: Selling Price"
            className="w-full border border-slate-200 rounded-lg px-3 py-2 bg-slate-50 focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition"
          />
        </div>


        <div>
          <label className="block text-sm font-medium text-slate-600 mb-1">
            Data Type
          </label>

          <select
            value={type}
            onChange={(e) => setType(e.target.value)}
            className="w-full border border-slate-200 rounded-lg px-3 py-2 bg-slate-50 focus:bg-white focus:border-blue-500"
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


      <div className="flex gap-4 mt-3">

        <label className="flex items-center gap-2 cursor-pointer">

          <input
            type="checkbox"
            checked={required}
            onChange={(e) => setRequired(e.target.checked)}
            className="w-4 h-4 accent-blue-600"
          />

          <span className="text-sm">
            Required
          </span>

        </label>


        <label className="flex items-center gap-2 cursor-pointer">

          <input
            type="checkbox"
            checked={visible}
            onChange={(e) => setVisible(e.target.checked)}
            className="w-4 h-4 accent-blue-600"
          />

          <span className="text-sm">
            Visible
          </span>

        </label>

      </div>


      <div className="flex justify-end gap-2 mt-3">

        {editing && (
          <button
            type="button"
            onClick={cancelEdit}
            className="px-4 py-2 rounded-lg bg-slate-100 text-slate-600 hover:bg-slate-200 text-sm"
          >
            Cancel
          </button>
        )}


        <button
          type="button"
          onClick={handleAdd}
          className="px-5 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 text-sm"
        >
          {editing ? "Save Changes" : "Add Column"}
        </button>

      </div>

    </div>
  );
}
import { CSS } from "@dnd-kit/utilities";
import { useSortable } from "@dnd-kit/sortable";
import { GripVertical } from "lucide-react";


export default function ColumnRow({
  column,
  handleEdit,
  handleDelete,
}) {

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: column.id,
  });


  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };


  return (
    <tr
      ref={setNodeRef}
      style={style}
      className={`border-b ${isDragging ? "opacity-70 shadow-lg" : ""
        }`}
    >

      <td className="w-14 p-3 text-center">

        <button
          {...attributes}
          {...listeners}
          className="cursor-grab text-slate-400 hover:text-blue-600"
        >
          <GripVertical size={18} />
        </button>

      </td>


      <td className="p-3">
        {column.label}
      </td>


      <td className="p-3 text-center capitalize">
        {column.type}
      </td>


      <td className="p-3 text-center">
        {column.required ? "Yes" : "No"}
      </td>


      <td className="p-3 text-center">
        {column.visible ? "Yes" : "No"}
      </td>


      <td className="p-3">

        <div className="flex justify-center gap-2">

          <button
            onClick={() => handleEdit(column)}
            className="rounded-lg bg-yellow-500 px-4 py-2 text-white"
          >
            Edit
          </button>


          <button
            onClick={() => handleDelete(column.id)}
            className="rounded-lg bg-red-500 px-4 py-2 text-white"
          >
            Delete
          </button>

        </div>

      </td>

    </tr>
  );
}
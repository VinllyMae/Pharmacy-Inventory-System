import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";

import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";

import ColumnRow from "./ColumnRow";

export default function ColumnTable({
  columns,
  handleEdit,
  handleDelete,
  handleDragEnd,
}) {

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
      },
    })
  );


  return (
    <div className="bg-white rounded-xl shadow border overflow-hidden flex flex-col">

      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >

        <SortableContext
          items={columns.map((c) => c.id)}
          strategy={verticalListSortingStrategy}
        >

          <div className="overflow-auto max-h-[600px]">

            <table className="w-full min-w-[700px]">

              <thead className="bg-blue-600 text-white sticky top-0 z-10">

                <tr>

                  <th className="w-12 p-3"></th>

                  <th className="p-3 text-left">
                    Column
                  </th>

                  <th className="p-3">
                    Type
                  </th>

                  <th className="p-3">
                    Required
                  </th>

                  <th className="p-3">
                    Visible
                  </th>

                  <th className="p-3">
                    Action
                  </th>

                </tr>

              </thead>


              <tbody>

                {columns.map((column) => (

                  <ColumnRow
                    key={column.id}
                    column={column}
                    handleEdit={handleEdit}
                    handleDelete={handleDelete}
                  />

                ))}

              </tbody>

            </table>

          </div>

        </SortableContext>

      </DndContext>

    </div>
  );
}
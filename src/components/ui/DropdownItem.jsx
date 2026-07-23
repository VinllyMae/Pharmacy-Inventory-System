export default function DropdownItem({
  children,
  onClick,
  danger = false,
}) {
  return (
    <button
      onClick={onClick}
      className={`w-full text-left px-4 py-2 hover:bg-gray-100 ${
        danger ? "text-red-600" : ""
      }`}
    >
      {children}
    </button>
  );
}
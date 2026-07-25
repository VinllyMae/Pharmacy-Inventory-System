export default function Modal({
  open,
  title,
  children,
  onClose,
  size = "lg",
}) {
  if (!open) return null;

  const sizes = {
    sm: "max-w-md",
    md: "max-w-xl",
    lg: "max-w-2xl",
    xl: "max-w-4xl",
    "2xl": "max-w-5xl",
    "3xl": "max-w-6xl",
    full: "w-[95vw] h-[95vh]",
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50 p-4">
      <div
        className={`bg-white rounded-lg shadow-lg w-full ${sizes[size]} max-h-[95vh] overflow-hidden`}
      >
        <div className="flex justify-between items-center border-b p-4">
          <h2 className="text-xl font-bold">
            {title}
          </h2>

          <button
            onClick={onClose}
            className="text-xl hover:text-red-500"
          >
            ✕
          </button>
        </div>

        <div className="p-6">
          {children}
        </div>
      </div>
    </div>
  );
}
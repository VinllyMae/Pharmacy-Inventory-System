import { useState, useRef, useEffect } from "react";

export default function DropdownMenu({ children }) {
  const [open, setOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (
        menuRef.current &&
        !menuRef.current.contains(event.target)
      ) {
        setOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);

    return () =>
      document.removeEventListener(
        "mousedown",
        handleClickOutside
      );
  }, []);

  return (
    <div className="relative inline-block" ref={menuRef}>
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
      >
        Actions ▼
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-44 bg-white border rounded shadow-lg z-[9999]">
          {children}
        </div>
      )}
    </div>
  );
}
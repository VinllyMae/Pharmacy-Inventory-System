export default function Input({
  label,
  type = "text",
  ...props
}) {
  return (
    <div className="mb-4">

      <label className="block mb-2 font-medium">
        {label}
      </label>

      <input
        type={type}
        {...props}
        className="w-full border rounded-md p-2 focus:ring-2 focus:ring-blue-500 outline-none"
      />

    </div>
  );
}
export default function Button({
    children,
    onClick,
    className = "",
    type = "button"
}) {

    return (
        <button
            type={type}
            onClick={onClick}
            className={`
                px-5
                py-3
                rounded-xl
                font-semibold
                transition
                ${className}
            `}
        >
            {children}
        </button>
    );
}
export default function Ripple({
    fxKey,
    className = "",
}) {
    return (
        <span
            key={fxKey}
            className={`fx-ripple ${className}`}
            aria-hidden="true"
        />
    );
}

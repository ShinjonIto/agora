const FormInput = ({
    name,
    type = "text",
    placeholder,
    value,
    onChange,
    error,
    inputMode,
    autoComplete,
    required = true,
}) => {
    const filled = String(value ?? "").trim() !== "";
    const isInvalid = filled && !!error;
    const isValid = filled && !error;

    const className = `authInput ${isValid ? "isValid" : ""} ${isInvalid ? "isInvalid" : ""}`;

    return (
        <div>
            <input
                className={className}
                name={name}
                type={type}
                placeholder={placeholder}
                value={value}
                onChange={onChange}
                inputMode={inputMode}
                autoComplete={autoComplete}
                required={required}
            />
            {error && <p className="errorText" >{error}</p>}
        </div>
    );
};

export default FormInput;

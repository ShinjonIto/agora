import { FIELD_CONFIG } from "../../utils/validation";
import "./FormInput.css"
const FormInput = ({
    name,
    value,
    onChange,
    error,
    required = true,

    title: titleProp,
    placeholder: placeholderProp,
    type: typeProp,
    inputMode: inputModeProp,
    autoComplete: autoCompleteProp,
}) => {
    const meta = FIELD_CONFIG[name] ?? {};

    const title = titleProp ?? meta.title ?? "";
    const placeholder = placeholderProp ?? meta.placeholder ?? "";
    const type = typeProp ?? meta.type ?? "text";
    const inputMode = inputModeProp ?? meta.inputMode;
    const autoComplete = autoCompleteProp ?? meta.autoComplete;

    const filled = String(value ?? "").trim() !== "";
    const isInvalid = filled && !!error;
    const isValid = filled && !error;

    const className = `authInput ${isValid ? "isValid" : ""} ${isInvalid ? "isInvalid" : ""}`;

    return (
        <div>
            {title && <h3>{title}</h3>}
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
            {error && <p className="errorText">{error}</p>}
        </div>
    );
};

export default FormInput;

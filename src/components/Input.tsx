import { useState } from "react";

interface InputProps {
  name?: string;
  type?: string;
  label?: string;
  placeholder?: string;
  required?: boolean;
  submitState:
    | ""
    | "failed"
    | "submitting"
    | "submitted"
    | "passwordNotMatch"
    | "formNotComplete"
    | "invalidStudentId"
    | "invalidEmail"
    | "passwordIncorrect"
    | "formSubmitFailed"
    | "invalidAverageStep"
    | "invalidUsername"
    | "invalidHeartRate"
    | "somethingWrong"
    | "serviceDown"
    | "usernameEmailTaken";
  children?: React.ReactNode;
  ref?: React.RefObject<HTMLInputElement>;
  value?: string;
  onChange?: (value: string) => void;
  disabled?: boolean;
}

const Input: React.FC<InputProps> = ({
  name,
  type = "text",
  label,
  placeholder,
  required = false,
  submitState,
  children,
  ref,
  onChange,
  disabled = false,
  value,
}) => {
  const [internalState, setInternalState] = useState<string>("");

  const inputValue = value || internalState;

  return (
    <div className="space-y-2 flex flex-col w-full">
      <div className="flex justify-between">
        {label ? (
          <label className="ml-3 text-sm font-medium">
            {label} {required ? " *" : null}
          </label>
        ) : null}
      </div>
      {type === "select" ? (
        <select
          name={name}
          className={`placeholder:text-gray-400 placeholder:font-normal placeholder:text-sm font-semibold outline-none bg-white rounded-lg w-full px-5 py-2.5 ${
            !inputValue && "text-gray-400 font-normal"
          } ${
            required
              ? `${
                  !inputValue && submitState
                    ? "outline-[1.5px] outline-red-400"
                    : ""
                }`
              : ``
          }`}
          value={inputValue}
          onChange={(e) => setInternalState(e.target.value)}
        >
          <option value="" disabled defaultValue="" hidden>
            {placeholder}
          </option>
          {children}
        </select>
      ) : (
        <input
          name={name}
          type={type}
          placeholder={placeholder}
          value={inputValue}
          ref={ref}
          disabled={disabled}
          onChange={(e) => {
            setInternalState(e.target.value);
            if (onChange) onChange(e.target.value);
          }}
          className={`placeholder:text-gray-400 placeholder:font-normal placeholder:text-sm font-semibold outline-none bg-white rounded-lg w-full px-5 py-2.5 ${
            required
              ? `${
                  !internalState && submitState
                    ? "outline-[1.5px] outline-red-400"
                    : ""
                }`
              : ``
          } ${
            name === "password" || name === "confirmPassword"
              ? `${
                  submitState === "passwordNotMatch"
                    ? "outline-[1.5px] outline-red-400"
                    : ""
                }`
              : ""
          }
          disabled:bg-gray-200
          `}
        />
      )}
    </div>
  );
};

export default Input;

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
    | "invalidStudentId";
  children?: React.ReactNode;
}

const Input: React.FC<InputProps> = ({
  name,
  type = "text",
  label,
  placeholder,
  required = false,
  submitState,
  children,
}) => {
  const [value, setValue] = useState<string>("");

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
            !value && "text-gray-400 font-normal"
          } ${
            required
              ? `${
                  !value && submitState ? "outline-[1.5px] outline-red-400" : ""
                }`
              : ``
          }`}
          value={value}
          onChange={(e) => setValue(e.target.value)}
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
          value={value}
          onChange={(e) => setValue(e.target.value)}
          className={`placeholder:text-gray-400 placeholder:font-normal placeholder:text-sm font-semibold outline-none bg-white rounded-lg w-full px-5 py-2.5 ${
            required
              ? `${
                  !value && submitState ? "outline-[1.5px] outline-red-400" : ""
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
          }`}
        />
      )}
    </div>
  );
};

export default Input;

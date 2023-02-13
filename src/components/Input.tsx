interface InputProps {
  type?: string;
  label?: string;
  placeholder?: string;
  required?: boolean;
}

const Input: React.FC<InputProps> = ({
  type = "text",
  label,
  placeholder,
  required = false,
}) => {
  return (
    <div className="space-y-2">
      <div className="flex justify-between">
        {label ? (
          <label className="ml-3 text-sm font-medium">
            {label} {required ? " *" : null}
          </label>
        ) : null}
      </div>
      <input
        type={type}
        placeholder={placeholder}
        required={required}
        className="placeholder:text-gray-400 placeholder:font-normal placeholder:text-sm font-semibold outline-none bg-white rounded-lg w-full px-5 py-2.5"
      />
    </div>
  );
};

export default Input;

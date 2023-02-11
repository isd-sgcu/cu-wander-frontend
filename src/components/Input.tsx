interface InputProps {
  type?: string;
  placeholder?: string;
  required?: boolean;
}

const Input: React.FC<InputProps> = ({
  type = "text",
  placeholder,
  required = false,
}) => {
  return (
    <input
      type={type}
      placeholder={placeholder}
      required={required}
      className="placeholder:text-green-700 placeholder:font-normal font-semibold outline-none bg-white rounded-lg w-full px-5 py-2.5"
    />
  );
};

export default Input;

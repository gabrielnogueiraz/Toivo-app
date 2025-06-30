import React, { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

interface FormInputProps {
  type?: "text" | "email" | "password";
  placeholder: string;
  value: string;
  onChange: (value: string) => void;
  label: string;
  error?: string;
}

const FormInput: React.FC<FormInputProps> = ({
  type = "text",
  placeholder,
  value,
  onChange,
  label,
  error,
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  const inputType = type === "password" && showPassword ? "text" : type;

  return (
    <div className="group relative">
      <label className="block text-sm font-medium text-gray-300 mb-2 font-inter">
        {label}
      </label>
      <div className="relative">
        <input
          type={inputType}
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          className={`
            w-full px-4 py-4 rounded-xl bg-white/5 backdrop-blur-sm border-2 
            text-white placeholder-gray-400 font-inter
            transition-all duration-300 ease-out
            ${
              isFocused
                ? "border-toivo-purple-400 bg-white/10 shadow-lg shadow-toivo-purple-500/25"
                : error
                ? "border-red-400/60"
                : "border-white/10 hover:border-white/20"
            }
            focus:outline-none focus:ring-0
            ${error ? "animate-pulse" : ""}
          `}
        />
        {type === "password" && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors duration-200"
          >
            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
        )}
      </div>
      {error && (
        <p className="mt-2 text-sm text-red-400 font-inter animate-fade-in">
          {error}
        </p>
      )}
    </div>
  );
};

export default FormInput;

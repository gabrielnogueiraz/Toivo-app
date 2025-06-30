import React, { useState } from "react";

interface FormButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  type?: "button" | "submit";
  variant?: "primary" | "secondary";
  loading?: boolean;
  disabled?: boolean;
  className?: string;
}

const FormButton: React.FC<FormButtonProps> = ({
  children,
  onClick,
  type = "button",
  variant = "primary",
  loading = false,
  disabled = false,
  className = "",
}) => {
  const [isHovered, setIsHovered] = useState(false);

  const baseClasses = `
    relative px-8 py-4 rounded-xl font-semibold text-base
    transition-all duration-300 ease-out
    disabled:opacity-50 disabled:cursor-not-allowed
    group overflow-hidden
  `;

  const variantClasses =
    variant === "primary"
      ? `
        bg-toivo-purple-gradient text-white
        hover:shadow-xl hover:shadow-toivo-purple-500/40
        hover:scale-[1.02] active:scale-[0.98]
        ${isHovered ? "animate-glow-pulse" : ""}
      `
      : `
        bg-white/10 backdrop-blur-sm text-white border-2 border-white/20
        hover:bg-white/20 hover:border-white/40
        hover:scale-[1.02] active:scale-[0.98]
      `;

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={`${baseClasses} ${variantClasses} ${className}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Shimmer effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out" />

      {/* Content */}
      <span className="relative z-10 flex items-center justify-center gap-2">
        {loading && (
          <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
        )}
        {children}
      </span>
    </button>
  );
};

export default FormButton;

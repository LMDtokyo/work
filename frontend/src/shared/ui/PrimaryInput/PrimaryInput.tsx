import { Eye, EyeOff } from "lucide-react";
import { forwardRef, useState, type InputHTMLAttributes } from "react";

interface PrimaryInputProps extends InputHTMLAttributes<HTMLInputElement> {
  isPassword?: boolean;
  errorMessage?: string;
  label: string;
  className?: string;
}

const PrimaryInput = forwardRef<HTMLInputElement, PrimaryInputProps>(
  (
    { isPassword = false, errorMessage = "", label, className = "", ...rest },
    ref,
  ) => {
    const [showPass, setShowPass] = useState(false);

    const inputType = isPassword && !showPass ? "password" : "text";
    const hasError = Boolean(errorMessage);

    return (
      <div className="relative w-full flex flex-col gap-2">
        <label className="text-font-primary text-sm font-semibold ml-2">
          {label}
        </label>
        <input
          ref={ref}
          type={inputType}
          className={`bg-chat-tertiary-bg px-3 sm:px-4 md:px-6 py-2.5 sm:py-3 rounded-lg outline-none font-normal text-font-primary w-full shadow-[0_2px_4px_#00000025] placeholder:text-font-secondary text-sm sm:text-base focus:bg-chat-tertiary-bg-hover/60 duration-100 ${isPassword ? "pr-12 sm:pr-14 md:pr-18" : ""} ${hasError ? "border border-[#ff6464]" : ""} ${className || ""}`}
          {...rest}
        />
        {hasError && (
          <p className="text-[#ff6464] ml-1 sm:ml-1 md:ml-2  text-xs sm:text-sm animate-fade-in-right">
            {errorMessage}
          </p>
        )}
        {isPassword && (
          <button
            type="button"
            onClick={() => setShowPass((v) => !v)}
            className="absolute right-4 sm:right-5 md:right-6 top-9.5 sm:top-10 text-font-secondary cursor-pointer hover:text-font-primary duration-150"
          >
            {showPass ? (
              <Eye className="w-5 h-5 sm:w-6 sm:h-6" />
            ) : (
              <EyeOff className="w-5 h-5 sm:w-6 sm:h-6" />
            )}
          </button>
        )}
      </div>
    );
  },
);

PrimaryInput.displayName = "PrimaryInput";

export default PrimaryInput;

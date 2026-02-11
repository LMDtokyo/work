import { Eye, EyeOff } from "lucide-react";
import { useState, forwardRef, type InputHTMLAttributes } from "react";

interface AuthInputProps extends InputHTMLAttributes<HTMLInputElement> {
  isPassword: boolean;
  errorMessage?: string;
}

const AuthInput = forwardRef<HTMLInputElement, AuthInputProps>(
  ({ isPassword, errorMessage, className, ...rest }, ref) => {
    const [showPass, setShowPass] = useState(false);

    const inputType = isPassword && !showPass ? "password" : "text";
    const hasError = Boolean(errorMessage);

    return (
      <div className="relative w-full">
        <input
          ref={ref}
          type={inputType}
          className={`bg-auth-secondary-bg px-5 sm:px-6 md:px-8 py-2.5 sm:py-3 rounded-full outline-none font-normal text-primary-font w-full shadow-[0_2px_4px_#00000025] placeholder:text-secondary-font text-sm sm:text-base ${isPassword ? "pr-12 sm:pr-14 md:pr-18" : ""} ${hasError ? "border border-[#ff6464]" : ""} ${className || ""}`}
          {...rest}
        />
        {hasError && (
          <p className="text-[#ff6464] ml-2 sm:ml-3 md:ml-4 mt-1 sm:mt-1.5 text-xs sm:text-sm animate-fade-in-right">
            {errorMessage}
          </p>
        )}
        {isPassword && (
          <button
            type="button"
            onClick={() => setShowPass((v) => !v)}
            className="absolute right-4 sm:right-5 md:right-6 top-2.5 sm:top-3 text-primary-font cursor-pointer hover:text-primary-font duration-150"
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

AuthInput.displayName = "AuthInput";

export default AuthInput;

import { Eye, EyeOff } from "lucide-react";
import { useState, type InputHTMLAttributes } from "react";

interface IAuthInput extends InputHTMLAttributes<HTMLInputElement> {
  isPassword: boolean;
  placeholder: string;
  errorMessage?: string;
  maxLenght?: number;
}

function AuthInput({
  isPassword,
  placeholder,
  errorMessage,
  maxLenght,
  ...props
}: IAuthInput) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      <input
        placeholder={placeholder}
        type={isPassword && !isOpen ? "password" : "text"}
        className={`bg-auth-input-bg px-8 py-3 rounded-full outline-none font-normal text-font-primary w-125 shadow-[0_2px_4px_#00000025] placeholder:text-font-secondary ${isPassword && "pr-18"} ${errorMessage && "border border-[#ff6464]"}`}
        maxLength={maxLenght}
        {...props}
      />
      {errorMessage && (
        <p className="text-[#ff6464] ml-4 mt-1.5 text-sm animate-fade-in-right max-w-120">
          {errorMessage}
        </p>
      )}
      {isPassword &&
        (!isOpen ? (
          <EyeOff
            className="absolute right-6 top-3 text-font-secondary cursor-pointer hover:text-font-primary duration-150"
            onClick={() => setIsOpen(true)}
          />
        ) : (
          <Eye
            className="absolute right-6 top-3 text-font-secondary cursor-pointer hover:text-font-primary duration-150"
            onClick={() => setIsOpen(false)}
          />
        ))}
    </div>
  );
}

export default AuthInput;

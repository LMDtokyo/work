interface IAuthButton extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  text: string;
  onClick?: () => void;
  className?: string;
}

function AuthButton({ text, onClick, className = "", ...props }: IAuthButton) {
  return (
    <button
      onClick={onClick}
      className={`bg-contrast text-tertiary-font px-6 sm:px-8 py-2.5 sm:py-3 rounded-full outline-none font-semibold cursor-pointer w-full duration-200 mt-5 sm:mt-6 md:mt-7 text-sm sm:text-base hover:scale-102 duration-100 ${className}`}
      {...props}
    >
      {text}
    </button>
  );
}

export default AuthButton;

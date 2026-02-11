interface IPrimaryButton extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  text: string;
  onClick?: () => void;
  className?: string;
}

function PrimaryButton({
  text,
  onClick,
  className = "",
  ...props
}: IPrimaryButton) {
  return (
    <button
      onClick={onClick}
      className={`bg-contrast text-tertiary-font px-6 sm:px-8 py-2.5 sm:py-3 rounded-xl outline-none font-semibold cursor-pointer w-full hover:shadow-[0_3px_8px_var(--color-hover-shadow)] duration-200 text-sm sm:text-base ${className}`}
      {...props}
    >
      {text}
    </button>
  );
}

export default PrimaryButton;

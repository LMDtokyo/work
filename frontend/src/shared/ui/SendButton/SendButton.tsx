import { ArrowUp } from "lucide-react";
import cx from "classix";
import Loader from "../Loader/Loader";

export interface ISendButton {
  isDisabled?: boolean;
  isLoading?: boolean;
  className?: string;
}

function SendButton({
  isDisabled = false,
  isLoading = false,
  className = "",
}: ISendButton) {
  const cls = cx(
    `bg-contrast rounded-full p-2.5 
         hover:bg-contrast-hover duration-150 cursor-pointer 
         disabled:opacity-50 
         disabled:cursor-default 
         disabled:hover:bg-contrast`,
    className,
  );

  return (
    <button className={cls} disabled={isDisabled}>
      {isLoading ? (
        <Loader size={4.5} />
      ) : (
        <ArrowUp
          width={18}
          height={18}
          strokeWidth={3}
          className="text-tertiary-font"
        />
      )}
    </button>
  );
}

export default SendButton;

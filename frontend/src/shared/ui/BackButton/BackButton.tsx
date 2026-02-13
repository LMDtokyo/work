import { ChevronLeft } from "lucide-react";
import cx from "classix";
import { useNavigate } from "react-router-dom";

interface IBackButton {
  className?: string;
  link: string;
}

function BackButton({ className = "", link }: IBackButton) {
  const navigate = useNavigate();

  const cls = cx(
    "flex items-center justify-center gap-1 bg-auth-secondary-bg px-4 py-1 rounded-full outline-none font-semibold text-primary-font shadow-[0_2px_4px_#00000025] cursor-pointer hover:shadow-[0_3px_6px_#00000030] hover:scale-102 duration-150",
    className,
  );

  return (
    <div className={cls} onClick={() => navigate(link)}>
      <ChevronLeft
        className="text-primary-font w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6"
        width={18}
        hanging={18}
      />
      <span className="text-primary-font text-sm sm:text-base">Назад</span>
    </div>
  );
}

export default BackButton;

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
    "flex gap-1 bg-auth-input-bg px-4 py-1 rounded-full outline-none font-semibold text-font-primary shadow-[0_2px_4px_#00000025] cursor-pointer hover:shadow-[0_3px_6px_#00000030] duration-150",
    className,
  );

  return (
    <div className={cls} onClick={() => navigate(link)}>
      <ChevronLeft className="text-font-primary" width={18} hanging={18} />
      <span className="text-font-primary">Назад</span>
    </div>
  );
}

export default BackButton;

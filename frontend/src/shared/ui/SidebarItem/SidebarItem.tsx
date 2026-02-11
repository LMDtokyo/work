import { NavLink } from "react-router-dom";
import cx from "classix";

interface ISidebarItem {
  icon: React.ReactNode;
  link?: string;
  isSelected?: boolean;
  isButton?: boolean;
  onClick: () => void;
}

function SidebarItem({
  icon,
  link = "",
  isSelected = false,
  isButton = false,
  onClick,
}: ISidebarItem) {
  const cls = cx(
    `flex justify-center items-center w-15 h-15 rounded-xl cursor-pointer text-primary-font hover:text-primary-font-hover hover:shadow-[0_2px_4px_#00000025] hover:bg-chat-tertiary-bg duration-150 select-none ${isSelected ? "bg-chat-tertiary-bg shadow-[0_2px_4px_#00000025] text-primary-font-hover" : "bg-chat-secondary-bg"}`,
  );

  if (isButton) {
    return (
      <button onClick={onClick} className={cls}>
        {icon}
      </button>
    );
  } else {
    return (
      <NavLink to={link} onClick={onClick} className={cls}>
        {icon}
      </NavLink>
    );
  }
}

export default SidebarItem;

import { ArrowLeftRight, Crown, Menu, Settings, UserRound } from "lucide-react";
import WildberriesIcon from "../../shared/assets/WildberriesIcon";
import AvitoIcon from "../../shared/assets/AvitoIcon";
import TelegramIcon from "../../shared/assets/TelegramIcon";
import PlatformLink from "../../shared/ui/PlatformLink/PlatformLink";
import { NavLink } from "react-router-dom";
import { useRef, useState } from "react";
import { useClickOutside } from "../../shared/hooks";
import AllAccountsIcon from "../../shared/assets/AllAccountsIcon";

const items = [
  {
    link: "/app/chats/wildberries",
    icon: <WildberriesIcon width={52} height={52} />,
  },
  {
    link: "/app/chats/avito",
    icon: <AvitoIcon width={52} height={52} />,
  },
  {
    link: "/app/chats/telegram",
    icon: <TelegramIcon width={52} height={52} />,
  },
  {
    link: "/app/chats/all-accounts",
    icon: <AllAccountsIcon width={52} height={52} />,
  },
];

const menuItems = [
  {
    link: "/app/profile",
    title: "Профиль",
    icon: <UserRound className="w-5 sm:w-6" />,
  },
  {
    link: "/app/settings",
    title: "Настройки",
    icon: <Settings className="w-5 sm:w-6" />,
  },
  {
    link: "/app/subscription",
    title: "Подписка",
    icon: <Crown className="w-5 sm:w-6" />,
  },
  {
    link: "/app/transactions",
    title: "Транзакции",
    icon: <ArrowLeftRight className="w-5 sm:w-6" />,
  },
];

function Sidebar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useClickOutside(menuRef, () => setMenuOpen(false), menuOpen);

  return (
    <div
      ref={menuRef}
      className="flex flex-row min-[450px]:flex-col bg-chat-secondary-bg items-center border border-chat-primary-border rounded-xl md:rounded-2xl relative"
    >
      <button
        onClick={() => setMenuOpen(!menuOpen)}
        className="flex items-center justify-center w-14 h-14 md:h-16 md:w-14 border border-transparent border-r-chat-primary-border min-[450px]:border-b-chat-primary-border min-[450px]:border-r-transparent min-[450px]:rounded-t-xl cursor-pointer hover:bg-chat-tertiary-bg duration-100"
      >
        <Menu className="text-primary-font w-6 h-6 md:w-7 md:h-7" />
      </button>
      <div className="flex flex-row min-[450px]:flex-col">
        {items.map((item, i) => (
          <PlatformLink
            key={item.link}
            to={item.link}
            icon={item.icon}
            onClick={() => setMenuOpen(false)}
            className={
              i === items.length - 1
                ? "rounded-r-xl min-[450px]:rounded-b-xl min-[450px]:rounded-r-none"
                : ""
            }
          />
        ))}
      </div>
      {menuOpen && (
        <div
          className={`absolute flex flex-col rounded-xl border border-chat-primary-border left-0 top-16 min-[450px]:left-16 md:left-18 min-[450px]:-top-px bg-chat-secondary-bg z-999 overflow-hidden ${menuOpen && "animate-fade-in-bottom"}`}
        >
          {menuItems.map((item, i) => (
            <NavLink
              key={item.link}
              to={item.link}
              onClick={() => setMenuOpen(false)}
              className={({ isActive }) =>
                `flex gap-2 text-primary-font py-2 sm:py-3 px-4 hover:bg-chat-tertiary-bg duration-100 border-b border-chat-primary-border ${i === menuItems.length - 1 && "border-b-transparent"} ${isActive && "bg-chat-tertiary-bg"}`
              }
            >
              {item.icon}
              <span className="text-sm sm:text-base">{item.title}</span>
            </NavLink>
          ))}
        </div>
      )}
    </div>
  );
}

export default Sidebar;

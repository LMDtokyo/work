import { Crown, Menu, Settings, UserRound } from "lucide-react";
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
    icon: <UserRound />,
  },
  {
    link: "/app/settings",
    title: "Настройки",
    icon: <Settings />,
  },
  {
    link: "/app/subscription",
    title: "Подписка",
    icon: <Crown />,
  },
];

function Sidebar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useClickOutside(menuRef, () => setMenuOpen(false), menuOpen);

  return (
    <div
      ref={menuRef}
      className="flex flex-col bg-chat-secondary-bg items-center border border-primary-border rounded-2xl relative"
    >
      <button
        onClick={() => setMenuOpen(!menuOpen)}
        className="flex items-center justify-center h-16 w-full border border-transparent border-b-primary-border rounded-t-xl cursor-pointer hover:bg-primary-border duration-100"
      >
        <Menu className="text-font-primary" width={28} height={28} />
      </button>
      <div className="flex flex-col">
        {items.map((item, i) => (
          <PlatformLink
            key={item.link}
            to={item.link}
            icon={item.icon}
            onClick={() => setMenuOpen(false)}
            className={i === items.length - 1 ? "rounded-b-xl" : ""}
          />
        ))}
      </div>
      {menuOpen && (
        <div
          className={`absolute flex flex-col rounded-xl border border-primary-border left-18 -top-px bg-chat-secondary-bg z-99 overflow-hidden ${menuOpen && "animate-fade-in-bottom"}`}
        >
          {menuItems.map((item) => (
            <NavLink
              key={item.link}
              to={item.link}
              onClick={() => setMenuOpen(false)}
              className={({ isActive }) =>
                `flex gap-2 text-font-primary py-3 px-4 hover:bg-primary-border duration-100 ${isActive && "bg-primary-border"}`
              }
            >
              {item.icon}
              <span>{item.title}</span>
            </NavLink>
          ))}
        </div>
      )}
    </div>
  );
}

export default Sidebar;

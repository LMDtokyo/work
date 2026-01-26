import { MessageCircle, Moon, Settings, Sun } from "lucide-react";
import SidebarItem from "../../shared/ui/SidebarItem/SidebarItem";
import { useState } from "react";
import useTheme from "../../shared/store/useTheme";

function Sidebar() {
  const [selectedItem, setSelectedItem] = useState(0);
  const { theme, setTheme } = useTheme((state) => state);

  return (
    <div className="flex flex-col justify-between h-full">
      <div>
        <SidebarItem
          icon={<MessageCircle />}
          link={"/app/chats"}
          isSelected={selectedItem === 0}
          onClick={() => {
            setSelectedItem(0);
          }}
        />
      </div>
      <div className="flex flex-col gap-2">
        <SidebarItem
          icon={<Settings />}
          link="/app/chats"
          isSelected={selectedItem === 1}
          onClick={() => setSelectedItem(1)}
        />
        <SidebarItem
          icon={theme === "light" ? <Sun /> : <Moon />}
          link=""
          isButton
          onClick={() => {
            setTheme(theme === "light" ? "dark" : "light");
            document.documentElement.setAttribute("data-theme", theme);
          }}
        />
        <SidebarItem
          icon={<span className="font-semibold text-2xl">A</span>}
          link="/app/profile"
          isSelected={selectedItem === 3}
          onClick={() => {
            setSelectedItem(3);
          }}
        />
      </div>
    </div>
  );
}

export default Sidebar;

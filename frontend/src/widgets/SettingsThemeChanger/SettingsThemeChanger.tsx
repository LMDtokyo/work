import { Moon, Sun } from "lucide-react";
import { useAuth } from "../../shared/context/auth";

function SettingsThemeChanger() {
  const { theme, setTheme } = useAuth();

  const toggleTheme = () => setTheme(theme === "light" ? "dark" : "light");

  return (
    <div className="flex justify-between w-full items-center bg-chat-secondary-bg border border-chat-primary-border px-6 py-4 rounded-2xl animate-fade-in-bottom">
      <div>
        <h2 className="text-base sm:text-lg md:text-xl font-bold text-primary-font">
          Тема
        </h2>
        <p className="text-secondary-font text-xs sm:text-sm md:text-base">
          {theme === "dark" ? "Тёмная" : "Светлая"}
        </p>
      </div>
      <button
        className="bg-chat-tertiary-bg rounded-full group p-2.5 lg:p-3 cursor-pointer hover:bg-chat-tertiary-bg-hover border border-chat-secondary-border duration-150"
        onClick={toggleTheme}
      >
        {theme === "light" ? (
          <Sun className="text-primary-font w-5 h-5 lg:w-6 lg:h-6 group-hover:scale-105 duration-150" />
        ) : (
          <Moon className="text-primary-font w-5 h-5 lg:w-6 lg:h-6 group-hover:scale-105 duration-150" />
        )}
      </button>
    </div>
  );
}

export default SettingsThemeChanger;

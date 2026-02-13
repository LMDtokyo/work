import { useRef, useState } from "react";
import { Link } from "react-router-dom";
import { Menu, Moon, Sun, X } from "lucide-react";
import { useAuth } from "../../shared/context/auth";
import ManitoDark from "../../shared/assets/ManitoDark";
import ManitoLight from "../../shared/assets/ManitoLight";
import { useClickOutside } from "../../shared/hooks";

function LandingHeader() {
  const { theme, setTheme } = useAuth();
  const [isOpened, setIsOpened] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useClickOutside(dropdownRef, () => setIsOpened(false), isOpened);

  const toggleTheme = () => setTheme(theme === "light" ? "dark" : "light");

  return (
    <header
      className="flex justify-between items-center w-svw py-4 md:py-6 z-10 absolute left-0 px-4 sm:px-6 md:px-10 lg:px-14"
      ref={dropdownRef}
    >
      {theme === "dark" ? <ManitoDark /> : <ManitoLight />}

      <div className="hidden md:flex gap-3">
        <button
          className="bg-theme-button rounded-full p-2.5 lg:p-3 cursor-pointer group shadow-[0_2px_4px_#00000025] hover:bg-theme-button-hover duration-150"
          onClick={toggleTheme}
        >
          {theme === "light" ? (
            <Sun className="text-primary-font w-5 h-5 lg:w-6 lg:h-6 group-hover:scale-105 duration-150" />
          ) : (
            <Moon className="text-primary-font w-5 h-5 lg:w-6 lg:h-6 group-hover:scale-105 duration-250" />
          )}
        </button>
        <Link
          to="/login"
          className="text-tertiary-font font-semibold bg-contrast px-8 lg:px-12 py-2.5 lg:py-3 rounded-full text-sm lg:text-base hover:scale-102 duration-100"
        >
          <span>Войти</span>
        </Link>
      </div>

      <div className="flex md:hidden gap-2">
        <button
          className="bg-landing-secondary-bg rounded-full p-2.5 cursor-pointer shadow-[0_2px_4px_#00000025]"
          onClick={toggleTheme}
        >
          {theme === "light" ? (
            <Sun className="text-primary-font w-5 h-5" />
          ) : (
            <Moon className="text-primary-font w-5 h-5" />
          )}
        </button>
        <button
          className="text-primary-font p-2"
          onClick={() => setIsOpened(!isOpened)}
        >
          {isOpened ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {isOpened && (
        <div className="absolute top-20 right-4 border border-chat-primary-border p-3 rounded-3xl bg-landing-bg-1/98 backdrop-blur-sm z-50 md:hidden animate-fade-in">
          <nav className="flex flex-col items-center gap-6 pt-3 font-bold text-primary-font text-xl">
            <a
              href="#posibilities"
              className="hover:text-primary-font-hover text-sm"
              onClick={() => setIsOpened(false)}
            >
              Возможности
            </a>
            <a
              href="#prices"
              className="hover:text-primary-font-hover text-sm"
              onClick={() => setIsOpened(false)}
            >
              Цены
            </a>
            <Link
              to="/login"
              className="text-tertiary-font font-semibold bg-contrast px-10 py-3 text-sm rounded-full mt-1"
              onClick={() => setIsOpened(false)}
            >
              Войти
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}

export default LandingHeader;

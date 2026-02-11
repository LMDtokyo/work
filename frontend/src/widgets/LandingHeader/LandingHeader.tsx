import { useState } from "react";
import { Link } from "react-router-dom";
import { Menu, Moon, Sun, X } from "lucide-react";
import { useAuth } from "../../shared/context/auth";
import ManitoDark from "../../shared/assets/ManitoDark";
import ManitoLight from "../../shared/assets/ManitoLight";

function LandingHeader() {
  const { theme, setTheme } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleTheme = () => setTheme(theme === "light" ? "dark" : "light");

  return (
    <header className="flex justify-between items-center w-svw py-4 md:py-6 z-10 absolute left-0 px-4 sm:px-6 md:px-10 lg:px-14">
      {theme === "dark" ? <ManitoDark /> : <ManitoLight />}

      <div className="hidden md:flex gap-3">
        <button
          className="bg-theme-button rounded-full p-2.5 lg:p-3 cursor-pointer shadow-[0_2px_4px_#00000025] hover:shadow-[0_3px_4px_#00000040] duration-150"
          onClick={toggleTheme}
        >
          {theme === "light" ? (
            <Sun className="text-primary-font w-5 h-5 lg:w-6 lg:h-6" />
          ) : (
            <Moon className="text-primary-font w-5 h-5 lg:w-6 lg:h-6" />
          )}
        </button>
        <Link
          to="/login"
          className="text-tertiary-font font-semibold bg-contrast px-8 lg:px-12 py-2.5 lg:py-3 rounded-full text-sm lg:text-base"
        >
          Войти
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
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {menuOpen && (
        <div className="fixed inset-0 top-14 bg-landing-bg-1/98 backdrop-blur-sm z-50 md:hidden animate-fade-in">
          <nav className="flex flex-col items-center gap-6 pt-10 font-bold text-primary-font text-xl">
            <a
              href="#posibilities"
              className="hover:text-primary-font-hover"
              onClick={() => setMenuOpen(false)}
            >
              Возможности
            </a>
            <a
              href="#prices"
              className="hover:text-primary-font-hover"
              onClick={() => setMenuOpen(false)}
            >
              Цены
            </a>
            <Link
              to="/login"
              className="text-tertiary-font font-semibold bg-contrast px-10 py-3 rounded-full mt-4"
              onClick={() => setMenuOpen(false)}
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

import { Link } from "react-router-dom";
import manitoLogo from "../../shared/assets/manitoLogo.svg";
import { Moon, Sun } from "lucide-react";
import useTheme from "../../shared/store/useTheme";

function LandingHeader() {
  const theme = useTheme((state) => state.theme);
  const setTheme = useTheme((state) => state.setTheme);

  return (
    <header className="flex justify-between items-center w-svw py-6 z-10 absolute left-0 px-14">
      <img src={manitoLogo} alt="Manito Logo" className="cursor-pointer" />
      <div className="flex gap-10 font-bold text-font-primary text-lg">
        <a
          href="#posibilities"
          className="hover:text-font-primary-hover duration-150 cursor-pointer"
        >
          Возможности
        </a>
        <a
          href="#prices"
          className="hover:text-font-primary-hover duration-150 cursor-pointer"
        >
          Цены
        </a>
      </div>
      <div className="flex gap-3">
        <button
          className="bg-theme-button rounded-full p-3 cursor-pointer shadow-[0_2px_4px_#00000025] hover:shadow-[0_3px_4px_#00000040] duration-150"
          onClick={() => {
            setTheme(theme === "light" ? "dark" : "light");
            document.documentElement.setAttribute("data-theme", theme);
          }}
        >
          {theme === "light" ? (
            <Sun className="text-font-primary" />
          ) : (
            <Moon className="text-font-primary" />
          )}
        </button>
        <Link
          to="/login"
          className="text-font-tertiary font-semibold bg-linear-to-b from-button-gradient-start to-button-gradient-end px-12 py-3 rounded-full hover:shadow-[0_3px_4px_var(--color-hover-shadow)] duration-150"
        >
          Войти
        </Link>
      </div>
    </header>
  );
}

export default LandingHeader;

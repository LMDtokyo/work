import { Link } from "react-router-dom";
import ManitoDark from "../../shared/assets/ManitoDark";
import ManitoLight from "../../shared/assets/ManitoLight";
import { useAuth } from "../../shared/context/auth";

function LandingFooter() {
  const { theme } = useAuth();

  return (
    <footer className="flex flex-col md:flex-row gap-8 text-center justify-between items-center py-5 sm:py-7 px-4 sm:px-6 md:px-8 lg:px-10 w-[calc(100%+2rem)] sm:w-[calc(100%+3rem)] md:w-[calc(100%+5rem)] lg:w-screen -mx-4 sm:-mx-6 md:-mx-10 lg:-mx-14">
      {theme === "dark" ? <ManitoDark /> : <ManitoLight />}
      <div className="text-primary-font font-bold text-lg">
        <h3>ИП Евсютин Иван Алексеевич</h3>
        <h3>ИНН: 773389267379 ОГРН/ОГРНИП: 316774600498753</h3>
      </div>
      <div>
        <Link
          to="/offer"
          className="text-contrast hover:text-contrast-hover font-bold"
        >
          Договор оферты
        </Link>
        <h3 className="text-primary-font font-bold">© MANITO CRM . 2025</h3>
      </div>
    </footer>
  );
}

export default LandingFooter;

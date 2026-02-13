import { Handshake } from "lucide-react";
import { Link } from "react-router-dom";

function HeroSection() {
  return (
    <div className="flex flex-col justify-center items-center w-full h-svh relative animate-fade-in-bottom px-2 sm:px-0">
      <div className="flex gap-3 md:gap-4 items-center font-semibold text-contrast border border-contrast bg-contrast-20 rounded-full py-2 px-6 md:px-8 mb-2">
        <Handshake className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6" />
        <h3 className="text-xs md:text-base">Объединяем ваш бизнес</h3>
      </div>
      <h1 className="text-2xl min-[400px]:text-3xl sm:text-4xl lg:text-6xl font-bold text-primary-font text-center w-full sm:w-[90%] md:w-[85%] lg:w-211 leading-tight">
        Хотите <span className="text-contrast">увеличить продажи</span> и
        сохранить клиентов?
      </h1>
      <h3 className="text-sm min-[400px]:text-base sm:text-xl md:text-2xl font-semibold text-primary-font mt-4 sm:mt-6 md:mt-8 lg:mt-10 text-center px-2">
        Вся аналитика маркетплейсов в одной панели MANITO
      </h3>
      <p className="text-xs sm:text-base md:text-xl text-secondary-font w-full sm:w-[85%] md:w-[75%] lg:w-170 mt-4 sm:mt-5 text-center px-2">
        Мы объединяем все каналы продаж - больше не требуется открывать много
        окон для каждого маркетплейса!
      </p>
      <Link
        to="/login"
        className="flex items-center gap-2 sm:gap-3 text-tertiary-font text-sm sm:text-base md:text-lg font-semibold
             bg-contrast
             px-8 sm:px-10 md:px-12 py-2.5 sm:py-3 rounded-full
             duration-100 mt-8 sm:mt-10 group hover:scale-102"
      >
        Попробовать бесплатно
      </Link>
    </div>
  );
}

export default HeroSection;

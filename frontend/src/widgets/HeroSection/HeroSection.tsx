import { ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";

function HeroSection() {
  return (
    <div className="flex flex-col justify-center items-center w-full h-svh relative animate-fade-in-bottom">
      <h1 className="text-6xl font-bold text-font-primary text-center w-211">
        Хотите{" "}
        <span className="bg-linear-to-r from-button-gradient-start to-button-gradient-end bg-clip-text text-transparent">
          увеличить продажи
        </span>{" "}
        и сохранить клиентов?
      </h1>
      <h3 className="text-2xl font-semibold text-font-primary mt-10">
        Вся аналитика маркетплейсов в одной панели MANITO
      </h3>
      <p className="text-xl text-font-secondary w-170 mt-5 text-center">
        Мы объединяем все каналы продаж - больше не требуется открывать много
        окон для каждого маркетплейса!
      </p>
      <Link
        to="/login"
        className="flex items-center gap-3 text-font-tertiary text-lg font-semibold 
             bg-linear-to-b from-button-gradient-start to-button-gradient-end 
             px-12 py-3 rounded-full 
             hover:shadow-[0_3px_4px_var(--color-hover-shadow)] 
             duration-150 mt-10 group"
      >
        Попробовать бесплатно
        <ChevronRight
          width={20}
          strokeWidth={3}
          className="mt-px transition-transform duration-300 group-hover:translate-x-1"
        />
      </Link>
    </div>
  );
}

export default HeroSection;

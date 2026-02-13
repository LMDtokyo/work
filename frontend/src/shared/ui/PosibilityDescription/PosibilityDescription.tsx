import { Link } from "react-router-dom";

interface IPosibilityDescription {
  title: string;
  desc: string;
  className?: string;
}

function PosibilityDescription({
  title,
  desc,
  className = "",
}: IPosibilityDescription) {
  return (
    <div
      className={`flex flex-col gap-8 sm:gap-10 md:gap-12 lg:gap-16 justify-center items-center text-center max-w-[90%] lg:items-start lg:max-w-155 lg:text-start animate-fade-in-bottom ${className}`}
    >
      <div className="flex flex-col gap-6">
        <h2 className="text-primary-font text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold">
          {title}
        </h2>
        <p className="text-secondary-font text-xs sm:text-sm md:text-base lg:text-xl">
          {desc}
        </p>
      </div>
      <Link
        to="/login"
        className="bg-contrast py-3 sm:py-4 px-10 rounded-full text-tertiary-font text-sm sm:text-base font-semibold hover:scale-102 duration-100"
      >
        Начать сейчас
      </Link>
    </div>
  );
}

export default PosibilityDescription;

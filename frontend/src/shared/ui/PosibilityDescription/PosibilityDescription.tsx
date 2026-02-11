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
      className={`flex flex-col gap-12 lg:gap-16 justify-center items-center text-center max-w-[90%] lg:items-start lg:max-w-155 lg:text-start ${className}`}
    >
      <div className="flex flex-col gap-6">
        <h2 className="text-primary-font text-3xl lg:text-4xl font-bold">
          {title}
        </h2>
        <p className="text-secondary-font text-base lg:text-xl">{desc}</p>
      </div>
      <Link
        to="/login"
        className="bg-contrast py-4 px-10 rounded-full text-tertiary-font font-semibold"
      >
        Начать сейчас
      </Link>
    </div>
  );
}

export default PosibilityDescription;

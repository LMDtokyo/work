interface IPosibilityAdditionItem {
  icon: React.ReactNode;
  title: string;
  desc: string;
  isSelected?: boolean;
  onClick?: () => void;
}

function PosibilityAdditionItem({
  icon,
  title,
  desc,
  isSelected = false,
  onClick,
}: IPosibilityAdditionItem) {
  return (
    <div
      onClick={onClick}
      className={`border rounded-xl sm:rounded-2xl md:rounded-3xl py-3 sm:py-5 px-4 sm:px-8 hover:bg-landing-secondary-bg hover:border-landing-border duration-150 cursor-pointer ${isSelected ? "bg-landing-secondary-bg border-landing-border" : "bg-transparent border-transparent"}`}
    >
      <div className="flex gap-5 justify-start items-start sm:items-center">
        <span className="bg-contrast-20 rounded-lg sm:rounded-xl md:rounded-2xl flex items-center justify-center p-3 sm:p-5 text-contrast">
          {icon}
        </span>
        <div className="flex flex-col gap-2">
          <h2 className="text-primary-font font-semibold text-lg sm:text-xl md:text-2xl">
            {title}
          </h2>
          <p className="text-secondary-font text-sm sm:text-base md:text-lg">
            {desc}
          </p>
        </div>
      </div>
    </div>
  );
}

export default PosibilityAdditionItem;

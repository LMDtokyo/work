import cx from "classix";

interface IPosibilityItem {
  icon: React.ReactNode;
  title: string;
  description: string;
  className?: string;
}

function PosibilityItem({
  icon,
  title,
  description,
  className = "",
}: IPosibilityItem) {
  const cls = cx(
    "flex flex-col items-start bg-landing-secondary-bg rounded-xl sm:rounded-2xl p-5 sm:p-6 md:p-8 border border-landing-border hover:scale-101 hover:shadow-[0_20px_50px_var(--color-glare)] duration-200",
    className,
  );

  return (
    <div className={cls}>
      <span className="bg-contrast-20 p-3 sm:p-4 md:p-5 rounded-lg text-contrast">
        {icon}
      </span>
      <h3 className="text-xl sm:text-2xl font-bold text-primary-font mt-4 sm:mt-5 md:mt-6">
        {title}
      </h3>
      <p className="text-base sm:text-lg text-secondary-font mt-2 sm:mt-2.5">
        {description}
      </p>
    </div>
  );
}

export default PosibilityItem;

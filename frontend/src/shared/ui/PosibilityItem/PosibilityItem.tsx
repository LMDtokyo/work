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
    "flex flex-col items-start bg-chat-tertiary-bg rounded-2xl p-8 border border-border hover:scale-101 hover:shadow-[0_20px_50px_var(--color-glare)] duration-200",
    className,
  );

  return (
    <div className={cls}>
      <span className="bg-bg-contrast-20 p-5 rounded-lg text-font-contrast">
        {icon}
      </span>
      <h3 className="text-2xl font-bold text-font-primary mt-6">{title}</h3>
      <p className="text-lg text-font-secondary mt-2.5">{description}</p>
    </div>
  );
}

export default PosibilityItem;

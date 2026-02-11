interface ISubscriptionInfoItem {
  icon: React.ReactNode;
  title: string;
  value: string;
}

function SubscriptionInfoItem({ icon, title, value }: ISubscriptionInfoItem) {
  return (
    <div className="flex gap-4 items-center">
      <span className="bg-chat-tertiary-bg-hover border border-chat-secondary-border p-5 rounded-full text-primary-font">
        {icon}
      </span>
      <div className="flex flex-col">
        <h3 className="text-primary-font/50 text-sm md:text-base">{title}</h3>
        <h2 className="text-primary-font text-lg md:text-xl font-semibold">
          {value}
        </h2>
      </div>
    </div>
  );
}

export default SubscriptionInfoItem;

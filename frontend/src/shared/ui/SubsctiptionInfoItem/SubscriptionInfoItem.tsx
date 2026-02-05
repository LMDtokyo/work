interface ISubscriptionInfoItem {
  icon: React.ReactNode;
  title: string;
  value: string;
}

function SubscriptionInfoItem({ icon, title, value }: ISubscriptionInfoItem) {
  return (
    <div className="flex gap-4 items-center">
      <span className="bg-chat-tertiary-bg-hover p-5 rounded-full text-font-primary">
        {icon}
      </span>
      <div className="flex flex-col">
        <h3 className="text-font-primary/50">{title}</h3>
        <h2 className="text-font-primary text-xl">{value}</h2>
      </div>
    </div>
  );
}

export default SubscriptionInfoItem;

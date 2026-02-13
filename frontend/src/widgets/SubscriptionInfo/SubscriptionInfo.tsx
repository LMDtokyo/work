import { AlarmClock, BriefcaseBusiness, KeyRound, Wallet } from "lucide-react";
import SubscriptionInfoItem from "../../shared/ui/SubsctiptionInfoItem/SubscriptionInfoItem";
import PeriodSwitcher from "../../shared/ui/PeriodSwitcher/PeriodSwitcher";

const infoItems = [
  {
    icon: <BriefcaseBusiness className="w-5 h-5 sm:w-6 sm:h-5" />,
    title: "Тип подписки",
    value: "Premium",
  },
  {
    icon: <Wallet className="w-5 h-5 sm:w-6 sm:h-5" />,
    title: "Цена тарифа",
    value: "Бесплатно",
  },
  {
    icon: <KeyRound className="w-5 h-5 sm:w-6 sm:h-5" />,
    title: "Кол-во аккаунтов",
    value: "3 аккаунта",
  },
  {
    icon: <AlarmClock className="w-5 h-5 sm:w-6 sm:h-5" />,
    title: "Действует до",
    value: "Бессрочно",
  },
];

function SubscriptionInfo() {
  return (
    <div className="flex flex-col gap-4 justify-between bg-chat-secondary-bg rounded-2xl md:rounded-4xl w-full py-4 px-4 md:px-10 md:py-8 animate-fade-in-bottom border border-chat-primary-border">
      <div className="flex flex-col gap-5 items-start md:flex-row md:items-center md:justify-between">
        <div className="flex flex-col gap-1 sm:gap-0">
          <h1 className="text-primary-font text-base sm:text-lg md:text-xl font-semibold">
            Подписка
          </h1>
          <p className="text-secondary-font text-xs sm:text-sm md:text-base">
            Cледите за информацией о своей подписке
          </p>
        </div>
        <PeriodSwitcher />
      </div>
      <div className="flex flex-wrap justify-centerg gap-7 md:justify-between items-center bg-chat-tertiary-bg py-4 sm:py-6 px-4 md:px-8 pr-10 rounded-3xl border border-chat-secondary-border">
        {infoItems.map((item) => (
          <SubscriptionInfoItem
            key={item.title}
            icon={item.icon}
            title={item.title}
            value={item.value}
          />
        ))}
      </div>
    </div>
  );
}

export default SubscriptionInfo;

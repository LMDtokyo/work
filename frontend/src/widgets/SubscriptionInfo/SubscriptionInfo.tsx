import { AlarmClock, BriefcaseBusiness, KeyRound, Wallet } from "lucide-react";
import SubscriptionInfoItem from "../../shared/ui/SubsctiptionInfoItem/SubscriptionInfoItem";
import PeriodSwitcher from "../../shared/ui/PeriodSwitcher/PeriodSwitcher";

const infoItems = [
  {
    icon: <BriefcaseBusiness />,
    title: "Тип подписки",
    value: "Premium",
  },
  {
    icon: <Wallet />,
    title: "Цена тарифа",
    value: "Бесплатно",
  },
  {
    icon: <KeyRound />,
    title: "Кол-во аккаунтов",
    value: "3 аккаунта",
  },
  {
    icon: <AlarmClock />,
    title: "Действует до",
    value: "Бессрочно",
  },
];

function SubscriptionInfo() {
  return (
    <div className="flex flex-col gap-10 justify-between bg-chat-secondary-bg rounded-4xl w-full py-8 px-12 pr-15 animate-fade-in-bottom">
      <div className="flex justify-between items-center">
        <div>
            <h1 className="text-font-primary text-2xl font-semibold">Подписка</h1>
            <p className="text-font-primary/50">
            Cледите за информацией о своей подписке
            </p>
        </div>
        <PeriodSwitcher />
      </div>
      <div className="flex justify-between items-center">
        {infoItems.map((item, i) => (
          <>
            {i === 0 ? (
                <div className="bg-chat-tertiary-bg py-2 px-2 pr-10 rounded-full border border-secondary-border">
                    <SubscriptionInfoItem
                      key={item.title}
                      icon={item.icon}
                      title={item.title}
                      value={item.value}
                    />
                </div>
            ) : (
              <SubscriptionInfoItem
                key={item.title}
                icon={item.icon}
                title={item.title}
                value={item.value}
              />
            )}
          </>
        ))}
      </div>
    </div>
  );
}

export default SubscriptionInfo;

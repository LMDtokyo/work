import { SubscriptionType } from "../../shared/ui/SubscribeItem/SubscribeItem";

interface SubscriptionData {
  type: SubscriptionType;
  title: string;
  price: number;
  accounts: number;
  advantages: string[];
}

const basePlans: Omit<SubscriptionData, "price">[] = [
  {
    type: SubscriptionType.BASIC,
    title: "Базовый план",
    accounts: 3,
    advantages: ["Бесплатно", "Доступ ко всем агрегаторам"],
  },
  {
    type: SubscriptionType.PRO,
    title: "Pro план",
    accounts: 25,
    advantages: ["Cистема уведомлений", "Приоритетная поддержка"],
  },
  {
    type: SubscriptionType.PRO_MAX,
    title: "Pro Max план",
    accounts: 50,
    advantages: ["Cистема уведомлений", "Приоритетная поддержка"],
  },
  {
    type: SubscriptionType.VIP,
    title: "VIP план",
    accounts: 100,
    advantages: ["Cистема уведомлений", "Приоритетная поддержка"],
  },
];

const monthlyPrices = [0, 3990, 15990, 29990];
const yearlyPrices = [0, 39900, 100000, 200000];

export const dataMonth: SubscriptionData[] = basePlans.map((plan, index) => ({
  ...plan,
  price: monthlyPrices[index],
}));

export const dataYear: SubscriptionData[] = basePlans.map((plan, index) => ({
  ...plan,
  price: yearlyPrices[index],
}));

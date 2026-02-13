import { CircleCheck } from "lucide-react";
import { Link } from "react-router-dom";

const SubscriptionType = {
  BASIC: 1,
  PRO: 2,
  PRO_MAX: 3,
  VIP: 4,
} as const;

type SubscriptionType =
  (typeof SubscriptionType)[keyof typeof SubscriptionType];

interface ISubscribeItem {
  type: SubscriptionType;
  title: string;
  price: number;
  accounts: number;
  advantages: string[];
  color: string;
}

function SubscribeItem({
  type,
  title,
  price,
  accounts,
  advantages,
  color,
}: ISubscribeItem) {
  return (
    <div
      className={`flex flex-col gap-5 sm:gap-7 border rounded-2xl sm:rounded-3xl md:rounded-4xl relative p-4 sm:p-6 md:p-8 overflow-hidden ${color === "landing" ? "bg-landing-secondary-bg border-landing-border" : "bg-chat-tertiary-bg border-chat-secondary-border"}`}
    >
      <div
        className={`absolute top-0 left-0 px-4 sm:px-6 md:px-7 py-5 w-full h-15 sm:h-18 md:h-22 flex justify-between overflow-hidden items-center border-b z-99 ${color === "landing" ? "border-b-landing-border" : "border-b-chat-secondary-border"}`}
      >
        <h2 className="text-primary-font text-sm sm:text-lg md:text-xl font-bold z-99">
          {title}
        </h2>
        <span
          className={`text-primary-font/20 text-[60px] sm:text-[80px] md:text-[100px] absolute right-3 min-[330px]:right-10 -bottom-6 sm:-bottom-8 md:-bottom-11 font-bold z-99 ${type === SubscriptionType.VIP && "text-primary-font/70"}`}
        >
          {type}
        </span>

        {type === SubscriptionType.BASIC ? (
          <div className="absolute -bottom-10 -left-10 rotate-12 blur-[50px] w-48 h-25 bg-subscription-light-purple-bg rounded-full"></div>
        ) : type === SubscriptionType.PRO ? (
          <>
            <div className="absolute -bottom-15 left-0 blur-xl w-30 h-26.25 bg-subscription-yellow-bg rounded-full"></div>
            <div className="absolute -bottom-13 left-33 blur-xl w-27.5 h-23 bg-subscription-blue-bg rounded-full"></div>
            <div className="absolute -bottom-10 -right-10 blur-xl w-27.5 h-25 bg-subscription-sea-blue-bg rounded-full"></div>
          </>
        ) : type === SubscriptionType.PRO_MAX ? (
          <>
            <div className="absolute -bottom-40 left-5 blur-xl rotate-90 w-41.25 h-55 bg-subscription-light-pink-bg rounded-full"></div>
            <div className="absolute -bottom-35 -right-3 blur-xl rotate-85 w-38.75 h-55 bg-subscription-pink-bg rounded-full"></div>
          </>
        ) : null}
      </div>

      <div className="flex flex-col gap-1 mt-18 sm:mt-23 md:mt-25 z-99">
        <h2 className="text-primary-font text-lg sm:text-xl md:text-2xl font-semibold">
          {type === 1 ? "Бесплатно" : "₽" + price}
        </h2>
        <p className="text-primary-font text-sm sm:text-base">
          {accounts}{" "}
          <span className="text-primary-font/50">
            {type === SubscriptionType.BASIC ? "аккаунта" : "аккаунтов"}
          </span>
        </p>
      </div>

      <Link
        to=""
        className={`flex items-center justify-center w-full text-xs sm:text-sm md:text-base rounded-full py-3 sm:py-4 font-semibold text-tertiary-font z-99 ${type === SubscriptionType.BASIC ? "bg-current-tarif cursor-default touch-none" : "bg-contrast cursor-pointer hover:scale-102 duration-100"}`}
      >
        {type === SubscriptionType.BASIC
          ? "Текущий план"
          : type === SubscriptionType.PRO
            ? "Обновить до Pro"
            : type === SubscriptionType.PRO_MAX
              ? "Обновить до Pro Max"
              : "Обновить до VIP"}
      </Link>

      <div className="flex flex-col gap-2 sm:gap-3 z-99">
        <h3 className="text-primary-font text-xs sm:text-sm md:text-base">
          {type === SubscriptionType.BASIC
            ? "Для малого бизнеса"
            : type === SubscriptionType.PRO
              ? "Для среднего бизнеса"
              : type === SubscriptionType.PRO_MAX
                ? "Для крупного бизнеса"
                : "VIP-подписка"}
        </h3>
        <div className="flex flex-col gap-1 sm:gap-2">
          {advantages.map((advantage) => (
            <div className="flex items-center gap-2">
              <CircleCheck
                strokeWidth={1}
                className="text-contrast w-4 sm:w-5 md:w-6"
              />
              <p className="text-primary-font text-[10px] sm:text-xs md:text-sm">
                {advantage}
              </p>
            </div>
          ))}
        </div>
      </div>

      {type === SubscriptionType.VIP && (
        <>
          <div className="absolute -top-15 -right-5 blur-2xl -rotate-12 w-76.25 h-43.75 bg-subscription-purple-bg rounded-full z-5"></div>
          <div className="absolute top-13 -right-20 blur-2xl -rotate-12 w-67.5 h-35 bg-subscription-violet-bg rounded-full z-4"></div>
          <div className="absolute top-30 -right-50 blur-xl -rotate-10 w-62.5 h-56.25 bg-subscription-purple-bg rounded-full z-5"></div>
          <div className="absolute bottom-15 -right-32 blur-2xl w-62.5 h-56.25 bg-subscription-violet-bg rounded-full z-4"></div>
        </>
      )}
    </div>
  );
}

export default SubscribeItem;
export { SubscriptionType };

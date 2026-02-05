import { Link } from "react-router-dom";
import AccountSlider from "../../shared/ui/AccountSlider/AccountSlider";
import AccountsCountButtonsList from "../AccountsCountButtonsList/AccountsCountButtonsList";
import { Sparkles } from "lucide-react";
import usePrice from "../../shared/store/usePrice";

function PricesCalculator() {
  const { accounts, price, oneAccountPrice, economyPercentage } = usePrice();

  return (
    <div className="flex flex-col bg-chat-tertiary-bg px-4 sm:px-8 md:px-16 lg:px-28 py-8 sm:py-12 md:py-16 lg:py-20 rounded-2xl sm:rounded-3xl w-full border border-border z-99">
      <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-8 md:gap-10 lg:gap-15">
        <div className="flex items-end gap-2 sm:gap-3">
          <h2 className="font-bold text-4xl sm:text-5xl md:text-6xl lg:text-7xl text-font-primary">
            {accounts}
          </h2>
          <p className="text-font-secondary text-xl sm:text-2xl md:text-3xl lg:text-4xl mb-0.5 sm:mb-1">
            аккаунтов
          </p>
        </div>
        <div className="flex items-end gap-2 sm:gap-3">
          <h2 className="font-bold text-4xl sm:text-5xl md:text-6xl lg:text-7xl bg-linear-to-r from-button-gradient-start to-button-gradient-end bg-clip-text text-transparent">
            {price}
          </h2>
          <p className="text-font-secondary text-xl sm:text-2xl md:text-3xl lg:text-4xl mb-0.5 sm:mb-1">
            ₽/мес.
          </p>
        </div>
      </div>
      <div className="flex flex-col sm:flex-row justify-center items-center gap-4 sm:gap-6 md:gap-8 lg:gap-10 my-6 sm:my-8 md:my-10">
        <h3 className="text-font-primary font-medium text-lg sm:text-xl md:text-2xl">
          {oneAccountPrice} ₽ за аккаунт
        </h3>
        <div className="flex gap-2 sm:gap-3 items-center justify-center bg-bg-contrast-20 rounded-lg px-4 sm:px-5 py-2 sm:py-3">
          <Sparkles className="text-font-contrast w-5 h-5 sm:w-6 sm:h-6" />
          <h3 className="text-font-contrast text-base sm:text-lg md:text-xl font-medium">
            Экономия {economyPercentage}%
          </h3>
        </div>
      </div>
      <AccountSlider className="mb-4 sm:mb-5" />
      <AccountsCountButtonsList />
      <Link
        to="/login"
        className="text-center text-lg sm:text-xl md:text-2xl p-4 sm:p-5 bg-linear-to-b from-button-gradient-start to-button-gradient-end text-font-tertiary px-6 sm:px-8 py-2.5 sm:py-3 rounded-xl outline-none font-semibold cursor-pointer shadow-[0_2px_4px_var(--color-hover-shadow)] hover:shadow-[0_3px_8px_var(--color-hover-shadow)] duration-150 mt-5 sm:mt-6 md:mt-7"
      >
        Подключить {accounts} аккаунтов
      </Link>
    </div>
  );
}

export default PricesCalculator;

import { Link } from "react-router-dom";
import AccountSlider from "../../shared/ui/AccountSlider/AccountSlider";
import AccountsCountButtonsList from "../AccountsCountButtonsList/AccountsCountButtonsList";
import { Sparkles } from "lucide-react";
import usePrice from "../../shared/store/usePrice";

function PricesCalculator() {
  const { accounts, price, oneAccountPrice, economyPercentage } = usePrice();

  return (
    <div className="flex flex-col bg-chat-tertiary-bg px-28 py-20 rounded-3xl w-full border border-border z-99">
      <div className="flex items-center justify-center gap-15">
        <div className="flex items-end gap-3">
          <h2 className="font-bold text-7xl text-font-primary">{accounts}</h2>
          <p className="text-font-secondary text-4xl mb-1">аккаунтов</p>
        </div>
        <div className="flex items-end gap-3">
          <h2 className="font-bold text-7xl bg-linear-to-r from-button-gradient-start to-button-gradient-end bg-clip-text text-transparent">
            {price}
          </h2>
          <p className="text-font-secondary text-4xl mb-1">₽/мес.</p>
        </div>
      </div>
      <div className="flex justify-center items-center gap-10 my-10">
        <h3 className="text-font-primary font-medium text-2xl">
          {oneAccountPrice} ₽ за аккаунт
        </h3>
        <div className="flex gap-3 items-center justify-center bg-bg-contrast-20 rounded-lg px-5 py-3">
          <Sparkles className="text-font-contrast" />
          <h3 className="text-font-contrast text-xl font-medium">
            Экономия {economyPercentage}%
          </h3>
        </div>
      </div>
      <AccountSlider className="mb-5" />
      <AccountsCountButtonsList />
      <Link
        to="/login"
        className="text-center text-2xl p-5 bg-linear-to-b from-button-gradient-start to-button-gradient-end text-font-tertiary px-8 py-3 rounded-xl outline-none font-semibold cursor-pointer shadow-[0_2px_4px_var(--color-hover-shadow)] hover:shadow-[0_3px_8px_var(--color-hover-shadow)] duration-150 mt-7"
      >
        Подключить {accounts} аккаунтов
      </Link>
    </div>
  );
}

export default PricesCalculator;

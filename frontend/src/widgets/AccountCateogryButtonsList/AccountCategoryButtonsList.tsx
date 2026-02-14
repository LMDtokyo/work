import AllAccountsIcon from "../../shared/assets/AllAccountsIcon";
import AvitoIcon from "../../shared/assets/AvitoIcon";
import TelegramIcon from "../../shared/assets/TelegramIcon";
import WildberriesIcon from "../../shared/assets/WildberriesIcon";
import useAccountCategory from "../../shared/store/useAccountCategory";
import AccountCategoryButton from "../../shared/ui/AccountCategoryButton/AccountCategoryButton";

function AccountCategoryButtonsList() {
  const setCategory = useAccountCategory((state) => state.setCategory);

  return (
    <div className="flex flex-col gap-2">
      <AccountCategoryButton
        onClick={() => setCategory("wildberries")}
        icon={
          <WildberriesIcon
            width={47}
            height={47}
            className="w-10 h-10 sm:w-11.75 sm:h-11.75"
          />
        }
        title="Wildberries"
        accounts={20}
      />
      <AccountCategoryButton
        onClick={() => setCategory("avito")}
        icon={
          <AvitoIcon
            width={47}
            height={47}
            className="w-10 h-10 sm:w-11.75 sm:h-11.75"
          />
        }
        title="Avito"
        accounts={20}
      />
      <AccountCategoryButton
        onClick={() => setCategory("telegram")}
        icon={
          <TelegramIcon
            width={47}
            height={47}
            className="w-10 h-10 sm:w-11.75 sm:h-11.75"
          />
        }
        title="Telegram"
        accounts={20}
      />
      <AccountCategoryButton
        onClick={() => setCategory("all")}
        icon={
          <AllAccountsIcon
            width={47}
            height={47}
            className="w-10 h-10 sm:w-11.75 sm:h-11.75"
          />
        }
        title="Все аккаунты"
        accounts={20}
      />
    </div>
  );
}

export default AccountCategoryButtonsList;

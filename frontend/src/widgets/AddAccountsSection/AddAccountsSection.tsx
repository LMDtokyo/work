import AccountSlider from "../../shared/ui/AccountSlider/AccountSlider";
import AddAccountFilter from "../../shared/ui/AddAccountsFilter/AddAccountsFilter";
import AddAccountsInfo from "../../shared/ui/AddAccountsInfo/AddAccountsInfo";

function AddAccountsSection() {
  const handleSubmit = () => {
    console.log("++");
  };

  return (
    <div className="flex flex-col gap-4 bg-chat-secondary-bg w-full rounded-2xl md:rounded-3xl border border-chat-primary-border py-4 md:py-6 px-5 md:px-10 animate-fade-in-bottom">
      <div className="flex flex-col gap-5 min-[900px]:flex-row min-[900px]:items-center justify-between">
        <div className="flex flex-col gap-1 text-primary-font">
          <h2 className="font-semibold text-base sm:text-lg md:text-xl">
            Добавить аккаунты
          </h2>
          <p className="text-secondary-font text-xs sm:text-sm md:text-basic">
            Добавьте необходимое количество аккаунтов
          </p>
        </div>
        <div className="flex flex-col gap-2 min-[500px]:flex-row">
          <AddAccountFilter />
          <AddAccountsInfo />
        </div>
      </div>
      <form className="flex flex-col gap-6" onSubmit={handleSubmit}>
        <AccountSlider />
        <button className="bg-contrast rounded-full w-full py-2 sm:py-3 text-tertiary-font cursor-pointer hover:scale-101 duration-100">
          Добавить
        </button>
      </form>
    </div>
  );
}

export default AddAccountsSection;

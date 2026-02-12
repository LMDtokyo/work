import AddAccountsSection from "../../../widgets/AddAccountsSection/AddAccountsSection";
import SubscribeItemsList from "../../../widgets/SubscribeItemsList/SubscribeItemsList";
import SubscriptionInfo from "../../../widgets/SubscriptionInfo/SubscriptionInfo";

export const Subscription = () => {
  return (
    <div className="bg-chat-primary-bg w-full h-screen overflow-auto flex flex-col gap-2 justify-start items-start relative pb-4">
      <SubscriptionInfo />
      <AddAccountsSection />
      <div className="flex flex-col gap-5 bg-chat-secondary-bg rounded-3xl border border-chat-primary-border px-10 py-8 w-full animate-fade-in-bottom">
        <div>
          <h2 className="font-semibold text-primary-font text-xl md:text-2xl">
            Тарифы
          </h2>
          <p className="text-secondary-font text-sm md:text-base">
            Выберите план необходимый вашему бизнесу
          </p>
        </div>
        <SubscribeItemsList color="chat" />
      </div>
    </div>
  );
};

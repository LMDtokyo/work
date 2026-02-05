import SubscribeItemsList from "../../../widgets/SubscribeItemsList/SubscribeItemsList";
import SubscriptionInfo from "../../../widgets/SubscriptionInfo/SubscriptionInfo";

export const Subscription = () => {
  return (
    <div className="bg-chat-bg w-full h-screen flex flex-col gap-10 justify-start items-start overflow-hidden relative pb-4">
      <SubscriptionInfo />
      <SubscribeItemsList />
    </div>
  );
};

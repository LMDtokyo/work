import SubscribeItemsList from "../../../widgets/SubscribeItemsList/SubscribeItemsList";
import SubscriptionInfo from "../../../widgets/SubscriptionInfo/SubscriptionInfo";

export const Subscription = () => {
  return (
    <div className="bg-chat-primary-bg w-full h-screen overflow-auto lg:overflow-hidden flex flex-col gap-6 justify-start items-start relative pb-4">
      <SubscriptionInfo />
      <SubscribeItemsList color="chat" />
    </div>
  );
};

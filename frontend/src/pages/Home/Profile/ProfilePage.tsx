import Accounts from "../../../widgets/Accounts/Accounts";
import Transactions from "../../../widgets/Transactions/Transactions";
import UserInfo from "../../../widgets/UserInfo/UserInfo";

export const Profile = () => {
  return (
    <div className="bg-chat-primary-bg w-full h-screen flex flex-col min-[1000px]:flex-row gap-2 justify-start items-start overflow-auto relative sm:pb-4">
      <div className="flex flex-col gap-2 w-full min-[1000px]:h-full">
        <UserInfo />
        <Accounts />
      </div>
      <Transactions />
    </div>
  );
};

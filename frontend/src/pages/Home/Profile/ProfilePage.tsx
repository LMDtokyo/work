import Accounts from "../../../widgets/Accounts/Accounts";
import Transactions from "../../../widgets/Transactions/Transactions";
import UserInfo from "../../../widgets/UserInfo/UserInfo";

export const Profile = () => {
  return (
    <div className="bg-chat-bg w-full h-screen flex gap-2 justify-center items-start overflow-hidden relative pb-4">
      <div className="flex flex-col gap-2 w-full h-full">
        <UserInfo />
        <Accounts />
      </div>
      <Transactions />
    </div>
  );
};

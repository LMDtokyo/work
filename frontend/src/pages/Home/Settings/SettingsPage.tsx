import ChangePasswordForm from "../../../widgets/Forms/ChangePasswordForm/ChangePasswordForm";
import UserInfo from "../../../widgets/UserInfo/UserInfo";

export const Settings = () => {
  return (
    <div className="bg-chat-bg w-full h-screen flex flex-col gap-2 justify-start items-start overflow-hidden relative pb-4">
      <UserInfo />
      <ChangePasswordForm />
    </div>
  );
};

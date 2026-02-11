import ChangePasswordForm from "../../../widgets/Forms/ChangePasswordForm/ChangePasswordForm";
import SettingsThemeChanger from "../../../widgets/SettingsThemeChanger/SettingsThemeChanger";
import UserInfo from "../../../widgets/UserInfo/UserInfo";

export const Settings = () => {
  return (
    <div className="bg-chat-primary-bg w-full h-screen flex flex-col gap-2 justify-start items-start overflow-auto lg:overflow-hidden relative pb-4">
      <div className="flex flex-col w-full gap-2 md:flex-row">
        <UserInfo />
        <SettingsThemeChanger />
      </div>
      <ChangePasswordForm />
    </div>
  );
};

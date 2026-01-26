import BackButton from "../../../shared/ui/BackButton/BackButton";
import RecoveryPasswordForm from "../../../widgets/Forms/RecoveryPasswordForm/RecoveryPasswordForm";

export const RecoveryPassword = () => {
  return (
    <div className="w-full h-svh flex flex-col justify-center items-center bg-auth-bg overflow-hidden relative">
      <BackButton className="absolute left-8 top-6" link="/login" />
      <RecoveryPasswordForm />
      <div className="w-165 h-165 bg-glare absolute rounded-full -left-82.5 -bottom-82.5 blur-[200px]"></div>
      <div className="w-165 h-165 bg-glare absolute rounded-full -top-82.5 -right-82.5 blur-[200px]"></div>
    </div>
  );
};

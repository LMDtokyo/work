import BackButton from "../../../shared/ui/BackButton/BackButton";
import VerifyCodeForm from "../../../widgets/Forms/VerifyCodeForm/VerifyCodeForm";

export const VerifyCode = () => {
  return (
    <div className="w-full h-svh flex flex-col justify-center items-center bg-auth-bg overflow-hidden relative">
      <BackButton className="absolute left-8 top-6" link="/recovery-password" />
      <VerifyCodeForm />
      <div className="w-165 h-165 bg-glare absolute rounded-full -left-82.5 -bottom-82.5 blur-[200px]"></div>
      <div className="w-165 h-165 bg-glare absolute rounded-full -top-82.5 -right-82.5 blur-[200px]"></div>
    </div>
  );
};

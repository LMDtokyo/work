import BackButton from "../../../shared/ui/BackButton/BackButton";
import RecoveryPasswordForm from "../../../widgets/Forms/RecoveryPasswordForm/RecoveryPasswordForm";

export const RecoveryPassword = () => {
  return (
    <div className="w-full h-svh flex flex-col justify-center items-center bg-auth-bg overflow-hidden relative px-4 sm:px-6">
      <BackButton
        className="absolute left-4 sm:left-6 md:left-8 top-4 sm:top-5 md:top-6"
        link="/login"
      />
      <RecoveryPasswordForm />
      <div className="w-40 h-40 sm:w-80 sm:h-80 md:w-120 md:h-120 lg:w-165 lg:h-165 bg-glare absolute rounded-full -left-20 sm:-left-40 md:-left-60 lg:-left-82.5 -bottom-20 sm:-bottom-40 md:-bottom-60 lg:-bottom-82.5 blur-[100px] sm:blur-[150px] md:blur-[200px]"></div>
      <div className="w-40 h-40 sm:w-80 sm:h-80 md:w-120 md:h-120 lg:w-165 lg:h-165 bg-glare absolute rounded-full -top-20 sm:-top-40 md:-top-60 lg:-top-82.5 -right-20 sm:-right-40 md:-right-60 lg:-right-82.5 blur-[100px] sm:blur-[150px] md:blur-[200px]"></div>
    </div>
  );
};

import { Link } from "react-router-dom";
import BackButton from "../../../shared/ui/BackButton/BackButton";
import SignupForm from "../../../widgets/Forms/SignupForm/SignupForm";

export const Signup = () => {
  return (
    <div className="w-full h-svh flex flex-col justify-center items-center bg-landing-primary-bg overflow-hidden relative px-4 sm:px-6">
      <BackButton
        className="absolute left-4 sm:left-6 md:left-8 top-4 sm:top-5 md:top-6"
        link="/login"
      />
      <SignupForm />
      <p className="text-primary-font absolute bottom-4 w-full max-w-[320px] sm:max-w-100 md:max-w-120 text-center text-xs sm:text-sm px-4">
        Нажимая кнопку, вы соглашаетесь с{" "}
        <Link
          to="/offer"
          className="text-contrast underline-offset-2 underline hover:text-contrast-hover"
        >
          Условиями использования
        </Link>
        , даете согласие на{" "}
        <Link
          to="/privacy-policy"
          className="text-contrast underline-offset-2 underline hover:text-contrast-hover"
        >
          обработку данных
        </Link>{" "}
        и принимаете{" "}
        <Link
          to="/offer"
          className="text-contrast underline-offset-2 underline hover:text-contrast-hover"
        >
          оферту
        </Link>{" "}
        MANITO.
      </p>
      <div className="w-40 h-40 sm:w-80 sm:h-80 md:w-120 md:h-120 lg:w-165 lg:h-165 bg-glare absolute rounded-full -left-20 sm:-left-40 md:-left-60 lg:-left-82.5 -bottom-20 sm:-bottom-40 md:-bottom-60 lg:-bottom-82.5 blur-[100px] sm:blur-[150px] md:blur-[200px]"></div>
      <div className="w-40 h-40 sm:w-80 sm:h-80 md:w-120 md:h-120 lg:w-165 lg:h-165 bg-glare absolute rounded-full -top-20 sm:-top-40 md:-top-60 lg:-top-82.5 -right-20 sm:-right-40 md:-right-60 lg:-right-82.5 blur-[100px] sm:blur-[150px] md:blur-[200px]"></div>
    </div>
  );
};

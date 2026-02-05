import { Link } from "react-router-dom";
import BackButton from "../../../shared/ui/BackButton/BackButton";
import LoginForm from "../../../widgets/Forms/LoginForm/LoginForm";

export const Login = () => {
  return (
    <div className="w-full h-svh flex flex-col justify-center items-center bg-auth-bg overflow-hidden relative duration-150 px-4 sm:px-6">
      <BackButton
        className="absolute left-4 sm:left-6 md:left-8 top-4 sm:top-5 md:top-6"
        link="/"
      />
      <LoginForm />
      <p className="text-font-primary absolute bottom-4 w-full max-w-[320px] sm:max-w-[400px] md:max-w-[480px] text-center text-xs sm:text-sm px-4">
        Нажимая кнопку, вы соглашаетесь с{" "}
        <Link
          to="/offer"
          className="text-font-contrast underline-offset-2 underline hover:text-hover-font-contrast"
        >
          Условиями использования
        </Link>
        , даете согласие на{" "}
        <Link
          to="/privacy-policy"
          className="text-font-contrast underline-offset-2 underline hover:text-hover-font-contrast"
        >
          обработку данных
        </Link>{" "}
        и принимаете{" "}
        <Link
          to="/offer"
          className="text-font-contrast underline-offset-2 underline hover:text-hover-font-contrast"
        >
          оферту
        </Link>{" "}
        MANITO.
      </p>
      <div className="w-40 h-40 sm:w-80 sm:h-80 md:w-120 md:h-120 lg:w-150 lg:h-150 bg-glare absolute rounded-full -left-20 sm:-left-40 md:-left-60 lg:-left-82.5 -bottom-20 sm:-bottom-40 md:-bottom-60 lg:-bottom-82.5 blur-[100px] sm:blur-[150px] md:blur-[200px] animate-fade-in-glare"></div>
      <div className="w-40 h-40 sm:w-80 sm:h-80 md:w-120 md:h-120 lg:w-150 lg:h-150 bg-glare absolute rounded-full -top-20 sm:-top-40 md:-top-60 lg:-top-82.5 -right-20 sm:-right-40 md:-right-60 lg:-right-82.5 blur-[100px] sm:blur-[150px] md:blur-[200px] animate-fade-in-glare"></div>
    </div>
  );
};

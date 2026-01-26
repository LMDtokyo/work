import { Link } from "react-router-dom";
import BackButton from "../../../shared/ui/BackButton/BackButton";
import LoginForm from "../../../widgets/Forms/LoginForm/LoginForm";

export const Login = () => {
  return (
    <div className="w-full h-svh flex flex-col justify-center items-center bg-auth-bg overflow-hidden relative duration-150">
      <BackButton className="absolute left-8 top-6" link="/" />
      <LoginForm />
      <p className="text-font-primary absolute bottom-4 w-120 text-center text-sm">
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
      <div className="w-150 h-150 bg-glare absolute rounded-full -left-82.5 -bottom-82.5 blur-[200px] animate-fade-in-glare"></div>
      <div className="w-150 h-150 bg-glare absolute rounded-full -top-82.5 -right-82.5 blur-[200px] animate-fade-in-glare"></div>
    </div>
  );
};

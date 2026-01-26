import { useNavigate } from "react-router-dom";
import AuthButton from "../../../shared/ui/AuthButton/AuthButton";

export const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="w-full h-svh bg-auth-bg flex flex-col justify-center items-center relative overflow-hidden">
      <div className="flex flex-col gap-4 justify-center items-center">
        <h1 className="font-bold text-6xl text-font-primary">404</h1>
        <h3 className="text-2xl font-medium text-font-primary">
          Такой страницы не существует
        </h3>
      </div>
      <AuthButton text="Вернуться назад" onClick={() => navigate(-1)} />
      <div className="w-165 h-165 bg-glare absolute rounded-full -left-82.5 -bottom-82.5 blur-[200px]"></div>
      <div className="w-165 h-165 bg-glare absolute rounded-full -top-82.5 -right-82.5 blur-[200px]"></div>
    </div>
  );
};

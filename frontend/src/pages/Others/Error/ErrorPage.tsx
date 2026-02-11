import {
  useNavigate,
  useRouteError,
  isRouteErrorResponse,
} from "react-router-dom";
import AuthButton from "../../../shared/ui/AuthButton/AuthButton";

export const ErrorPage = () => {
  const navigate = useNavigate();
  const error = useRouteError();

  let errorMessage = "Произошла непредвиденная ошибка";
  let errorCode = "Ошибка";

  if (isRouteErrorResponse(error)) {
    errorCode = String(error.status);
    errorMessage = error.statusText || errorMessage;
  } else if (error instanceof Error) {
    errorMessage = error.message;
  }

  const handleReload = () => {
    window.location.reload();
  };

  return (
    <div className="w-full h-svh bg-landing-primary-bg flex flex-col justify-center items-center relative overflow-hidden px-4">
      <div className="flex flex-col gap-4 justify-center items-center text-center">
        <h1 className="font-bold text-4xl sm:text-5xl md:text-6xl text-primary-font">
          {errorCode}
        </h1>
        <h3 className="text-lg sm:text-xl md:text-2xl font-medium text-primary-font max-w-md">
          {errorMessage}
        </h3>
        <p className="text-sm text-secondary-font max-w-sm">
          Попробуйте обновить страницу или вернуться назад
        </p>
      </div>
      <div className="flex flex-col sm:flex-row gap-3 mt-6 w-full max-w-xs sm:max-w-md">
        <AuthButton text="Обновить" onClick={handleReload} />
        <AuthButton text="Назад" onClick={() => navigate(-1)} />
      </div>
      <div className="w-40 h-40 sm:w-80 sm:h-80 md:w-120 md:h-120 lg:w-165 lg:h-165 bg-glare absolute rounded-full -left-20 sm:-left-40 md:-left-60 lg:-left-82.5 -bottom-20 sm:-bottom-40 md:-bottom-60 lg:-bottom-82.5 blur-[100px] sm:blur-[150px] md:blur-[200px]"></div>
      <div className="w-40 h-40 sm:w-80 sm:h-80 md:w-120 md:h-120 lg:w-165 lg:h-165 bg-glare absolute rounded-full -top-20 sm:-top-40 md:-top-60 lg:-top-82.5 -right-20 sm:-right-40 md:-right-60 lg:-right-82.5 blur-[100px] sm:blur-[150px] md:blur-[200px]"></div>
    </div>
  );
};

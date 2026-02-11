import AuthButton from "../../../shared/ui/AuthButton/AuthButton";
import AuthInput from "../../../shared/ui/AuthInput/AuthInput";
import { useCountdown } from "../../../shared/hooks";

function VerifyCodeForm() {
  const { isRunning, formatted, reset } = useCountdown(120);

  return (
    <form className="animate-fade-in-bottom w-full max-w-[320px] sm:max-w-[400px] md:max-w-[500px]">
      <div className="flex flex-col gap-1 items-center">
        <h1 className="text-primary-font font-bold text-xl sm:text-2xl md:text-[28px] lg:text-[32px] text-center">
          Восстановление пароля
        </h1>
        <h3 className="text-secondary-font font-normal text-sm sm:text-base max-w-[280px] sm:max-w-[360px] md:max-w-120 text-center">
          На вашу почту был отправлен код восставновления. Пожалуйста, введите
          его в данное поле
        </h3>
      </div>
      <div className="flex flex-col gap-4 sm:gap-5 mt-6 sm:mt-8 md:mt-10">
        <AuthInput
          isPassword={false}
          placeholder="Код"
          maxLength={6}
          autoFocus
        />
      </div>
      <AuthButton text="Подтвердить" />
      {isRunning ? (
        <p className="text-primary-font text-center text-xs sm:text-sm mt-4 sm:mt-5">
          Отправить код повторно через:{" "}
          <span className="text-contrast">{formatted}</span>
        </p>
      ) : (
        <p
          className="text-contrast text-center text-xs sm:text-sm mt-4 sm:mt-5 cursor-pointer underline-offset-2 underline"
          onClick={() => reset(120)}
        >
          Отправить код повторно
        </p>
      )}
    </form>
  );
}

export default VerifyCodeForm;

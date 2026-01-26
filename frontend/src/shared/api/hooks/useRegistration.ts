import { useMutation } from "@tanstack/react-query";
import fetchRegister from "../requests/register";
import type { UseFormReset } from "react-hook-form";
import type { ISignupForm } from "../../../widgets/Forms/SignupForm/types";

function useRegistration(reset: UseFormReset<ISignupForm>) {
  return useMutation({
    mutationFn: fetchRegister,
    onSuccess: (data) => {
      if (!data.isSuccess && data.errors.length > 0) {
        console.log(data.errors[0].description);
      } else {
        console.log("Успешная регистрация: ", data);
      }
      reset();
    },
    onError: (error) => {
      console.log("Ошибка регистрации: ", error);
    },
  });
}

export default useRegistration;

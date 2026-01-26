import { useMutation } from "@tanstack/react-query";
import type { UseFormReset } from "react-hook-form";
import type { ISignupForm } from "../../../widgets/Forms/SignupForm/types";
import fetchLogin from "../requests/login";
import { useNavigate } from "react-router-dom";

function useLogin(reset: UseFormReset<ISignupForm>) {
  const navigate = useNavigate();

  return useMutation({
    mutationFn: fetchLogin,
    onSuccess: (data) => {
      if (!data.isSuccess && data.errors.length > 0) {
        console.log(data.errors[0].description);
      } else {
        localStorage.setItem("accessToken", data.data.accessToken);
        localStorage.setItem("refreshToken", data.data.refreshToken);
        localStorage.setItem("userId", data.data.userId);
      }
      reset();
      navigate("/app");
    },
    onError: (error) => {
      console.log("Ошибка авторизации: ", error);
    },
  });
}

export default useLogin;

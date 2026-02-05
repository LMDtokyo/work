import { AxiosError } from "axios";

interface ApiErrorResponse {
  isSuccess: false;
  errors?: Array<{ description: string }>;
}

interface ValidationErrorResponse {
  message?: string;
  errors?: string[];
}

type ErrorResponse =
  | ApiErrorResponse
  | ValidationErrorResponse
  | string
  | null
  | undefined;

const errorMessages: Record<string, string> = {
  "Invalid credentials": "Неверный email или пароль",
  "Invalid email or password": "Неверный email или пароль",
  "User not found": "Пользователь не найден",
  "User already exists": "Пользователь с таким email уже существует",
  "Email already exists": "Пользователь с таким email уже существует",
  "Email is already taken": "Пользователь с таким email уже существует",
  "Invalid email format": "Некорректный формат email",
  "Password is too short": "Пароль слишком короткий",
  "Password is too weak": "Пароль слишком простой",
  "Invalid token": "Сессия истекла, войдите заново",
  "Token expired": "Сессия истекла, войдите заново",
  Unauthorized: "Необходима авторизация",
  "Access denied": "Доступ запрещён",
  "Network Error": "Ошибка сети. Проверьте подключение к интернету",
  "Request failed with status code 500": "Ошибка сервера. Попробуйте позже",
  "Request failed with status code 429":
    "Слишком много запросов. Подождите немного",
};

function translateError(message: string): string {
  const lowerMessage = message.toLowerCase();

  for (const [key, value] of Object.entries(errorMessages)) {
    if (lowerMessage.includes(key.toLowerCase())) {
      return value;
    }
  }

  return message;
}

function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

export function extractErrorMessage(error: unknown, fallback: string): string {
  if (error instanceof Error) {
    return translateError(error.message);
  }

  if (typeof error === "string") {
    return translateError(error);
  }

  return fallback;
}

export function handleApiError(error: unknown, fallback: string): never {
  if (error instanceof AxiosError) {
    if (!error.response) {
      throw new Error(errorMessages["Network Error"]);
    }

    const status = error.response.status;

    if (status === 429) {
      throw new Error("Слишком много запросов. Подождите минуту");
    }

    if (status === 500 || status === 502 || status === 503) {
      throw new Error("Ошибка сервера. Попробуйте позже");
    }

    const responseData = error.response.data as ErrorResponse;

    if (typeof responseData === "string" && responseData.length > 0) {
      throw new Error(translateError(responseData));
    }

    if (!isObject(responseData)) {
      throw new Error(fallback);
    }

    if ("errors" in responseData && Array.isArray(responseData.errors)) {
      const firstError = responseData.errors[0];

      if (typeof firstError === "string") {
        throw new Error(translateError(firstError));
      }

      if (isObject(firstError) && "description" in firstError) {
        throw new Error(translateError(String(firstError.description)));
      }
    }

    if ("message" in responseData && typeof responseData.message === "string") {
      throw new Error(translateError(responseData.message));
    }

    throw new Error(fallback);
  }

  if (error instanceof Error) {
    throw new Error(translateError(error.message));
  }

  throw new Error(fallback);
}

import { chatApi } from "../../config/api/chatApi";
import { handleApiError } from "../utils/errorHandler";

export interface Chat {
  id: string;
  name: string;
  avatar: string | null;
  lastMessage: string | null;
  lastMessageTime: string | null;
  unreadCount: number;
}

interface ApiResponse<T> {
  isSuccess: boolean;
  data: T | null;
  errors?: Array<{ description: string }>;
}

export async function getChats(): Promise<Chat[]> {
  try {
    const { data } = await chatApi.get<ApiResponse<Chat[]>>("/");

    if (!data.isSuccess) {
      const msg = data.errors?.[0]?.description || "Не удалось загрузить чаты";
      throw new Error(msg);
    }

    return data.data || [];
  } catch (error) {
    handleApiError(error, "Ошибка загрузки чатов");
    throw error;
  }
}

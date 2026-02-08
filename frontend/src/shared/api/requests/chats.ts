import { chatApi } from "../../config/api/chatApi";
import { handleApiError } from "../utils/errorHandler";

export interface Chat {
  id: string;
  name: string;
  avatar: string | null;
  lastMessage: string | null;
  lastMessageTime: string | null;
  unreadCount: number;
  platform: string;
}

interface ApiResponse<T> {
  isSuccess: boolean;
  data: T | null;
  errors?: Array<{ description: string }>;
}

export async function getChats(): Promise<Chat[]> {
  try {
    const { data } = await chatApi.get<ApiResponse<Chat[]>>("");

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

export async function markChatAsRead(chatId: string): Promise<boolean> {
  try {
    const { data } = await chatApi.put<ApiResponse<boolean>>(
      `${chatId}/read`
    );

    if (!data.isSuccess) {
      const msg =
        data.errors?.[0]?.description || "Не удалось отметить чат";
      throw new Error(msg);
    }

    return data.data || false;
  } catch (error) {
    handleApiError(error, "Ошибка обновления чата");
    throw error;
  }
}

export interface Message {
  id: string;
  text: string;
  sentAt: string;
  isFromCustomer: boolean;
}

export async function getChatMessages(chatId: string): Promise<Message[]> {
  try {
    const { data } = await chatApi.get<ApiResponse<Message[]>>(
      `${chatId}/messages`
    );

    if (!data.isSuccess) {
      const msg = data.errors?.[0]?.description || "Не удалось загрузить сообщения";
      throw new Error(msg);
    }

    return data.data || [];
  } catch (err) {
    handleApiError(err, "Ошибка загрузки сообщений");
    throw err;
  }
}

export async function sendMessage(chatId: string, text: string): Promise<boolean> {
  try {
    const { data } = await chatApi.post<ApiResponse<boolean>>(
      `${chatId}/messages`,
      { text }
    );

    if (!data.isSuccess) {
      const msg = data.errors?.[0]?.description || "Не удалось отправить";
      throw new Error(msg);
    }

    return true;
  } catch (err) {
    handleApiError(err, "Ошибка отправки");
    throw err;
  }
}

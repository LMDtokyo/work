import { wbApi } from "../../config/api/wildberriesApi";
import { handleApiError } from "../utils/errorHandler";

export interface WbAccount {
  id: string;
  shopName: string;
  status: string;
  lastSyncAt: string | null;
  createdAt: string;
  errorMessage: string | null;
}

interface AddAccountParams {
  apiToken: string;
  shopName: string;
}

interface ApiResponse<T> {
  isSuccess: boolean;
  data: T | null;
  errors?: Array<{ description: string }>;
}

export async function addWbAccount({ apiToken, shopName }: AddAccountParams): Promise<WbAccount> {
  try {
    const { data } = await wbApi.post<ApiResponse<WbAccount>>("/accounts", {
      apiToken,
      shopName,
    });

    if (!data.isSuccess || !data.data) {
      const msg = data.errors?.[0]?.description || "Не удалось добавить аккаунт";
      throw new Error(msg);
    }

    return data.data;
  } catch (error) {
    handleApiError(error, "Ошибка при добавлении аккаунта");
    throw error;
  }
}

export async function getWbAccounts(): Promise<WbAccount[]> {
  try {
    const { data } = await wbApi.get<ApiResponse<WbAccount[]>>("/accounts");

    if (!data.isSuccess) {
      const msg = data.errors?.[0]?.description || "Не удалось загрузить аккаунты";
      throw new Error(msg);
    }

    return data.data || [];
  } catch (error) {
    handleApiError(error, "Ошибка загрузки аккаунтов");
    throw error;
  }
}

export async function removeWbAccount(accountId: string): Promise<void> {
  try {
    const { data } = await wbApi.delete<ApiResponse<null>>(`/accounts/${accountId}`);

    if (!data.isSuccess) {
      const msg = data.errors?.[0]?.description || "Не удалось удалить аккаунт";
      throw new Error(msg);
    }
  } catch (error) {
    handleApiError(error, "Ошибка удаления аккаунта");
    throw error;
  }
}

export async function syncWbOrders(accountId: string): Promise<number> {
  try {
    const { data } = await wbApi.post<ApiResponse<{ newOrdersCount: number }>>(`/accounts/${accountId}/sync`);

    if (!data.isSuccess || !data.data) {
      const msg = data.errors?.[0]?.description || "Синхронизация не удалась";
      throw new Error(msg);
    }

    return data.data.newOrdersCount;
  } catch (error) {
    handleApiError(error, "Ошибка синхронизации");
    throw error;
  }
}

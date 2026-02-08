import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getWbAccounts,
  addWbAccount,
  removeWbAccount,
  syncWbOrders
} from "../requests/wildberries";
import type { WbAccount } from "../requests/wildberries";

const WB_ACCOUNTS_KEY = ["wildberries", "accounts"];

export function useWbAccounts() {
  return useQuery({
    queryKey: WB_ACCOUNTS_KEY,
    queryFn: getWbAccounts,
    staleTime: 30_000,
  });
}

interface AddAccountArgs {
  apiToken: string;
  shopName: string;
}

export function useAddWbAccount(onSuccess?: () => void) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (args: AddAccountArgs) => addWbAccount(args),
    onSuccess: (newAccount) => {
      queryClient.setQueryData<WbAccount[]>(WB_ACCOUNTS_KEY, (old) => {
        if (!old) return [newAccount];
        return [...old, newAccount];
      });
      onSuccess?.();
    },
  });
}

export function useRemoveWbAccount() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: removeWbAccount,
    onSuccess: (_, accountId) => {
      queryClient.setQueryData<WbAccount[]>(WB_ACCOUNTS_KEY, (old) => {
        if (!old) return [];
        return old.filter((acc) => acc.id !== accountId);
      });
    },
  });
}

export function useSyncWbOrders() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: syncWbOrders,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: WB_ACCOUNTS_KEY });
    },
  });
}

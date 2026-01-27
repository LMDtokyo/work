import { useQuery } from "@tanstack/react-query";
import { getChats } from "../requests/chats";

const CHATS_KEY = ["chats"];

export function useChats() {
  return useQuery({
    queryKey: CHATS_KEY,
    queryFn: getChats,
    staleTime: 30_000,
  });
}

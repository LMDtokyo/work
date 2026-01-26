import Searchbar from "../../../shared/ui/Searchbar/Searchbar";
import ChatInput from "../../../shared/ui/ChatInput/ChatInput";
import ChatsCategoryItemsList from "../../../widgets/ChatsCategoryItemsList/ChatsCateogoryItemsList";
import ChatItemsList from "../../../widgets/ChatItemsList/ChatItemsList";

export const Chats = () => {
  return (
    <div className="bg-chat-bg w-full h-svh flex gap-2 justify-center items-start overflow-hidden relative pb-4">
      <div className="w-full flex flex-col gap-3 animate-fade-in-bottom">
        <Searchbar />
        <hr className="border-border mx-2" />
        <ChatsCategoryItemsList />
        <ChatItemsList />
      </div>
      <div className="flex flex-col w-full h-full bg-linear-to-b from-chat-gradient-bg-1 to-chat-gradient-bg-2 rounded-[40px] p-4 py-3 pb-2 border border-primary-border animate-fade-in-bottom">
        <div className="h-full text-font-secondary flex items-center justify-center">
          Пока что здесь пусто...
        </div>
        <ChatInput />
      </div>
    </div>
  );
};

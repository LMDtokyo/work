import type React from "react";

interface IChatItem {
  image: React.ReactNode;
  name: string;
  lastMessage: string;
  timestamp: string;
  unreadMessages: number;
  isSelected?: boolean;
  onClick?: () => void;
}

function ChatItem({
  image,
  name,
  lastMessage,
  timestamp,
  unreadMessages,
  isSelected = false,
  onClick,
}: IChatItem) {
  return (
    <div
      onClick={onClick}
      className={`flex items-center justify-between w-full gap-4 bg-chat-secondary-bg px-6 pl-3 py-3 hover:bg-chat-tertiary-bg duration-50 rounded-xl cursor-pointer ${isSelected ? "bg-chat-tertiary-bg border border-chat-primary-border" : "bg-chat-secondary-bg"}`}
    >
      <div className="flex items-center gap-4 min-w-0 flex-1">
        <span>{image}</span>
        <div className="flex flex-col gap-0.5 min-w-0 flex-1">
          <h3 className="font-semibold text-primary-font text-sm sm:text-base md:text-lg truncate">
            {name}
          </h3>
          <p className="text-xs sm:text-sm text-secondary-font truncate">
            {lastMessage}
          </p>
        </div>
      </div>
      <div className="flex flex-col justify-center items-center gap-2 shrink-0">
        <span className="text-xs text-secondary-font whitespace-nowrap">
          {timestamp}
        </span>
        {unreadMessages > 0 && (
          <span className="bg-contrast text-white rounded-full w-5 h-5 sm:w-6 sm:h-6 flex items-center justify-center text-xs">
            {unreadMessages}
          </span>
        )}
      </div>
    </div>
  );
}

export default ChatItem;

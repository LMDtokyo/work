interface IChatItem {
  image: string;
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
      className={`flex items-center justify-between w-full gap-4 bg-chat-secondary-bg px-6 py-3 hover:bg-chat-tertiary-bg duration-50 rounded-xl cursor-pointer ${isSelected ? "bg-chat-tertiary-bg border border-chat-primary-border" : "bg-chat-secondary-bg"}`}
    >
      <div className="flex items-center gap-4 min-w-0 flex-1">
        <img
          src={image}
          alt={name}
          className="w-15.5 h-15.5 rounded-full object-cover shrink-0"
        />
        <div className="flex flex-col gap-0.5 min-w-0 flex-1">
          <h3 className="font-semibold text-primary-font text-lg truncate">
            {name}
          </h3>
          <p className="text-sm text-secondary-font truncate">{lastMessage}</p>
        </div>
      </div>
      <div className="flex flex-col justify-center items-center gap-2 shrink-0">
        <span className="text-xs text-secondary-font whitespace-nowrap">
          {timestamp}
        </span>
        {unreadMessages > 0 && (
          <span className="bg-contrast text-white rounded-full w-6 h-6 flex items-center justify-center text-xs">
            {unreadMessages}
          </span>
        )}
      </div>
    </div>
  );
}

export default ChatItem;

interface IChatItem {
  image: string;
  name: string;
  lastMessage: string;
  timestamp: string;
  unreadMessages: number;
  isSelected?: boolean;
}

function ChatItem({
  image,
  name,
  lastMessage,
  timestamp,
  unreadMessages,
  isSelected = false,
}: IChatItem) {
  return (
    <div
      className={`flex items-center justify-between w-full gap-4 bg-chat-secondary-bg px-6 py-3 hover:bg-chat-selected-bg duration-50 rounded-xl cursor-pointer ${isSelected ? "bg-chat-selected-bg border border-primary-border" : "bg-chat-secondary-bg"}`}
    >
      <div className="flex items-center gap-4">
        <img
          src={image}
          alt={name}
          className="w-15.5 h-15.5 rounded-full object-cover"
        />
        <div className="flex flex-col gap-0.5">
          <h3 className="font-semibold text-font-primary text-lg">{name}</h3>
          <p className="text-sm text-font-secondary truncate">{lastMessage}</p>
        </div>
      </div>
      <div className="flex flex-col jsutify-center items-center gap-2">
        <span className="text-xs text-font-secondary">{timestamp}</span>
        {unreadMessages > 0 && (
          <span className="bg-font-contrast text-white rounded-full w-6 h-6 flex items-center justify-center text-xs">
            {unreadMessages}
          </span>
        )}
      </div>
    </div>
  );
}

export default ChatItem;

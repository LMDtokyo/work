interface IChatsCategoryItem {
  icon: React.ReactNode;
  title: string;
  count: number;
  isSelected: boolean;
  onClick: () => void;
}

function ChatsCategoryItem({
  icon,
  title,
  count,
  onClick,
  isSelected,
}: IChatsCategoryItem) {
  return (
    <div
      onClick={onClick}
      className={`rounded-lg inline-flex justify-between py-1.5 px-3 pr-5 max-w-45 cursor-pointer hover:bg-chat-selected-bg hover:shadow-[0_1px_2px_#00000025] duration-150 ${isSelected ? "bg-chat-selected-bg shadow-[0_1px_2px_#00000025]" : "bg-chat-secondary-bg"}`}
    >
      <div className="flex justify-center items-center gap-2.5">
        <span className="text-font-secondary">{icon}</span>
        <span className="text-font-primary text-sm text-ellipsis truncate max-w-22.5 select-none">
          {title}
        </span>
      </div>
      {count > 0 && (
        <span className="text-font-primary text-sm flex justify-center items-center select-none ml-4">
          {count}
        </span>
      )}
    </div>
  );
}

export default ChatsCategoryItem;

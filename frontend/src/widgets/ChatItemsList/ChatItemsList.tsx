import avatar from "../../shared/assets/avatar.jpg";
import ChatItem from "../../shared/ui/ChatItem/ChatItem";

const data = [
  {
    image: avatar,
    name: "John Doe",
    lastMessage: "Hello there!",
    timestamp: "10:30 AM",
    unreadMessages: 3,
  },
  {
    image: avatar,
    name: "John Doe",
    lastMessage: "Hello there!",
    timestamp: "10:30 AM",
    unreadMessages: 3,
  },
  {
    image: avatar,
    name: "John Doe",
    lastMessage: "Hello there!",
    timestamp: "10:30 AM",
    unreadMessages: 3,
  },
  {
    image: avatar,
    name: "John Doe",
    lastMessage: "Hello there!",
    timestamp: "10:30 AM",
    unreadMessages: 3,
  },
  {
    image: avatar,
    name: "John Doe",
    lastMessage: "Hello there!",
    timestamp: "10:30 AM",
    unreadMessages: 3,
  },
];

function ChatItemsList() {
  return (
    <div className="w-full flex flex-col gap-2 mt-1">
      {data.map((item) => (
        <ChatItem
          image={item.image}
          name={item.name}
          lastMessage={item.lastMessage}
          timestamp={item.timestamp}
          unreadMessages={item.unreadMessages}
        />
      ))}
    </div>
  );
}

export default ChatItemsList;

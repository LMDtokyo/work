import { useEffect, useRef, useCallback } from "react";
import * as signalR from "@microsoft/signalr";

interface NewMessagePayload {
  chatId: string;
  messageId: string;
  text: string;
  isFromCustomer: boolean;
  sentAt: string;
}

interface NewOrderPayload {
  orderId: string;
  productName: string | null;
  price: number;
  status: string;
}

type MsgHandler = (msg: NewMessagePayload) => void;
type ChatUpdateHandler = (data: { chatId: string }) => void;
type OrderHandler = (data: NewOrderPayload) => void;

let _connection: signalR.HubConnection | null = null;

function getConnection(): signalR.HubConnection {
  if (_connection) return _connection;

  _connection = new signalR.HubConnectionBuilder()
    .withUrl("/hubs/chat", {
      withCredentials: true,
      // send access_token cookie value won't work for WS,
      // but our CookieAuthMiddleware already handles it via cookie
    })
    .withAutomaticReconnect([0, 2000, 5000, 10000, 30000])
    .configureLogging(signalR.LogLevel.Warning)
    .build();

  return _connection;
}

export function useChatSocket(
  onNewMessage?: MsgHandler,
  onChatUpdated?: ChatUpdateHandler,
  onNewOrder?: OrderHandler,
) {
  const msgRef = useRef(onNewMessage);
  const chatRef = useRef(onChatUpdated);
  const orderRef = useRef(onNewOrder);
  msgRef.current = onNewMessage;
  chatRef.current = onChatUpdated;
  orderRef.current = onNewOrder;

  useEffect(() => {
    const conn = getConnection();

    const handleMsg = (payload: NewMessagePayload) => {
      msgRef.current?.(payload);
    };

    const handleChatUpdate = (data: { chatId: string }) => {
      chatRef.current?.(data);
    };

    const handleNewOrder = (data: NewOrderPayload) => {
      orderRef.current?.(data);
    };

    conn.on("NewMessage", handleMsg);
    conn.on("ChatUpdated", handleChatUpdate);
    conn.on("NewOrder", handleNewOrder);

    if (conn.state === signalR.HubConnectionState.Disconnected) {
      conn.start().catch((err) => {
        console.error("SignalR connect failed:", err);
      });
    }

    return () => {
      conn.off("NewMessage", handleMsg);
      conn.off("ChatUpdated", handleChatUpdate);
      conn.off("NewOrder", handleNewOrder);
    };
  }, []);

  const disconnect = useCallback(() => {
    if (
      _connection &&
      _connection.state !== signalR.HubConnectionState.Disconnected
    ) {
      _connection.stop();
      _connection = null;
    }
  }, []);

  return { disconnect };
}

export function disconnectChatSocket() {
  if (_connection) {
    _connection.stop();
    _connection = null;
  }
}

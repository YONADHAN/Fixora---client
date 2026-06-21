
import { IChatEntity } from "./chat.type";

export type ChatListUpdatePayload = Pick<
  IChatEntity,
  "chatId" | "lastMessage" | "unreadCount"
>
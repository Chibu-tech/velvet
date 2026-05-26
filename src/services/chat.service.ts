import { getSupabase, useMock, mockDelay } from "./base.service";
import { Conversation, ChatMessage, MOCK_CONVERSATIONS, MOCK_MESSAGES, MOCK_COMPANIONS } from "@/lib/mockData";

type DbConv = Record<string, any>;
type DbMsg = Record<string, any>;

function mapDbToConversation(db: DbConv): Conversation {
  return {
    id: db.id,
    companionId: db.companion_id,
    lastMessage: db.last_message || "",
    updatedAt: db.updated_at || db.created_at,
    unreadCount: db.unread_count || 0,
  };
}

function mapDbToMessage(db: DbMsg): ChatMessage {
  return {
    id: db.id,
    senderId: db.sender_id,
    content: db.content,
    imageUrl: db.image_url,
    createdAt: db.created_at,
    isRead: db.is_read || false,
  };
}

export async function getConversations(userId: string): Promise<Conversation[]> {
  if (useMock()) {
    await mockDelay(200);
    return MOCK_CONVERSATIONS;
  }
  const { data, error } = await getSupabase()
    .from("conversations")
    .select("*")
    .or(`companion_id.eq.${userId},customer_id.eq.${userId}`)
    .order("updated_at", { ascending: false });
  if (error) throw error;
  return (data || []).map(mapDbToConversation);
}

export async function getMessages(conversationId: string): Promise<ChatMessage[]> {
  if (useMock()) {
    await mockDelay(150);
    return MOCK_MESSAGES[conversationId] || [];
  }
  const { data, error } = await getSupabase()
    .from("messages")
    .select("*")
    .eq("conversation_id", conversationId)
    .order("created_at", { ascending: true });
  if (error) throw error;
  return (data || []).map(mapDbToMessage);
}

export async function sendMessage(conversationId: string, senderId: string, content: string): Promise<ChatMessage> {
  if (useMock()) {
    await mockDelay(100);
    const msg: ChatMessage = {
      id: `msg-${Date.now()}`,
      senderId,
      content,
      createdAt: new Date().toISOString(),
      isRead: true,
    };
    return msg;
  }
  const { data, error } = await getSupabase()
    .from("messages")
    .insert({ conversation_id: conversationId, sender_id: senderId, content })
    .select()
    .single();
  if (error) throw error;

  await getSupabase()
    .from("conversations")
    .update({ last_message: content, updated_at: new Date().toISOString() })
    .eq("id", conversationId);

  return mapDbToMessage(data);
}

export async function createConversation(companionId: string, customerId: string): Promise<string> {
  if (useMock()) {
    const existing = MOCK_CONVERSATIONS.find(c => c.companionId === companionId);
    if (existing) return existing.id;
    const newId = `conv-${Date.now()}`;
    return newId;
  }
  const { data, error } = await getSupabase()
    .from("conversations")
    .insert({ companion_id: companionId, customer_id: customerId })
    .select()
    .single();
  if (error) throw error;
  return data.id;
}

export async function simulateReply(convId: string, companionId: string, content: string): Promise<ChatMessage> {
  if (useMock()) {
    await mockDelay(2500);
    const msg: ChatMessage = {
      id: `msg-reply-${Date.now()}`,
      senderId: companionId,
      content,
      createdAt: new Date().toISOString(),
      isRead: false,
    };
    return msg;
  }
  const { data, error } = await getSupabase()
    .from("messages")
    .insert({ conversation_id: convId, sender_id: companionId, content })
    .select()
    .single();
  if (error) throw error;
  return mapDbToMessage(data);
}

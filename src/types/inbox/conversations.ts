import { ConversationType, ConversationStatus } from "../../generated/prisma/enums";

// REQUEST TYPES 
export interface CreatePrivateConversationDTO {
  otherProfileId: string;
}

export interface CreateGroupConversationDTO {
  title: string;
  avatarUrl?: string;
  participantProfileIds: string[];
}

export interface UpdateGroupDTO {
  conversationId: string;
  title?: string;
  avatarUrl?: string;
}

export interface ConversationListItem {
  id: string;
  type: ConversationType;
  updatedAt: Date;
  lastMessage?: {
    content: string | null;
    createdAt: Date;
    senderUsername: string;
  };
  participants: {
    id: string;
    username: string;
    avatarUrl: string | null;
    lastSeenAt: Date | null; 
  }[];
  unreadCount: number; 
}

export interface ConversationActionParams {
  conversationId: string;
}

// RESPONSE TYPES 
export interface ConversationResponse {
  id: string;
  type: ConversationType;
  status: ConversationStatus;
  title?: string | null;
  avatarUrl?: string | null;
  createdAt: Date;
  updatedAt: Date;
  lastMessageId?: string | null;
  participants: {
    id: string;
    profileId: string;
    joinedAt: Date;
    profile: {
      username: string;
      avatarUrl?: string | null;
    };
  }[];
}

// SOCKET PAYLOADS
export interface ConversationSocketPayload {
  conversationId: string;
}

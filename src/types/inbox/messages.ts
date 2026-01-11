// REQUEST TYPES
export interface SendMessageDTO {
  conversationId: string;
  content?: string;
  mediaUrls?: { 
    url: string; 
    type: "IMAGE" | "VIDEO" | "AUDIO"; 
    duration?: number 
  }[];
}

export interface UpdateMessageDTO {
  content: string;
}

export interface MessageParams {
  messageId: string;
}

// RESPONSE TYPES 
export interface MediaResponse {
  id: string;
  url: string;
  type: "IMAGE" | "VIDEO" | "AUDIO";
  duration?: number; 
}

export interface MessageResponse {
  id: string;
  conversationId: string;
  senderProfileId: string;
  content: string | null;
  readAt?: Date | null;
  media?: MediaResponse[];
  isEdited: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// SOCKET PAYLOADS 
export interface NewMessageSocketPayload {
  conversationId: string;
  message: MessageResponse;
}
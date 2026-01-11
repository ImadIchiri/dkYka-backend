// REQUEST TYPES 
export interface AddParticipantDTO {
  profileId: string;
}

export interface ParticipantParams {
  conversationId: string;
  profileId: string;
}

// RESPONSE TYPES 
export interface ParticipantResponse {
  id: string;
  conversationId: string;
  profileId: string;
  joinedAt: Date;
  isMuted: boolean;
  isArchived: boolean;
  lastReadAt?: Date | null;

  profile?: {
    username: string;
    avatarUrl: string | null;
    lastSeenAt: Date | null;
  };
}

// SOCKET PAYLOADS
export interface ParticipantSocketPayload {
  conversationId: string;
  profileId: string;
}

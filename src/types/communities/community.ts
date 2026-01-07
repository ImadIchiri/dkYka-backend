
// Input pour créer une communauté
export interface CreateCommunityInput {
  name: string;
  description?: string;
  coverImage?: string;
  visibility: "PUBLIC" | "PRIVATE";
}

// Input pour mettre à jour une communauté
export interface UpdateCommunityInput {
  name?: string;
  description?: string;
  coverImage?: string;
  visibility?: "PUBLIC" | "PRIVATE";
}

// Réponse d'une communauté
export interface CommunityResponse {
  id: string;
  name: string;
  description?: string;
  coverImage?: string;
  visibility: "PUBLIC" | "PRIVATE";
  createdAt: Date;
}

// Pour gérer les membres (optionnel ici)
export interface CommunityMemberInput {
  communityId: string;
  userId: string;
  role: "ADMIN" | "MEMBER";
}

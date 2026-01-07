
// types/communities/member.ts

export interface AddMemberInput {
  communityId: string;
  userId: string;
  role: "ADMIN" | "MEMBER";
}

export interface UpdateMemberRoleInput {
  role: "ADMIN" | "MEMBER";
}

export interface CommunityMemberResponse {
  id: string;
  communityId: string;
  userId: string;
  role: "ADMIN" | "MEMBER";
  joinedAt: Date;
}
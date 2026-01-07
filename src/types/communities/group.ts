// types/communities/group.ts

export interface CreateGroupInput {
  name: string;
  description?: string;
  communityId: string; // obligatoire pour lier au community
}

export interface UpdateGroupInput {
  name?: string;
  description?: string;
}

export interface AddGroupMemberInput {
  userId: string;
}

export interface GroupMember {
  id: string;
  userId: string;
  role: "MODERATOR" | "MEMBER";
}

export interface CommunityGroup {
  id: string;
  name: string;
  description?: string;
  communityId: string;
  moderators?: { id: string; name: string }[];
  members?: GroupMember[];
}

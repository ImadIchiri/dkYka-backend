export type CreateGroupInput = {
  name: string;
  description?: string;
  communityId: string;
 coverImage?: string;
  visibility: "PUBLIC" | "PRIVATE";
};

export type UpdateGroupInput = {
  name?: string;
  description?: string;
  coverImage?: string;
  visibility?: "PUBLIC" | "PRIVATE";
};

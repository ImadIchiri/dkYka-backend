export type MediaType = "IMAGE" | "VIDEO";

export type Media = {
  id: string;
  ownerId: string;
  postId?: string ;
  communityPostId?: string;
  storyId?: string;
  type: MediaType;
  url: string;
  thumbnailUrl?: string;
  createdAt: Date;
};

export type MediaCreate = {
  ownerId: string;
  postId?: string | null;
  communityPostId?: string | null;
  storyId?: string | null;
  type: MediaType;
  url: string;
  thumbnailUrl?: string | null;
};

export type MediaUpdate = {
  ownerId?: string;
  postId?: string;
  communityPostId?: string;
  storyId?: string;
  type?: MediaType;
  url?: string;
  thumbnailUrl?: string;
};

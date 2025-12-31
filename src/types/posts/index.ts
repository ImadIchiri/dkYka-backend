export type posts={
  id: number;
  authorId: number;
  content: String;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date | null;
  isDeleted?: boolean;
};

export type postsCreate={
  authorId: number;
  content: String;
};

export type postsUpdate={
  authorId: number;
  content: String;
};
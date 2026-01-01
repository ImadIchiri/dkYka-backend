export type NewComment = {
  content: string;
  postId: string;
  authorId: string;
  parentCommentId?: string | null;
};

export type ExistingComment = NewComment & {
  id: string;
  createdAt?: Date;

  author?: {
    id: string;
    email: string;
  };

  reactions?: {
    id: string;
    type: string;
    userId: string;
  }[];
};

export type NewComment = {
  content: string;
  postId: string;
  authorId: string;
};

export type ExistingComment = {
  id: string;
  content: string;
  postId: string;
  authorId: string;
  createdAt: Date;

  author: {
    id: string;
    email: string;
  };

  reactions: {
    id: string;
    type: "like" | "love" | "haha";
    userId: string;
  }[];
};

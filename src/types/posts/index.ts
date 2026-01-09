export type postsCreate = {
  id:string;
  authorId: string;
  groupId?:string | null ;
  content: string;
};

export type postsUpdate={
  authorId: string;
  groupId?:string | null;
  content: string;
};

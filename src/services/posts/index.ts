import { prisma } from "../../lib/prisma";
import type {postsCreate, postsUpdate } from "../../types/posts";

// Récupérer tous les posts
export const getAllPosts=async()=>{
    return await prisma.post.findMany({
        include:{
            author:true,
            media:true,
            comments:true
        }
    });
};

// Récupérer un post par ID
export const getPostsById=async(id:string)=>{
    return await prisma.post.findUnique({
        where: {id},
        include:{
            author:true,
            media:true,
            comments:true
        }
    });
};

// Créer un post
export const createPosts = async (data: postsCreate) => {
  return await prisma.post.create({
    data,
    include: {
      author: true,
    },
  });
};

// Mettre à jour un post
export const updatePosts=async(id:string,data:postsUpdate)=>{
    return await prisma.post.update({
        where:{id},
        data,
        include:{
            author:true
        }
    });
};

// Supprimer un post
export const deletePost= async(id:string)=>{
    return await prisma.post.delete({
        where :{id},
        include:{
            media:true,
            comments:true
        }
    });
};
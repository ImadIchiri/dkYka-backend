import { prisma } from "../../lib/prisma";
import type { postsCreate, postsUpdate } from "../../types/posts";

// Récupérer tous les posts
export const getAllPosts=async()=>{
    return await prisma.posts.findMany({
        include:{
            user:true
        }
    });
};

// Récupérer un post par ID
export const getPostsById=async(id:number)=>{
    return await prisma.posts.findUnique({
        where: {id},
        include:{
            user:true
        }
    });
};

// Créer un post
export const createPosts= async(data:postsCreate)=>{
    return await prisma.posts.create({
        data,
        include:{
            user:true
        }
    });
};

// Mettre à jour un post
export const updatePosts=async(id:number,data:postsUpdate)=>{
    return await prisma.posts.update({
        where:{id},
        data,
        include:{
            user:true
        }
    });
};

// Supprimer un post (soft delete)
export const deletePost= async(id:number)=>{
    return await prisma.posts.delete({
        where :{id}
    });
};
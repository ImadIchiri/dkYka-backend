import type { Request, Response} from "express";
import * as postsServices from "../../services/posts/index";
import { json } from "node:stream/consumers";

export const getAllPosts=async (req: Request, res: Response)=>{
    try{
        const posts =await postsServices.getAllPosts();
        return res.status(200).json(posts);
    } catch(error){
        console.error(error);
        return res.status(500).json({error: "Impossible de récupérer les posts"});
    }
};

export const getPostsById=async (req:Request, res:Response)=>{
    try{
        const id =Number(req.params.id);
        const post=await postsServices.getPostsById(id);
        res.status(200).json(post);
    } catch(error){
        console.error(error);
        return res.status(500).json({error: "Erreur lors de la récupération du post"});
    }
};

export const createPosts= async(req:Request, res:Response)=>{
    try
    {
        const {authorId, content}= req.body;
        const created = await postsServices.createPosts({
            authorId,
            content,
        });
        return res.status(201).json(created);
    }catch (error){
        console.error(error);
        return res.status(500).json({error:"Impossible de créer le post"})
    }
};

export const updatePosts =async(req:Request, res:Response)=>{
    try{
        const id=Number(req.params.id);
        const {authorId, content}= req.body;
        const updated= await postsServices.updatePosts(
            id,
            {
                authorId,
                content,
            }
        );
        return res.status(200).json({success: true, message: "Post mis à jour", data:updated});
    }catch(error){
        console.error(error);
        return res.status(500).json({error:"Erreur lors de la mise à jour du post"})
    }
};

export const deletePost = async (req:Request, res:Response)=>{
    try{
        const id= Number(req.params.id);
        const deleted=await postsServices.deletePost(id);
        return res.status(200).json({success:true, message:"Post supprimé", data:deleted});
    }catch(error){
        console.error(error);
        return res.status(500).json({error:"Erreur lors de la suppression du post"});
    }
};
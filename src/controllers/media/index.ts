import type { Request, Response } from "express";
import * as mediaService from "../../services/media/index";
import { deleteFromFirebase } from "../../lib/firebase";
import type { MediaUpdate } from "../../types/media";

// Créer un media avec upload

export const uploadMedia = async (req: Request, res: Response) => {
  try {
    const { ownerId, type, postId, storyId, communityPostId } = req.body;

    if (!req.file || !ownerId || !type) {
      return res.status(400).json({ error: "file, ownerId et type requis" });
    }

  // Validation du type de media

    if (!["IMAGE", "VIDEO"].includes(type)) {
      return res.status(400).json({
        error: "Invalid media type. Allowed values: IMAGE, VIDEO",
      });
    }
    const media = await mediaService.uploadAndCreateMedia({
      file: req.file,
      ownerId,
      type,
      postId,
      storyId,
      communityPostId,
    });

    return res.status(201).json({
      success: true,
      data: media,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Upload media failed" });
  }
};

// Récupérer tous les medias

export const getAllMedia = async (req: Request, res: Response) => {
  try {
    const media = await mediaService.getAllMedia();
    return res.status(200).json(media);
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
};

// Récupérer un media par ID

export const getMediaById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    if (!id) return res.status(400).json({ error: "ID requis" });

    const media = await mediaService.getMediaById(id);
    if (!media) return res.status(404).json({ error: "Media non trouvé" });

    return res.status(200).json(media);
  } catch (error) {
    return res.status(500).json({ error: "Impossible de récupérer le media" });
  }
};

// Mettre à jour un media

export const updateMedia = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    if (!id) return res.status(400).json({ error: "ID requis" });

    const data: MediaUpdate = req.body;

    const updated = await mediaService.updateMedia(id, data);

    return res.status(200).json({ success: true, data: updated });
  } catch (error) {
    return res.status(500).json({ error: "Erreur lors de la mise à jour du media" });
  }
};

// Supprimer un media

export const deleteMediaById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    if (!id) return res.status(400).json({ error: "ID requis" });

    const media = await mediaService.getMediaById(id);
    if (!media) return res.status(404).json({ error: "Media non trouvé" });

    if (media.url) await deleteFromFirebase(media.url);
    const deleted = await mediaService.deleteMedia(id);

    return res.status(200).json({ success: true, data: deleted });
  } catch (error) {
    return res.status(500).json({ error: "Erreur lors de la suppression du media" });
  }
};

import { Router } from "express";
import multer from "multer";
import * as mediaController from "../../controllers/media/index";

const router = Router();
const upload = multer({ storage: multer.memoryStorage() });

router.get("/media", mediaController.getAllMedia);
router.get("/media/:id", mediaController.getMediaById);
router.post("/media/upload", upload.single("file"), mediaController.uploadMedia);
router.put("/media/:id", mediaController.updateMedia);
router.delete("/media/:id", mediaController.deleteMediaById);

export default router;

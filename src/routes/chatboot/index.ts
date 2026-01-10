import { Router } from "express";
import { chatBotController } from "../../controllers/chatboot";

const router = Router();

router.post("/", chatBotController);

export default router;

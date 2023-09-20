import { Router } from "express";
import requireUser from "../middleware/requireUser.js";

const router = Router();

router.use(requireUser);

export default router;

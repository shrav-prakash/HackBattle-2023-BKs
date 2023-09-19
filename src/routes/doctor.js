import { Router } from "express";
import requireDoctor from "../middleware/requireDoctor";



const router = Router();

router.use(requireDoctor);

export default router;
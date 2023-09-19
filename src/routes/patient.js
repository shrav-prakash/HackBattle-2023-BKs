import { Router } from "express";
import requirePatient from "../middleware/requirePatient";



const router = Router();

router.use(requirePatient);

export default router;

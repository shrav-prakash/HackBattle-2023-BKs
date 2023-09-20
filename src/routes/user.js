import { Router } from "express";
import requireUser from "../middleware/requireUser.js";
import { acceptPickup, cancelPickup, checkPickupStatus, completePickup, getAvailablePickups, getLocations, getPickups, schedulePickup, toggleAvailability } from "../controllers/appcontroller.js";

const router = Router();

router.use(requireUser);

router.post("/schedule", schedulePickup);
router.get("/scheduledPickups", getPickups);
router.get("/locations", getLocations);
router.get("/availablePickups", getAvailablePickups);
router.post("/acceptPickup", acceptPickup);
router.post("/completePickup", completePickup);
router.get("/checkPickupStatus", checkPickupStatus);
router.get("/toggleAvailability", toggleAvailability);
router.post("/cancelPickup", cancelPickup);

export default router;

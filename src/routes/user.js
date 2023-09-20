import { Router } from "express";
import requireUser from "../middleware/requireUser.js";
import {
  acceptPickup,
  cancelPickup,
  checkPickupStatus,
  completePickup,
  getAcceptedPickups,
  getAvailablePickups,
  getLocations,
  getPickups,
  schedulePickup,
  toggleAvailability,
} from "../controllers/appcontroller.js";
import handleValidation from "../middleware/handleValidation.js";
import {
  acceptPickupSchema,
  authorizationHeaderSchema,
  cancelPickupSchema,
  completePickupSchema,
  schedulePickupSchema,
} from "../helpers/validationSchemas.js";

const router = Router();

router.use(requireUser);

router.post(
  "/schedule",
  handleValidation(schedulePickupSchema, "body"),
  schedulePickup
);
router.get("/scheduledPickups", getPickups);
router.get("/locations", getLocations);
router.get("/availablePickups", getAvailablePickups);
router.post(
  "/acceptPickup",
  handleValidation(acceptPickupSchema, "body"),
  acceptPickup
);
router.post(
  "/completePickup",
  handleValidation(completePickupSchema, "body"),
  completePickup
);
router.get("/checkPickupStatus", checkPickupStatus);
router.get("/toggleAvailability", toggleAvailability);
router.post(
  "/cancelPickup",
  handleValidation(cancelPickupSchema, "body"),
  cancelPickup
);
router.get("/acceptedPickups", getAcceptedPickups);

export default router;

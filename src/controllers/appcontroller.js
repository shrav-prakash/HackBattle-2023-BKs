import { Pickup } from "../models/pickup.js";
import { Location } from "../models/location.js";

export const schedulePickup = async (req, res, next) => {
  const { pickupMaxTime, pickupLocationId, dropLocationId } = req.body;

  //check if pickUpMaxTime is not in the past
  if (pickupMaxTime < Date.now()) {
    return res
      .status(400)
      .json({ message: "Pickup time cannot be in the past" });
  }
  const pickupLocation = await Location.findById(pickupLocationId);
  if (!pickupLocation) {
    return res.status(400).json({ message: "Location not found" });
  }
  const dropLocation = await Location.findById(dropLocationId);
  if (!dropLocation) {
    return res.status(400).json({ message: "Location not found" });
  }
  const pickup = new Pickup({
    scheduler: req.user._id,
    pickupFrom: pickupLocation,
    deliverTo: dropLocation,
    pickupTime: {
      scheduled: Date.now(),
      maximum: pickupMaxTime,
    },
    deliverer: null,
  });
  req.user.scheduledPickups.push(pickup._id);
  await pickup.save();
  req.user.save();
  return res.status(201).json({ pickup });
};

export const getPickups = async (req, res, next) => {
  await req.user.populate("scheduledPickups");
  return res.status(200).json({ pickups: req.user.scheduledPickups });
};

export const getLocations = async (req, res, next) => {
  const locations = await Location.find();
  return res.status(200).json({ locations });
};

export const getAvailablePickups = async (req, res, next) => {
  const pickups = await Pickup.find({
    deliverer: null,
    "pickupTime.maximum": { $gte: Date.now() + 15 * 60 * 1000 },
    "pickupFrom.accessibleGender": req.user.gender,
    "deliverTo.accessibleGender": req.user.gender,
  });
  return res.status(200).json({ pickups });
};

export const acceptPickup = async (req, res, next) => {
  const { pickupId } = req.body;
  const pickup = await Pickup.findById(pickupId);
  if (!pickup) {
    return res.status(400).json({ message: "Pickup not found" });
  }
  if (pickup.deliverer) {
    return res.status(400).json({ message: "Pickup already accepted" });
  }
  if (pickup.pickupTime.maximum < Date.now() - 15 * 60 * 1000) {
    return res.status(400).json({ message: "Pickup time has passed" });
  }
  // check if gender is accessible
  if (
    !pickup.pickupFrom.accessibleGender.includes(req.user.gender) ||
    !pickup.deliverTo.accessibleGender.includes(req.user.gender)
  ) {
    return res.status(400).json({ message: "Location is inaccessible" });
  }
  pickup.deliverer = req.user._id;
  req.user.currentPickups.push(pickup._id);
  if (req.user.currentPickups.length > 2) {
    req.user.availableToPickup = false;
  }
  await pickup.save();
  await req.user.save();
  return res.status(200).json({ pickup });
};

export const checkPickupStatus = async (req, res, next) => {
  await req.user.populate("scheduledPickups");
  await req.user.scheduledPickups.foreach(async (pickup) => {
    await pickup.populate("deliverer");
    pickup.deliverer = pickup.deliverer.toJSON();
  });
  return res.status(200).json({ user: req.user.toJSON() });
};

export const completePickup = async (req, res, next) => {
  const { pickupId, rating } = req.body;
  const pickup = await Pickup.findById(pickupId)
    .populate("deliverer")
    .populate("scheduler");
  if (!pickup) {
    return res.status(400).json({ message: "Pickup not found" });
  }
  if (pickup.scheduler._id.toString() != req.user._id.toString()) {
    console.log(req.user._id, pickup.scheduler._id)
    return res.status(400).json({ message: "Pickup not assigned by you" });
  }
  req.user.scheduledPickups = req.user.scheduledPickups.filter(
    (pickup) => pickup != pickupId
  );
  req.user.completedPickups.push({ pickup: pickupId, scheduler: true });
  pickup.deliverer.completedPickups.push({
    pickup: pickupId,
    scheduler: false,
  });
  pickup.deliverer.currentPickups = pickup.deliverer.currentPickups.filter(
    (pickup) => pickup != pickupId
  );
  pickup.deliverer.pickupRating =
    (pickup.deliverer.pickupRating * pickup.deliverer.completedPickups.length +
      rating) /
    (pickup.deliverer.completedPickups.length + 1);
  await pickup.save();
  await req.user.save();
  await pickup.deliverer.save();
  return res.status(200).json({ pickup });
};

export const cancelPickup = async (req, res, next) => {
  const pickupId = req.params.pickupId;
  const pickup = await Pickup.findById(pickupId)
    .populate("deliverer")
    .populate("scheduler");
  if (!pickup) {
    return res.status(400).json({ message: "Pickup not found" });
  }
  if (pickup.scheduler._id.toString() != req.user._id.toString()) {
    return res.status(400).json({ message: "Pickup not assigned by you" });
  }
  req.user.scheduledPickups = req.user.scheduledPickups.filter(
    (pickup) => pickup != pickupId
  );
  pickup.deliverer.currentPickups = pickup.deliverer.currentPickups.filter(
    (pickup) => pickup != pickupId
  );
  await pickup.save();
  await req.user.save();
  await pickup.deliverer.save();
  return res.status(200).json({ pickup });
};

export const toggleAvailability = async (req, res, next) => {
  req.user.availableToPickup = !req.user.availableToPickup;
  await req.user.save();
  return res.status(200).json({ user: req.user.toJSON() });
};

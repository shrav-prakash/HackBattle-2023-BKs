import { Pickup } from "../models/Pickup";
import { Location } from "../models/location";
import { User } from "../models/user";

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
      maximum: new Date(pickupMaxTime),
    },
  });
  req.user.scheduledPickups.push(pickup._id);
  await pickup.save();
  return res.status(201).json({ pickup });
};

export const getPickups = async (req, res, next) => {
  const pickups = await Pickup.find({ scheduler: req.user._id });
  return res.status(200).json({ pickups });
};

export const getAvailableDeliverers = async (req, res, next) => {
  const { pickupId } = req.params;
  const pickup = await Pickup.findById(pickupId);
  if (!pickup) {
    return res.status(400).json({ message: "Pickup not found" });
  }
  const availableDeliverers = await User.find({
    availableToPickup: true,
    gender: {
      $and: [
        { $in: pickup.deliverTo.accessibleGender },
        { $in: pickup.pickupFrom.accessibleGender },
      ],
    },
  });
  //return the available deliverers with only name email phone regno and pickupRating

  return res.status(200).json({
    availableDeliverers: availableDeliverers.map((deliverer) => {
      return {
        name: deliverer.name,
        email: deliverer.email,
        phone: deliverer.phone,
        regno: deliverer.regno,
        gender: deliverer.gender,
        pickupRating: deliverer.pickupRating,
      };
    }),
  });
};

import { faker } from "@faker-js/faker";
import { User } from "../models/user.js";
import { Location } from "../models/location.js";

export const generateFakeData = async (count) => {
  // generate fake data for all the models in the database

  // generate fake data for the user model and push to db
  const users = [];
  const locations = [];
  for (let i = 0; i < count; i++) {
    users.push(
      new User({
        name: faker.person.fullName(),
        email: faker.internet.email(),
        password: faker.internet.password(),
        regno: faker.string.alphanumeric(9),
        gender: faker.person.sex(),
        pickupRating: faker.number.int({ min: 0, max: 5 }),
        completedPickups: [],
        currentPickups: [],
        scheduledPickups: [],
        availableToPickup: faker.datatype.boolean(),
        phone: faker.phone.number(),
      })
    );
    console.log(users[i].email, users[i].password);
    locations.push(
      new Location({
        name: faker.location.streetAddress(),
        coordinates: [faker.location.latitude(), faker.location.longitude()],
        accessibleGender: faker.helpers.arrayElements(["male", "female"], {
          min: 1,
          max: 2,
        }),
      })
    );
  }
  for (let i = 0; i < count; i++) {
    await users[i].save();
    await locations[i].save();
  }
};

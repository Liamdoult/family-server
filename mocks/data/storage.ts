import { ObjectId } from "mongodb";

export const box = {
  base: {
    valid: [
      {
        label: "Bike Stuff",
        location: "Store room",
        description: "All my random bike shit",
      },
      {
        label: "G1",
        location: "Garage",
      },
    ],
    invalid: [
      {
        label: "",
        location: "Store room",
        description: "Other stuff",
      },
      {
        location: "Garage",
        description: "Other stuff",
      },
      {
        label: "G2",
        location: "",
      },
      {
        label: "G3",
      },
      {
        label: {},
        location: "Store room",
        description: "All my random bike shit",
      },
      {
        label: "Car stuff",
        location: {},
        description: "All my random bike shit",
      },
      {
        label: "Helicopter Stuff",
        location: "Store room",
        description: {},
      },
    ],
  },
};

export const database = {
  box: [
    {
      _id: new ObjectId("5fb6924cc65ca0101736bbc4"),
      created: 1605800524626,
      updated: ["2020-11-29T11:44:21.944Z"],
      label: "A1",
      location: "Home Storage",
      items: [] as string[],
    },
  ],
};

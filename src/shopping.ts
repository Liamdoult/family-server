import { ObjectId } from "mongodb";

import { Item } from "./lib/shopping";
import { RegisteredItem } from "./lib/shopping";

import { dbName } from "./database";
import { client } from "./database";

const collectionName = "shopping";

export async function get(): Promise<Array<RegisteredItem>> {
  const collection = client.db(dbName).collection(collectionName);
  const res = collection.find({ onList: { $eq: true } });
  if (!res) return [];
  return await res.toArray();
}

export async function add(items: Array<Item>) {
  const collection = client.db(dbName).collection(collectionName);
  const fullItems = items.map((item) => {
    return {
      onList: true,
      created: new Date(),
      ...item,
    };
  });
  await collection.insertMany(fullItems);
}

export async function purchased(id: ObjectId | string) {
  const collection = client.db(dbName).collection(collectionName);
  await collection.updateOne(
    { _id: new ObjectId(id) },
    { $set: { purchased: new Date(), onList: false } }
  );
}

export async function unpurchased(id: ObjectId | string) {
  const collection = client.db(dbName).collection(collectionName);
  await collection.updateOne(
    { _id: new ObjectId(id) },
    { $set: { onList: true } }
  );
}

export async function deleted(id: ObjectId | string) {
  const collection = client.db(dbName).collection(collectionName);
  await collection.updateOne(
    { _id: new ObjectId(id) },
    { $set: { deleted: new Date(), onList: false } }
  );
}

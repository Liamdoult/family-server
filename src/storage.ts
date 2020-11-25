import { ObjectId } from "mongodb";

import { dbName } from "./database";
import { client } from "./database";

export class NotFoundError extends Error {
  constructor(id: String) {
    super(`${id} not found.`);
  }
}

export namespace Item {
  const collectionName = "items";

  export interface Item {
    name: String;
    description: String;
    owner: String | undefined;
    quantity: Number | undefined;
  }

  export interface RegisteredItem extends Item {
    _id: String;
    created: string;
  }

  /**
   * Register a new item in the box.
   *
   * @param name Plain text identifier for the item.
   * @param description A description of the item.
   * @param owner (Optional) Who the item belongs to.
   * @param quantity (Optional) Quantity of items if more than 1.
   */
  async function register(item: Item): Promise<RegisteredItem> {
    const now = new Date();
    const collection = client.db(dbName).collection(collectionName);
    const res = await collection.insertOne({ ...item, created: now });
    const id = res.insertedId;
    return {
      _id: id,
      created: now.toISOString(),
      ...item,
    } as RegisteredItem;
  }

  /**
   * Get an item from the database.
   *
   * @param id Identifier of the item.
   */
  export async function get(id: String): Promise<RegisteredItem> {
    const collection = client.db(dbName).collection(collectionName);
    const res = await collection.findOne({ _id: new ObjectId(id as string) });
    if (!res) throw new NotFoundError(id);
    return res as RegisteredItem;
  }

  /**
   * Get the item, or register a new item if not found.
   *
   * @param item
   * @returns A registered item.
   */
  export async function getItem(item: String | Item): Promise<RegisteredItem> {
    if (item instanceof String) {
      return get(item);
    } else {
      return register(item);
    }
  }

  /**
   * Return a list of items based on provide ids.
   *
   * If id is not found, it will be ignored (It will not raise a not found error).
   *
   * @param itemIds List of ids of items required.
   */
  export async function getMany(
    itemIds: Array<string | ObjectId>
  ): Promise<RegisteredItem[]> {
    const collection = client.db(dbName).collection(collectionName);
    const res = await collection.find({
      _id: { $in: itemIds.map((id: string | ObjectId) => new ObjectId(id)) },
    });
    return res.toArray();
  }

  /**
   * Search Items by name and description.
   *
   * @param term Search term used to find items.
   */
  export async function search(term: string): Promise<RegisteredItem[]> {
    const collection = client.db(dbName).collection(collectionName);
    const res = await collection.find({
      $or: [{ name: { $regex: term } }, { description: { $regex: term } }],
    });
    return res.toArray();
  }
}

export namespace Box {
  const collectionName = "boxes";

  export interface Box {
    items: Item.RegisteredItem[];
    location: String;
    label: String;
  }

  export interface RegisteredBox extends Box {
    _id: String;
    created: string;
    updated: string[];
  }

  /**
   * Create a new box.
   *
   * @param location Location the box is stored.
   */
  export async function register(box: Box): Promise<RegisteredBox> {
    const now = new Date();
    const collection = client.db(dbName).collection(collectionName);
    const res = await collection.insertOne({
      created: Date.now(),
      updated: [],
      ...box,
    });
    return {
      _id: res.insertedId,
      created: now.toISOString(),
      updated: [],
      ...box,
    } as RegisteredBox;
  }

  /**
   * Add an item to a box.
   *
   * If multiple items need to be added use `addItems`.
   *
   * @param box Identifier of which box the items should be added to.
   * @param items Identifier of which item should be added to the box.
   */
  export async function addItem(
    box: RegisteredBox | String,
    item: Item.RegisteredItem
  ) {
    const collection = client.db(dbName).collection(collectionName);
    const res = await collection.updateOne(
      { _id: new ObjectId(box as string) },
      { $push: { items: item._id, updated: new Date() } }
    );
    if (res.modifiedCount !== 1) throw new Error("No boxes updated");
  }

  /**
   * Add multiple items to a box.
   *
   * Optimised version of `addItem` for adding multiple items.
   *
   * @param box Identifier of which box the items should be added to.
   * @param items The items that should be added to the box.
   */
  export async function addItems(
    box: RegisteredBox | String,
    items: Array<Item.RegisteredItem>
  ) {
    const ids = items.map((item) => item._id);
    const collection = client.db(dbName).collection(collectionName);
    const res = await collection.updateOne(
      { _id: new ObjectId(box as string) },
      { $push: { items: { $each: ids }, updated: new Date() } }
    );
    if (res.modifiedCount !== 1) throw new Error("No boxes updated");
  }

  /**
   * Get box information.
   *
   * @param id Identification for the box
   */
  export async function get(id: String): Promise<RegisteredBox> {
    const collection = client.db(dbName).collection(collectionName);
    const res = await collection.findOne({ _id: new ObjectId(id as string) });
    if (!res) throw new NotFoundError(id);
    if (res.items) {
      res.items = await Item.getMany(res.items);
    }
    return {
      ...res,
      created: new Date(res.created).toISOString(),
      updated: res.updated.map((d: number) => new Date(d).toISOString()),
    };
  }

  /**
   * Search boxes by label.
   *
   * @param term Term to compare
   */
  export async function search(term: String): Promise<RegisteredBox[]> {
    const collection = client.db(dbName).collection(collectionName);
    const res = await collection.find({
      $or: [{ label: { $regex: term } }, { location: { $regex: term } }],
    });
    return res.toArray();
  }
}

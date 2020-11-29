import { ObjectId } from "mongodb";

import { dbName } from "./database";
import { client } from "./database";

import * as StorageLib from "./lib/storage";
import { NotFoundError } from "./lib/errors";

export namespace Item {
  const collectionName = "items";

  /**
   * Register a new item in the box.
   *
   * @param name Plain text identifier for the item.
   * @param description A description of the item.
   * @param owner (Optional) Who the item belongs to.
   * @param quantity (Optional) Quantity of items if more than 1.
   */
  async function register(
    item: StorageLib.Item
  ): Promise<StorageLib.RegisteredItem> {
    const now = new Date();
    const collection = client.db(dbName).collection(collectionName);
    const res = await collection.insertOne({ ...item, created: now });
    const id = res.insertedId;
    return {
      _id: id,
      created: now.toISOString(),
      ...item,
    } as StorageLib.RegisteredItem;
  }

  /**
   * Get an item from the database.
   *
   * @param id Identifier of the item.
   */
  export async function get(id: String): Promise<StorageLib.RegisteredItem> {
    const collection = client.db(dbName).collection(collectionName);
    const res = await collection.findOne({ _id: new ObjectId(id as string) });
    if (!res) throw new NotFoundError(id);
    return res as StorageLib.RegisteredItem;
  }

  /**
   * Get the item, or register a new item if not found.
   *
   * @param item
   * @returns A registered item.
   */
  export async function getItem(
    item: String | StorageLib.Item
  ): Promise<StorageLib.RegisteredItem> {
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
  ): Promise<StorageLib.RegisteredItem[]> {
    const collection = client.db(dbName).collection(collectionName);
    const res = collection.find({
      _id: { $in: itemIds.map((id: string | ObjectId) => new ObjectId(id)) },
    });
    return res.toArray();
  }

  /**
   * Remove related ids from database.
   */
  export async function removeMany(ids: Array<string>) {
    const collection = client.db(dbName).collection(collectionName);
    await collection.remove({
      _id: { $in: ids.map((id) => new ObjectId(id)) },
    });
  }

  /**
   * SearchStorageLib.Items by name and description.
   *
   * @param term Search term used to find items.
   */
  export async function search(
    term: string
  ): Promise<StorageLib.RegisteredItem[]> {
    const collection = client.db(dbName).collection(collectionName);
    const res = collection.find({
      $or: [{ name: { $regex: term } }, { description: { $regex: term } }],
    });
    return res.toArray();
  }
}

export namespace Box {
  const collectionName = "boxes";

  /**
   * Create a new box.
   *
   * @param location Location the box is stored.
   */
  export async function register(
    box: StorageLib.Box
  ): Promise<StorageLib.RegisteredBox> {
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
    } as StorageLib.RegisteredBox;
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
    box: StorageLib.RegisteredBox | String,
    item: StorageLib.RegisteredItem
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
    box: StorageLib.RegisteredBox | String,
    items: Array<StorageLib.RegisteredItem>
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
  export async function get(id: String): Promise<StorageLib.RegisteredBox> {
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
   * Remove items from a box.
   *
   * If the id does not match an id in the box, it is ignored.
   *
   * @param boxId Identifier for the box.
   * @param itemIds A list of ids to remove from the box.
   * @return Updated box object.
   */
  export async function removeItem(
    boxId: string,
    itemIds: Array<string>
  ): Promise<StorageLib.Box> {
    const collection = client.db(dbName).collection(collectionName);
    const res = await collection.updateOne(
      { _id: new ObjectId(boxId) },
      { $pullAll: { items: itemIds.map((id) => new ObjectId(id)) } }
    );
    if (res.modifiedCount !== 1) throw new Error("No boxes updated");
    await Item.removeMany(itemIds);
    return await get(boxId);
  }

  /**
   * Search boxes by label.
   *
   * @param term Term to compare
   */
  export async function search(
    term: String
  ): Promise<StorageLib.RegisteredBox[]> {
    const collection = client.db(dbName).collection(collectionName);
    const res = collection.find({
      $or: [{ label: { $regex: term } }, { location: { $regex: term } }],
    });
    return res.toArray();
  }
}

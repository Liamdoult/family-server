import { assert } from "console";
import { MongoClient } from "mongodb";
import { ObjectId } from "mongodb";

const url = 'mongodb://localhost:27017';
const dbName = 'family';
export const client = new MongoClient(url);

export class NotFoundError extends Error {};

export namespace Item {
    const collectionName = "items";

    export interface Item {
        name: String,
        description: String,
        owner: String | undefined,
        quantity: Number | undefined,
    }

    export interface RegisteredItem extends Item {
        id: String,
        created: Date,
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
        const res = await collection.insertOne({...item, created: now});
        const id = res.insertedId;
        return {
            id,
            created: now,
            ...item
        } as RegisteredItem;
    }

    /**
     * Get an item from the database.
     * 
     * @param id Identifier of the item.
     */
    async function get(id: String): Promise<RegisteredItem> {
        const collection = client.db(dbName).collection(collectionName);
        const res = await collection.findOne({_id: id});
        if (!res) throw new NotFoundError();
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
}

/**
 * Get the id for an item.
 * 
 * If the item is the id, return the item.
 * 
 * @param item id required from.
 * @returns the id of the item.
 */
function getId(item: String | Box.RegisteredBox | Item.RegisteredItem | { id: String }): String {
    if (item instanceof String)
        return item;
    return item.id;
}

export namespace Box {
    const collectionName = "boxes";

    export interface Box {
        items: String[],
        location: String,
    }

    export interface RegisteredBox {
        id: String,
        created: Date,
        updated: Date[],
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
            ...box
        });
        return {
            id: res.insertedId,
            created: now,
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
    export async function addItem(box: RegisteredBox | String, item: Item.RegisteredItem) {
        const collection = client.db(dbName).collection(collectionName);
        const res = await collection.updateOne({_id: new ObjectId(box as string)}, { $push: { items: item.id, updated: new Date() } });
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
    export async function addItems(box: RegisteredBox | String, items: Array<Item.RegisteredItem>) {
        const ids = items.map(item => item.id);
        const collection = client.db(dbName).collection(collectionName);
        const res = await collection.updateOne({_id: new ObjectId(box as string)}, { $push: { items: { $each: ids }, updated: new Date() } });
        if (res.modifiedCount !== 1) throw new Error("No boxes updated");
    }

}

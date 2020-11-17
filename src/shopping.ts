import { ObjectId } from "mongodb";

import { dbName } from "./database";
import { client } from "./database";

interface Item {
    name: string;
    description: string;
    quantity: number;
    measure: string;
}

interface RegisteredItem extends Item {
    _id: ObjectId,
    onList: boolean,
    created: Date,
    purchased?: Date,
    deleted?: Date,
}

export class NoResultsError extends Error {};


export namespace Shopping {
    const collectionName = "shopping";

    export async function get(): Promise<Array<RegisteredItem>> {
        const collection = client.db(dbName).collection(collectionName);
        const res = collection.find({onList: {$eq: true}});
        if (!res) return [];
        return res.toArray(); 
    }

    export async function add(items: Array<Item>) {
        const collection = client.db(dbName).collection(collectionName);
        const fullItems = items.map(item => { return {
            onList: true,
            created: new Date(),
            ...item
        }});
        await collection.insertMany(fullItems);
    }

    export async function purchased(id: ObjectId | string) {
        const collection = client.db(dbName).collection(collectionName);
        await collection.updateOne({_id: new ObjectId(id)}, {$set: {purchased: new Date(), onList: false}});
    }

    export async function deleted(id: ObjectId | string) {
        const collection = client.db(dbName).collection(collectionName);
        await collection.updateOne({_id: new ObjectId(id)}, {$set: {deleted: new Date(), onList: false}});

    }
}

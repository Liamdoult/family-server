import { MongoClient } from "mongodb";

export const dbName = process.env.DBNAME || "family";

const url = "mongodb://localhost:27017";
export const dbClient = new MongoClient(url);

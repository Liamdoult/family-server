import express from "express";
import cors from "cors";

import * as ShoppingAPI from "./shopping";
import * as StorageAPI from "./storage";

const api = express();
export const defaultPort = 8080;

api.use(express.json());
api.use(cors());

// STORAGE
api.post("/storage/box", StorageAPI.createBox);
api.patch("/storage/box", StorageAPI.updateBox);
api.get("/storage/box", StorageAPI.getBox);
api.get("/storage/item", StorageAPI.getItem);
api.patch("/storage/item", StorageAPI.updateItem);
api.get("/storage/search", StorageAPI.search);
api.delete("/storage/box/items", StorageAPI.deleteBoxItems);

// SHOPPING
api.get("/shopping", ShoppingAPI.getAll);
api.post("/shopping", ShoppingAPI.createItems);
api.patch("/shopping", ShoppingAPI.updateItem);
api.delete("/shopping", ShoppingAPI.deleteItem);

export default api;

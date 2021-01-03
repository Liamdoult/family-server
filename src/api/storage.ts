import { Request } from "express";
import { Response } from "express";

import { Item } from "../lib/storage";
import * as errors from "../lib/errors";

import * as storage from "../storage";

export async function createBox(request: Request, response: Response) {
  // console.log("POST /storage/box");
  const json = request.body;
  if (!json) return response.status(400).send("Invalid Request");
  if (!json.label) return response.status(400).send("Invalid Request");
  if (!json.location) return response.status(400).send("Invalid Request");

  try {
    const box = await storage.Box.register(json);
    if (json.items) {
      const items: Item.Registered[] = await Promise.all(
        json.items.map(storage.Item.getItem)
      );
      await storage.Box.addItems(box, json.items);
      box.items = items;
    }
    response.json(box);
  } catch (err) {
    switch (err.constructor) {
      case errors.NotFoundError:
        return response.status(400).send("Invalid Request");
      default:
        console.log(err);
        return response.status(500).send("Unknown Server Issue");
    }
  }
}

export async function updateBox(request: Request, response: Response) {
  // console.log("PATCH /storage/box");
  const json = request.body;
  if (!json.boxId) return response.status(400).send("Invalid Request");
  if (!json.items) return response.status(400).send("Invalid Request");
  try {
    const items: Item.Registered[] = await Promise.all(
      json.items.map(storage.Item.getItem)
    );
    await storage.Box.addItems(json.boxId, items);
    const box = await storage.Box.get(json.boxId);
    return response.status(200).json(box);
  } catch (err) {
    switch (err.constructor) {
      case errors.NotFoundError:
        return response.status(400).send("Invalid Request");
      default:
        console.log(err);
        return response.status(500).send("Unknown Server Issue");
    }
  }
}

export async function getBox(request: Request, response: Response) {
  // console.log("GET /storage/box");
  if (!request.query) return response.status(400).send("Invalid Request");
  if (!request.query.id) return response.status(400).send("Invalid Request");
  const id = request.query.id;
  if (typeof id !== "string")
    return response.status(400).send("Invalid Request");
  try {
    const box = await storage.Box.get(id);
    return response.status(200).json(box);
  } catch (err) {
    switch (err.constructor) {
      case errors.NotFoundError:
        return response.status(404).send("Not Found.");
      default:
        console.log(err);
        return response.status(500).send("Unknown Server Issue");
    }
  }
}

export async function getItem(request: Request, response: Response) {
  // console.log("GET /storage/item");
  if (!request.query) return response.status(400).send("Invalid Request");
  if (!request.query.id) return response.status(400).send("Invalid Request");
  const id = request.query.id;
  if (typeof id !== "string")
    return response.status(400).send("Invalid Request");
  try {
    const item = await storage.Item.get(id);
    return response.status(200).json(item);
  } catch (err) {
    switch (err.constructor) {
      case errors.NotFoundError:
        return response.status(400).send("Invalid Request");
      default:
        console.log(err);
        return response.status(500).send("Unknown Server Issue");
    }
  }
}

export async function deleteBoxItems(request: Request, response: Response) {
  // console.log("DELETE /storage/box");
  const json = request.body;
  if (!json.boxId) return response.status(400).send("Invalid Request");
  if (!json.items) return response.status(400).send("Invalid Request");
  try {
    const updatedBox = await storage.Box.removeItem(json.boxId, json.items);
    return response.status(200).json(updatedBox);
  } catch (err) {
    switch (err.constructor) {
      case errors.NotFoundError:
        return response.status(400).send("Invalid Request");
      default:
        console.log(err);
        return response.status(500).send("Unknown Server Issue");
    }
  }
}

export async function search(request: Request, response: Response) {
  // console.log("GET /storage/search");
  if (!request.query) return response.status(400).send("Invalid Request");
  if (!request.query.term) return response.status(400).send("Invalid Request");
  const items = await storage.Item.search(request.query.term as string);
  const boxes = await storage.Box.search(request.query.term as string);
  return response.status(200).json({
    boxes,
    items,
  });
}

import { Request } from "express";
import { Response } from "express";

import { Box } from "../storage";
import { Item } from "../storage";
import { NotFoundError } from "../storage";

export async function createBox(request: Request, response: Response) {
  console.log("POST /storage/box");
  const json = request.body;
  if (!json) return response.status(400).send("Invalid Request");
  if (!json.label) return response.status(400).send("Invalid Request");
  if (!json.location) return response.status(400).send("Invalid Request");

  try {
    const box = await Box.register({
      label: json.label,
      location: json.location,
      items: [],
    });
    if (json.items) {
      const items: Item.RegisteredItem[] = await Promise.all(
        json.items.map(Item.getItem)
      );
      await Box.addItems(box, json.items);
      box.items = items;
    }
    response.json(box);
  } catch (err) {
    switch (err.constructor) {
      case NotFoundError:
        return response.status(400).send("Invalid Request");
      default:
        console.log(err);
        return response.status(500).send("Unknown Server Issue");
    }
  }
}

export async function updateBox(request: Request, response: Response) {
  console.log("PATCH /storage/box");
  const json = request.body;
  if (!json.box) return response.status(400).send("Invalid Request");
  if (!json.items) return response.status(400).send("Invalid Request");
  try {
    const items: Item.RegisteredItem[] = await Promise.all(
      json.items.map(Item.getItem)
    );
    await Box.addItems(json.box, items);
    return response.status(200).json({});
  } catch (err) {
    switch (err.constructor) {
      case NotFoundError:
        return response.status(400).send("Invalid Request");
      default:
        console.log(err);
        return response.status(500).send("Unknown Server Issue");
    }
  }
}

export async function getBox(request: Request, response: Response) {
  console.log("GET /storage/box");
  if (!request.query) return response.status(400).send("Invalid Request");
  if (!request.query.id) return response.status(400).send("Invalid Request");
  const id = request.query.id;
  if (typeof id !== "string")
    return response.status(400).send("Invalid Request");
  try {
    const box = await Box.get(id);
    return response.status(200).json(box);
  } catch (err) {
    switch (err.constructor) {
      case NotFoundError:
        return response.status(400).send("Invalid Request");
      default:
        console.log(err);
        return response.status(500).send("Unknown Server Issue");
    }
  }
}

export async function getItem(request: Request, response: Response) {
  console.log("GET /storage/item");
  if (!request.query) return response.status(400).send("Invalid Request");
  if (!request.query.id) return response.status(400).send("Invalid Request");
  const id = request.query.id;
  if (typeof id !== "string")
    return response.status(400).send("Invalid Request");
  try {
    const item = await Item.get(id);
    return response.status(200).json(item);
  } catch (err) {
    switch (err.constructor) {
      case NotFoundError:
        return response.status(400).send("Invalid Request");
      default:
        console.log(err);
        return response.status(500).send("Unknown Server Issue");
    }
  }
}

export async function search(request: Request, response: Response) {
  console.log("GET /storage/search");
  if (!request.query) return response.status(400).send("Invalid Request");
  if (!request.query.term) return response.status(400).send("Invalid Request");
  const items = await Item.search(request.query.term as string);
  const boxes = await Box.search(request.query.term as string);
  return response.status(200).json({
    boxes,
    items,
  });
}

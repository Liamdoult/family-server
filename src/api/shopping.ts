import { Request } from "express";
import { Response } from "express";

import * as Shopping from "../shopping";

export async function getAll(_: Request, response: Response) {
  console.log("GET /shopping");
  return response.status(200).json({ items: await Shopping.get() });
}

export async function createItems(request: Request, response: Response) {
  console.log("POST /shopping");
  const json = request.body;
  if (!json.items) return response.status(400).send("Invalid Request");
  const items = await Shopping.add(json.items);
  return response.status(200).json({ items });
}

export async function updateItem(request: Request, response: Response) {
  console.log("PATCH /shopping");
  if (!request.query) return response.status(400).send("Invalid Request");
  if (!request.query.id) return response.status(400).send("Invalid Request");
  if (request.query.purchased)
    await Shopping.purchased(request.query.id as string);
  if (request.query.unpurchased)
    await Shopping.unpurchased(request.query.id as string);
  return response.status(200).json({});
}

export async function deleteItem(request: Request, response: Response) {
  console.log("DELETE /shopping");
  if (!request.query) return response.status(400).send("Invalid Request");
  if (!request.query.id) return response.status(400).send("Invalid Request");
  await Shopping.deleted(request.query.id as string);
  return response.status(200).json({});
}

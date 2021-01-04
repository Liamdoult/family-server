import Ajv, { JSONSchemaType } from "ajv";
import fetch from "node-fetch";
import * as errors from "./errors";

const url = process.env.BASEURL || "http://localhost:8080";
const ajv = new Ajv();

ajv.addFormat("date", (date: any) => {
  return !isNaN(Date.parse(date));
});

export namespace Item {
  export interface Partial {
    name?: string;
    owner?: string;
    quantity?: number;
    description?: string;
  }

  export const validatePartial = ajv.compile({
    type: "object",
    properties: {
      name: { type: "string", minLength: 1 },
      description: { type: "string" },
      owner: { type: "string", minLength: 1 },
      quantity: { type: "number", minimum: 0 },
    },
    required: [],
    additionalProperties: false,
  } as JSONSchemaType<Partial>);

  export interface Base {
    name: string;
    description?: string;
    owner?: string;
    quantity?: number;
  }

  export const validateBase = ajv.compile({
    type: "object",
    properties: {
      name: { type: "string", minLength: 1 },
      description: { type: "string" },
      owner: { type: "string", minLength: 1 },
      quantity: { type: "number", minimum: 0 },
    },
    required: ["name"],
    additionalProperties: false,
  } as JSONSchemaType<Base>);

  export interface Registered extends Base {
    _id: string;
    created: string;
  }

  export const validateRegistered = ajv.compile({
    type: "object",
    properties: {
      name: { type: "string", minLength: 1 },
      description: { type: "string" },
      owner: { type: "string", minLength: 1 },
      quantity: { type: "number", minimum: 0 },
      _id: { type: "string", minLength: 24 },
      created: { type: "string", format: "date" },
    },
    required: ["name", "_id", "created"],
    additionalProperties: false,
  } as JSONSchemaType<Registered>);

  export class Registered implements Registered {
    constructor(registeredItem: any) {
      Object.assign(this, registeredItem);
    }

    private async update(update: Partial) {
      if (!validatePartial(update)) throw new errors.ValueError("unknown");
      const res = await fetch(`${url}/storage/item?id=${this._id}`, {
        method: "patch",
        body: JSON.stringify(update),
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (res.status === 200) return Object.assign(this, update);
      throw new Error("Unknown issue raise by the server");
    }

    async rename(name: string) {
      await this.update({ name });
    }

    async updateQuantity(quantity: number) {
      await this.update({ quantity });
    }

    async updateDescription(description: string) {
      await this.update({ description });
    }

    async updateOwner(owner: string) {
      await this.update({ owner });
    }
  }

  export async function get(_id: string): Promise<Registered> {
    const res = await fetch(`${url}/storage/item?id=${_id}`, {
      method: "get",
    });
    if (res.status === 200) return new Registered(await res.json());
    throw new Error("Unknown issue raise by the server");
  }
}

export namespace Box {
  export interface Partial {
    location?: string;
    label?: string;
    description?: string;
  }

  export const validatePartial = ajv.compile({
    type: "object",
    properties: {
      location: { type: "string", minLength: 1 },
      label: { type: "string", minLength: 1 },
      description: { type: "string" },
    },
    required: [],
    additionalProperties: false,
  } as JSONSchemaType<Partial>);

  export interface Base {
    location: string;
    label: string;
    description?: string;
  }

  export const validateBase = ajv.compile({
    type: "object",
    properties: {
      location: { type: "string", minLength: 1 },
      label: { type: "string", minLength: 1 },
      description: { type: "string" },
    },
    required: ["location", "label"],
    additionalProperties: false,
  } as JSONSchemaType<Base>);

  export interface Registered extends Base {
    _id: string;
    items: Item.Registered[];
    created: string;
    updated: string[];
  }

  export class Registered implements Registered {
    constructor(registeredBox: any) {
      Object.assign(this, registeredBox);
    }

    private async update(update: Partial) {
      if (!validatePartial(update)) throw new errors.ValueError("unknown");
      const res = await fetch(`${url}/storage/box?id=${this._id}`, {
        method: "patch",
        body: JSON.stringify(update),
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (res.status === 200) return Object.assign(this, update);
      throw new Error("Unknown issue raise by the server");
    }

    async relabel(label: string) {
      await this.update({ label });
    }

    /** Updates box location **/
    async move(location: string) {
      await this.update({ location });
    }

    async updateDescription(description: string) {
      await this.update({ description });
    }

    async addItem(item: Item.Base | Item.Registered) {
      // TODO
    }

    async addItems(items: Array<Item.Base | Item.Registered>) {
      // TODO
    }
  }

  /**
   * Register a new Box and attach items.
   *
   * If the Items do not exist, it will register new items.
   */
  export async function register(
    box: Base,
    items: Array<Item.Base | Item.Registered>
  ): Promise<Registered> {
    if (!validateBase(box)) throw new errors.ValueError("unknown");
    const res = await fetch(`${url}/storage/box`, {
      method: "post",
      body: JSON.stringify({ ...box, items }),
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (res.status === 200) return await res.json();
    throw new Error("Unknown issue raise by the server");
  }

  /**
   * Get a box by its id
   *
   * @param _id Unique hex identifier of the box.
   * @returns Box with matching _id.
   * @throws NotFoundError Server has not found a box with an exact match.
   */
  export async function get(_id: string): Promise<Registered> {
    if (_id === "") throw new errors.NotFoundError(_id);
    const res = await fetch(`${url}/storage/box?id=${_id}`, {
      method: "get",
    });
    if (res.status === 200) return new Registered(await res.json());
    if (res.status === 404) throw new errors.NotFoundError(_id);
    throw new Error("Unknown issue raise by the server");
  }
}

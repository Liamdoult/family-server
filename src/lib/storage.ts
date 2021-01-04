import fetch from "node-fetch";
import * as errors from "./errors";

const url = process.env.BASEURL || "http://localhost:8080";

export namespace Item {
  export interface Base {
    name: string;
    description?: string;
    owner?: string;
    quantity?: Number;
  }

  export interface Registered extends Base {
    _id: string;
    created: string;
  }

  export async function get(_id: string): Promise<Registered> {
    const res = await fetch(`${url}/storage/item?id=${_id}`, {
      method: "get",
    });
    if (res.status === 200) return res.json();
    throw new Error("Unknown issue raise by the server");
  }
}

export namespace Box {
  interface _Partial {
    location?: string;
    label?: string;
    description?: string;
  }

  export interface Base {
    location: string;
    label: string;
    description?: string;
  }

  export interface Registered extends Base {
    _id: string;
    items: Item.Registered[];
    created: string;
    updated: string[];
  }

  export class Registered implements Registered {
    constructor(registeredBox: Registered) {
      Object.assign(this, registeredBox);
    }

    private async update(update: _Partial) {
      const res = await fetch(`${url}/storage/box`, {
        method: "patch",
        body: JSON.stringify(update),
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (res.status === 200) Object.assign(this, update);
      throw new Error("Unknown issue raise by the server");
    }

    async relabel(label: string) {
      await this.update({ label });
    }

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
   * Validate a base objects fields.
   *
   * This should be performed before and after data is sent to the server.
   *
   * __This function creates a **NEW** object. This is to ensure that no other
   * un-accounted for values are attached to the object.__ Thus, if you use
   * this function, use the returned object and not the existing object (the
   * one you passed into the function).
   *
   * If validating a `Registered` object, use `validateRegistered`.
   *
   * @param box The base box to validate.
   * @returns A new validated base box object.
   * @throws ValueError A field is invalid.
   */
  export function validateBase(box: any): Base {
    let validatedBox: any = {};

    if (!box.label || typeof box.label !== "string" || box.label === "")
      throw new errors.ValueError("label");
    validatedBox.label = box.label;

    if (
      !box.location ||
      typeof box.location !== "string" ||
      box.location === ""
    )
      throw new errors.ValueError("location");
    validatedBox.location = box.location;

    if (box.description) {
      if (typeof box.description !== "string" || box.description === "")
        throw new errors.ValueError("description");
      validatedBox.description = box.description;
    }

    return validatedBox as Base;
  }

  /**
   * Validate a registered objects fields.
   *
   * This should be performed before data is sent to the server and after the
   * server receives data.
   *
   * __This function creates a **NEW** object. This is to ensure that no other
   * un-accounted for values are attached to the object.__ Thus, if you use
   * this function, use the returned object and not the existing object (the
   * one you passed into the function).
   *
   * If validating a `Base` object, use `validateBase`.
   *
   * @param box The base box to validate.
   * @returns A new validated base box object.
   * @throws ValueError A field is invalid.
   */
  export function validateRegistered(box: any): Registered {
    let validatedBox: any = {};

    if (!box.label || typeof box.label !== "string" || box.label === "")
      throw new errors.ValueError("label");
    validatedBox.label = box.label;

    if (
      !box.location ||
      typeof box.location !== "string" ||
      box.location === ""
    )
      throw new errors.ValueError("location");
    validatedBox.location = box.location;

    if (box.description) {
      if (typeof box.description !== "string" || box.description === "")
        throw new errors.ValueError("description");
      validatedBox.description = box.description;
    }

    if (
      !box._id ||
      typeof box._id !== "string" ||
      box._id === "" ||
      box._id.length !== 24
    )
      throw new errors.ValueError("_id");
    validatedBox._id = box._id;

    if (!box.items || !Array.isArray(box.items))
      throw new errors.ValueError("items");
    // TODO: Validate each item
    validatedBox.items = box.items;

    if (!box.created || !(box.created instanceof Date))
      throw new errors.ValueError("created");
    validatedBox.created = box.created;

    if (!box.updated || !Array.isArray(box.updated))
      throw new errors.ValueError("updated");
    box.updated.forEach((item: any) => {
      if (!(item instanceof Date)) throw new errors.ValueError("updated");
    });
    validatedBox.updated = box.updated;

    return validatedBox as Registered;
  }

  export async function register(
    location: string,
    label: string,
    items: Array<Item.Base | Item.Registered>
  ): Promise<Registered> {
    const res = await fetch(`${url}/storage/box`, {
      method: "post",
      body: JSON.stringify({ location, label, items }),
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

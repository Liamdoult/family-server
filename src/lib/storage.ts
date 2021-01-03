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
    const res = await fetch(`${url}/storage/box?id=${_id}`, {
      method: "get",
    });
    if (res.status === 200) return new Registered(await res.json());
    if (res.status === 404) throw new errors.NotFoundError(_id);
    throw new Error("Unknown issue raise by the server");
  }
}

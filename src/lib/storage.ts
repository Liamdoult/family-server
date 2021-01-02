import fetch from "node-fetch";

const url = process.env.BASEURL || "http://localhost:8080";

export namespace Item {
  export interface Base {
    name: string;
    description?: string;
    owner?: string;
    quantity?: Number;
  }

  export interface Registered {
    _id: string;
    created: string;
  }
}

export namespace Box {
  export interface Base {
    location: string;
    label: string;
  }

  export interface Registered extends Base {
    _id: string;
    items: Item.Registered[];
    created: string;
    updated: string[];
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
    if (res.status === 200) return res.json();
    throw new Error("Unknown issue raise by the server");
  }
}

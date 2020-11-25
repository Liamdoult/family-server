export interface Item {
  name: string;
  description: string;
  owner: string | undefined;
  quantity: Number | undefined;
}

export interface RegisteredItem extends Item {
  _id: string;
  created: string;
}

export interface Box {
  items: Item.RegisteredItem[];
  location: string;
  label: string;
}

export interface RegisteredBox extends Box {
  _id: string;
  created: string;
  updated: string[];
}

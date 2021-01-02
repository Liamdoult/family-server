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
    items: RegisteredItem[];
    created: string;
    updated: string[];
  }
}

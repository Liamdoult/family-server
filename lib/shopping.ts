export class NoResultsError extends Error {}

export interface Item {
  name: string;
  description: string;
  quantity: number;
  measure: string;
}

export interface RegisteredItem extends Item {
  _id: string;
  onList: boolean;
  created: Date;
  purchased?: Date;
  deleted?: Date;
}

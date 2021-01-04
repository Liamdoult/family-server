export class NoResultsError extends Error {}

export class NotFoundError extends Error {
  id;
  constructor(id: String) {
    super(`${id} not found.`);
    this.id = id;
    Object.setPrototypeOf(this, NotFoundError.prototype);
  }
}

export class ValueError extends Error {
  field;
  constructor(field: String) {
    super(`Invalid ${field}.`);
    this.field = field;
    Object.setPrototypeOf(this, ValueError.prototype);
  }
}

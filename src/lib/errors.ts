export class NoResultsError extends Error {}

export class NotFoundError extends Error {
  constructor(id: String) {
    super(`${id} not found.`);
    Object.setPrototypeOf(this, NotFoundError.prototype);
  }
}

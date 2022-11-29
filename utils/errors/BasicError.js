export class BasicError extends Error {
  constructor(message) {
    super(message);
    this.name = 'basic_error';
  }
}

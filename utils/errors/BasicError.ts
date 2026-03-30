export class BasicError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'basic_error';
  }
}

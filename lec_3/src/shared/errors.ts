export class UserAlreadyExists extends Error {
  constructor(msg: string) {
    super(msg);
  }
}

export class UserDoesNotExists extends Error {
  constructor(msg: string) {
    super(msg);
  }
}

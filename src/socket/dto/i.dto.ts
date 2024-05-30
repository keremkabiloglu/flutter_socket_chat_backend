export class IDto<T> {
  date: Date = new Date();

  stringify(): string {
    return JSON.stringify(this);
  }

  constructor(args: Partial<T>) {
    Object.assign(this, args);
  }
}

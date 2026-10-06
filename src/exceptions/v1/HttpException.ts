export class HttpException extends Error {
  public status: number;
  public toastMessage?: string;
  public details?: unknown;

  constructor(status: number, message: string, toastMessage?: string, details?: unknown) {
    super(message);
    this.status = status;
    this.toastMessage = toastMessage || message;
    this.details = details;
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

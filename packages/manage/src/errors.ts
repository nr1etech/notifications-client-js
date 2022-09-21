export interface ErrorOptions { cause: unknown }

// Based on https://www.bennadel.com/blog/3226-experimenting-with-error-sub-classing-using-es5-and-typescript-2-1-5.htm

interface NotificationMessageError extends Error {
}

class NotificationMessageError {
	public name: string;
	public message: string;
	public stack?: string;
	public cause:unknown|undefined;

	constructor(message:string, name:string, options:ErrorOptions|undefined) {
		this.name = name;
		this.message = message;
		this.stack = (new Error(message)).stack;
		this.cause = options?.cause;
	}
}

// eslint-disable-next-line @typescript-eslint/no-unsafe-argument
Object.setPrototypeOf(NotificationMessageError, Object.create(Error.prototype));

export class ArgumentError extends NotificationMessageError {
	constructor(message:string, options?:ErrorOptions) {
		super(message, "ArgumentError", options);
	}
}

export class AuthorizationError extends NotificationMessageError {
	constructor(message:string, options?:ErrorOptions) {
		super(message, "AuthorizationError", options);
	}
}

export class InitError extends NotificationMessageError {
	constructor(message:string, options?:ErrorOptions) {
		super(message, "InitError", options);
	}
}

export class FetchError extends NotificationMessageError {
	constructor(message:string, options?:ErrorOptions) {
		super(message, "FetchError", options);
	}
}

export class ResponseError extends NotificationMessageError {
	constructor(message:string, options?:ErrorOptions) {
		super(message, "ResponseError", options);
	}
}

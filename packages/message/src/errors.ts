export interface ErrorOptions<TCause> { cause: TCause }

// Based on https://www.bennadel.com/blog/3226-experimenting-with-error-sub-classing-using-es5-and-typescript-2-1-5.htm

// eslint-disable-next-line @typescript-eslint/no-unused-vars
interface NotificationMessageError<TCause> extends Error {
}

// eslint-disable-next-line @typescript-eslint/no-unsafe-declaration-merging
class NotificationMessageError<TCause> {
	public name: string;
	public message: string;
	public stack?: string;
	public cause:unknown|undefined;

	constructor(message:string, name:string, stack:string|undefined, options:ErrorOptions<TCause>|undefined) {
		this.name = name;
		this.message = message;
		this.stack = (new Error(message)).stack;
		this.cause = options?.cause;
	}
}

// eslint-disable-next-line @typescript-eslint/no-unsafe-argument
Object.setPrototypeOf(NotificationMessageError, Object.create(Error.prototype));

export class ArgumentError extends NotificationMessageError<unknown> {
	constructor(message:string, stack: string|undefined, options?:ErrorOptions<unknown>) {
		super(message, "ArgumentError", stack, options);
	}
}

export class FetchError extends NotificationMessageError<unknown> {
	constructor(message:string, stack: string|undefined, options?:ErrorOptions<unknown>) {
		super(message, "FetchError", stack, options);
	}
}

export class AuthorizationError extends NotificationMessageError<ResponseErrorCause> {
	constructor(message:string, stack: string|undefined, options?:ErrorOptions<ResponseErrorCause>) {
		super(message, "AuthorizationError", stack, options);
	}
}

export class ResponseError extends NotificationMessageError<ResponseErrorCause> {
	constructor(message:string, stack: string|undefined, options?:ErrorOptions<ResponseErrorCause>) {
		super(message, "ResponseError", stack, options);
	}
}

export interface ResponseErrorCause {
	url: string;
	redirection: boolean;
	status: number;
	statusText: string;
	headers: Record<string, string[]>;
	body: string;
}

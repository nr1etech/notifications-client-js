export interface ErrorOptions<TCause> { cause: TCause }

// Based on https://www.bennadel.com/blog/3226-experimenting-with-error-sub-classing-using-es5-and-typescript-2-1-5.htm

// eslint-disable-next-line @typescript-eslint/no-unused-vars
interface NotificationManageError<TCause> extends Error {
}

// eslint-disable-next-line @typescript-eslint/no-unsafe-declaration-merging
class NotificationManageError<TCause> {
	public name: string;
	public message: string;
	public stack?: string;
	public cause:unknown|undefined;

	constructor(message:string, name:string, stack:string|undefined, options:ErrorOptions<TCause>|undefined) {
		this.name = name;
		this.message = message;
		this.stack = stack;
		this.cause = options?.cause;
	}
}

// eslint-disable-next-line @typescript-eslint/no-unsafe-argument
Object.setPrototypeOf(NotificationManageError, Object.create(Error.prototype));

export class InitError extends NotificationManageError<undefined> {
	constructor(message:string, stack:string|undefined, options?:ErrorOptions<undefined>) {
		super(message, "InitError", stack, options);
	}
}

export class ArgumentError extends NotificationManageError<undefined> {
	constructor(message:string, stack:string|undefined, options?:ErrorOptions<unknown>) {
		super(message, "ArgumentError", stack, undefined);
	}
}

export class FetchError extends NotificationManageError<unknown> {
	constructor(message:string, stack:string|undefined, options?:ErrorOptions<unknown>) {
		super(message, "FetchError", stack, options);
	}
}

export class AuthorizationError extends NotificationManageError<ResponseErrorCause> {
	constructor(message:string, stack:string|undefined, options?:ErrorOptions<ResponseErrorCause>) {
		super(message, "AuthorizationError", stack, options);
	}
}

export class ResponseError extends NotificationManageError<ResponseErrorCause> {
	constructor(message:string, stack:string|undefined, options?:ErrorOptions<ResponseErrorCause>) {
		super(message, "ResponseError", stack, options);
	}
}

export interface ResponseErrorCause {
	url: string;
	redirection: boolean;
	status: number;
	statusText: string;
	headers: Record<string, string>;
	body: string;
}

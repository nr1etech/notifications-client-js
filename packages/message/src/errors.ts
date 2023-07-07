export interface ErrorOptions<TCause> { cause: TCause }

class NotificationMessageError<TCause> extends Error {
	public name: string;
	public cause:unknown|undefined;

	constructor(message:string, name:string, options:ErrorOptions<TCause>|undefined) {
		super(message);
		this.name = name;
		this.cause = options?.cause;
	}
}

export class ArgumentError extends NotificationMessageError<unknown> {
	constructor(message:string, options?:ErrorOptions<unknown>) {
		super(message, "ArgumentError", options);
	}
}

export class FetchError extends NotificationMessageError<unknown> {
	constructor(message:string, options?:ErrorOptions<unknown>) {
		super(message, "FetchError", options);
	}
	static FromError(error:Error):FetchError {
		const err = new FetchError(error.message, { cause: error });
		err.stack = error.stack;

		return err;
	}
	static FromObject(message:string, cause:unknown, stack:string|undefined) {
		const err = new FetchError(message, { cause: cause });
		err.stack = stack;

		return err;
	}
}

export class AuthorizationError extends NotificationMessageError<ResponseErrorCause> {
	constructor(message:string, options?:ErrorOptions<ResponseErrorCause>) {
		super(message, "AuthorizationError", options);
	}
}

export class ResponseError extends NotificationMessageError<ResponseErrorCause> {
	constructor(message:string, options?:ErrorOptions<ResponseErrorCause>) {
		super(message, "ResponseError", options);
	}
	static FromError(error:Error, cause:ResponseErrorCause):ResponseError {
		const err = new ResponseError(error.message, { cause: cause });
		err.stack = error.message;
		return err;
	}
	static FromObject(message:string, cause:ResponseErrorCause, stack:string|undefined) {
		const err = new ResponseError(message, { cause: cause });
		err.stack = stack;
		return err;
	}
}

export interface ResponseErrorCause {
	url: string;
	redirection: boolean;
	status: number;
	statusText: string;
	headers: Record<string, string>;
	body: string;
	error?: unknown;
}

export interface CaptureStackObject {
	stack?: string|undefined;
}
export interface ErrorOptions<TCause> { cause: TCause }

// eslint-disable-next-line @typescript-eslint/no-unsafe-declaration-merging
class NotificationManageError<TCause> extends Error {
	public name: string;
	public cause:unknown|undefined;

	constructor(message:string, name:string, options:ErrorOptions<TCause>|undefined) {
		super(message);
		this.name = name;
		this.cause = options?.cause;
	}
}

export class InitError extends NotificationManageError<unknown> {
	constructor(message:string, stack:string|undefined, options?:ErrorOptions<unknown>) {
		super(message, "InitError", options);
	}
}

export class ArgumentError extends NotificationManageError<unknown> {
	constructor(message:string, stack:string|undefined, options?:ErrorOptions<unknown>) {
		super(message, "ArgumentError", undefined);
	}
}

export class FetchError extends NotificationManageError<unknown> {
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

export class AuthorizationError extends NotificationManageError<ResponseErrorCause> {
	constructor(message:string, stack:string|undefined, options?:ErrorOptions<ResponseErrorCause>) {
		super(message, "AuthorizationError", options);
	}
}

export class ResponseError extends NotificationManageError<ResponseErrorCause> {
	constructor(message:string, stack:string|undefined, options?:ErrorOptions<ResponseErrorCause>) {
		super(message, "ResponseError", options);
	}
	static FromError(error:Error):ResponseError {
		const err = new ResponseError(error.message, { cause: error });
		err.stack = error.stack;

		return err;
	}
	static FromObject(message:string, cause:unknown, stack:string|undefined) {
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
}

import { ArgumentError, AuthorizationError, FetchError, ResponseError } from "./errors";
import fetch, { Response, Headers } from "node-fetch";

export class NotificationsMessageClient {
	private baseUrl:string;
	private authorizationToken:string;
	private organizationID: string;

	/**
	 * Notification Messaging service client.
	 */
	constructor(options: NotificationsMessageClientOptions) {
		const baseUrl = options.baseUrl.endsWith("/") ? options.baseUrl.slice(0, -1) : options.baseUrl;	// remove trailing slash
		if (!this.isUrl(baseUrl)) {
			throw new ArgumentError("baseUrl is invalid.");
		}
		this.baseUrl = baseUrl;

		if (!options.authorizationToken) throw new ArgumentError("authorizatonToken is invalid.");
		this.authorizationToken = options.authorizationToken;

		if (!options.organizationID) throw new ArgumentError("organizationID is invalid.");
		this.organizationID = options.organizationID;
	}

	/**
	 * Get the baseUrl
	 */
	getBaseUrl():string {
		return this.baseUrl;
	}

	/**
	 * Set the authorization token. Used by all future requests.
	 */
	setAuthorizationToken(authorizationToken:string):void {
		this.authorizationToken = authorizationToken;
	}

	/**
	 * Queue an Email Message for sending
	 */
	async sendEmail(message:EmailMessage):Promise<SendResponse> {
		return await this.executeRequest(`/message/${encodeURIComponent(this.organizationID)}/email`, "create-email", message);
	}

	/**
	 * Queue an SMS Message for sending
	 */
	async sendSms(message:SmsMessage):Promise<SendResponse> {
		return await this.executeRequest(`/message/${encodeURIComponent(this.organizationID)}/sms`, "create-sms", message);
	}

	private async executeRequest(uri:string, contentTypeResource:string, message:unknown):Promise<SendResponse> {

		const requestData = JSON.stringify(message);

		let responseBodyText:string|undefined = undefined;
		let responseBody:unknown;

		let response:Response|undefined = undefined;

		try {
			response = await fetch(this.baseUrl + uri, {
				method: "POST",
				headers: {
					"Content-Type": `application/vnd.notification.${contentTypeResource}.v1+json`,
					"Authorization": `Bearer ${this.authorizationToken}`,
				},
				body: requestData,
			});
			responseBodyText = await response.text();
		} catch (ex) {
			if (ex instanceof Error) {
				throw FetchError.FromError(ex);
			} else {
				const stack = Error().stack;
				throw FetchError.FromObject("Unknown error from the Fetch API", ex, stack);
			}
		}

		if (response.status === 401 || response.status === 403) {	// AWS HTTP API Gateway returns 403 from the authorizer (instead of 401) if the credentials are invalid
			throw new AuthorizationError("Authorization Failed", { cause: { status: response.status, body: responseBodyText, headers: this.headersToObject(response.headers), statusText: response.statusText, redirection: response.redirected, url: response.url, } });
		} else if (response.status === 404) {
			throw new ResponseError("Resource not found", { cause: { status: response.status, body: responseBodyText, headers: this.headersToObject(response.headers), statusText: response.statusText, redirection: response.redirected, url: response.url, } });
		}

		try {
			responseBody = responseBodyText && JSON.parse(responseBodyText);
		} catch (ex) {
			if (ex instanceof Error) {
				throw ResponseError.FromError(ex, { status: response.status, body: responseBodyText, headers: this.headersToObject(response.headers), statusText: response.statusText, redirection: response.redirected, url: response.url, });
			} else {
				const stack = Error().stack;
				throw ResponseError.FromObject("Invalid response content", { status: response.status, body: responseBodyText, headers: this.headersToObject(response.headers), statusText: response.statusText, redirection: response.redirected, url: response.url, }, stack);
			}
		}

		if (response.status != 200) {
			throw new ResponseError((responseBody as ErrorResponse).error ?? responseBodyText, { cause: { status: response.status, body: responseBodyText, headers: this.headersToObject(response.headers), statusText: response.statusText, redirection: response.redirected, url: response.url, } });
		}

		return responseBody as SendResponse;
	}

	private isUrl(value:string):boolean {
		try {
			const url = new URL(value);
			return url.protocol === "http:" || url.protocol === "https:";
		} catch { }

		return false;
	}

	private headersToObject(headers:Headers):Record<string, string> {
		const headersObj:Record<string, string> = {};

		try {
			for (const entry of headers) {
				const key = entry[0], values = entry[1];

				headersObj[key] = values;
			}
		} catch {}

		return headersObj;
	}
}

interface ErrorResponse extends Record<string, unknown> {
	error: string|undefined;
}

export interface SendResponse {
	messageID: string;
}
export interface NotificationsMessageClientOptions {
	baseUrl: string;
	authorizationToken: string;
	organizationID: string;
}

export class EmailRecipient {
	name: string;
	email: string;

	/**
	 * The recipient for an email message.
	 */
	constructor(name:string, email:string) {
		this.name = name;
		this.email = email;
	}
}

export class EmailMessage {
	templateSlug:string;
	templateLocale:string|undefined;
	recipient:EmailRecipient;
	mergeValues:Record<string, unknown>|undefined;
	metadata:Record<string,string>|undefined;
	senderID:string|undefined;

	/**
	 * The message information for sending an Email message.
	 * @param {string} templateSlug
	 * @param {string|undefined} templateLocale
	 * @param {EmailRecipient} recipient
	 * @param {Object} mergeValues
	 * @param {Metadata} metadata
	 * @param {string|undefined} senderID
	 */
	constructor(templateSlug:string, templateLocale:string|undefined, recipient:EmailRecipient, mergeValues:Record<string, unknown>|undefined, metadata:Record<string,string>|undefined, senderID?:string|undefined) {
		this.templateSlug = templateSlug;
		this.templateLocale = templateLocale;
		this.recipient = recipient;
		this.mergeValues = mergeValues;
		this.metadata = metadata;
		this.senderID = senderID;

		if (!(this.recipient instanceof EmailRecipient)) throw new Error("recipient must be an instance of EmailRecipient");
		if (this.mergeValues != undefined && !(this.mergeValues instanceof Object)) throw new Error("mergeValues must be a simple object");
		if (this.metadata != undefined && !(this.metadata instanceof Object)) throw new Error("metadata must be a simple object");
	}
}

export class SmsRecipient {
	phone:string;

	/**
	 * The recipient for an SMS message.
	 */
	constructor(phone:string) {
		this.phone = phone;
	}
}

export class SmsMessage {
	templateSlug:string;
	templateLocale:string|undefined;
	recipient:SmsRecipient;
	mergeValues:Record<string, unknown>|undefined;
	metadata:Record<string, string>|undefined;
	senderID:string|undefined;

	/**
	 * The message information for sending an SMS message.
	 * @param {string} templateSlug
	 * @param {string|undefined} templateLocale
	 * @param {SmsRecipient} recipient
	 * @param {Object} mergeValues
	 * @param {Metadata} metadata
	 * @param {string|undefined} senderID
	 */
	constructor(templateSlug:string, templateLocale:string|undefined, recipient:SmsRecipient, mergeValues:Record<string, unknown>|undefined, metadata:Record<string,string>|undefined, senderID?:string|undefined) {
		this.templateSlug = templateSlug;
		this.templateLocale = templateLocale;
		this.recipient = recipient;
		this.mergeValues = mergeValues;
		this.metadata = metadata;
		this.senderID = senderID;

		if (!(this.recipient instanceof SmsRecipient)) throw new Error("recipient must be an instance of SmsRecipient");
		if (this.mergeValues != undefined && !(this.mergeValues instanceof Object)) throw new Error("mergeValues must be an object");
		if (this.metadata != undefined && !(this.metadata instanceof Object)) throw new Error("metadata must be a simple object");
	}
}

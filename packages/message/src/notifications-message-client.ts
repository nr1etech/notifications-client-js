import { ArgumentError, AuthorizationError, FetchError, ResponseError } from "./errors";
import fetch, { Response } from "node-fetch";

export class NotificationsMessageClient {
	private baseUrl:string;
	private authorizationToken:string;
	private organizationID: string;

	/**
	 * Notification Messaging service client.
	 */
	constructor(options: NotificationsMessageClientOptions) {
		const baseUrl = options.baseUrl.endsWith("/") ? options.baseUrl.slice(0, -1) : options.baseUrl;	// remove trailing slash
		if (!this.isUrl(baseUrl)) throw new ArgumentError("baseUrl is invalid.");
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
			throw new FetchError((ex as Error).message, { cause: ex });
		}

		if (response.status === 401 || response.status === 403) {	// AWS HTTP API Gateway returns 403 from the authorizer (instead of 401) if the credentials are invalid
			throw new AuthorizationError("Authorization Failed");
		} else if (response.status === 404) {
			throw new ResponseError("Resource not found");
		}

		try {
			responseBody = responseBodyText && JSON.parse(responseBodyText);
		} catch (ex) {
			throw new ResponseError("Invalid response content", { cause: responseBodyText});
		}

		if (response.status != 200) {
			throw new ResponseError((responseBody as ErrorResponse).error ?? responseBodyText);
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

	/**
	 * Email Message information used to send an email.
	 */
	constructor(templateSlug:string, templateLocale:string|undefined, recipient:EmailRecipient, mergeValues:Record<string, unknown>|undefined, metadata:Record<string,string>|undefined) {
		this.templateSlug = templateSlug;
		this.templateLocale = templateLocale;
		this.recipient = recipient;
		this.mergeValues = mergeValues;
		this.metadata = metadata;

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

	/**
	 * The message information for sending an SMS message.
	 * @param {string} templateSlug
	 * @param {string|undefined} templateLocale
	 * @param {SmsRecipient} recipient
	 * @param {Object} mergeValues
	 * @param {Metadata} metadata
	 */
	constructor(templateSlug:string, templateLocale:string|undefined, recipient:SmsRecipient, mergeValues:Record<string, unknown>|undefined, metadata:Record<string,string>|undefined) {
		this.templateSlug = templateSlug;
		this.templateLocale = templateLocale;
		this.recipient = recipient;
		this.mergeValues = mergeValues;
		this.metadata = metadata;

		if (!(this.recipient instanceof SmsRecipient)) throw new Error("recipient must be an instance of SmsRecipient");
		if (this.mergeValues != undefined && !(this.mergeValues instanceof Object)) throw new Error("mergeValues must be an object");
		if (this.metadata != undefined && !(this.metadata instanceof Object)) throw new Error("metadata must be a simple object");
	}
}

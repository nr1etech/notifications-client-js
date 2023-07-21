// **********************
// Client Types

export interface NotificationsManageClientOptions {
	authorizationToken: string;
}

export interface AuthenticatedAccountInfo {
	accounts: AccountInfo[];
}

export interface AccountInfo {
	organizationID: string;
	organizationName: string;
	accountID: string;
	accountDescription: string;
	accountRole: AccountRole;
}

export interface RegistrationInfo {
	id_token: string;
}

export interface ErrorResponse extends Record<string, unknown> {
	error:string|undefined;
}

// **********************
// Message Types

export interface MessageList {
	results: Message[];
	nextPage: string | undefined;
}

export interface Message {
	messageID: string;
	type: MessageType;
	sentByAccountID: string;
	senderID: string;
	messageStatus: MessageStatus;
	serviceProvider: ServiceProvider;
	serviceProviderMessageID?: string;
	serviceProviderStatus?: string;
	serviceProviderStatusMessage?: string;
	templateID: string;
	templateSlug: string;
	templateLocale: string;
	fallbackOriginalLocale?: string;
	recipient: EmailRecipient | SmsRecipient;
	dateCreated: string;
	dateCompleted: string;
	mergeValues?: Record<string, unknown>;
	metadata?: Record<string, string>;
}

export interface EmailRecipient {
	name: string;
	email: string;
}

export interface SmsRecipient {
	phone: string;
}

export interface CreateEmailMessage {
	templateSlug: string;
	templateLocale?: string;
	recipient: EmailRecipient;
	mergeValues?: Record<string, unknown>;
	metadata?: Record<string, string>;
	senderID?: string;
}

export interface CreateSmsMessage {
	templateSlug: string;
	templateLocale?: string;
	recipient: SmsRecipient;
	mergeValues?: Record<string, unknown>;
	metadata?: Record<string, string>;
	senderID?: string;
}

export interface CreateMessageResult {
	messageID: string;
}

// **********************
// Organization Types

export interface OrganizationList {
	results: Organization[];
	nextPage: string | undefined;
}

export interface Organization {
	organizationID: string;
	organizationName: string;
	slug: string;
	status: OrganizationStatus;
}

export interface CreateOrganizationData {
	organizationName: string;
	slug: string;
}

export interface UpdateOrganizationData {
	organizationName?: string;
	status?: OrganizationStatus;
}

// **********************
// Account Types
export interface AccountList {
	results: Account[];
	nextPage: string | undefined;
}

export interface Account {
	accountID: string;
	userName: string|undefined;
	description: string;
	organizationName: string;
	organizationSlug: string;
	status: AccountStatus;
	identity: string|undefined;
	role: AccountRole;
	accountType: AccountType;
}

export interface AccountSecret extends Account {
	secret: string|undefined;
}

export interface CreateAccountData {
	userName: string|undefined;
	description: string;
	identity?: string;
	role: AccountRole;
	accountType: AccountType;
}

export interface UpdateAccountData {
	userName?: string;
	description?: string;
	status?: AccountStatus;
	identity?: string;
	role?: AccountRole;
}

// **********************
// Template Types

export interface TemplateList {
	results: Template[];
	nextPage: string | undefined;
}

export interface Template {
	templateID: string;
	slug: string;
	locale: string;
	name: string;
	type: MessageType;
	status: TemplateStatus;
	content?: TemplateContent[];
}

export interface TemplateContent {
	stage: TemplateStage;
	subject: string | undefined;
	body: string;
	dateLastModified: string;
}

export interface CreateTemplateData {
	slug: string;
	locale: string;
	name: string;
	type: MessageType;
	status: TemplateStatus;
	stage: TemplateStage;
	subject?: string;
	body: string;
}

export interface UpdateTemplateData {
	name?: string;
	slug?: string;
	locale?: string;
	status?: TemplateStatus;
	stage?: TemplateStage;
	subject?: string;
	body?: string;
}

// **********************
// Sender Types

export interface SenderList {
	results: Sender[];
	nextPage: string | undefined;
}

export interface Sender {
	senderID: string;
	name: string;
	type: MessageType;
	status: SenderStatus;
	priority: number;
	serviceProvider: ServiceProvider;
	senderConfiguration: Record<string, unknown>;
	webhookKey: string;
}

export interface CreateSenderData {
	name: string;
	type: MessageType;
	status: SenderStatus;
	priority: number;
	serviceProvider: ServiceProvider;
	senderConfiguration: Record<string, unknown>;
}

export interface UpdateSenderData {
	name?: string;
	type?: MessageType;
	status?: SenderStatus;
	priority?: number;
	serviceProvider?: ServiceProvider;
	senderConfiguration?: Record<string, unknown>;
}

// **********************
// Block Types

export interface BlockList {
	results: Block[];
	nextPage: string | undefined;
}

export interface Block {
	blockID: string;
	recipient: string;
	reason: BlockReasonType;
	description: string | undefined;
	dateAdded: string;
}

export interface CreateBlockData {
	recipient: string;
	reason: BlockReasonType;
	description?: string;
}

// **********************
// Enums

export const MessageType = {
	Email: "email",
	Sms: "sms",
} as const;
export type MessageType = typeof MessageType[keyof typeof MessageType];

export const MessageStatus = {
	Created: "created",
	Pending: "pending",
	Sending: "sending",
	Sent: "sent",
	Success: "success",
	Failure: "failure",
} as const;
export type MessageStatus = typeof MessageStatus[keyof typeof MessageStatus];

export const OrganizationStatus = {
	Active: "active",
	Inactive: "inactive",
} as const;
export type OrganizationStatus = typeof OrganizationStatus[keyof typeof OrganizationStatus];

export const AccountRole = {
	GlobalAdmin: "global-admin",
	Management: "management",
	Messaging: "messaging",
	MessagingTest: "messaging-test",
} as const;
export type AccountRole = typeof AccountRole[keyof typeof AccountRole];

export const AccountType = {
	User: "user",
	Client: "client",
} as const;
export type AccountType = typeof AccountType[keyof typeof AccountType];

export const AccountStatus = {
	Active: "active",
	Inactive: "inactive",
} as const;
export type AccountStatus = typeof AccountStatus[keyof typeof AccountStatus];

export const TemplateStatus = {
	Active: "active",
	Inactive: "inactive",
} as const;
export type TemplateStatus = typeof TemplateStatus[keyof typeof TemplateStatus];

export const TemplateStage = {
	Published: "published",
	Draft: "draft",
} as const;
export type TemplateStage = typeof TemplateStage[keyof typeof TemplateStage];

export const SenderStatus = {
	Active: "active",
	Inactive: "inactive",
} as const;
export type SenderStatus = typeof SenderStatus[keyof typeof SenderStatus];

export const ServiceProvider = {
	Twilio: "twilio",
	SendGrid: "sendgrid",
	AwsSes: "aws-ses",
	EmailIntegrationTest: "email-integration-test",
	SmsIntegrationTest: "sms-integration-test",
} as const;
export type ServiceProvider = typeof ServiceProvider[keyof typeof ServiceProvider];

export const BlockReasonType = {
	Spam: "spam",
	Bounce: "bounce",
	Blocked: "blocked",
	OptOut: "optout",
	Other: "other",
	Manual: "manual",
} as const;
export type BlockReasonType = typeof BlockReasonType[keyof typeof BlockReasonType];

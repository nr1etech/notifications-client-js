// **********************
// Client Types

export interface NotificationsManageClientOptions {
	authorizationToken: string;
}

export interface OrganizationInfo {
	organizationID: string;
	organizationName: string;
	userDescription: string;
	userType: UserType;
}

export interface KeyResult {
	key: string;
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
	sentByUserID: string;
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
}

export interface CreateSmsMessage {
	templateSlug: string;
	templateLocale?: string;
	recipient: SmsRecipient;
	mergeValues?: Record<string, unknown>;
	metadata?: Record<string, string>;
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
	status: OrganizationStatus;
}

export interface CreateOrganizationData {
	organizationName: string;
}

export interface UpdateOrganizationData {
	organizationName?: string;
	apiKey?: string;
	status?: OrganizationStatus;
}

// **********************
// User Types
export interface UserList {
	results: User[];
	nextPage: string | undefined;
}

export interface User {
	userID: string;
	description: string;
	organizationName: string;
	status: UserStatus;
	identity: string|undefined;
	type: UserType;
	class: UserClass;
	inviteToken?: string;
	inviteTokenExpirationDate?: string;
}

export interface CreateUserData {
	description: string;
	identity?: string;
	type: UserType;
	class: UserClass;
	inviteToken?: string;
}

export interface UpdateUserData {
	description?: string;
	status?: UserStatus;
	identity?: string;
	type?: UserType;
	inviteToken?: string;
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

export enum MessageType {
	Email = "email",
	Sms = "sms",
}

export enum MessageStatus {
	Created = "created",
	Pending = "pending",
	Sending = "sending",
	Sent = "sent",
	Success = "success",
	Failure = "failure",
}

export enum OrganizationStatus {
	Active = "active",
	Inactive = "inactive",
}

export enum UserType {
	GlobalAdmin = "global-admin",
	Management = "management",
	Messaging = "messaging",
	MessagingTest = "messaging-test",
}

export enum UserClass {
	Person = "person",
	Client = "client",
}

export enum UserStatus {
	Active = "active",
	Inactive = "inactive",
}

export enum TemplateStatus {
	Active = "active",
	Inactive = "inactive",
}

export enum TemplateStage {
	Published = "published",
	Draft = "draft",
}

export enum SenderStatus {
	Active = "active",
	Inactive = "inactive",
}

export enum ServiceProvider {
	Twilio = "twilio",
	SendGrid = "sendgrid",
	EmailIntegrationTest = "email-integration-test",
	SmsIntegrationTest = "sms-integration-test",
}

export enum AppKeyStatus {
	Active = "active",
	Inactive = "inactive",
}

export enum AppKeyType {
	Messaging = "messaging",
	Webhook = "webhook",
	Management = "management",
	Admin = "admin",
	MessagingTest = "messaging-test",
}

export enum BlockReasonType {
	Spam = "spam",
	Bounce = "bounce",
	Blocked = "blocked",
	OptOut = "optout",
	Other = "other",
	Manual = "manual",
}

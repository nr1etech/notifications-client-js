// **********************
// Client Types

export interface NotificationManageOptions {
	authorizationToken: string
}

export interface CustomerInfo {
	Role: string,
	CustomerID: string,
	OrganizationName: string
}

export interface ApiKeyResult {
	ApiKey: string
}

// **********************
// Message Types

export interface MessageList {
	Results: Message[],
	NextPage: string | undefined
}

export interface Message {
	MessageID: string,
	Type: MessageType,
	MessageStatus: MessageStatus,
	SenderID: string,
	SenderMessageID?: string,
	SenderStatus?: string,
	SenderStatusMessage?: string,
	TemplateSlug: string,
	TemplateLocale: string | undefined,
	Recipient: EmailRecipient | SmsRecipient,
	DateCreated: string,
	DateCompleted: string,
	MergeValues?: unknown,
	Metadata?: Record<string, string>
}

export interface EmailRecipient {
	Name: string,
	Email: string
}

export interface SmsRecipient {
	Phone: string
}

export interface CreateEmailMessage {
	TemplateSlug: string,
	TemplateLocale: string | undefined,
	Recipient: EmailRecipient,
	MergeValues?: unknown,
	Metadata?: Record<string, string>
}

export interface CreateSmsMessage {
	TemplateSlug: string,
	TemplateLocale: string | undefined,
	Recipient: SmsRecipient,
	MergeValues?: unknown,
	Metadata?: Record<string, string>
}

export interface CreateMessageResult {
	MessageID: string
}

// **********************
// Customer Types

export interface CustomerList {
	Results: Customer[],
	NextPage: string | undefined
}

export interface Customer {
	CustomerID: string,
	ApiKey: string,
	OrganizationName: string,
	Status: CustomerStatus
}

export interface CreateCustomerData {
	OrganizationName: string
}

export interface UpdateCustomerData {
	OrganizationName?: string,
	ApiKey?: string,
	Status?: CustomerStatus
}

// **********************
// Template Types

export interface TemplateList {
	Results: Template[],
	NextPage: string | undefined
}

export interface Template {
	Slug: string,
	Locale: string,
	Name: string,
	Type: MessageType,
	Status: TemplateStatus,
	Content?: TemplateContent[],
}

export interface TemplateContent {
	Stage: TemplateStage,
	Subject: string | undefined,
	Body: string,
	DateLastModified: string,
}

export interface CreateTemplateData {
	Slug: string,
	Locale?: string,
	Name: string,
	Type: MessageType,
	Status: TemplateStatus,
	Stage: TemplateStage,
	Subject?: string,
	Body: string
}

export interface UpdateTemplateData {
	Name?: string,
	Status?: TemplateStatus,
	Stage?: TemplateStage,
	Subject?: string,
	Body?: string
}

// **********************
// Sender Types

export interface SenderList {
	Results: Sender[],
	NextPage: string | undefined
}

export interface Sender {
	SenderID: string,
	Name: string,
	Type: MessageType,
	Status: SenderStatus,
	Priority: number,
	ServiceProvider: ServiceProvider,
	SenderConfiguration: any,
}

export interface CreateSenderData {
	Name: string,
	Type: MessageType,
	Status: SenderStatus,
	Priority: number,
	ServiceProvider: ServiceProvider,
	SenderConfiguration: Object
}

export interface UpdateSenderData {
	Name?: string,
	Type?: MessageType,
	Status?: SenderStatus,
	Priority?: number,
	ServiceProvider?: ServiceProvider,
	SenderConfiguration?: Object
}

// **********************
// AppKey Types

export interface AppKeyList {
	Results: AppKey[],
	NextPage: string | undefined
}

export interface AppKey {
	AppKeyID: string,
	Name: string,
	Type: AppKeyType,
	Status: AppKeyStatus,
	AppKey: string,
	KeySnippet: string
}

export interface CreateAppKeyData {
	Name: string,
	Type: AppKeyType
}

export interface UpdateAppKeyData {
	Name?: string,
	Status?: AppKeyStatus
}

// **********************
// Block Types

export interface BlockList {
	Results: Block[],
	NextPage: string | undefined
}

export interface Block {
	BlockID: string,
	Recipient: string,
	Reason: string,
	Description: string | undefined,
	DateAdded: string
}

export interface CreateBlockData {
	Recipient: string,
	Reason: BlockReasonType,
	Description?: string
}

// **********************
// Enums

export enum MessageType {
	Email = "email",
	Sms = "sms",
}

export enum MessageStatus {
	Pending = "pending",
	Success = "success",
	Failure = "failure"
}

export enum CustomerStatus {
	Active = "active",
	Inactive = "inactive"
}

export enum TemplateStatus {
	Active = "active",
	Inactive = "inactive"
}

export enum TemplateStage {
	Published = "PUBLISHED",
	Draft = "DRAFT"
}

export enum SenderStatus {
	Active = "active",
	Inactive = "inactive"
}

export enum ServiceProvider {
	Twilio = "twilio",
	SendGrid = "sendgrid",
	EmailIntegrationTest = "email-integration-test",
	SmsIntegrationTest = "sms-integration-test",
}

export enum AppKeyStatus {
	Active = "active",
	Inactive = "inactive"
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
	Manual = "manual"
}

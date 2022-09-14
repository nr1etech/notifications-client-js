"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SmsMessage = exports.SmsRecipient = exports.EmailMessage = exports.EmailRecipient = exports.NotificationMessage = void 0;
const errors_1 = require("./errors");
const node_fetch_1 = require("node-fetch");
class NotificationMessage {
    constructor(baseUrl, options) {
        baseUrl = baseUrl.slice(-1) === "/" ? baseUrl.slice(0, -1) : baseUrl;
        if (!this.isUrl(baseUrl))
            throw new errors_1.ArgumentError("baseUrl is invalid.");
        this.baseUrl = baseUrl;
        this.authorizationToken = options.authorizationToken;
    }
    getBaseUrl() {
        return this.baseUrl;
    }
    setAuthorizationToken(authorizationToken) {
        this.authorizationToken = authorizationToken;
    }
    async sendEmail(message) {
        return await this.executeRequest("/message/email", "create-email", {
            TemplateSlug: message.templateSlug,
            TemplateLocale: message.templateLocale,
            Recipient: {
                Name: message.recipient.name,
                Email: message.recipient.email,
            },
            MergeValues: message.mergeValues
        });
    }
    async sendSms(message) {
        return await this.executeRequest("/message/sms", "create-sms", {
            TemplateSlug: message.templateSlug,
            TemplateLocale: message.templateLocale,
            Recipient: {
                Phone: message.recipient.phone,
            },
            MergeValues: message.mergeValues,
        });
    }
    async executeRequest(uri, contentTypeResource, message) {
        let requestData = JSON.stringify(message);
        let responseBodyText = undefined;
        let responseBody = undefined;
        let response;
        try {
            response = await (0, node_fetch_1.default)(this.baseUrl + uri, {
                method: "POST",
                headers: {
                    "Content-Type": `application/vnd.notification.${contentTypeResource}.v1+json`,
                    "Authorization": this.authorizationToken,
                },
                body: requestData,
            });
            responseBodyText = await response.text();
        }
        catch (ex) {
            throw new errors_1.FetchError(ex.message, { cause: ex });
        }
        if (!response) {
            throw new errors_1.ResponseError("Server did not respond");
        }
        if (response.status === 401 || response.status === 403) {
            throw new errors_1.AuthorizationError("Authorization Failed");
        }
        else if (response.status === 404) {
            throw new errors_1.ResponseError("Resource not found");
        }
        try {
            responseBody = responseBodyText && JSON.parse(responseBodyText);
        }
        catch (ex) {
            throw new errors_1.ResponseError("Invalid response content", { cause: responseBodyText });
        }
        if (response.status != 200) {
            throw new errors_1.ResponseError(responseBody.Error || responseBodyText);
        }
        return responseBody;
    }
    isUrl(value) {
        try {
            const url = new URL(value);
            return url.protocol === "http:" || url.protocol === "https:";
        }
        catch { }
        return false;
    }
}
exports.NotificationMessage = NotificationMessage;
class EmailRecipient {
    constructor(name, email) {
        this.name = name;
        this.email = email;
    }
}
exports.EmailRecipient = EmailRecipient;
class EmailMessage {
    constructor(templateSlug, templateLocale, recipient, mergeValues, metadata) {
        this.templateSlug = templateSlug;
        this.templateLocale = templateLocale;
        this.recipient = recipient;
        this.mergeValues = mergeValues;
        this.metadata = metadata;
        if (!(this.recipient instanceof EmailRecipient))
            throw new Error("recipient must be an instance of EmailRecipient");
        if (this.mergeValues != undefined && !(this.mergeValues instanceof Object))
            throw new Error("mergeValues must be a simple object");
        if (this.metadata != undefined && !(this.metadata instanceof Object))
            throw new Error("metadata must be a simple object");
    }
}
exports.EmailMessage = EmailMessage;
class SmsRecipient {
    constructor(phone) {
        this.phone = phone;
    }
}
exports.SmsRecipient = SmsRecipient;
class SmsMessage {
    constructor(templateSlug, templateLocale, recipient, mergeValues, metadata) {
        this.templateSlug = templateSlug;
        this.templateLocale = templateLocale;
        this.recipient = recipient;
        this.mergeValues = mergeValues;
        this.metadata = metadata;
        if (!(this.recipient instanceof SmsRecipient))
            throw new Error("recipient must be an instance of SmsRecipient");
        if (this.mergeValues != undefined && !(this.mergeValues instanceof Object))
            throw new Error("mergeValues must be an object");
        if (this.metadata != undefined && !(this.metadata instanceof Object))
            throw new Error("metadata must be a simple object");
    }
}
exports.SmsMessage = SmsMessage;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibm90aWZpY2F0aW9uLW1lc3NhZ2UuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi9zcmMvbm90aWZpY2F0aW9uLW1lc3NhZ2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBQUEscUNBQXdGO0FBQ3hGLDJDQUE2QztBQUU3QyxNQUFhLG1CQUFtQjtJQU8vQixZQUFZLE9BQWUsRUFBRSxPQUFtQztRQUMvRCxPQUFPLEdBQUcsT0FBTyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLEdBQUcsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDO1FBRXJFLElBQUksQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQztZQUFFLE1BQU0sSUFBSSxzQkFBYSxDQUFDLHFCQUFxQixDQUFDLENBQUM7UUFFekUsSUFBSSxDQUFDLE9BQU8sR0FBRyxPQUFPLENBQUM7UUFDdkIsSUFBSSxDQUFDLGtCQUFrQixHQUFHLE9BQU8sQ0FBQyxrQkFBa0IsQ0FBQztJQUN0RCxDQUFDO0lBS0QsVUFBVTtRQUNULE9BQU8sSUFBSSxDQUFDLE9BQU8sQ0FBQztJQUNyQixDQUFDO0lBS0QscUJBQXFCLENBQUMsa0JBQXlCO1FBQzlDLElBQUksQ0FBQyxrQkFBa0IsR0FBRyxrQkFBa0IsQ0FBQztJQUM5QyxDQUFDO0lBS0QsS0FBSyxDQUFDLFNBQVMsQ0FBQyxPQUFvQjtRQUNuQyxPQUFPLE1BQU0sSUFBSSxDQUFDLGNBQWMsQ0FBQyxnQkFBZ0IsRUFBRSxjQUFjLEVBQUU7WUFDbEUsWUFBWSxFQUFFLE9BQU8sQ0FBQyxZQUFZO1lBQ2xDLGNBQWMsRUFBRSxPQUFPLENBQUMsY0FBYztZQUN0QyxTQUFTLEVBQUU7Z0JBQ1YsSUFBSSxFQUFFLE9BQU8sQ0FBQyxTQUFTLENBQUMsSUFBSTtnQkFDNUIsS0FBSyxFQUFFLE9BQU8sQ0FBQyxTQUFT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QUFDLFlBQVksR0FBRyxZQUFZLENBQUM7UUFDakMsSUFBSSxDQUFDLGNBQWMsR0FBRyxjQUFjLENBQUM7UUFDckMsSUFBSSxDQUFDLFNBQVMsR0FBRyxTQUFTLENBQUM7UUFDM0IsSUFBSSxDQUFDLFdBQVcsR0FBRyxXQUFXLENBQUM7UUFDL0IsSUFBSSxDQUFDLFFBQVEsR0FBRyxRQUFRLENBQUM7UUFFekIsSUFBSSxDQUFDLENBQUMsSUFBSSxDQUFDLFNBQVMsWUFBWSxZQUFZLENBQUM7WUFBRSxNQUFNLElBQUksS0FBSyxDQUFDLCtDQUErQyxDQUFDLENBQUM7UUFDaEgsSUFBSSxJQUFJLENBQUMsV0FBVyxJQUFJLFNBQVMsSUFBSSxDQUFDLENBQUMsSUFBSSxDQUFDLFdBQVcsWUFBWSxNQUFNLENBQUM7WUFBRSxNQUFNLElBQUksS0FBSyxDQUFDLCtCQUErQixDQUFDLENBQUM7UUFDN0gsSUFBSSxJQUFJLENBQUMsUUFBUSxJQUFJLFNBQVMsSUFBSSxDQUFDLENBQUMsSUFBSSxDQUFDLFFBQVEsWUFBWSxNQUFNLENBQUM7WUFBRSxNQUFNLElBQUksS0FBSyxDQUFDLGtDQUFrQyxDQUFDLENBQUM7SUFDM0gsQ0FBQztDQUNEO0FBMUJELGdDQTBCQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IEFyZ3VtZW50RXJyb3IsIEF1dGhvcml6YXRpb25FcnJvciwgRmV0Y2hFcnJvciwgUmVzcG9uc2VFcnJvciB9IGZyb20gXCIuL2Vycm9yc1wiO1xuaW1wb3J0IGZldGNoLCB7IFJlc3BvbnNlIH0gZnJvbSBcIm5vZGUtZmV0Y2hcIjtcblxuZXhwb3J0IGNsYXNzIE5vdGlmaWNhdGlvbk1lc3NhZ2Uge1xuXHRwcml2YXRlIGJhc2VVcmw6c3RyaW5nO1xuXHRwcml2YXRlIGF1dGhvcml6YXRpb25Ub2tlbjpzdHJpbmc7XG5cblx0LyoqXG5cdCAqIE5vdGlmaWNhdGlvbiBNZXNzYWdpbmcgc2VydmljZSBjbGllbnQuXG5cdCAqL1xuXHRjb25zdHJ1Y3RvcihiYXNlVXJsOiBzdHJpbmcsIG9wdGlvbnM6IE5vdGlmaWNhdGlvbk1lc3NhZ2VPcHRpb25zKSB7XG5cdFx0YmFzZVVybCA9IGJhc2VVcmwuc2xpY2UoLTEpID09PSBcIi9cIiA/IGJhc2VVcmwuc2xpY2UoMCwgLTEpIDogYmFzZVVybDtcdC8vIHJlbW92ZSB0cmFpbGluZyBzbGFzaFxuXG5cdFx0aWYgKCF0aGlzLmlzVXJsKGJhc2VVcmwpKSB0aHJvdyBuZXcgQXJndW1lbnRFcnJvcihcImJhc2VVcmwgaXMgaW52YWxpZC5cIik7XG5cblx0XHR0aGlzLmJhc2VVcmwgPSBiYXNlVXJsO1xuXHRcdHRoaXMuYXV0aG9yaXphdGlvblRva2VuID0gb3B0aW9ucy5hdXRob3JpemF0aW9uVG9rZW47XG5cdH1cblxuXHQvKipcblx0ICogR2V0IHRoZSBiYXNlVXJsXG5cdCAqL1xuXHRnZXRCYXNlVXJsKCk6c3RyaW5nIHtcblx0XHRyZXR1cm4gdGhpcy5iYXNlVXJsO1xuXHR9XG5cblx0LyoqXG5cdCAqIFNldCB0aGUgYXV0aG9yaXphdGlvbiB0b2tlbi4gVXNlZCBieSBhbGwgZnV0dXJlIHJlcXVlc3RzLlxuXHQgKi9cblx0c2V0QXV0aG9yaXphdGlvblRva2VuKGF1dGhvcml6YXRpb25Ub2tlbjpzdHJpbmcpOnZvaWQge1xuXHRcdHRoaXMuYXV0aG9yaXphdGlvblRva2VuID0gYXV0aG9yaXphdGlvblRva2VuO1xuXHR9XG5cblx0LyoqXG5cdCAqIFF1ZXVlIGFuIEVtYWlsIE1lc3NhZ2UgZm9yIHNlbmRpbmdcblx0ICovXG5cdGFzeW5jIHNlbmRFbWFpbChtZXNzYWdlOkVtYWlsTWVzc2FnZSk6UHJvbWlzZTxTZW5kUmVzcG9uc2U+IHtcblx0XHRyZXR1cm4gYXdhaXQgdGhpcy5leGVjdXRlUmVxdWVzdChcIi9tZXNzYWdlL2VtYWlsXCIsIFwiY3JlYXRlLWVtYWlsXCIsIHtcblx0XHRcdFRlbXBsYXRlU2x1ZzogbWVzc2FnZS50ZW1wbGF0ZVNsdWcsXG5cdFx0XHRUZW1wbGF0ZUxvY2FsZTogbWVzc2FnZS50ZW1wbGF0ZUxvY2FsZSxcblx0XHRcdFJlY2lwaWVudDoge1xuXHRcdFx0XHROYW1lOiBtZXNzYWdlLnJlY2lwaWVudC5uYW1lLFxuXHRcdFx0XHRFbWFpbDogbWVzc2FnZS5yZWNpcGllbnQuZW1haWwsXG5cdFx0XHR9LFxuXHRcdFx0TWVyZ2VWYWx1ZXM6IG1lc3NhZ2UubWVyZ2VWYWx1ZXNcblx0XHR9KTtcblx0fVxuXG5cdC8qKlxuXHQgKiBRdWV1ZSBhbiBTTVMgTWVzc2FnZSBmb3Igc2VuZGluZ1xuXHQgKi9cblx0YXN5bmMgc2VuZFNtcyhtZXNzYWdlOlNtc01lc3NhZ2UpOlByb21pc2U8U2VuZFJlc3BvbnNlPiB7XG5cdFx0cmV0dXJuIGF3YWl0IHRoaXMuZXhlY3V0ZVJlcXVlc3QoXCIvbWVzc2FnZS9zbXNcIiwgXCJjcmVhdGUtc21zXCIsIHtcblx0XHRcdFRlbXBsYXRlU2x1ZzogbWVzc2FnZS50ZW1wbGF0ZVNsdWcsXG5cdFx0XHRUZW1wbGF0ZUxvY2FsZTogbWVzc2FnZS50ZW1wbGF0ZUxvY2FsZSxcblx0XHRcdFJlY2lwaWVudDoge1xuXHRcdFx0XHRQaG9uZTogbWVzc2FnZS5yZWNpcGllbnQucGhvbmUsXG5cdFx0XHR9LFxuXHRcdFx0TWVyZ2VWYWx1ZXM6IG1lc3NhZ2UubWVyZ2VWYWx1ZXMsXG5cdFx0fSk7XG5cdH1cblxuXHRwcml2YXRlIGFzeW5jIGV4ZWN1dGVSZXF1ZXN0KHVyaTpzdHJpbmcsIGNvbnRlbnRUeXBlUmVzb3VyY2U6c3RyaW5nLCBtZXNzYWdlOmFueSk6UHJvbWlzZTxTZW5kUmVzcG9uc2U+IHtcblxuXHRcdGxldCByZXF1ZXN0RGF0YTphbnkgPSBKU09OLnN0cmluZ2lmeShtZXNzYWdlKTtcblxuXHRcdGxldCByZXNwb25zZUJvZHlUZXh0OnN0cmluZ3x1bmRlZmluZWQgPSB1bmRlZmluZWQ7XG5cdFx0bGV0IHJlc3BvbnNlQm9keTphbnkgPSB1bmRlZmluZWQ7XG5cblx0XHRsZXQgcmVzcG9uc2U6UmVzcG9uc2V8dW5kZWZpbmVkO1xuXG5cdFx0dHJ5IHtcblx0XHRcdHJlc3BvbnNlID0gYXdhaXQgZmV0Y2godGhpcy5iYXNlVXJsICsgdXJpLCB7XG5cdFx0XHRcdG1ldGhvZDogXCJQT1NUXCIsXG5cdFx0XHRcdGhlYWRlcnM6IHtcblx0XHRcdFx0XHRcIkNvbnRlbnQtVHlwZVwiOiBgYXBwbGljYXRpb24vdm5kLm5vdGlmaWNhdGlvbi4ke2NvbnRlbnRUeXBlUmVzb3VyY2V9LnYxK2pzb25gLFxuXHRcdFx0XHRcdFwiQXV0aG9yaXphdGlvblwiOiB0aGlzLmF1dGhvcml6YXRpb25Ub2tlbixcblx0XHRcdFx0fSxcblx0XHRcdFx0Ym9keTogcmVxdWVzdERhdGEsXG5cdFx0XHR9KTtcblx0XHRcdHJlc3BvbnNlQm9keVRleHQgPSBhd2FpdCByZXNwb25zZS50ZXh0KCk7XG5cdFx0fSBjYXRjaCAoZXg6YW55KSB7XG5cdFx0XHR0aHJvdyBuZXcgRmV0Y2hFcnJvcigoZXggYXMgRXJyb3IpLm1lc3NhZ2UsIHsgY2F1c2U6IGV4IH0pO1xuXHRcdH1cblxuXHRcdGlmICghcmVzcG9uc2UpIHtcblx0XHRcdHRocm93IG5ldyBSZXNwb25zZUVycm9yKFwiU2VydmVyIGRpZCBub3QgcmVzcG9uZFwiKTtcblx0XHR9XG5cblx0XHRpZiAocmVzcG9uc2Uuc3RhdHVzID09PSA0MDEgfHwgcmVzcG9uc2Uuc3RhdHVzID09PSA0MDMpIHtcdC8vIEFXUyBIVFRQIEFQSSBHYXRld2F5IHJldHVybnMgNDAzIGZyb20gdGhlIGF1dGhvcml6ZXIgKGluc3RlYWQgb2YgNDAxKSBpZiB0aGUgY3JlZGVudGlhbHMgYXJlIGludmFsaWRcblx0XHRcdHRocm93IG5ldyBBdXRob3JpemF0aW9uRXJyb3IoXCJBdXRob3JpemF0aW9uIEZhaWxlZFwiKTtcblx0XHR9IGVsc2UgaWYgKHJlc3BvbnNlLnN0YXR1cyA9PT0gNDA0KSB7XG5cdFx0XHR0aHJvdyBuZXcgUmVzcG9uc2VFcnJvcihcIlJlc291cmNlIG5vdCBmb3VuZFwiKTtcblx0XHR9XG5cblx0XHR0cnkge1xuXHRcdFx0cmVzcG9uc2VCb2R5ID0gcmVzcG9uc2VCb2R5VGV4dCAmJiBKU09OLnBhcnNlKHJlc3BvbnNlQm9keVRleHQpO1xuXHRcdH0gY2F0Y2ggKGV4KSB7XG5cdFx0XHR0aHJvdyBuZXcgUmVzcG9uc2VFcnJvcihcIkludmFsaWQgcmVzcG9uc2UgY29udGVudFwiLCB7IGNhdXNlOiByZXNwb25zZUJvZHlUZXh0fSk7XG5cdFx0fVxuXG5cdFx0aWYgKHJlc3BvbnNlLnN0YXR1cyAhPSAyMDApIHtcblx0XHRcdHRocm93IG5ldyBSZXNwb25zZUVycm9yKHJlc3BvbnNlQm9keS5FcnJvciB8fCByZXNwb25zZUJvZHlUZXh0KTtcblx0XHR9XG5cblx0XHRyZXR1cm4gcmVzcG9uc2VCb2R5IGFzIFNlbmRSZXNwb25zZTtcblx0fVxuXG5cdHByaXZhdGUgaXNVcmwodmFsdWU6c3RyaW5nKTpib29sZWFuIHtcblx0XHR0cnkge1xuXHRcdFx0Y29uc3QgdXJsID0gbmV3IFVSTCh2YWx1ZSk7XG5cdFx0XHRyZXR1cm4gdXJsLnByb3RvY29sID09PSBcImh0dHA6XCIgfHwgdXJsLnByb3RvY29sID09PSBcImh0dHBzOlwiO1xuXHRcdH0gY2F0Y2ggeyB9XG5cblx0XHRyZXR1cm4gZmFsc2U7XG5cdH1cbn1cblxuZXhwb3J0IGludGVyZmFjZSBTZW5kUmVzcG9uc2Uge1xuXHRNZXNzYWdlSUQ6IHN0cmluZyxcbn1cbmV4cG9ydCBpbnRlcmZhY2UgTm90aWZpY2F0aW9uTWVzc2FnZU9wdGlvbnMgeyBhdXRob3JpemF0aW9uVG9rZW46IHN0cmluZyB9XG5cbmV4cG9ydCBjbGFzcyBFbWFpbFJlY2lwaWVudCB7XG5cdG5hbWU6IHN0cmluZztcblx0ZW1haWw6IHN0cmluZztcblxuXHQvKipcblx0ICogVGhlIHJlY2lwaWVudCBmb3IgYW4gZW1haWwgbWVzc2FnZS5cblx0ICovXG5cdGNvbnN0cnVjdG9yKG5hbWU6c3RyaW5nLCBlbWFpbDpzdHJpbmcpIHtcblx0XHR0aGlzLm5hbWUgPSBuYW1lO1xuXHRcdHRoaXMuZW1haWwgPSBlbWFpbDtcblx0fVxufVxuXG5leHBvcnQgY2xhc3MgRW1haWxNZXNzYWdlIHtcblx0dGVtcGxhdGVTbHVnOnN0cmluZztcblx0dGVtcGxhdGVMb2NhbGU6c3RyaW5nfHVuZGVmaW5lZDtcblx0cmVjaXBpZW50OkVtYWlsUmVjaXBpZW50O1xuXHRtZXJnZVZhbHVlczpSZWNvcmQ8c3RyaW5nLCBhbnk+fHVuZGVmaW5lZDtcblx0bWV0YWRhdGE6UmVjb3JkPHN0cmluZyxzdHJpbmc+fHVuZGVmaW5lZDtcblxuXHQvKipcblx0ICogRW1haWwgTWVzc2FnZSBpbmZvcm1hdGlvbiB1c2VkIHRvIHNlbmQgYW4gZW1haWwuXG5cdCAqL1xuXHRjb25zdHJ1Y3Rvcih0ZW1wbGF0ZVNsdWc6c3RyaW5nLCB0ZW1wbGF0ZUxvY2FsZTpzdHJpbmd8dW5kZWZpbmVkLCByZWNpcGllbnQ6RW1haWxSZWNpcGllbnQsIG1lcmdlVmFsdWVzOlJlY29yZDxzdHJpbmcsIGFueT58dW5kZWZpbmVkLCBtZXRhZGF0YTpSZWNvcmQ8c3RyaW5nLHN0cmluZz58dW5kZWZpbmVkKSB7XG5cdFx0dGhpcy50ZW1wbGF0ZVNsdWcgPSB0ZW1wbGF0ZVNsdWc7XG5cdFx0dGhpcy50ZW1wbGF0ZUxvY2FsZSA9IHRlbXBsYXRlTG9jYWxlO1xuXHRcdHRoaXMucmVjaXBpZW50ID0gcmVjaXBpZW50O1xuXHRcdHRoaXMubWVyZ2VWYWx1ZXMgPSBtZXJnZVZhbHVlcztcblx0XHR0aGlzLm1ldGFkYXRhID0gbWV0YWRhdGE7XG5cblx0XHRpZiAoISh0aGlzLnJlY2lwaWVudCBpbnN0YW5jZW9mIEVtYWlsUmVjaXBpZW50KSkgdGhyb3cgbmV3IEVycm9yKFwicmVjaXBpZW50IG11c3QgYmUgYW4gaW5zdGFuY2Ugb2YgRW1haWxSZWNpcGllbnRcIik7XG5cdFx0aWYgKHRoaXMubWVyZ2VWYWx1ZXMgIT0gdW5kZWZpbmVkICYmICEodGhpcy5tZXJnZVZhbHVlcyBpbnN0YW5jZW9mIE9iamVjdCkpIHRocm93IG5ldyBFcnJvcihcIm1lcmdlVmFsdWVzIG11c3QgYmUgYSBzaW1wbGUgb2JqZWN0XCIpO1xuXHRcdGlmICh0aGlzLm1ldGFkYXRhICE9IHVuZGVmaW5lZCAmJiAhKHRoaXMubWV0YWRhdGEgaW5zdGFuY2VvZiBPYmplY3QpKSB0aHJvdyBuZXcgRXJyb3IoXCJtZXRhZGF0YSBtdXN0IGJlIGEgc2ltcGxlIG9iamVjdFwiKTtcblx0fVxufVxuXG5leHBvcnQgY2xhc3MgU21zUmVjaXBpZW50IHtcblx0cGhvbmU6c3RyaW5nO1xuXG5cdC8qKlxuXHQgKiBUaGUgcmVjaXBpZW50IGZvciBhbiBTTVMgbWVzc2FnZS5cblx0ICovXG5cdGNvbnN0cnVjdG9yKHBob25lOnN0cmluZykge1xuXHRcdHRoaXMucGhvbmUgPSBwaG9uZTtcblx0fVxufVxuXG5leHBvcnQgY2xhc3MgU21zTWVzc2FnZSB7XG5cdHRlbXBsYXRlU2x1ZzpzdHJpbmc7XG5cdHRlbXBsYXRlTG9jYWxlOnN0cmluZ3x1bmRlZmluZWQ7XG5cdHJlY2lwaWVudDpTbXNSZWNpcGllbnQ7XG5cdG1lcmdlVmFsdWVzOlJlY29yZDxzdHJpbmcsIGFueT58dW5kZWZpbmVkO1xuXHRtZXRhZGF0YTpSZWNvcmQ8c3RyaW5nLCBzdHJpbmc+fHVuZGVmaW5lZDtcblxuXHQvKipcblx0ICogVGhlIG1lc3NhZ2UgaW5mb3JtYXRpb24gZm9yIHNlbmRpbmcgYW4gU01TIG1lc3NhZ2UuXG5cdCAqIEBwYXJhbSB7c3RyaW5nfSB0ZW1wbGF0ZVNsdWdcblx0ICogQHBhcmFtIHtzdHJpbmd8dW5kZWZpbmVkfSB0ZW1wbGF0ZUxvY2FsZVxuXHQgKiBAcGFyYW0ge1Ntc1JlY2lwaWVudH0gcmVjaXBpZW50XG5cdCAqIEBwYXJhbSB7T2JqZWN0fSBtZXJnZVZhbHVlc1xuXHQgKiBAcGFyYW0ge01ldGFkYXRhfSBtZXRhZGF0YVxuXHQgKi9cblx0Y29uc3RydWN0b3IodGVtcGxhdGVTbHVnOnN0cmluZywgdGVtcGxhdGVMb2NhbGU6c3RyaW5nfHVuZGVmaW5lZCwgcmVjaXBpZW50OlNtc1JlY2lwaWVudCwgbWVyZ2VWYWx1ZXM6UmVjb3JkPHN0cmluZywgYW55Pnx1bmRlZmluZWQsIG1ldGFkYXRhOlJlY29yZDxzdHJpbmcsc3RyaW5nPnx1bmRlZmluZWQpIHtcblx0XHR0aGlzLnRlbXBsYXRlU2x1ZyA9IHRlbXBsYXRlU2x1Zztcblx0XHR0aGlzLnRlbXBsYXRlTG9jYWxlID0gdGVtcGxhdGVMb2NhbGU7XG5cdFx0dGhpcy5yZWNpcGllbnQgPSByZWNpcGllbnQ7XG5cdFx0dGhpcy5tZXJnZVZhbHVlcyA9IG1lcmdlVmFsdWVzO1xuXHRcdHRoaXMubWV0YWRhdGEgPSBtZXRhZGF0YTtcblxuXHRcdGlmICghKHRoaXMucmVjaXBpZW50IGluc3RhbmNlb2YgU21zUmVjaXBpZW50KSkgdGhyb3cgbmV3IEVycm9yKFwicmVjaXBpZW50IG11c3QgYmUgYW4gaW5zdGFuY2Ugb2YgU21zUmVjaXBpZW50XCIpO1xuXHRcdGlmICh0aGlzLm1lcmdlVmFsdWVzICE9IHVuZGVmaW5lZCAmJiAhKHRoaXMubWVyZ2VWYWx1ZXMgaW5zdGFuY2VvZiBPYmplY3QpKSB0aHJvdyBuZXcgRXJyb3IoXCJtZXJnZVZhbHVlcyBtdXN0IGJlIGFuIG9iamVjdFwiKTtcblx0XHRpZiAodGhpcy5tZXRhZGF0YSAhPSB1bmRlZmluZWQgJiYgISh0aGlzLm1ldGFkYXRhIGluc3RhbmNlb2YgT2JqZWN0KSkgdGhyb3cgbmV3IEVycm9yKFwibWV0YWRhdGEgbXVzdCBiZSBhIHNpbXBsZSBvYmplY3RcIik7XG5cdH1cbn1cbiJdfQ==
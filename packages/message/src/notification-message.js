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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibm90aWZpY2F0aW9uLW1lc3NhZ2UuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJub3RpZmljYXRpb24tbWVzc2FnZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFBQSxxQ0FBd0Y7QUFDeEYsMkNBQTZDO0FBRTdDLE1BQWEsbUJBQW1CO0lBTy9CLFlBQVksT0FBZSxFQUFFLE9BQW1DO1FBQy9ELE9BQU8sR0FBRyxPQUFPLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssR0FBRyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUM7UUFFckUsSUFBSSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDO1lBQUUsTUFBTSxJQUFJLHNCQUFhLENBQUMscUJBQXFCLENBQUMsQ0FBQztRQUV6RSxJQUFJLENBQUMsT0FBTyxHQUFHLE9BQU8sQ0FBQztRQUN2QixJQUFJLENBQUMsa0JBQWtCLEdBQUcsT0FBTyxDQUFDLGtCQUFrQixDQUFDO0lBQ3RELENBQUM7SUFLRCxVQUFVO1FBQ1QsT0FBTyxJQUFJLENBQUMsT0FBTyxDQUFDO0lBQ3JCLENBQUM7SUFLRCxxQkFBcUIsQ0FBQyxrQkFBeUI7UUFDOUMsSUFBSSxDQUFDLGtCQUFrQixHQUFHLGtCQUFrQixDQUFDO0lBQzlDLENBQUM7SUFLRCxLQUFLLENBQUMsU0FBUyxDQUFDLE9BQW9CO1FBQ25DLE9BQU8sTUFBTSxJQUFJLENBQUMsY0FBYyxDQUFDLGdCQUFnQixFQUFFLGNBQWMsRUFBRTtZQUNsRSxZQUFZLEVBQUUsT0FBTyxDQUFDLFlBQVk7WUFDbEMsY0FBYyxFQUFFLE9BQU8sQ0FBQyxjQUFjO1lBQ3RDLFNBQVMsRUFBRTtnQkFDVixJQUFJLEVBQUUsT0FBTyxDQUFDLFNBQVMsQ0FBQyxJQUFJO2dCQUM1QixLQUFLLEVBQUUsT0FBTyxDQUFDLFNBQVMsQ0FBQyxL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WSxHQUFHLFlBQVksQ0FBQztRQUNqQyxJQUFJLENBQUMsY0FBYyxHQUFHLGNBQWMsQ0FBQztRQUNyQyxJQUFJLENBQUMsU0FBUyxHQUFHLFNBQVMsQ0FBQztRQUMzQixJQUFJLENBQUMsV0FBVyxHQUFHLFdBQVcsQ0FBQztRQUMvQixJQUFJLENBQUMsUUFBUSxHQUFHLFFBQVEsQ0FBQztRQUV6QixJQUFJLENBQUMsQ0FBQyxJQUFJLENBQUMsU0FBUyxZQUFZLFlBQVksQ0FBQztZQUFFLE1BQU0sSUFBSSxLQUFLLENBQUMsK0NBQStDLENBQUMsQ0FBQztRQUNoSCxJQUFJLElBQUksQ0FBQyxXQUFXLElBQUksU0FBUyxJQUFJLENBQUMsQ0FBQyxJQUFJLENBQUMsV0FBVyxZQUFZLE1BQU0sQ0FBQztZQUFFLE1BQU0sSUFBSSxLQUFLLENBQUMsK0JBQStCLENBQUMsQ0FBQztRQUM3SCxJQUFJLElBQUksQ0FBQyxRQUFRLElBQUksU0FBUyxJQUFJLENBQUMsQ0FBQyxJQUFJLENBQUMsUUFBUSxZQUFZLE1BQU0sQ0FBQztZQUFFLE1BQU0sSUFBSSxLQUFLLENBQUMsa0NBQWtDLENBQUMsQ0FBQztJQUMzSCxDQUFDO0NBQ0Q7QUExQkQsZ0NBMEJDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgQXJndW1lbnRFcnJvciwgQXV0aG9yaXphdGlvbkVycm9yLCBGZXRjaEVycm9yLCBSZXNwb25zZUVycm9yIH0gZnJvbSBcIi4vZXJyb3JzXCI7XG5pbXBvcnQgZmV0Y2gsIHsgUmVzcG9uc2UgfSBmcm9tIFwibm9kZS1mZXRjaFwiO1xuXG5leHBvcnQgY2xhc3MgTm90aWZpY2F0aW9uTWVzc2FnZSB7XG5cdHByaXZhdGUgYmFzZVVybDpzdHJpbmc7XG5cdHByaXZhdGUgYXV0aG9yaXphdGlvblRva2VuOnN0cmluZztcblxuXHQvKipcblx0ICogTm90aWZpY2F0aW9uIE1lc3NhZ2luZyBzZXJ2aWNlIGNsaWVudC5cblx0ICovXG5cdGNvbnN0cnVjdG9yKGJhc2VVcmw6IHN0cmluZywgb3B0aW9uczogTm90aWZpY2F0aW9uTWVzc2FnZU9wdGlvbnMpIHtcblx0XHRiYXNlVXJsID0gYmFzZVVybC5zbGljZSgtMSkgPT09IFwiL1wiID8gYmFzZVVybC5zbGljZSgwLCAtMSkgOiBiYXNlVXJsO1x0Ly8gcmVtb3ZlIHRyYWlsaW5nIHNsYXNoXG5cblx0XHRpZiAoIXRoaXMuaXNVcmwoYmFzZVVybCkpIHRocm93IG5ldyBBcmd1bWVudEVycm9yKFwiYmFzZVVybCBpcyBpbnZhbGlkLlwiKTtcblxuXHRcdHRoaXMuYmFzZVVybCA9IGJhc2VVcmw7XG5cdFx0dGhpcy5hdXRob3JpemF0aW9uVG9rZW4gPSBvcHRpb25zLmF1dGhvcml6YXRpb25Ub2tlbjtcblx0fVxuXG5cdC8qKlxuXHQgKiBHZXQgdGhlIGJhc2VVcmxcblx0ICovXG5cdGdldEJhc2VVcmwoKTpzdHJpbmcge1xuXHRcdHJldHVybiB0aGlzLmJhc2VVcmw7XG5cdH1cblxuXHQvKipcblx0ICogU2V0IHRoZSBhdXRob3JpemF0aW9uIHRva2VuLiBVc2VkIGJ5IGFsbCBmdXR1cmUgcmVxdWVzdHMuXG5cdCAqL1xuXHRzZXRBdXRob3JpemF0aW9uVG9rZW4oYXV0aG9yaXphdGlvblRva2VuOnN0cmluZyk6dm9pZCB7XG5cdFx0dGhpcy5hdXRob3JpemF0aW9uVG9rZW4gPSBhdXRob3JpemF0aW9uVG9rZW47XG5cdH1cblxuXHQvKipcblx0ICogUXVldWUgYW4gRW1haWwgTWVzc2FnZSBmb3Igc2VuZGluZ1xuXHQgKi9cblx0YXN5bmMgc2VuZEVtYWlsKG1lc3NhZ2U6RW1haWxNZXNzYWdlKTpQcm9taXNlPFNlbmRSZXNwb25zZT4ge1xuXHRcdHJldHVybiBhd2FpdCB0aGlzLmV4ZWN1dGVSZXF1ZXN0KFwiL21lc3NhZ2UvZW1haWxcIiwgXCJjcmVhdGUtZW1haWxcIiwge1xuXHRcdFx0VGVtcGxhdGVTbHVnOiBtZXNzYWdlLnRlbXBsYXRlU2x1Zyxcblx0XHRcdFRlbXBsYXRlTG9jYWxlOiBtZXNzYWdlLnRlbXBsYXRlTG9jYWxlLFxuXHRcdFx0UmVjaXBpZW50OiB7XG5cdFx0XHRcdE5hbWU6IG1lc3NhZ2UucmVjaXBpZW50Lm5hbWUsXG5cdFx0XHRcdEVtYWlsOiBtZXNzYWdlLnJlY2lwaWVudC5lbWFpbCxcblx0XHRcdH0sXG5cdFx0XHRNZXJnZVZhbHVlczogbWVzc2FnZS5tZXJnZVZhbHVlc1xuXHRcdH0pO1xuXHR9XG5cblx0LyoqXG5cdCAqIFF1ZXVlIGFuIFNNUyBNZXNzYWdlIGZvciBzZW5kaW5nXG5cdCAqL1xuXHRhc3luYyBzZW5kU21zKG1lc3NhZ2U6U21zTWVzc2FnZSk6UHJvbWlzZTxTZW5kUmVzcG9uc2U+IHtcblx0XHRyZXR1cm4gYXdhaXQgdGhpcy5leGVjdXRlUmVxdWVzdChcIi9tZXNzYWdlL3Ntc1wiLCBcImNyZWF0ZS1zbXNcIiwge1xuXHRcdFx0VGVtcGxhdGVTbHVnOiBtZXNzYWdlLnRlbXBsYXRlU2x1Zyxcblx0XHRcdFRlbXBsYXRlTG9jYWxlOiBtZXNzYWdlLnRlbXBsYXRlTG9jYWxlLFxuXHRcdFx0UmVjaXBpZW50OiB7XG5cdFx0XHRcdFBob25lOiBtZXNzYWdlLnJlY2lwaWVudC5waG9uZSxcblx0XHRcdH0sXG5cdFx0XHRNZXJnZVZhbHVlczogbWVzc2FnZS5tZXJnZVZhbHVlcyxcblx0XHR9KTtcblx0fVxuXG5cdHByaXZhdGUgYXN5bmMgZXhlY3V0ZVJlcXVlc3QodXJpOnN0cmluZywgY29udGVudFR5cGVSZXNvdXJjZTpzdHJpbmcsIG1lc3NhZ2U6YW55KTpQcm9taXNlPFNlbmRSZXNwb25zZT4ge1xuXG5cdFx0bGV0IHJlcXVlc3REYXRhOmFueSA9IEpTT04uc3RyaW5naWZ5KG1lc3NhZ2UpO1xuXG5cdFx0bGV0IHJlc3BvbnNlQm9keVRleHQ6c3RyaW5nfHVuZGVmaW5lZCA9IHVuZGVmaW5lZDtcblx0XHRsZXQgcmVzcG9uc2VCb2R5OmFueSA9IHVuZGVmaW5lZDtcblxuXHRcdGxldCByZXNwb25zZTpSZXNwb25zZXx1bmRlZmluZWQ7XG5cblx0XHR0cnkge1xuXHRcdFx0cmVzcG9uc2UgPSBhd2FpdCBmZXRjaCh0aGlzLmJhc2VVcmwgKyB1cmksIHtcblx0XHRcdFx0bWV0aG9kOiBcIlBPU1RcIixcblx0XHRcdFx0aGVhZGVyczoge1xuXHRcdFx0XHRcdFwiQ29udGVudC1UeXBlXCI6IGBhcHBsaWNhdGlvbi92bmQubm90aWZpY2F0aW9uLiR7Y29udGVudFR5cGVSZXNvdXJjZX0udjEranNvbmAsXG5cdFx0XHRcdFx0XCJBdXRob3JpemF0aW9uXCI6IHRoaXMuYXV0aG9yaXphdGlvblRva2VuLFxuXHRcdFx0XHR9LFxuXHRcdFx0XHRib2R5OiByZXF1ZXN0RGF0YSxcblx0XHRcdH0pO1xuXHRcdFx0cmVzcG9uc2VCb2R5VGV4dCA9IGF3YWl0IHJlc3BvbnNlLnRleHQoKTtcblx0XHR9IGNhdGNoIChleDphbnkpIHtcblx0XHRcdHRocm93IG5ldyBGZXRjaEVycm9yKChleCBhcyBFcnJvcikubWVzc2FnZSwgeyBjYXVzZTogZXggfSk7XG5cdFx0fVxuXG5cdFx0aWYgKCFyZXNwb25zZSkge1xuXHRcdFx0dGhyb3cgbmV3IFJlc3BvbnNlRXJyb3IoXCJTZXJ2ZXIgZGlkIG5vdCByZXNwb25kXCIpO1xuXHRcdH1cblxuXHRcdGlmIChyZXNwb25zZS5zdGF0dXMgPT09IDQwMSB8fCByZXNwb25zZS5zdGF0dXMgPT09IDQwMykge1x0Ly8gQVdTIEhUVFAgQVBJIEdhdGV3YXkgcmV0dXJucyA0MDMgZnJvbSB0aGUgYXV0aG9yaXplciAoaW5zdGVhZCBvZiA0MDEpIGlmIHRoZSBjcmVkZW50aWFscyBhcmUgaW52YWxpZFxuXHRcdFx0dGhyb3cgbmV3IEF1dGhvcml6YXRpb25FcnJvcihcIkF1dGhvcml6YXRpb24gRmFpbGVkXCIpO1xuXHRcdH0gZWxzZSBpZiAocmVzcG9uc2Uuc3RhdHVzID09PSA0MDQpIHtcblx0XHRcdHRocm93IG5ldyBSZXNwb25zZUVycm9yKFwiUmVzb3VyY2Ugbm90IGZvdW5kXCIpO1xuXHRcdH1cblxuXHRcdHRyeSB7XG5cdFx0XHRyZXNwb25zZUJvZHkgPSByZXNwb25zZUJvZHlUZXh0ICYmIEpTT04ucGFyc2UocmVzcG9uc2VCb2R5VGV4dCk7XG5cdFx0fSBjYXRjaCAoZXgpIHtcblx0XHRcdHRocm93IG5ldyBSZXNwb25zZUVycm9yKFwiSW52YWxpZCByZXNwb25zZSBjb250ZW50XCIsIHsgY2F1c2U6IHJlc3BvbnNlQm9keVRleHR9KTtcblx0XHR9XG5cblx0XHRpZiAocmVzcG9uc2Uuc3RhdHVzICE9IDIwMCkge1xuXHRcdFx0dGhyb3cgbmV3IFJlc3BvbnNlRXJyb3IocmVzcG9uc2VCb2R5LkVycm9yIHx8IHJlc3BvbnNlQm9keVRleHQpO1xuXHRcdH1cblxuXHRcdHJldHVybiByZXNwb25zZUJvZHkgYXMgU2VuZFJlc3BvbnNlO1xuXHR9XG5cblx0cHJpdmF0ZSBpc1VybCh2YWx1ZTpzdHJpbmcpOmJvb2xlYW4ge1xuXHRcdHRyeSB7XG5cdFx0XHRjb25zdCB1cmwgPSBuZXcgVVJMKHZhbHVlKTtcblx0XHRcdHJldHVybiB1cmwucHJvdG9jb2wgPT09IFwiaHR0cDpcIiB8fCB1cmwucHJvdG9jb2wgPT09IFwiaHR0cHM6XCI7XG5cdFx0fSBjYXRjaCB7IH1cblxuXHRcdHJldHVybiBmYWxzZTtcblx0fVxufVxuXG5leHBvcnQgaW50ZXJmYWNlIFNlbmRSZXNwb25zZSB7XG5cdE1lc3NhZ2VJRDogc3RyaW5nLFxufVxuZXhwb3J0IGludGVyZmFjZSBOb3RpZmljYXRpb25NZXNzYWdlT3B0aW9ucyB7IGF1dGhvcml6YXRpb25Ub2tlbjogc3RyaW5nIH1cblxuZXhwb3J0IGNsYXNzIEVtYWlsUmVjaXBpZW50IHtcblx0bmFtZTogc3RyaW5nO1xuXHRlbWFpbDogc3RyaW5nO1xuXG5cdC8qKlxuXHQgKiBUaGUgcmVjaXBpZW50IGZvciBhbiBlbWFpbCBtZXNzYWdlLlxuXHQgKi9cblx0Y29uc3RydWN0b3IobmFtZTpzdHJpbmcsIGVtYWlsOnN0cmluZykge1xuXHRcdHRoaXMubmFtZSA9IG5hbWU7XG5cdFx0dGhpcy5lbWFpbCA9IGVtYWlsO1xuXHR9XG59XG5cbmV4cG9ydCBjbGFzcyBFbWFpbE1lc3NhZ2Uge1xuXHR0ZW1wbGF0ZVNsdWc6c3RyaW5nO1xuXHR0ZW1wbGF0ZUxvY2FsZTpzdHJpbmd8dW5kZWZpbmVkO1xuXHRyZWNpcGllbnQ6RW1haWxSZWNpcGllbnQ7XG5cdG1lcmdlVmFsdWVzOlJlY29yZDxzdHJpbmcsIGFueT58dW5kZWZpbmVkO1xuXHRtZXRhZGF0YTpSZWNvcmQ8c3RyaW5nLHN0cmluZz58dW5kZWZpbmVkO1xuXG5cdC8qKlxuXHQgKiBFbWFpbCBNZXNzYWdlIGluZm9ybWF0aW9uIHVzZWQgdG8gc2VuZCBhbiBlbWFpbC5cblx0ICovXG5cdGNvbnN0cnVjdG9yKHRlbXBsYXRlU2x1ZzpzdHJpbmcsIHRlbXBsYXRlTG9jYWxlOnN0cmluZ3x1bmRlZmluZWQsIHJlY2lwaWVudDpFbWFpbFJlY2lwaWVudCwgbWVyZ2VWYWx1ZXM6UmVjb3JkPHN0cmluZywgYW55Pnx1bmRlZmluZWQsIG1ldGFkYXRhOlJlY29yZDxzdHJpbmcsc3RyaW5nPnx1bmRlZmluZWQpIHtcblx0XHR0aGlzLnRlbXBsYXRlU2x1ZyA9IHRlbXBsYXRlU2x1Zztcblx0XHR0aGlzLnRlbXBsYXRlTG9jYWxlID0gdGVtcGxhdGVMb2NhbGU7XG5cdFx0dGhpcy5yZWNpcGllbnQgPSByZWNpcGllbnQ7XG5cdFx0dGhpcy5tZXJnZVZhbHVlcyA9IG1lcmdlVmFsdWVzO1xuXHRcdHRoaXMubWV0YWRhdGEgPSBtZXRhZGF0YTtcblxuXHRcdGlmICghKHRoaXMucmVjaXBpZW50IGluc3RhbmNlb2YgRW1haWxSZWNpcGllbnQpKSB0aHJvdyBuZXcgRXJyb3IoXCJyZWNpcGllbnQgbXVzdCBiZSBhbiBpbnN0YW5jZSBvZiBFbWFpbFJlY2lwaWVudFwiKTtcblx0XHRpZiAodGhpcy5tZXJnZVZhbHVlcyAhPSB1bmRlZmluZWQgJiYgISh0aGlzLm1lcmdlVmFsdWVzIGluc3RhbmNlb2YgT2JqZWN0KSkgdGhyb3cgbmV3IEVycm9yKFwibWVyZ2VWYWx1ZXMgbXVzdCBiZSBhIHNpbXBsZSBvYmplY3RcIik7XG5cdFx0aWYgKHRoaXMubWV0YWRhdGEgIT0gdW5kZWZpbmVkICYmICEodGhpcy5tZXRhZGF0YSBpbnN0YW5jZW9mIE9iamVjdCkpIHRocm93IG5ldyBFcnJvcihcIm1ldGFkYXRhIG11c3QgYmUgYSBzaW1wbGUgb2JqZWN0XCIpO1xuXHR9XG59XG5cbmV4cG9ydCBjbGFzcyBTbXNSZWNpcGllbnQge1xuXHRwaG9uZTpzdHJpbmc7XG5cblx0LyoqXG5cdCAqIFRoZSByZWNpcGllbnQgZm9yIGFuIFNNUyBtZXNzYWdlLlxuXHQgKi9cblx0Y29uc3RydWN0b3IocGhvbmU6c3RyaW5nKSB7XG5cdFx0dGhpcy5waG9uZSA9IHBob25lO1xuXHR9XG59XG5cbmV4cG9ydCBjbGFzcyBTbXNNZXNzYWdlIHtcblx0dGVtcGxhdGVTbHVnOnN0cmluZztcblx0dGVtcGxhdGVMb2NhbGU6c3RyaW5nfHVuZGVmaW5lZDtcblx0cmVjaXBpZW50OlNtc1JlY2lwaWVudDtcblx0bWVyZ2VWYWx1ZXM6UmVjb3JkPHN0cmluZywgYW55Pnx1bmRlZmluZWQ7XG5cdG1ldGFkYXRhOlJlY29yZDxzdHJpbmcsIHN0cmluZz58dW5kZWZpbmVkO1xuXG5cdC8qKlxuXHQgKiBUaGUgbWVzc2FnZSBpbmZvcm1hdGlvbiBmb3Igc2VuZGluZyBhbiBTTVMgbWVzc2FnZS5cblx0ICogQHBhcmFtIHtzdHJpbmd9IHRlbXBsYXRlU2x1Z1xuXHQgKiBAcGFyYW0ge3N0cmluZ3x1bmRlZmluZWR9IHRlbXBsYXRlTG9jYWxlXG5cdCAqIEBwYXJhbSB7U21zUmVjaXBpZW50fSByZWNpcGllbnRcblx0ICogQHBhcmFtIHtPYmplY3R9IG1lcmdlVmFsdWVzXG5cdCAqIEBwYXJhbSB7TWV0YWRhdGF9IG1ldGFkYXRhXG5cdCAqL1xuXHRjb25zdHJ1Y3Rvcih0ZW1wbGF0ZVNsdWc6c3RyaW5nLCB0ZW1wbGF0ZUxvY2FsZTpzdHJpbmd8dW5kZWZpbmVkLCByZWNpcGllbnQ6U21zUmVjaXBpZW50LCBtZXJnZVZhbHVlczpSZWNvcmQ8c3RyaW5nLCBhbnk+fHVuZGVmaW5lZCwgbWV0YWRhdGE6UmVjb3JkPHN0cmluZyxzdHJpbmc+fHVuZGVmaW5lZCkge1xuXHRcdHRoaXMudGVtcGxhdGVTbHVnID0gdGVtcGxhdGVTbHVnO1xuXHRcdHRoaXMudGVtcGxhdGVMb2NhbGUgPSB0ZW1wbGF0ZUxvY2FsZTtcblx0XHR0aGlzLnJlY2lwaWVudCA9IHJlY2lwaWVudDtcblx0XHR0aGlzLm1lcmdlVmFsdWVzID0gbWVyZ2VWYWx1ZXM7XG5cdFx0dGhpcy5tZXRhZGF0YSA9IG1ldGFkYXRhO1xuXG5cdFx0aWYgKCEodGhpcy5yZWNpcGllbnQgaW5zdGFuY2VvZiBTbXNSZWNpcGllbnQpKSB0aHJvdyBuZXcgRXJyb3IoXCJyZWNpcGllbnQgbXVzdCBiZSBhbiBpbnN0YW5jZSBvZiBTbXNSZWNpcGllbnRcIik7XG5cdFx0aWYgKHRoaXMubWVyZ2VWYWx1ZXMgIT0gdW5kZWZpbmVkICYmICEodGhpcy5tZXJnZVZhbHVlcyBpbnN0YW5jZW9mIE9iamVjdCkpIHRocm93IG5ldyBFcnJvcihcIm1lcmdlVmFsdWVzIG11c3QgYmUgYW4gb2JqZWN0XCIpO1xuXHRcdGlmICh0aGlzLm1ldGFkYXRhICE9IHVuZGVmaW5lZCAmJiAhKHRoaXMubWV0YWRhdGEgaW5zdGFuY2VvZiBPYmplY3QpKSB0aHJvdyBuZXcgRXJyb3IoXCJtZXRhZGF0YSBtdXN0IGJlIGEgc2ltcGxlIG9iamVjdFwiKTtcblx0fVxufVxuIl19
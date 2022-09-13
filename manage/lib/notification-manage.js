"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotificationManage = void 0;
const Errors = require("./errors");
const node_fetch_1 = require("node-fetch");
class NotificationManage {
    constructor(baseUrl, options) {
        this.initComplete = false;
        baseUrl = baseUrl.slice(-1) === "/" ? baseUrl.slice(0, -1) : baseUrl; // remove trailing slash
        if (!this.isUrl(baseUrl))
            throw new Errors.ArgumentError("baseUrl is invalid.");
        this.baseUrl = baseUrl;
        this.authorizationToken = options.authorizationToken;
    }
    /**
     * Get the baseUrl
     */
    getBaseUrl() {
        return this.baseUrl;
    }
    /**
     * Set the authorization token. Used by all future requests.
     */
    setAuthorizationToken(authorizationToken) {
        this.authorizationToken = authorizationToken;
    }
    /**
     * Set the Customer ID that will be passed to all API requests.
     */
    configureForOverrideCustomer(customerID) {
        this.customerID = customerID;
    }
    /**
     * Remove the Customer ID. The customer for the Authorization Token will be used for requests.
     */
    clearOverrideCustomer() {
        this.customerID = undefined;
        this.initComplete = false;
    }
    /**
     * Get an info object for the authorized customer.
     */
    async getInfo() {
        const uri = "/manage/info";
        return await this.executeRequest(uri, "GET", "get-info");
    }
    /**
     * Generates a valid API key.
     */
    async generateApiKey() {
        let uri = "/manage/apikey";
        return await this.executeRequest(uri, "POST", "create-apikey");
    }
    /**
     * Get a list of messages. Limits the number of records by pageSize and starting with the record at nextPageID.
     */
    async getMessages(pageSize, nextPageID) {
        let uri = "/manage/customer/{{customerID}}/messages";
        return await this.executeRequest(uri, "GET", "list-message", undefined, {
            pagesize: pageSize,
            nextpage: nextPageID,
        });
    }
    /**
     * Get a message record.
     */
    async getMessage(messageID) {
        const uri = `/manage/customer/{{customerID}}/message/${encodeURIComponent(messageID)}`;
        return await this.executeRequest(uri, "GET", "get-message");
    }
    /**
     * Create an email message.
     */
    async createEmailMessage(emailMessage, test) {
        const uri = "/manage/customer/{{customerID}}/message";
        const contentType = test ? "create-test-email-message" : "create-email-message";
        return await this.executeRequest(uri, "POST", contentType, emailMessage);
    }
    /**
     * Create an SMS message.
     */
    async createSmsMessage(smsMessage, test) {
        const uri = "/manage/customer/{{customerID}}/message";
        const contentType = test ? "create-test-sms-message" : "create-sms-message";
        return await this.executeRequest(uri, "POST", contentType, smsMessage);
    }
    /**
     * Get a list of customers. Only an admin app key can make this request.
     * Limits the number of records by pageSize and starting with the record at nextPageID.
     */
    async getCustomers(pageSize, nextPageID) {
        let uri = "/manage/customers"; // This URI is different. We don't embed the client customer id because the get customers endpoint does not use it.
        return await this.executeRequest(uri, "GET", "list-customer", undefined, {
            pagesize: pageSize,
            nextpage: nextPageID,
        });
    }
    /**
     * Get a customer record. Only an admin app key can get customer records other than its own.
     */
    async getCustomer(customerID) {
        let uri = "/manage/customer"; // This URI is different. We don't embed the client customer id because the get customer endpoint does not use it.
        if (customerID != undefined) {
            uri += "/" + encodeURIComponent(customerID);
        }
        return await this.executeRequest(uri, "GET", "get-customer");
    }
    /**
     * Creates a new customer. Only an admin app key can create customers.
     */
    async createCustomer(customer) {
        let uri = "/manage/customer"; // This URI is different. We don't embed the client customer id because the create customer endpoint does not use it.
        return await this.executeRequest(uri, "POST", "create-customer", customer);
    }
    /**
     * Update an existing customer.
     */
    async updateCustomer(customerID, customer) {
        let uri = `/manage/customer/${encodeURIComponent(customerID)}`; // This URI is different. We don't embed the client customer id because the update customer endpoint does use it.
        return await this.executeRequest(uri, "PATCH", "update-customer", customer);
    }
    /**
     * Delete an existing customer.
     */
    async deleteCustomer(customerID) {
        let uri = `/manage/customer/${encodeURIComponent(customerID)}`; // This URI is different. We don't embed the client customer id because the update customer endpoint does use it.
        return await this.executeRequest(uri, "DELETE", "delete-customer");
    }
    /**
     * Get a list of templates.
     * Limits the number of records by pageSize and starting with the record at nextPageID.
     */
    async getTemplates(pageSize, nextPageID) {
        const uri = "/manage/customer/{{customerID}}/templates";
        return await this.executeRequest(uri, "GET", "list-template", undefined, {
            pagesize: pageSize,
            nextpage: nextPageID,
        });
    }
    /**
     * Get a template record.
     */
    async getTemplate(slug, locale) {
        let uri = `/manage/customer/{{customerID}}/template/${encodeURIComponent(slug)}`;
        if (locale) {
            uri += "/" + encodeURIComponent(locale);
        }
        return await this.executeRequest(uri, "GET", "get-template");
    }
    /**
     * Creates a new template.
     */
    async createTemplate(template) {
        const uri = "/manage/customer/{{customerID}}/template";
        return await this.executeRequest(uri, "POST", "create-template", template);
    }
    /**
     * Update an existing template.
     */
    async updateTemplate(slug, locale, template) {
        let uri = `/manage/customer/{{customerID}}/template/${encodeURIComponent(slug)}`;
        if (locale) {
            uri += "/" + encodeURIComponent(locale);
        }
        return await this.executeRequest(uri, "PATCH", "update-template", template);
    }
    /**
     * Delete an existing template.
     */
    async deleteTemplate(slug, locale) {
        let uri = `/manage/customer/{{customerID}}/template/${encodeURIComponent(slug)}`;
        if (locale) {
            uri += "/" + encodeURIComponent(locale);
        }
        return await this.executeRequest(uri, "DELETE", "delete-template");
    }
    /**
     * Get a list of senders.
     * Limits the number of records by pageSize and starting with the record at nextPageID.
     */
    async getSenders(pageSize, nextPageID) {
        const uri = "/manage/customer/{{customerID}}/senders";
        return await this.executeRequest(uri, "GET", "list-sender", undefined, {
            pagesize: pageSize,
            nextpage: nextPageID,
        });
    }
    /**
     * Get a sender record.
     */
    async getSender(senderID) {
        const uri = `/manage/customer/{{customerID}}/sender/${encodeURIComponent(senderID)}`;
        return await this.executeRequest(uri, "GET", "get-sender");
    }
    /**
     * Creates a new sender.
     */
    async createSender(sender) {
        const uri = "/manage/customer/{{customerID}}/sender";
        return await this.executeRequest(uri, "POST", "create-sender", sender);
    }
    /**
     * Update an existing sender.
     */
    async updateSender(senderID, sender) {
        const uri = `/manage/customer/{{customerID}}/sender/${encodeURIComponent(senderID)}`;
        return await this.executeRequest(uri, "PATCH", "update-sender", sender);
    }
    /**
     * Delete an existing sender.
     */
    async deleteSender(senderID) {
        const uri = `/manage/customer/{{customerID}}/sender/${encodeURIComponent(senderID)}`;
        return await this.executeRequest(uri, "DELETE", "delete-sender");
    }
    /**
     * Get a list of app keys.
     * Limits the number of records by pageSize and starting with the record at nextPageID.
     */
    async getAppKeys(pageSize, nextPageID) {
        const uri = "/manage/customer/{{customerID}}/appkeys";
        return await this.executeRequest(uri, "GET", "list-appkey", undefined, {
            pagesize: pageSize,
            nextpage: nextPageID,
        });
    }
    /**
     * Get an app key record.
     */
    async getAppKey(appKeyID) {
        const uri = `/manage/customer/{{customerID}}/appkey/${encodeURIComponent(appKeyID)}`;
        return await this.executeRequest(uri, "GET", "get-appkey");
    }
    /**
     * Creates a new app key.
     */
    async createAppKey(appKey) {
        const uri = "/manage/customer/{{customerID}}/appkey";
        return await this.executeRequest(uri, "POST", "create-appkey", appKey);
    }
    /**
     * Update an existing app key.
     */
    async updateAppKey(appKeyID, appKey) {
        const uri = `/manage/customer/{{customerID}}/appkey/${encodeURIComponent(appKeyID)}`;
        return await this.executeRequest(uri, "PATCH", "update-appkey", appKey);
    }
    /**
     * Delete an existing app key.
     */
    async deleteAppKey(appKeyID) {
        const uri = `/manage/customer/{{customerID}}/appkey/${encodeURIComponent(appKeyID)}`;
        return await this.executeRequest(uri, "DELETE", "delete-appkey");
    }
    /**
     * Get a list of blocks.
     * Limits the number of records by pageSize and starting with the record at nextPageID.
     */
    async getBlocks(pageSize, nextPageID) {
        const uri = "/manage/customer/{{customerID}}/blocks";
        return await this.executeRequest(uri, "GET", "list-block", undefined, {
            pagesize: pageSize,
            nextpage: nextPageID,
        });
    }
    /**
     * Get a block record.
     */
    async getBlock(blockID) {
        const uri = `/manage/customer/{{customerID}}/block/${encodeURIComponent(blockID)}`;
        return await this.executeRequest(uri, "GET", "get-block");
    }
    /**
     * Creates a new block.
     */
    async createBlock(block) {
        const uri = "/manage/customer/{{customerID}}/block";
        return await this.executeRequest(uri, "POST", "create-block", block);
    }
    /**
     * Delete a block.
     */
    async deleteBlock(blockID) {
        const uri = `/manage/customer/{{customerID}}/block/${encodeURIComponent(blockID)}`;
        await this.executeRequest(uri, "DELETE", "delete-block");
    }
    // If there is a network response with JSON then a tuple is returned (boolean success, object jsonContent). If any exceptions are thrown they are not handled by this method.
    async executeRequest(uri, method, contentTypeResource, requestBody, queryParameters) {
        await this.initClient();
        uri = uri.replace(/{{customerID}}/, encodeURIComponent(this.customerID));
        let qp = "";
        if (queryParameters) {
            for (const [k, v] of Object.entries(queryParameters)) {
                if (v === undefined || v === null) {
                    delete queryParameters[k];
                }
            }
            qp = "?" + new URLSearchParams(queryParameters);
        }
        let requestData = undefined;
        if (requestBody) {
            requestData = (typeof requestBody === "string") ? requestBody : JSON.stringify(requestBody);
        }
        let responseBodyText = undefined;
        let responseBody = undefined;
        let response;
        try {
            response = await (0, node_fetch_1.default)(this.baseUrl + uri + qp, {
                method,
                headers: {
                    "Content-Type": `application/vnd.notification.${contentTypeResource}.v1+json`,
                    "Authorization": this.authorizationToken,
                },
                body: requestData,
            });
            responseBodyText = await response.text();
        }
        catch (ex) {
            throw new Errors.FetchError(ex.message, { cause: ex });
        }
        if (!response) {
            throw new Errors.ResponseError("Server did not respond");
        }
        if (response.status === 401 || response.status === 403) { // AWS HTTP API Gateway returns 403 from the authorizer (instead of 401) if the credentials are invalid
            throw new Errors.AuthorizationError("Authorization Failed");
        }
        else if (response.status === 404) {
            throw new Errors.ResponseError("Resource not found");
        }
        try {
            responseBody = responseBodyText && JSON.parse(responseBodyText);
        }
        catch (ex) {
            throw new Errors.ResponseError("Invalid response content", { cause: responseBodyText });
        }
        if (response.status != 200) {
            throw new Errors.ResponseError(responseBody.Error || responseBodyText);
        }
        return responseBody;
    }
    // There must be a client id specified. If we don't have one then retrieve the value for the authenticated customer.
    // This is called before each request to verify a customer ID is present
    async initClient() {
        if (this.initComplete)
            return;
        this.initComplete = true; // Mark init as complete before triggering the customer ID lookup or we get circular calls
        try {
            const dataItem = await this.getInfo();
            this.customerID = dataItem.CustomerID;
        }
        catch (ex) {
            this.initComplete = false;
            const error = ex;
            if (error instanceof Errors.AuthorizationError)
                throw error;
            else
                throw new Errors.InitError(`Failed to init client: ${error.message}`, { cause: error });
        }
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
exports.NotificationManage = NotificationManage;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibm90aWZpY2F0aW9uLW1hbmFnZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uL3NyYy9ub3RpZmljYXRpb24tbWFuYWdlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUFBLG1DQUFtQztBQUVuQywyQ0FBNkM7QUFFN0MsTUFBYSxrQkFBa0I7SUFNOUIsWUFBWSxPQUFjLEVBQUUsT0FBdUM7UUFGM0QsaUJBQVksR0FBVyxLQUFLLENBQUM7UUFHcEMsT0FBTyxHQUFHLE9BQU8sQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxHQUFHLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLHdCQUF3QjtRQUU5RixJQUFJLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUM7WUFBRSxNQUFNLElBQUksTUFBTSxDQUFDLGFBQWEsQ0FBQyxxQkFBcUIsQ0FBQyxDQUFDO1FBRWhGLElBQUksQ0FBQyxPQUFPLEdBQUcsT0FBTyxDQUFDO1FBQ3ZCLElBQUksQ0FBQyxrQkFBa0IsR0FBRyxPQUFPLENBQUMsa0JBQWtCLENBQUM7SUFDdEQsQ0FBQztJQUVEOztPQUVHO0lBQ0gsVUFBVTtRQUNULE9BQU8sSUFBSSxDQUFDLE9BQU8sQ0FBQztJQUNyQixDQUFDO0lBRUQ7O09BRUc7SUFDSCxxQkFBcUIsQ0FBQyxrQkFBeUI7UUFDOUMsSUFBSSxDQUFDLGtCQUFrQixHQUFHLGtCQUFrQixDQUFDO0lBQzlDLENBQUM7SUFFRDs7T0FFRztJQUNILDRCQUE0QixDQUFDLFVBQWlCO1FBQzdDLElBQUksQ0FBQyxVQUFVLEdBQUcsVUFBVSxDQUFDO0lBQzlCLENBQUM7SUFFRDs7T0FFRztJQUNILHFCQUFxQjtRQUNwQixJQUFJLENBQUMsVUFBVSxHQUFHLFNBQVMsQ0FBQztRQUM1QixJQUFJLENBQUMsWUFBWSxHQUFHLEtBQUss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QztJQUVELG9IQUFvSDtJQUNwSCx3RUFBd0U7SUFDaEUsS0FBSyxDQUFDLFVBQVU7UUFDdkIsSUFBSSxJQUFJLENBQUMsWUFBWTtZQUFFLE9BQU87UUFFOUIsSUFBSSxDQUFDLFlBQVksR0FBRyxJQUFJLENBQUMsQ0FBQywwRkFBMEY7UUFFcEgsSUFBSTtZQUNILE1BQU0sUUFBUSxHQUFHLE1BQU0sSUFBSSxDQUFDLE9BQU8sRUFBRSxDQUFDO1lBQ3RDLElBQUksQ0FBQyxVQUFVLEdBQUcsUUFBUSxDQUFDLFVBQVUsQ0FBQztTQUN0QztRQUFDLE9BQU8sRUFBRSxFQUFFO1lBQ1osSUFBSSxDQUFDLFlBQVksR0FBRyxLQUFLLENBQUM7WUFFMUIsTUFBTSxLQUFLLEdBQUcsRUFBVyxDQUFDO1lBRTFCLElBQUksS0FBSyxZQUFZLE1BQU0sQ0FBQyxrQkFBa0I7Z0JBQUUsTUFBTSxLQUFLLENBQUM7O2dCQUN2RCxNQUFNLElBQUksTUFBTSxDQUFDLFNBQVMsQ0FBQywwQkFBMEIsS0FBSyxDQUFDLE9BQU8sRUFBRSxFQUFFLEVBQUUsS0FBSyxFQUFFLEtBQUssRUFBRSxDQUFDLENBQUM7U0FDN0Y7SUFDRixDQUFDO0lBRU8sS0FBSyxDQUFDLEtBQVk7UUFDekIsSUFBSTtZQUNILE1BQU0sR0FBRyxHQUFHLElBQUksR0FBRyxDQUFDLEtBQUssQ0FBQyxDQUFDO1lBQzNCLE9BQU8sR0FBRyxDQUFDLFFBQVEsS0FBSyxPQUFPLElBQUksR0FBRyxDQUFDLFFBQVEsS0FBSyxRQUFRLENBQUM7U0FDN0Q7UUFBQyxNQUFNLEdBQUc7UUFFWCxPQUFPLEtBQUssQ0FBQztJQUNkLENBQUM7Q0FDRDtBQTViRCxnREE0YkMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgKiBhcyBFcnJvcnMgZnJvbSBcIi4vZXJyb3JzXCI7XG5pbXBvcnQgKiBhcyBUeXBlcyBmcm9tIFwiLi90eXBlc1wiO1xuaW1wb3J0IGZldGNoLCB7IFJlc3BvbnNlIH0gZnJvbSBcIm5vZGUtZmV0Y2hcIjtcblxuZXhwb3J0IGNsYXNzIE5vdGlmaWNhdGlvbk1hbmFnZSB7XG5cdHByaXZhdGUgYmFzZVVybDpzdHJpbmc7XG5cdHByaXZhdGUgYXV0aG9yaXphdGlvblRva2VuOnN0cmluZztcblx0cHJpdmF0ZSBjdXN0b21lcklEOnN0cmluZ3x1bmRlZmluZWQ7XG5cdHByaXZhdGUgaW5pdENvbXBsZXRlOmJvb2xlYW4gPSBmYWxzZTtcblxuXHRjb25zdHJ1Y3RvcihiYXNlVXJsOnN0cmluZywgb3B0aW9uczpUeXBlcy5Ob3RpZmljYXRpb25NYW5hZ2VPcHRpb25zKSB7XG5cdFx0YmFzZVVybCA9IGJhc2VVcmwuc2xpY2UoLTEpID09PSBcIi9cIiA/IGJhc2VVcmwuc2xpY2UoMCwgLTEpIDogYmFzZVVybDtcdC8vIHJlbW92ZSB0cmFpbGluZyBzbGFzaFxuXG5cdFx0aWYgKCF0aGlzLmlzVXJsKGJhc2VVcmwpKSB0aHJvdyBuZXcgRXJyb3JzLkFyZ3VtZW50RXJyb3IoXCJiYXNlVXJsIGlzIGludmFsaWQuXCIpO1xuXG5cdFx0dGhpcy5iYXNlVXJsID0gYmFzZVVybDtcblx0XHR0aGlzLmF1dGhvcml6YXRpb25Ub2tlbiA9IG9wdGlvbnMuYXV0aG9yaXphdGlvblRva2VuO1xuXHR9XG5cblx0LyoqXG5cdCAqIEdldCB0aGUgYmFzZVVybFxuXHQgKi9cblx0Z2V0QmFzZVVybCgpOnN0cmluZyB7XG5cdFx0cmV0dXJuIHRoaXMuYmFzZVVybDtcblx0fVxuXG5cdC8qKlxuXHQgKiBTZXQgdGhlIGF1dGhvcml6YXRpb24gdG9rZW4uIFVzZWQgYnkgYWxsIGZ1dHVyZSByZXF1ZXN0cy5cblx0ICovXG5cdHNldEF1dGhvcml6YXRpb25Ub2tlbihhdXRob3JpemF0aW9uVG9rZW46c3RyaW5nKTp2b2lkIHtcblx0XHR0aGlzLmF1dGhvcml6YXRpb25Ub2tlbiA9IGF1dGhvcml6YXRpb25Ub2tlbjtcblx0fVxuXG5cdC8qKlxuXHQgKiBTZXQgdGhlIEN1c3RvbWVyIElEIHRoYXQgd2lsbCBiZSBwYXNzZWQgdG8gYWxsIEFQSSByZXF1ZXN0cy5cblx0ICovXG5cdGNvbmZpZ3VyZUZvck92ZXJyaWRlQ3VzdG9tZXIoY3VzdG9tZXJJRDpzdHJpbmcpOnZvaWQge1xuXHRcdHRoaXMuY3VzdG9tZXJJRCA9IGN1c3RvbWVySUQ7XG5cdH1cblxuXHQvKipcblx0ICogUmVtb3ZlIHRoZSBDdXN0b21lciBJRC4gVGhlIGN1c3RvbWVyIGZvciB0aGUgQXV0aG9yaXphdGlvbiBUb2tlbiB3aWxsIGJlIHVzZWQgZm9yIHJlcXVlc3RzLlxuXHQgKi9cblx0Y2xlYXJPdmVycmlkZUN1c3RvbWVyKCkge1xuXHRcdHRoaXMuY3VzdG9tZXJJRCA9IHVuZGVmaW5lZDtcblx0XHR0aGlzLmluaXRDb21wbGV0ZSA9IGZhbHNlO1xuXHR9XG5cblx0LyoqXG5cdCAqIEdldCBhbiBpbmZvIG9iamVjdCBmb3IgdGhlIGF1dGhvcml6ZWQgY3VzdG9tZXIuXG5cdCAqL1xuXHRhc3luYyBnZXRJbmZvKCk6UHJvbWlzZTxUeXBlcy5DdXN0b21lckluZm8+IHtcblx0XHRjb25zdCB1cmkgPSBcIi9tYW5hZ2UvaW5mb1wiO1xuXG5cdFx0cmV0dXJuIGF3YWl0IHRoaXMuZXhlY3V0ZVJlcXVlc3Q8VHlwZXMuQ3VzdG9tZXJJbmZvPih1cmksIFwiR0VUXCIsIFwiZ2V0LWluZm9cIik7XG5cdH1cblxuXHQvKipcblx0ICogR2VuZXJhdGVzIGEgdmFsaWQgQVBJIGtleS5cblx0ICovXG5cdGFzeW5jIGdlbmVyYXRlQXBpS2V5KCk6UHJvbWlzZTxUeXBlcy5BcGlLZXlSZXN1bHQ+IHtcblx0XHRsZXQgdXJpID0gXCIvbWFuYWdlL2FwaWtleVwiO1xuXG5cdFx0cmV0dXJuIGF3YWl0IHRoaXMuZXhlY3V0ZVJlcXVlc3Q8VHlwZXMuQXBpS2V5UmVzdWx0Pih1cmksIFwiUE9TVFwiLCBcImNyZWF0ZS1hcGlrZXlcIik7XG5cdH1cblxuXHQvKipcblx0ICogR2V0IGEgbGlzdCBvZiBtZXNzYWdlcy4gTGltaXRzIHRoZSBudW1iZXIgb2YgcmVjb3JkcyBieSBwYWdlU2l6ZSBhbmQgc3RhcnRpbmcgd2l0aCB0aGUgcmVjb3JkIGF0IG5leHRQYWdlSUQuXG5cdCAqL1xuXHRhc3luYyBnZXRNZXNzYWdlcyhwYWdlU2l6ZTpudW1iZXIsIG5leHRQYWdlSUQ/OnN0cmluZyk6UHJvbWlzZTxUeXBlcy5NZXNzYWdlTGlzdD4ge1xuXHRcdGxldCB1cmkgPSBcIi9tYW5hZ2UvY3VzdG9tZXIve3tjdXN0b21lcklEfX0vbWVzc2FnZXNcIjtcblxuXHRcdHJldHVybiBhd2FpdCB0aGlzLmV4ZWN1dGVSZXF1ZXN0PFR5cGVzLk1lc3NhZ2VMaXN0Pih1cmksIFwiR0VUXCIsIFwibGlzdC1tZXNzYWdlXCIsIHVuZGVmaW5lZCwge1xuXHRcdFx0cGFnZXNpemU6IHBhZ2VTaXplLFxuXHRcdFx0bmV4dHBhZ2U6IG5leHRQYWdlSUQsXG5cdFx0fSk7XG5cdH1cblxuXHQvKipcblx0ICogR2V0IGEgbWVzc2FnZSByZWNvcmQuXG5cdCAqL1xuXHRhc3luYyBnZXRNZXNzYWdlKG1lc3NhZ2VJRDpzdHJpbmcpOlByb21pc2U8VHlwZXMuTWVzc2FnZT4ge1xuXHRcdGNvbnN0IHVyaSA9IGAvbWFuYWdlL2N1c3RvbWVyL3t7Y3VzdG9tZXJJRH19L21lc3NhZ2UvJHtlbmNvZGVVUklDb21wb25lbnQobWVzc2FnZUlEKX1gO1xuXG5cdFx0cmV0dXJuIGF3YWl0IHRoaXMuZXhlY3V0ZVJlcXVlc3Q8VHlwZXMuTWVzc2FnZT4odXJpLCBcIkdFVFwiLCBcImdldC1tZXNzYWdlXCIpO1xuXHR9XG5cblx0LyoqXG5cdCAqIENyZWF0ZSBhbiBlbWFpbCBtZXNzYWdlLlxuXHQgKi9cblx0YXN5bmMgY3JlYXRlRW1haWxNZXNzYWdlKGVtYWlsTWVzc2FnZTpUeXBlcy5DcmVhdGVFbWFpbE1lc3NhZ2UsIHRlc3Q6Ym9vbGVhbik6UHJvbWlzZTxUeXBlcy5DcmVhdGVNZXNzYWdlUmVzdWx0PiB7XG5cdFx0Y29uc3QgdXJpID0gXCIvbWFuYWdlL2N1c3RvbWVyL3t7Y3VzdG9tZXJJRH19L21lc3NhZ2VcIjtcblx0XHRjb25zdCBjb250ZW50VHlwZSA9IHRlc3QgPyBcImNyZWF0ZS10ZXN0LWVtYWlsLW1lc3NhZ2VcIiA6IFwiY3JlYXRlLWVtYWlsLW1lc3NhZ2VcIjtcblxuXHRcdHJldHVybiBhd2FpdCB0aGlzLmV4ZWN1dGVSZXF1ZXN0PFR5cGVzLkNyZWF0ZU1lc3NhZ2VSZXN1bHQ+KHVyaSwgXCJQT1NUXCIsIGNvbnRlbnRUeXBlLCBlbWFpbE1lc3NhZ2UpO1xuXHR9XG5cblx0LyoqXG5cdCAqIENyZWF0ZSBhbiBTTVMgbWVzc2FnZS5cblx0ICovXG5cdGFzeW5jIGNyZWF0ZVNtc01lc3NhZ2Uoc21zTWVzc2FnZTpUeXBlcy5DcmVhdGVTbXNNZXNzYWdlLCB0ZXN0OmJvb2xlYW4pOlByb21pc2U8VHlwZXMuQ3JlYXRlTWVzc2FnZVJlc3VsdD4ge1xuXHRcdGNvbnN0IHVyaSA9IFwiL21hbmFnZS9jdXN0b21lci97e2N1c3RvbWVySUR9fS9tZXNzYWdlXCI7XG5cdFx0Y29uc3QgY29udGVudFR5cGUgPSB0ZXN0ID8gXCJjcmVhdGUtdGVzdC1zbXMtbWVzc2FnZVwiIDogXCJjcmVhdGUtc21zLW1lc3NhZ2VcIjtcblxuXHRcdHJldHVybiBhd2FpdCB0aGlzLmV4ZWN1dGVSZXF1ZXN0PFR5cGVzLkNyZWF0ZU1lc3NhZ2VSZXN1bHQ+KHVyaSwgXCJQT1NUXCIsIGNvbnRlbnRUeXBlLCBzbXNNZXNzYWdlKTtcblx0fVxuXG5cdC8qKlxuXHQgKiBHZXQgYSBsaXN0IG9mIGN1c3RvbWVycy4gT25seSBhbiBhZG1pbiBhcHAga2V5IGNhbiBtYWtlIHRoaXMgcmVxdWVzdC5cblx0ICogTGltaXRzIHRoZSBudW1iZXIgb2YgcmVjb3JkcyBieSBwYWdlU2l6ZSBhbmQgc3RhcnRpbmcgd2l0aCB0aGUgcmVjb3JkIGF0IG5leHRQYWdlSUQuXG5cdCAqL1xuXHRhc3luYyBnZXRDdXN0b21lcnMocGFnZVNpemU6bnVtYmVyLCBuZXh0UGFnZUlEPzpzdHJpbmcpOlByb21pc2U8VHlwZXMuQ3VzdG9tZXJMaXN0PiB7XG5cdFx0bGV0IHVyaSA9IFwiL21hbmFnZS9jdXN0b21lcnNcIjtcdC8vIFRoaXMgVVJJIGlzIGRpZmZlcmVudC4gV2UgZG9uJ3QgZW1iZWQgdGhlIGNsaWVudCBjdXN0b21lciBpZCBiZWNhdXNlIHRoZSBnZXQgY3VzdG9tZXJzIGVuZHBvaW50IGRvZXMgbm90IHVzZSBpdC5cblxuXHRcdHJldHVybiBhd2FpdCB0aGlzLmV4ZWN1dGVSZXF1ZXN0PFR5cGVzLkN1c3RvbWVyTGlzdD4odXJpLCBcIkdFVFwiLCBcImxpc3QtY3VzdG9tZXJcIiwgdW5kZWZpbmVkLCB7XG5cdFx0XHRwYWdlc2l6ZTogcGFnZVNpemUsXG5cdFx0XHRuZXh0cGFnZTogbmV4dFBhZ2VJRCxcblx0XHR9KTtcblx0fVxuXG5cdC8qKlxuXHQgKiBHZXQgYSBjdXN0b21lciByZWNvcmQuIE9ubHkgYW4gYWRtaW4gYXBwIGtleSBjYW4gZ2V0IGN1c3RvbWVyIHJlY29yZHMgb3RoZXIgdGhhbiBpdHMgb3duLlxuXHQgKi9cblx0YXN5bmMgZ2V0Q3VzdG9tZXIoY3VzdG9tZXJJRD86c3RyaW5nfHVuZGVmaW5lZCk6UHJvbWlzZTxUeXBlcy5DdXN0b21lcj4ge1xuXHRcdGxldCB1cmkgPSBcIi9tYW5hZ2UvY3VzdG9tZXJcIjtcdC8vIFRoaXMgVVJJIGlzIGRpZmZlcmVudC4gV2UgZG9uJ3QgZW1iZWQgdGhlIGNsaWVudCBjdXN0b21lciBpZCBiZWNhdXNlIHRoZSBnZXQgY3VzdG9tZXIgZW5kcG9pbnQgZG9lcyBub3QgdXNlIGl0LlxuXG5cdFx0aWYgKGN1c3RvbWVySUQgIT0gdW5kZWZpbmVkKSB7XG5cdFx0XHR1cmkgKz0gXCIvXCIgKyBlbmNvZGVVUklDb21wb25lbnQoY3VzdG9tZXJJRCk7XG5cdFx0fVxuXG5cdFx0cmV0dXJuIGF3YWl0IHRoaXMuZXhlY3V0ZVJlcXVlc3Q8VHlwZXMuQ3VzdG9tZXI+KHVyaSwgXCJHRVRcIiwgXCJnZXQtY3VzdG9tZXJcIik7XG5cdH1cblxuXHQvKipcblx0ICogQ3JlYXRlcyBhIG5ldyBjdXN0b21lci4gT25seSBhbiBhZG1pbiBhcHAga2V5IGNhbiBjcmVhdGUgY3VzdG9tZXJzLlxuXHQgKi9cblx0YXN5bmMgY3JlYXRlQ3VzdG9tZXIoY3VzdG9tZXI6VHlwZXMuQ3JlYXRlQ3VzdG9tZXJEYXRhKTpQcm9taXNlPFR5cGVzLkN1c3RvbWVyPiB7XG5cdFx0bGV0IHVyaSA9IFwiL21hbmFnZS9jdXN0b21lclwiO1x0Ly8gVGhpcyBVUkkgaXMgZGlmZmVyZW50LiBXZSBkb24ndCBlbWJlZCB0aGUgY2xpZW50IGN1c3RvbWVyIGlkIGJlY2F1c2UgdGhlIGNyZWF0ZSBjdXN0b21lciBlbmRwb2ludCBkb2VzIG5vdCB1c2UgaXQuXG5cblx0XHRyZXR1cm4gYXdhaXQgdGhpcy5leGVjdXRlUmVxdWVzdDxUeXBlcy5DdXN0b21lcj4odXJpLCBcIlBPU1RcIiwgXCJjcmVhdGUtY3VzdG9tZXJcIiwgY3VzdG9tZXIpO1xuXHR9XG5cblx0LyoqXG5cdCAqIFVwZGF0ZSBhbiBleGlzdGluZyBjdXN0b21lci5cblx0ICovXG5cdGFzeW5jIHVwZGF0ZUN1c3RvbWVyKGN1c3RvbWVySUQ6c3RyaW5nLCBjdXN0b21lcjpUeXBlcy5VcGRhdGVDdXN0b21lckRhdGEpOlByb21pc2U8VHlwZXMuQ3VzdG9tZXI+IHtcblx0XHRsZXQgdXJpID0gYC9tYW5hZ2UvY3VzdG9tZXIvJHtlbmNvZGVVUklDb21wb25lbnQoY3VzdG9tZXJJRCl9YDtcdC8vIFRoaXMgVVJJIGlzIGRpZmZlcmVudC4gV2UgZG9uJ3QgZW1iZWQgdGhlIGNsaWVudCBjdXN0b21lciBpZCBiZWNhdXNlIHRoZSB1cGRhdGUgY3VzdG9tZXIgZW5kcG9pbnQgZG9lcyB1c2UgaXQuXG5cblx0XHRyZXR1cm4gYXdhaXQgdGhpcy5leGVjdXRlUmVxdWVzdDxUeXBlcy5DdXN0b21lcj4odXJpLCBcIlBBVENIXCIsIFwidXBkYXRlLWN1c3RvbWVyXCIsIGN1c3RvbWVyKTtcblx0fVxuXG5cdC8qKlxuXHQgKiBEZWxldGUgYW4gZXhpc3RpbmcgY3VzdG9tZXIuXG5cdCAqL1xuXHRhc3luYyBkZWxldGVDdXN0b21lcihjdXN0b21lcklEOnN0cmluZyk6UHJvbWlzZTx2b2lkPiB7XG5cdFx0bGV0IHVyaSA9IGAvbWFuYWdlL2N1c3RvbWVyLyR7ZW5jb2RlVVJJQ29tcG9uZW50KGN1c3RvbWVySUQpfWA7XHQvLyBUaGlzIFVSSSBpcyBkaWZmZXJlbnQuIFdlIGRvbid0IGVtYmVkIHRoZSBjbGllbnQgY3VzdG9tZXIgaWQgYmVjYXVzZSB0aGUgdXBkYXRlIGN1c3RvbWVyIGVuZHBvaW50IGRvZXMgdXNlIGl0LlxuXG5cdFx0cmV0dXJuIGF3YWl0IHRoaXMuZXhlY3V0ZVJlcXVlc3Q8dm9pZD4odXJpLCBcIkRFTEVURVwiLCBcImRlbGV0ZS1jdXN0b21lclwiKTtcblx0fVxuXG5cdC8qKlxuXHQgKiBHZXQgYSBsaXN0IG9mIHRlbXBsYXRlcy5cblx0ICogTGltaXRzIHRoZSBudW1iZXIgb2YgcmVjb3JkcyBieSBwYWdlU2l6ZSBhbmQgc3RhcnRpbmcgd2l0aCB0aGUgcmVjb3JkIGF0IG5leHRQYWdlSUQuXG5cdCAqL1xuXHRhc3luYyBnZXRUZW1wbGF0ZXMocGFnZVNpemU6bnVtYmVyLCBuZXh0UGFnZUlEPzpzdHJpbmcpOlByb21pc2U8VHlwZXMuVGVtcGxhdGVMaXN0PiB7XG5cdFx0Y29uc3QgdXJpID0gXCIvbWFuYWdlL2N1c3RvbWVyL3t7Y3VzdG9tZXJJRH19L3RlbXBsYXRlc1wiO1xuXG5cdFx0cmV0dXJuIGF3YWl0IHRoaXMuZXhlY3V0ZVJlcXVlc3Q8VHlwZXMuVGVtcGxhdGVMaXN0Pih1cmksIFwiR0VUXCIsIFwibGlzdC10ZW1wbGF0ZVwiLCB1bmRlZmluZWQsIHtcblx0XHRcdHBhZ2VzaXplOiBwYWdlU2l6ZSxcblx0XHRcdG5leHRwYWdlOiBuZXh0UGFnZUlELFxuXHRcdH0pO1xuXHR9XG5cblx0LyoqXG5cdCAqIEdldCBhIHRlbXBsYXRlIHJlY29yZC5cblx0ICovXG5cdGFzeW5jIGdldFRlbXBsYXRlKHNsdWc6c3RyaW5nLCBsb2NhbGU6c3RyaW5nfHVuZGVmaW5lZCk6UHJvbWlzZTxUeXBlcy5UZW1wbGF0ZT4ge1xuXHRcdGxldCB1cmkgPSBgL21hbmFnZS9jdXN0b21lci97e2N1c3RvbWVySUR9fS90ZW1wbGF0ZS8ke2VuY29kZVVSSUNvbXBvbmVudChzbHVnKX1gO1xuXHRcdGlmIChsb2NhbGUpIHtcblx0XHRcdHVyaSArPSBcIi9cIiArIGVuY29kZVVSSUNvbXBvbmVudChsb2NhbGUpO1xuXHRcdH1cblxuXHRcdHJldHVybiBhd2FpdCB0aGlzLmV4ZWN1dGVSZXF1ZXN0PFR5cGVzLlRlbXBsYXRlPih1cmksIFwiR0VUXCIsIFwiZ2V0LXRlbXBsYXRlXCIpO1xuXHR9XG5cblx0LyoqXG5cdCAqIENyZWF0ZXMgYSBuZXcgdGVtcGxhdGUuXG5cdCAqL1xuXHRhc3luYyBjcmVhdGVUZW1wbGF0ZSh0ZW1wbGF0ZTpUeXBlcy5DcmVhdGVUZW1wbGF0ZURhdGEpOlByb21pc2U8VHlwZXMuVGVtcGxhdGU+IHtcblx0XHRjb25zdCB1cmkgPSBcIi9tYW5hZ2UvY3VzdG9tZXIve3tjdXN0b21lcklEfX0vdGVtcGxhdGVcIjtcblxuXHRcdHJldHVybiBhd2FpdCB0aGlzLmV4ZWN1dGVSZXF1ZXN0PFR5cGVzLlRlbXBsYXRlPih1cmksIFwiUE9TVFwiLCBcImNyZWF0ZS10ZW1wbGF0ZVwiLCB0ZW1wbGF0ZSk7XG5cdH1cblxuXHQvKipcblx0ICogVXBkYXRlIGFuIGV4aXN0aW5nIHRlbXBsYXRlLlxuXHQgKi9cblx0YXN5bmMgdXBkYXRlVGVtcGxhdGUoc2x1ZzpzdHJpbmcsIGxvY2FsZTpzdHJpbmd8dW5kZWZpbmVkLCB0ZW1wbGF0ZTpUeXBlcy5VcGRhdGVUZW1wbGF0ZURhdGEpOlByb21pc2U8VHlwZXMuVGVtcGxhdGU+IHtcblx0XHRsZXQgdXJpID0gYC9tYW5hZ2UvY3VzdG9tZXIve3tjdXN0b21lcklEfX0vdGVtcGxhdGUvJHtlbmNvZGVVUklDb21wb25lbnQoc2x1Zyl9YDtcblx0XHRpZiAobG9jYWxlKSB7XG5cdFx0XHR1cmkgKz0gXCIvXCIgKyBlbmNvZGVVUklDb21wb25lbnQobG9jYWxlKTtcblx0XHR9XG5cblx0XHRyZXR1cm4gYXdhaXQgdGhpcy5leGVjdXRlUmVxdWVzdDxUeXBlcy5UZW1wbGF0ZT4odXJpLCBcIlBBVENIXCIsIFwidXBkYXRlLXRlbXBsYXRlXCIsIHRlbXBsYXRlKTtcblx0fVxuXG5cdC8qKlxuXHQgKiBEZWxldGUgYW4gZXhpc3RpbmcgdGVtcGxhdGUuXG5cdCAqL1xuXHRhc3luYyBkZWxldGVUZW1wbGF0ZShzbHVnOnN0cmluZywgbG9jYWxlOnN0cmluZ3x1bmRlZmluZWQpOlByb21pc2U8dm9pZD4ge1xuXHRcdGxldCB1cmkgPSBgL21hbmFnZS9jdXN0b21lci97e2N1c3RvbWVySUR9fS90ZW1wbGF0ZS8ke2VuY29kZVVSSUNvbXBvbmVudChzbHVnKX1gO1xuXHRcdGlmIChsb2NhbGUpIHtcblx0XHRcdHVyaSArPSBcIi9cIiArIGVuY29kZVVSSUNvbXBvbmVudChsb2NhbGUpO1xuXHRcdH1cblxuXHRcdHJldHVybiBhd2FpdCB0aGlzLmV4ZWN1dGVSZXF1ZXN0PHZvaWQ+KHVyaSwgXCJERUxFVEVcIiwgXCJkZWxldGUtdGVtcGxhdGVcIik7XG5cdH1cblxuXHQvKipcblx0ICogR2V0IGEgbGlzdCBvZiBzZW5kZXJzLlxuXHQgKiBMaW1pdHMgdGhlIG51bWJlciBvZiByZWNvcmRzIGJ5IHBhZ2VTaXplIGFuZCBzdGFydGluZyB3aXRoIHRoZSByZWNvcmQgYXQgbmV4dFBhZ2VJRC5cblx0ICovXG5cdGFzeW5jIGdldFNlbmRlcnMocGFnZVNpemU6bnVtYmVyLCBuZXh0UGFnZUlEPzpzdHJpbmcpOlByb21pc2U8VHlwZXMuU2VuZGVyTGlzdD4ge1xuXHRcdGNvbnN0IHVyaSA9IFwiL21hbmFnZS9jdXN0b21lci97e2N1c3RvbWVySUR9fS9zZW5kZXJzXCI7XG5cblx0XHRyZXR1cm4gYXdhaXQgdGhpcy5leGVjdXRlUmVxdWVzdCh1cmksIFwiR0VUXCIsIFwibGlzdC1zZW5kZXJcIiwgdW5kZWZpbmVkLCB7XG5cdFx0XHRwYWdlc2l6ZTogcGFnZVNpemUsXG5cdFx0XHRuZXh0cGFnZTogbmV4dFBhZ2VJRCxcblx0XHR9KTtcblx0fVxuXG5cdC8qKlxuXHQgKiBHZXQgYSBzZW5kZXIgcmVjb3JkLlxuXHQgKi9cblx0YXN5bmMgZ2V0U2VuZGVyKHNlbmRlcklEOnN0cmluZyk6UHJvbWlzZTxUeXBlcy5TZW5kZXI+IHtcblx0XHRjb25zdCB1cmkgPSBgL21hbmFnZS9jdXN0b21lci97e2N1c3RvbWVySUR9fS9zZW5kZXIvJHtlbmNvZGVVUklDb21wb25lbnQoc2VuZGVySUQpfWA7XG5cblx0XHRyZXR1cm4gYXdhaXQgdGhpcy5leGVjdXRlUmVxdWVzdDxUeXBlcy5TZW5kZXI+KHVyaSwgXCJHRVRcIiwgXCJnZXQtc2VuZGVyXCIpO1xuXHR9XG5cblx0LyoqXG5cdCAqIENyZWF0ZXMgYSBuZXcgc2VuZGVyLlxuXHQgKi9cblx0YXN5bmMgY3JlYXRlU2VuZGVyKHNlbmRlcjpUeXBlcy5DcmVhdGVTZW5kZXJEYXRhKTpQcm9taXNlPFR5cGVzLlNlbmRlcj4ge1xuXHRcdGNvbnN0IHVyaSA9IFwiL21hbmFnZS9jdXN0b21lci97e2N1c3RvbWVySUR9fS9zZW5kZXJcIjtcblxuXHRcdHJldHVybiBhd2FpdCB0aGlzLmV4ZWN1dGVSZXF1ZXN0PFR5cGVzLlNlbmRlcj4odXJpLCBcIlBPU1RcIiwgXCJjcmVhdGUtc2VuZGVyXCIsIHNlbmRlcik7XG5cdH1cblxuXHQvKipcblx0ICogVXBkYXRlIGFuIGV4aXN0aW5nIHNlbmRlci5cblx0ICovXG5cdGFzeW5jIHVwZGF0ZVNlbmRlcihzZW5kZXJJRDpzdHJpbmcsIHNlbmRlcjpUeXBlcy5VcGRhdGVTZW5kZXJEYXRhKTpQcm9taXNlPFR5cGVzLlNlbmRlcj4ge1xuXHRcdGNvbnN0IHVyaSA9IGAvbWFuYWdlL2N1c3RvbWVyL3t7Y3VzdG9tZXJJRH19L3NlbmRlci8ke2VuY29kZVVSSUNvbXBvbmVudChzZW5kZXJJRCl9YDtcblxuXHRcdHJldHVybiBhd2FpdCB0aGlzLmV4ZWN1dGVSZXF1ZXN0PFR5cGVzLlNlbmRlcj4odXJpLCBcIlBBVENIXCIsIFwidXBkYXRlLXNlbmRlclwiLCBzZW5kZXIpO1xuXHR9XG5cblx0LyoqXG5cdCAqIERlbGV0ZSBhbiBleGlzdGluZyBzZW5kZXIuXG5cdCAqL1xuXHRhc3luYyBkZWxldGVTZW5kZXIoc2VuZGVySUQ6c3RyaW5nKTpQcm9taXNlPHZvaWQ+IHtcblx0XHRjb25zdCB1cmkgPSBgL21hbmFnZS9jdXN0b21lci97e2N1c3RvbWVySUR9fS9zZW5kZXIvJHtlbmNvZGVVUklDb21wb25lbnQoc2VuZGVySUQpfWA7XG5cblx0XHRyZXR1cm4gYXdhaXQgdGhpcy5leGVjdXRlUmVxdWVzdDx2b2lkPih1cmksIFwiREVMRVRFXCIsIFwiZGVsZXRlLXNlbmRlclwiKTtcblx0fVxuXG5cdC8qKlxuXHQgKiBHZXQgYSBsaXN0IG9mIGFwcCBrZXlzLlxuXHQgKiBMaW1pdHMgdGhlIG51bWJlciBvZiByZWNvcmRzIGJ5IHBhZ2VTaXplIGFuZCBzdGFydGluZyB3aXRoIHRoZSByZWNvcmQgYXQgbmV4dFBhZ2VJRC5cblx0ICovXG5cdGFzeW5jIGdldEFwcEtleXMocGFnZVNpemU6bnVtYmVyLCBuZXh0UGFnZUlEPzpzdHJpbmcpOlByb21pc2U8VHlwZXMuQXBwS2V5TGlzdD4ge1xuXHRcdGNvbnN0IHVyaSA9IFwiL21hbmFnZS9jdXN0b21lci97e2N1c3RvbWVySUR9fS9hcHBrZXlzXCI7XG5cblx0XHRyZXR1cm4gYXdhaXQgdGhpcy5leGVjdXRlUmVxdWVzdDxUeXBlcy5BcHBLZXlMaXN0Pih1cmksIFwiR0VUXCIsIFwibGlzdC1hcHBrZXlcIiwgdW5kZWZpbmVkLCB7XG5cdFx0XHRwYWdlc2l6ZTogcGFnZVNpemUsXG5cdFx0XHRuZXh0cGFnZTogbmV4dFBhZ2VJRCxcblx0XHR9KTtcblx0fVxuXG5cdC8qKlxuXHQgKiBHZXQgYW4gYXBwIGtleSByZWNvcmQuXG5cdCAqL1xuXHRhc3luYyBnZXRBcHBLZXkoYXBwS2V5SUQ6c3RyaW5nKTpQcm9taXNlPFR5cGVzLkFwcEtleT4ge1xuXHRcdGNvbnN0IHVyaSA9IGAvbWFuYWdlL2N1c3RvbWVyL3t7Y3VzdG9tZXJJRH19L2FwcGtleS8ke2VuY29kZVVSSUNvbXBvbmVudChhcHBLZXlJRCl9YDtcblxuXHRcdHJldHVybiBhd2FpdCB0aGlzLmV4ZWN1dGVSZXF1ZXN0PFR5cGVzLkFwcEtleT4odXJpLCBcIkdFVFwiLCBcImdldC1hcHBrZXlcIik7XG5cdH1cblxuXHQvKipcblx0ICogQ3JlYXRlcyBhIG5ldyBhcHAga2V5LlxuXHQgKi9cblx0YXN5bmMgY3JlYXRlQXBwS2V5KGFwcEtleTpUeXBlcy5DcmVhdGVBcHBLZXlEYXRhKTpQcm9taXNlPFR5cGVzLkFwcEtleT4ge1xuXHRcdGNvbnN0IHVyaSA9IFwiL21hbmFnZS9jdXN0b21lci97e2N1c3RvbWVySUR9fS9hcHBrZXlcIjtcblxuXHRcdHJldHVybiBhd2FpdCB0aGlzLmV4ZWN1dGVSZXF1ZXN0PFR5cGVzLkFwcEtleT4odXJpLCBcIlBPU1RcIiwgXCJjcmVhdGUtYXBwa2V5XCIsIGFwcEtleSk7XG5cdH1cblxuXHQvKipcblx0ICogVXBkYXRlIGFuIGV4aXN0aW5nIGFwcCBrZXkuXG5cdCAqL1xuXHRhc3luYyB1cGRhdGVBcHBLZXkoYXBwS2V5SUQ6c3RyaW5nLCBhcHBLZXk6VHlwZXMuVXBkYXRlQXBwS2V5RGF0YSk6UHJvbWlzZTxUeXBlcy5BcHBLZXk+IHtcblx0XHRjb25zdCB1cmkgPSBgL21hbmFnZS9jdXN0b21lci97e2N1c3RvbWVySUR9fS9hcHBrZXkvJHtlbmNvZGVVUklDb21wb25lbnQoYXBwS2V5SUQpfWA7XG5cblx0XHRyZXR1cm4gYXdhaXQgdGhpcy5leGVjdXRlUmVxdWVzdDxUeXBlcy5BcHBLZXk+KHVyaSwgXCJQQVRDSFwiLCBcInVwZGF0ZS1hcHBrZXlcIiwgYXBwS2V5KTtcblx0fVxuXG5cdC8qKlxuXHQgKiBEZWxldGUgYW4gZXhpc3RpbmcgYXBwIGtleS5cblx0ICovXG5cdGFzeW5jIGRlbGV0ZUFwcEtleShhcHBLZXlJRDpzdHJpbmcpOlByb21pc2U8dm9pZD4ge1xuXHRcdGNvbnN0IHVyaSA9IGAvbWFuYWdlL2N1c3RvbWVyL3t7Y3VzdG9tZXJJRH19L2FwcGtleS8ke2VuY29kZVVSSUNvbXBvbmVudChhcHBLZXlJRCl9YDtcblxuXHRcdHJldHVybiBhd2FpdCB0aGlzLmV4ZWN1dGVSZXF1ZXN0PHZvaWQ+KHVyaSwgXCJERUxFVEVcIiwgXCJkZWxldGUtYXBwa2V5XCIpO1xuXHR9XG5cblx0LyoqXG5cdCAqIEdldCBhIGxpc3Qgb2YgYmxvY2tzLlxuXHQgKiBMaW1pdHMgdGhlIG51bWJlciBvZiByZWNvcmRzIGJ5IHBhZ2VTaXplIGFuZCBzdGFydGluZyB3aXRoIHRoZSByZWNvcmQgYXQgbmV4dFBhZ2VJRC5cblx0ICovXG5cdGFzeW5jIGdldEJsb2NrcyhwYWdlU2l6ZTpudW1iZXIsIG5leHRQYWdlSUQ/OlN0cmluZyk6UHJvbWlzZTxUeXBlcy5CbG9ja0xpc3Q+IHtcblx0XHRjb25zdCB1cmkgPSBcIi9tYW5hZ2UvY3VzdG9tZXIve3tjdXN0b21lcklEfX0vYmxvY2tzXCI7XG5cblx0XHRyZXR1cm4gYXdhaXQgdGhpcy5leGVjdXRlUmVxdWVzdDxUeXBlcy5CbG9ja0xpc3Q+KHVyaSwgXCJHRVRcIiwgXCJsaXN0LWJsb2NrXCIsIHVuZGVmaW5lZCwge1xuXHRcdFx0cGFnZXNpemU6IHBhZ2VTaXplLFxuXHRcdFx0bmV4dHBhZ2U6IG5leHRQYWdlSUQsXG5cdFx0fSk7XG5cdH1cblxuXHQvKipcblx0ICogR2V0IGEgYmxvY2sgcmVjb3JkLlxuXHQgKi9cblx0YXN5bmMgZ2V0QmxvY2soYmxvY2tJRDpzdHJpbmcpOlByb21pc2U8VHlwZXMuQmxvY2s+IHtcblx0XHRjb25zdCB1cmkgPSBgL21hbmFnZS9jdXN0b21lci97e2N1c3RvbWVySUR9fS9ibG9jay8ke2VuY29kZVVSSUNvbXBvbmVudChibG9ja0lEKX1gO1xuXG5cdFx0cmV0dXJuIGF3YWl0IHRoaXMuZXhlY3V0ZVJlcXVlc3Q8VHlwZXMuQmxvY2s+KHVyaSwgXCJHRVRcIiwgXCJnZXQtYmxvY2tcIik7XG5cdH1cblxuXHQvKipcblx0ICogQ3JlYXRlcyBhIG5ldyBibG9jay5cblx0ICovXG5cdGFzeW5jIGNyZWF0ZUJsb2NrKGJsb2NrOlR5cGVzLkNyZWF0ZUJsb2NrRGF0YSk6UHJvbWlzZTxUeXBlcy5CbG9jaz4ge1xuXHRcdGNvbnN0IHVyaSA9IFwiL21hbmFnZS9jdXN0b21lci97e2N1c3RvbWVySUR9fS9ibG9ja1wiO1xuXG5cdFx0cmV0dXJuIGF3YWl0IHRoaXMuZXhlY3V0ZVJlcXVlc3Q8VHlwZXMuQmxvY2s+KHVyaSwgXCJQT1NUXCIsIFwiY3JlYXRlLWJsb2NrXCIsIGJsb2NrKTtcblx0fVxuXG5cdC8qKlxuXHQgKiBEZWxldGUgYSBibG9jay5cblx0ICovXG5cdGFzeW5jIGRlbGV0ZUJsb2NrKGJsb2NrSUQ6c3RyaW5nKTpQcm9taXNlPHZvaWQ+IHtcblx0XHRjb25zdCB1cmkgPSBgL21hbmFnZS9jdXN0b21lci97e2N1c3RvbWVySUR9fS9ibG9jay8ke2VuY29kZVVSSUNvbXBvbmVudChibG9ja0lEKX1gO1xuXG5cdFx0YXdhaXQgdGhpcy5leGVjdXRlUmVxdWVzdDx2b2lkPih1cmksIFwiREVMRVRFXCIsIFwiZGVsZXRlLWJsb2NrXCIpO1xuXHR9XG5cblx0Ly8gSWYgdGhlcmUgaXMgYSBuZXR3b3JrIHJlc3BvbnNlIHdpdGggSlNPTiB0aGVuIGEgdHVwbGUgaXMgcmV0dXJuZWQgKGJvb2xlYW4gc3VjY2Vzcywgb2JqZWN0IGpzb25Db250ZW50KS4gSWYgYW55IGV4Y2VwdGlvbnMgYXJlIHRocm93biB0aGV5IGFyZSBub3QgaGFuZGxlZCBieSB0aGlzIG1ldGhvZC5cblx0cHJpdmF0ZSBhc3luYyBleGVjdXRlUmVxdWVzdDxUPih1cmk6c3RyaW5nLCBtZXRob2Q6c3RyaW5nLCBjb250ZW50VHlwZVJlc291cmNlOnN0cmluZywgcmVxdWVzdEJvZHk/OmFueSwgcXVlcnlQYXJhbWV0ZXJzPzphbnkpOlByb21pc2U8VD4ge1xuXHRcdGF3YWl0IHRoaXMuaW5pdENsaWVudCgpO1xuXHRcdHVyaSA9IHVyaS5yZXBsYWNlKC97e2N1c3RvbWVySUR9fS8sIGVuY29kZVVSSUNvbXBvbmVudCh0aGlzLmN1c3RvbWVySUQhKSk7XG5cblx0XHRsZXQgcXAgPSBcIlwiO1xuXHRcdGlmIChxdWVyeVBhcmFtZXRlcnMpIHtcblx0XHRcdGZvciAoY29uc3QgW2ssIHZdIG9mIE9iamVjdC5lbnRyaWVzKHF1ZXJ5UGFyYW1ldGVycykpIHtcblx0XHRcdFx0aWYgKHYgPT09IHVuZGVmaW5lZCB8fCB2ID09PSBudWxsKSB7XG5cdFx0XHRcdFx0ZGVsZXRlIHF1ZXJ5UGFyYW1ldGVyc1trXTtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXG5cdFx0XHRxcCA9IFwiP1wiICsgbmV3IFVSTFNlYXJjaFBhcmFtcyhxdWVyeVBhcmFtZXRlcnMpO1xuXHRcdH1cblxuXHRcdGxldCByZXF1ZXN0RGF0YTphbnkgPSB1bmRlZmluZWQ7XG5cdFx0aWYgKHJlcXVlc3RCb2R5KSB7XG5cdFx0XHRyZXF1ZXN0RGF0YSA9ICh0eXBlb2YgcmVxdWVzdEJvZHkgPT09IFwic3RyaW5nXCIpID8gcmVxdWVzdEJvZHkgOiBKU09OLnN0cmluZ2lmeShyZXF1ZXN0Qm9keSk7XG5cdFx0fVxuXG5cdFx0bGV0IHJlc3BvbnNlQm9keVRleHQ6c3RyaW5nfHVuZGVmaW5lZCA9IHVuZGVmaW5lZDtcblx0XHRsZXQgcmVzcG9uc2VCb2R5OmFueSA9IHVuZGVmaW5lZDtcblxuXHRcdGxldCByZXNwb25zZTpSZXNwb25zZXx1bmRlZmluZWQ7XG5cblx0XHR0cnkge1xuXHRcdFx0cmVzcG9uc2UgPSBhd2FpdCBmZXRjaCh0aGlzLmJhc2VVcmwgKyB1cmkgKyBxcCwge1xuXHRcdFx0XHRtZXRob2QsXG5cdFx0XHRcdGhlYWRlcnM6IHtcblx0XHRcdFx0XHRcIkNvbnRlbnQtVHlwZVwiOiBgYXBwbGljYXRpb24vdm5kLm5vdGlmaWNhdGlvbi4ke2NvbnRlbnRUeXBlUmVzb3VyY2V9LnYxK2pzb25gLFxuXHRcdFx0XHRcdFwiQXV0aG9yaXphdGlvblwiOiB0aGlzLmF1dGhvcml6YXRpb25Ub2tlbixcblx0XHRcdFx0fSxcblx0XHRcdFx0Ym9keTogcmVxdWVzdERhdGEsXG5cdFx0XHR9KTtcblx0XHRcdHJlc3BvbnNlQm9keVRleHQgPSBhd2FpdCByZXNwb25zZS50ZXh0KCk7XG5cdFx0fSBjYXRjaCAoZXg6YW55KSB7XG5cdFx0XHR0aHJvdyBuZXcgRXJyb3JzLkZldGNoRXJyb3IoKGV4IGFzIEVycm9yKS5tZXNzYWdlLCB7IGNhdXNlOiBleCB9KTtcblx0XHR9XG5cblx0XHRpZiAoIXJlc3BvbnNlKSB7XG5cdFx0XHR0aHJvdyBuZXcgRXJyb3JzLlJlc3BvbnNlRXJyb3IoXCJTZXJ2ZXIgZGlkIG5vdCByZXNwb25kXCIpO1xuXHRcdH1cblxuXHRcdGlmIChyZXNwb25zZS5zdGF0dXMgPT09IDQwMSB8fCByZXNwb25zZS5zdGF0dXMgPT09IDQwMykge1x0Ly8gQVdTIEhUVFAgQVBJIEdhdGV3YXkgcmV0dXJucyA0MDMgZnJvbSB0aGUgYXV0aG9yaXplciAoaW5zdGVhZCBvZiA0MDEpIGlmIHRoZSBjcmVkZW50aWFscyBhcmUgaW52YWxpZFxuXHRcdFx0dGhyb3cgbmV3IEVycm9ycy5BdXRob3JpemF0aW9uRXJyb3IoXCJBdXRob3JpemF0aW9uIEZhaWxlZFwiKTtcblx0XHR9IGVsc2UgaWYgKHJlc3BvbnNlLnN0YXR1cyA9PT0gNDA0KSB7XG5cdFx0XHR0aHJvdyBuZXcgRXJyb3JzLlJlc3BvbnNlRXJyb3IoXCJSZXNvdXJjZSBub3QgZm91bmRcIik7XG5cdFx0fVxuXG5cblx0XHR0cnkge1xuXHRcdFx0cmVzcG9uc2VCb2R5ID0gcmVzcG9uc2VCb2R5VGV4dCAmJiBKU09OLnBhcnNlKHJlc3BvbnNlQm9keVRleHQpO1xuXHRcdH0gY2F0Y2ggKGV4KSB7XG5cdFx0XHR0aHJvdyBuZXcgRXJyb3JzLlJlc3BvbnNlRXJyb3IoXCJJbnZhbGlkIHJlc3BvbnNlIGNvbnRlbnRcIiwgeyBjYXVzZTogcmVzcG9uc2VCb2R5VGV4dH0pO1xuXHRcdH1cblxuXHRcdGlmIChyZXNwb25zZS5zdGF0dXMgIT0gMjAwKSB7XG5cdFx0XHR0aHJvdyBuZXcgRXJyb3JzLlJlc3BvbnNlRXJyb3IocmVzcG9uc2VCb2R5LkVycm9yIHx8IHJlc3BvbnNlQm9keVRleHQpO1xuXHRcdH1cblxuXHRcdHJldHVybiByZXNwb25zZUJvZHkgYXMgVDtcblx0fVxuXG5cdC8vIFRoZXJlIG11c3QgYmUgYSBjbGllbnQgaWQgc3BlY2lmaWVkLiBJZiB3ZSBkb24ndCBoYXZlIG9uZSB0aGVuIHJldHJpZXZlIHRoZSB2YWx1ZSBmb3IgdGhlIGF1dGhlbnRpY2F0ZWQgY3VzdG9tZXIuXG5cdC8vIFRoaXMgaXMgY2FsbGVkIGJlZm9yZSBlYWNoIHJlcXVlc3QgdG8gdmVyaWZ5IGEgY3VzdG9tZXIgSUQgaXMgcHJlc2VudFxuXHRwcml2YXRlIGFzeW5jIGluaXRDbGllbnQoKSB7XG5cdFx0aWYgKHRoaXMuaW5pdENvbXBsZXRlKSByZXR1cm47XG5cblx0XHR0aGlzLmluaXRDb21wbGV0ZSA9IHRydWU7XHQvLyBNYXJrIGluaXQgYXMgY29tcGxldGUgYmVmb3JlIHRyaWdnZXJpbmcgdGhlIGN1c3RvbWVyIElEIGxvb2t1cCBvciB3ZSBnZXQgY2lyY3VsYXIgY2FsbHNcblxuXHRcdHRyeSB7XG5cdFx0XHRjb25zdCBkYXRhSXRlbSA9IGF3YWl0IHRoaXMuZ2V0SW5mbygpO1xuXHRcdFx0dGhpcy5jdXN0b21lcklEID0gZGF0YUl0ZW0uQ3VzdG9tZXJJRDtcblx0XHR9IGNhdGNoIChleCkge1xuXHRcdFx0dGhpcy5pbml0Q29tcGxldGUgPSBmYWxzZTtcblxuXHRcdFx0Y29uc3QgZXJyb3IgPSBleCBhcyBFcnJvcjtcblxuXHRcdFx0aWYgKGVycm9yIGluc3RhbmNlb2YgRXJyb3JzLkF1dGhvcml6YXRpb25FcnJvcikgdGhyb3cgZXJyb3I7XG5cdFx0XHRlbHNlIHRocm93IG5ldyBFcnJvcnMuSW5pdEVycm9yKGBGYWlsZWQgdG8gaW5pdCBjbGllbnQ6ICR7ZXJyb3IubWVzc2FnZX1gLCB7IGNhdXNlOiBlcnJvciB9KTtcblx0XHR9XG5cdH1cblxuXHRwcml2YXRlIGlzVXJsKHZhbHVlOnN0cmluZyk6Ym9vbGVhbiB7XG5cdFx0dHJ5IHtcblx0XHRcdGNvbnN0IHVybCA9IG5ldyBVUkwodmFsdWUpO1xuXHRcdFx0cmV0dXJuIHVybC5wcm90b2NvbCA9PT0gXCJodHRwOlwiIHx8IHVybC5wcm90b2NvbCA9PT0gXCJodHRwczpcIjtcblx0XHR9IGNhdGNoIHsgfVxuXG5cdFx0cmV0dXJuIGZhbHNlO1xuXHR9XG59XG4iXX0=
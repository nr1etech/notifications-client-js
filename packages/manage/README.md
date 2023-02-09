# NetRadius Notifications Service Manage API Javascript Client


## Installation

`npm install @netradius/notifications-manage-client`

## Usage

```typescript
import { NotificationsManageClient } from "@netradius/notifications-manage-client";

let baseUrl = "https://api.....";

const manageClient = new NotificationsManageClient(baseUrl, {
	authorizationToken: "abcd-1234",
});

const accountInfo = await manageClient.getInfo();
```

# NetRadius Notifications Service Message API Javascript Client


## Installation

`npm install @netradius/notifications-message-client`

## Usage

```typescript
import { NotificationsMessageClient } from "@netradius/notifications-message-client";

let baseUrl = "https://api.....";

const manageClient = new NotificationsMessageClient(baseUrl, {
	authorizationToken: "abcd-1234",
});

const userInfo = await manageClient.getInfo();
```

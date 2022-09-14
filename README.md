# NetRadius Notifications Service Javascript Client

This monorepo contains client packages for interfacing with the NetRadius Notifications Service management and messaging APIs.

## Installation

`npm install @netradius/notifications-message-client`

`npm install @netradius/notifications-manage-client`


### Developer Notes
Do not add package dependencies using 'npm install'. Use the appropriate `lerna` commands

### `lerna` command summary. These commands should be run from the project root rather than the package roots.

- `npm install` -- install npm modules for the root and also all the workspaces in /packages. This must be run once after cloning to install the lerna packages.
- `npx lerna bootstrap` -- install all dependencies and will also handle local dependencies (if any).
- `npx lerna create package` -- add a new package to the monorepo with basic scaffolding. You will need to create the tsconfig.json and modify the package.json after the package is created.
- `npx lerna add module /packages/package` -- replaces `npm install module` for packages. If a package path is omitted the module will be added as a dependency in all the packages.
- `npx lerna run tsc`  -- runs the package.json script 'tsc' from all the packages (so you don't have to run them individually).


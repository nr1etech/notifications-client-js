# notifications-client-js

## helpful commands. should be run from the project root
npm install
 -- this will install npm modules for the root and also all the workspaces in /packages
npx lerna bootstrap
 -- this will install any dependencies and will also handle local dependencies (if any)
npx lerna add module --scope=@notifications-client
 -- this will add a new scoped module
npx lerna run tsc
 -- this will run the package.json script 'tsc' in all the packages (so you don't have to run them individually)

#!/bin/bash
set -e

./scripts/clean-artifacts.sh

echo "Installing node modules..."

npm ci --no-fund

echo "Building and linting project..."

npx lerna run tsc
npx lerna run lint

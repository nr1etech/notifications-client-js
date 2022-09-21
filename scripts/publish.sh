#!/bin/bash
set -e

./scripts/clean-artifacts.sh
./scripts/build.sh

npx lerna publish

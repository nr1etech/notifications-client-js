#!/bin/bash
set -e

echo "Cleaning lerna logs, package output and all node_modules..."

rm -rf ./lerna-debug.log

rm -rf ./node_modules

rm -rf ./packages/manage/node_modules
rm -rf ./packages/manage/lib

rm -rf ./packages/message/node_modules
rm -rf ./packages/message/lib

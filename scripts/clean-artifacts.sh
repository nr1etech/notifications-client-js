#!/bin/bash
set -e

rm -r ./lerna-debug.log

rm -rf ./node_modules

rm -rf ./packages/manage/node_modules
rm -rf ./packages/manage/lib

rm -rf ./packages/message/node_modules
rm -rf ./packages/message/lib

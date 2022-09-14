#!/bin/bash
set -e

rm -rf ./node_modules
rm -rf ./superbin
rm -f tsconfig.tsbuildinfo

rm -rf ./packages/manage/node_modules
rm -rf ./packages/manage/lib
rm -rf ./packages/manage/tsconfig.tsbuildinfo

rm -rf ./packages/message/node_modules
rm -rf ./packages/message/lib
rm -rf ./packages/message/tsconfig.tsbuildinfo

#!/bin/bash
set -e

cd $(dirname $0)

## Read from stdin
IFS=''
while read line; do
  echo "$line"
done | npx ts-node ./timestamp.ts

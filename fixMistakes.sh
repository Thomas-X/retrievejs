#!/bin/bash

echo "Doing git things.."

git add .
git commit -m "$1"
git push
npm version "$2"
npm publish
#!/usr/bin/env bash
echo 'Releasing..'
npm version "$1"
npm publish
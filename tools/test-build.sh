#!/bin/bash

git checkout v11-lts && git pull && pnpm i

# 11.37.1-rei0784-5.xx.x-xxxxxxxx
NODE_ENV=production RK_MODE=testing pnpm build

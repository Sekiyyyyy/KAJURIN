#!/usr/bin/env bash
cd "$(dirname "$0")"
pm2 start ecosystem.config.cjs
pm2 status kajurin


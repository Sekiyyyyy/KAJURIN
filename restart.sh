#!/usr/bin/env bash
cd "$(dirname "$0")"
pm2 restart kajurin
pm2 status kajurin


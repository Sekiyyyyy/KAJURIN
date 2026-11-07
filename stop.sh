#!/usr/bin/env bash
cd "$(dirname "$0")"
pm2 stop kajurin
pm2 status kajurin


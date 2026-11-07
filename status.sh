#!/usr/bin/env bash
cd "$(dirname "$0")"
pm2 status kajurin
echo ""
echo "=== Informasi Akses KAJURIN ==="
IP=$(hostname -I 2>/dev/null | awk '{print $1}')
echo "Port 80 (Standar Web):"
echo "  - Localhost : http://localhost"
if [ -n "$IP" ]; then
  echo "  - IP Lokal  : http://${IP}"
fi
echo ""
echo "Port 3000 (Direct Node):"
echo "  - Localhost : http://localhost:3000"
if [ -n "$IP" ]; then
  echo "  - IP Lokal  : http://${IP}:3000"
fi
echo "================================"

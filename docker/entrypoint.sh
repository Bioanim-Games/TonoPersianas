#!/bin/bash
set -eu

: "${BFF_SESSION_SECRET:?BFF_SESSION_SECRET must be set}"
: "${BFF_INTERNAL_SECRET:?BFF_INTERNAL_SECRET must be set}"

cd /app
uvicorn main:app --host 127.0.0.1 --port 8000 &
API_PID=$!

cd /srv/ui
node bff/server.ts &
BFF_PID=$!

trap 'kill $API_PID $BFF_PID 2>/dev/null || true' TERM INT

# Exit as soon as either process dies so the container gets restarted
wait -n || true
kill $API_PID $BFF_PID 2>/dev/null || true
wait || true
exit 1

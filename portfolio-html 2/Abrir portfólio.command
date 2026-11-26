#!/bin/sh
# Opens the standalone copy of the portfolio in your browser (a tiny local server; close this window to stop it).
cd "$(dirname "$0")/site" || exit 1
PORT=4173
( sleep 1; open "http://localhost:$PORT/" ) &
exec python3 -m http.server $PORT

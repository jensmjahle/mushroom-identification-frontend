#!/bin/sh
echo "window.env = {" > /app/env.js
echo "  VITE_API_URL: '\"${VITE_API_URL}\"'," >> /app/env.js
echo "};" >> /app/env.js

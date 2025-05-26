#!/bin/sh

# If VITE_API_URL is unset or empty, do nothing—
# leaves the static dist/env.js intact as the fallback.
if [ -z "${VITE_API_URL}" ]; then
  exit 0
fi

# Otherwise overwrite /app/env.js with the real value
echo "window.env = {" > /app/env.js
echo "  VITE_API_URL: \"${VITE_API_URL}\"" >> /app/env.js
echo "};" >> /app/env.js
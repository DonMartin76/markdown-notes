#!/bin/bash

# This has potential for optimizations...
printf "{
  \"authServers\": [" > /var/www/settings.json
if [ ! -z "$USE_GITHUB" ]; then
    printf "{
      \"name\": \"GitHub\",
      \"url\": \"${AUTH_SERVER}/github/api/markdown-notes?client_id=${CLIENT_ID}&response_type=token\",
      \"profileUrl\": \"${AUTH_SERVER}/github/profile\",
      \"bsStyle\": \"default\"
    }" >> /var/www/settings.json
fi
if [ ! -z "$USE_GITHUB" ] && [ ! -z "$USE_GOOGLE" ]; then
    printf ",
    " >> /var/www/settings.json
fi
if [ ! -z "$USE_GOOGLE" ]; then
    printf "{
      \"name\": \"Google\",
      \"url\": \"${AUTH_SERVER}/google/api/markdown-notes?client_id=${CLIENT_ID}&response_type=token\",
      \"profileUrl\": \"${AUTH_SERVER}/google/profile\",
      \"bsStyle\": \"danger\"
    }" >> /var/www/settings.json
fi
printf "]
}" >> /var/www/settings.json

chmod 0644 /var/www/settings.json
cat /var/www/settings.json

nginx

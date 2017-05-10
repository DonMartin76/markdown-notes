FROM kyma/docker-nginx

COPY docker/entrypoint.sh /entrypoint.sh
COPY build/ /var/www

# CMD 'nginx'

ENTRYPOINT ["/entrypoint.sh"]

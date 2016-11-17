# Markdown Notes - backend API

Interesting bits and pieces:

* Have look at the `userMapper`, which takes the `X-Authenticated-Userid` which is introduced by Kong, and maps that to an internal user; it doesn't matter if the user is already present or not, the user will be created automatically if not present
* `apiAuth` enforces simple Basic Auth for base usage of the API; this does not mean the credentials are actually used for something, and they default to `username` and `password`. This is just to prevent people hitting the API (should they have network access to it) without going via the API Gateway (bad idea)
* The "db" is just storing stuff in plain JSON files to disk
* To actually get persistance (we're in Docker, remember), the `docker-compose.yml` defines a volume for the API where it stores its data (with the location defined via env var)

## Tweaking behaviour

Use the following env vars to tweak behaviour:

* `API_USERNAME`: The username for the Basic Auth, defaults to `username`
* `API_PASSWORD`: The password for the Basic Auth, defaults to `password`
* `API_DATAPATH`: Where the API should store its data, defaults to `__dirname/data` (override this in `docker-compose.yml`)
* `API_BASE_PATH`: Which base path should the API respond to; defaults to `/`, i.e. server root. Must start and end with a slash `/`.

## Deploying

Deployment is assumed to be on a Docker host you can deploy to, and for which you have the certificate to be able to use it (using `docker-machine`).

Deploy behind an SSL termination of some sorts, like the `docker-haproxy` from the proposed `docker-compose.yml.template` file in this directory.

There is also a template `deploy-api.sh.template` file which can perhaps be used for getting the idea of how to deploy. It reads certificates from a `certs` directory, where the API certificates need to be stored as `api-cert.pem` and `api-key.pem`. The Docker machine ID is assumed to be `markdown-notes`; if this is something else, change it accordingly. If you want to test deployment locally, you can also just skip the first line, and things will just work. In that case, when accessing the API using `curl` or similar, also pass the `-H 'Host: api.yourcompany.com'` (or whatever you specified there) with `curl`, otherwise `haproxy` will just respond with a `503` (could not route request).

With the following bash command (inside the `api` directory), new self-signed certificates can be created:

```bash
$ mkdir -p certs && pushd certs && openssl req -x509 -newkey rsa:2048 -keyout api-key.pem -out api-cert.pem -nodes -days 730 && popd
...
```

## Publishing via wicked.haufe.io

Settings for wicked:

* Specify a suitable Authorization Server (supporting the OAuth 2.0 Implicit Flow)
* Add a request transformer to pass in the Basic Auth you specified via `API_USERNAME` and `API_PASSWORD`
* Enable CORS (without any special settings)

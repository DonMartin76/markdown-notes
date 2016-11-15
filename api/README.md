# Markdown Notes - backend API

Interesting bits and pieces:

* Have look at the `userMapper`, which takes the `X-Authenticated-Userid` which is introduced by Kong, and maps that to an internal user; it doesn't matter if the user is already present or not, the user will be created automatically if not present
* `apiAuth` enforces simple Basic Auth for base usage of the API; this does not mean the credentials are actually used for something, and they default to `username` and `password`. This is just to prevent people hitting the API (should they have network access to it) without going via the API Gateway (bad idea)
* The "db" is just storing stuff in plain JSON files to disk
* To actually get persistance (we're in Docker, remember), the `docker-compose.yml` defines a volume for the API where it stores its data (with the location defined via env var)

## Deploying

Deploy behind an SSL termination of some sorts, like the `docker-haproxy` from the proposed `docker-compose.yml` file in the main repository directory.

## Tweaking behaviour

Use the following env vars to tweak behaviour:

* `API_USERNAME`: The username for the Basic Auth, defaults to `username`
* `API_PASSWORD`: The password for the Basic Auth, defaults to `password`
* `API_DATAPATH`: Where the API should store its data, defaults to `__dirname/data` (override this in `docker-compose.yml`)
* `API_BASE_PATH`: Which base path should the API respond to; defaults to `/`, i.e. server root. Must start and end with a slash `/`.
 
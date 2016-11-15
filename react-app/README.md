# Markdown Notes - React/Redux SPA

Generated with `create-react-app`, not yet ejected (just works fine like it is).

For more information on that, see the [README_react](README_react.md).

## Inject authorization servers

Build the react-app like this:

```bash
$ REACT_APP_AUTH_SERVER_GITHUB=true REACT_APP_AUTH_SERVER_GOOGLE=true REACT_APP_AUTH_SERVER_SOCIAL=https://api.donmartin76.com/auth-passport/ REACT_APP_CLIENT_ID=<your client id> npm run build
```

Depending on which social authentication methods you want, specify the following env variables prior to building:

* `REACT_APP_AUTH_SERVER_SOCIAL`: The base URL to the wicked Authorization Server (`wicked.auth-passport`)
* `REACT_APP_AUTH_SERVER_GITHUB`: Set to `true` if you have configured Github Login
* `REACT_APP_AUTH_SERVER_GOOGLE`: Set to `true` if you have configured Google+ Login
* `REACT_APP_AUTH_SERVER_SAML`: Specify the base path to the SAML Authorization Server (if wanted), e.g. `https://api.donmartin76.com/auth-saml/`

You can also just start the development server like this:

```bash
$ REACT_APP_AUTH_SERVER...=... npm start
```

Using the same environment variables as above.

**Note**: Chrome does not support cookies via `http://localhost`. The API Portal as of 0.10.1 will also support the following aliases for `localhost`: `http://127.0.0.1` and `http://portal.local` (need to be set in `/etc/hosts`). All other redirect URIs need to start with `https://`.
 
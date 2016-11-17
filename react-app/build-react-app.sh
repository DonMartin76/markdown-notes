#!/bin/bash

export REACT_APP_CLIENT_ID=e68d9c4fbb6b35b0b58142984063292bbc594f83

export REACT_APP_AUTH_SERVER_SOCIAL=https://api.donmartin76.com/auth-passport
export REACT_APP_AUTH_SERVER_GITHUB=true
export REACT_APP_AUTH_SERVER_GOOGLE=true

#export REACT_APP_AUTH_SERVER_SAML=https://api.donmartin76.com/auth-saml

npm run build

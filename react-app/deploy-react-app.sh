#!/bin/bash

set -e

cp -R build/ ../publish/markdown-notes
pushd ../publish/markdown-notes

git add .
git commit -m "Pushing new release"
git push

popd


FROM node:12-slim

LABEL "com.github.actions.name"="Monorepo PR Repo extractor"
LABEL "com.github.actions.description"="Monorepo PR Repo extractor"
LABEL "com.github.actions.icon"="git-merge"
LABEL "com.github.actions.color"="green"

LABEL "maintainer"="Andreas Fürst"

ADD entrypoint.sh /action/entrypoint.sh
ADD package.json /action/package.json
ADD index.js /action/index.js
ADD helpers.js /action/helpers.js

RUN chmod +x /action/entrypoint.sh

ENTRYPOINT ["/action/entrypoint.sh"]
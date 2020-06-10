FROM node:12-slim

LABEL com.github.actions.name="Detect changed projects action"
LABEL com.github.actions.description="Detect changed projects for monorepo action"
LABEL com.github.actions.icon="box"
LABEL com.github.actions.color="green"

LABEL maintainer="Andreas Fürst"
LABEL version="1.0.0"

ADD entrypoint.sh /action/entrypoint.sh
ADD package.json /action/package.json
ADD index.js /action/index.js
ADD helpers.js /action/helpers.js

RUN chmod +x /action/entrypoint.sh

ENTRYPOINT ["/action/entrypoint.sh"]
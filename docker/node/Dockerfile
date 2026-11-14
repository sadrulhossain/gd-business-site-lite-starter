# Node for the dev server and the static build. pnpm comes from corepack; the bundled npm is never used here, and its
# packages are what image scans flag (docs/VERSIONS.md), so it is removed.
ARG NODE_VERSION
FROM node:${NODE_VERSION}-alpine
RUN rm -rf /usr/local/lib/node_modules/npm /usr/local/bin/npm /usr/local/bin/npx

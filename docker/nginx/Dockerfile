# nginx preview of ./out. The stock image plus the Alpine fixes that are already published (image scan, docs/VERSIONS.md).
ARG NGINX_VERSION
FROM nginx:${NGINX_VERSION}-alpine
RUN apk upgrade --no-cache

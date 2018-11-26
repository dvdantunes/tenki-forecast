#!/usr/bin/env bash

# Path to microservices code source
SERVER_PATH=server/
CLIENT_PATH=client/
REVERSE_PROXY_PATH=reverse-proxy/

# Docker images names
DOCKER_IMAGES_PREFIX=tenki-forecast
SERVER_IMAGE="$DOCKER_IMAGES_PREFIX-server"
CLIENT_IMAGE="$DOCKER_IMAGES_PREFIX-client"
REVERSE_PROXY_IMAGE="$DOCKER_IMAGES_PREFIX-traefik"

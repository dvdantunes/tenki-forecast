# Use official traefik image (https://hub.docker.com/_/traefik/)
FROM traefik:v1.7.4-alpine

MAINTAINER David Antunes <dvdantunes@gmail.com>

# Custom traefik.toml for ECS
COPY traefik_ecs.toml /etc/traefik/traefik.toml

# Mount point to listen to docker events
#VOLUME ["/var/run/docker.sock"]

# Expose ports for http and web UI
EXPOSE 80
EXPOSE 8080

# Args to entrypoint
# Enables the web UI and tells Traefik to listen to docker
CMD ["--api", "--docker"]

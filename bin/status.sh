#!/usr/bin/env bash

BIN_PATH="$PWD/bin"


# Load env configuration
source "$BIN_PATH/env-configuration.sh"

# Load utils
source "$BIN_PATH/utils.sh"

# Load AWS configuration
source "$BIN_PATH/aws-config.sh"




# Amazon ECS cluster status

colorecho "Getting '$AWS_ECS_CLUSTER_NAME' cluster status" $YELLOW
breakline


colorecho "Listing images history" $YELLOW

DOCKER_IMAGES=($SERVER_IMAGE $CLIENT_IMAGE $REVERSE_PROXY_IMAGE)

for IMAGE in "${DOCKER_IMAGES[@]}"
do
    breakline

    colorecho "Listing '$IMAGE' history" $CYAN

    ecs-cli images $IMAGE
    #aws ecr list-images --repository-name tenki-forecast-server
done
breakline
dekita
breakline


colorecho "Listing Task definition status" $YELLOW
breakline

ecs-cli ps --cluster-config $AWS_ECS_CLUSTER_CONFIG
breakline
dekita

#!/usr/bin/env bash

BIN_PATH="$PWD/bin"


# Load env configuration
source "$BIN_PATH/env-configuration.sh"

# Load utils
source "$BIN_PATH/utils.sh"

# Load AWS configuration
source "$BIN_PATH/aws-config.sh"




# Amazon ECS project removing

colorecho "Removing '$AWS_ECS_PROJECT_NAME' project from Amazon ECS" $YELLOW
breakline


colorecho "Scaling down '$AWS_ECS_CLUSTER_NAME' cluster" $YELLOW
breakline

ecs-cli compose --verbose --file docker-compose.yml --ecs-params ecs-params.yml service down --cluster-config $AWS_ECS_CLUSTER_CONFIG
breakline
dekita
breakline


colorecho "Permanently removing '$AWS_ECS_CLUSTER_NAME' cluster" $YELLOW
breakline

ecs-cli down --force --cluster-config $AWS_ECS_CLUSTER_CONFIG
breakline
dekita

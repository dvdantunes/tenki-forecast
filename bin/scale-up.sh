#!/usr/bin/env bash

BIN_PATH="$PWD/bin"


# Load env configuration
source "$BIN_PATH/env-configuration.sh"

# Load utils
source "$BIN_PATH/utils.sh"

# Load AWS configuration
source "$BIN_PATH/aws-config.sh"




# Amazon ECS cluster scale up

colorecho "Scaling up '$AWS_ECS_CLUSTER_NAME' cluster on Amazon ECS" $YELLOW
breakline

ecs-cli compose --verbose --project-name $AWS_ECS_PROJECT_NAME --file docker-compose.yml --ecs-params ecs-params.yml service up --create-log-groups --force-deployment --cluster-config $AWS_ECS_CLUSTER_CONFIG
breakline
dekita

#!/usr/bin/env bash

BIN_PATH="$PWD/bin"


# Load env configuration
source "$BIN_PATH/env-configuration.sh"

# Load utils
source "$BIN_PATH/utils.sh"

# Load AWS configuration
source "$BIN_PATH/aws-config.sh"




# Deploy project to Amazon ECS
#
# Troubleshooting:
# @see https://docs.aws.amazon.com/AmazonECS/latest/developerguide/service-event-messages.html
# @see https://community.gruntwork.io/t/unable-to-place-a-task-in-ecs/163
# @see https://stackoverflow.com/questions/36523282/aws-ecs-error-when-running-task-no-container-instances-were-found-in-your-clust

colorecho "Deploying '$AWS_ECS_PROJECT_NAME' project to Amazon ECS" $YELLOW
breakline


# Get AWS auth token
colorecho "Getting AWS auth token" $YELLOW
eval $(aws ecr get-login --no-include-email --region $AWS_DEFAULT_REGION)
dekita
breakline



# Scaling down current service
colorecho "Scaling down current '$AWS_ECS_CLUSTER_CONFIG' service" $YELLOW
breakline

ecs-cli compose --verbose --file docker-compose.yml --ecs-params ecs-params.yml service down --cluster-config $AWS_ECS_CLUSTER_CONFIG
breakline
dekita


# We need to sleep a little so down process can scale down the current service
# and avoid "InvalidParameterException: Unable to Start a service that is still Draining." error
sleep 10


# Deploying new service
colorecho "Deploying new '$AWS_ECS_CLUSTER_CONFIG' service to Amazon ECS" $YELLOW
breakline

ecs-cli compose --verbose --project-name $AWS_ECS_PROJECT_NAME --file docker-compose.yml --ecs-params ecs-params.yml service up --create-log-groups --force-deployment --cluster-config $AWS_ECS_CLUSTER_CONFIG
breakline
dekita

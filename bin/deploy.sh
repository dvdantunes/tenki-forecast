#!/usr/bin/env bash

BIN_PATH="$PWD/bin"


# Load env configuration
source "$BIN_PATH/env-configuration.sh"

# Load utils
source "$BIN_PATH/utils.sh"

# Load AWS configuration
source "$BIN_PATH/aws-config.sh"



# Build microservices docker images
# Note: we need to do this because AWS ECS doesn't allow builds by docker-compose.yml files
# so we need to push them first
colorecho "Building microservices docker images" $YELLOW

docker build -t $SERVER_IMAGE:latest $SERVER_PATH
# docker build -t $CLIENT_IMAGE:latest $CLIENT_PATH
docker build -t $REVERSE_PROXY_IMAGE:latest $REVERSE_PROXY_PATH

dekita
breakline



# AWS ECR docker image push

# Get AWS auth token
colorecho "Getting AWS auth token" $YELLOW
eval $(aws ecr get-login --no-include-email --region $AWS_DEFAULT_REGION)
dekita
breakline


# Check if repository exist for each image and push each image
colorecho "Pushing images to Amazon ECR" $YELLOW

# DOCKER_IMAGES = ($SERVER_IMAGE $CLIENT_IMAGE $REVERSE_PROXY_IMAGE)
DOCKER_IMAGES=( $SERVER_IMAGE $REVERSE_PROXY_IMAGE )

for IMAGE in "${DOCKER_IMAGES[@]}"
do
    breakline

    colorecho "Pushing '$IMAGE' image" $YELLOW
    breakline

    aws ecr list-images --repository-name $IMAGE &> /dev/null

    last_command_code=$?
    if [ $last_command_code -eq 0 ];then
       echo "'$IMAGE' repository found"

    else
       echo "'$IMAGE' repository not found, creating repository"
       (aws ecr create-repository --repository-name $IMAGE) || true
    fi

    # eg: 223263753891.dkr.ecr.us-east-1.amazonaws.com/tenki-forecast-server:latest
    docker tag $IMAGE:latest $AWS_ACCOUNT_ID.dkr.ecr.$AWS_DEFAULT_REGION.amazonaws.com/$IMAGE:latest
    docker push $AWS_ACCOUNT_ID.dkr.ecr.$AWS_DEFAULT_REGION.amazonaws.com/$IMAGE:latest

    last_command_code=$?
    if [ $last_command_code -ne 0 ];then
        colorecho "Error found pushing '$IMAGE' image" $RED
        breakline
        exit 1
    fi
done
breakline
dekita
breakline




# AWS ECS service deployment
#
# Troubleshooting:
# @see https://docs.aws.amazon.com/AmazonECS/latest/developerguide/service-event-messages.html
# @see https://community.gruntwork.io/t/unable-to-place-a-task-in-ecs/163
# @see https://stackoverflow.com/questions/36523282/aws-ecs-error-when-running-task-no-container-instances-were-found-in-your-clust

colorecho "Deploying new '$AWS_ECS_CLUSTER_CONFIG' service to Amazon ECS" $YELLOW
breakline

ecs-cli compose --verbose --file docker-compose.yml --ecs-params ecs-params.yml service down --cluster-config $AWS_ECS_CLUSTER_CONFIG
breakline
dekita

ecs-cli compose --verbose --project-name $AWS_ECS_PROJECT_NAME --file docker-compose.yml --ecs-params ecs-params.yml service up --create-log-groups --force-deployment --cluster-config $AWS_ECS_CLUSTER_CONFIG
breakline
dekita

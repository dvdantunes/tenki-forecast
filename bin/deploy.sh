#!/usr/bin/env bash

# Load env configuration
BIN_PATH="$PWD/bin"
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




# AWS ECR docker image push

# Get AWS auth token
colorecho "Getting AWS auth token" $YELLOW
eval $(aws ecr get-login --no-include-email --region $AWS_DEFAULT_REGION)
dekita


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

    # eg: 223263753891.dkr.ecr.us-east-1.amazonaws.com/tenki-forecast-server
    docker tag $IMAGE:latest $AWS_ACCOUNT_ID.dkr.ecr.$AWS_DEFAULT_REGION.amazonaws.com/$IMAGE:latest
    docker push $AWS_ACCOUNT_ID.dkr.ecr.$AWS_DEFAULT_REGION.amazonaws.com/$IMAGE:latest

    last_command_code=$?
    if [ $last_command_code -ne 0 ];then
        colorecho "Error found pushing '$IMAGE' image" $RED
        breakline
        exit 1
    fi
done
dekita



# ecs-cli up --verbose -cluster-config tenki-2 --keypair david --size 2 --instance-type t2.medium --image-id ami-045f1b3f87ed83659 --launch-type EC2 --vpc vpc-03c47a7627e65047b --subnets subnet-0f1713cc8d09256e9,subnet-0374ec6f39de7b754 --security-group sg-0da8056f522b9da5f --instance-role ecsInstanceRole

# ecs-cli compose --verbose --project-name tenki-forecast --file docker-compose.yml --ecs-params ecs-params.yml up --create-log-groups --force-update --cluster-config tenki-2

# ecs-cli ps --cluster-config tenki-2

# ecs-cli compose --verbose --file docker-compose.yml --ecs-params ecs-params.yml down --cluster-config tenki-2

# ecs-cli compose --verbose --file docker-compose.yml --ecs-params ecs-params.yml service up --cluster-config tenki-2

# ecs-cli ps --cluster-config tenki-2


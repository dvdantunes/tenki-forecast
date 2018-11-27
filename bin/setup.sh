#!/usr/bin/env bash

BIN_PATH="$PWD/bin"


# Load env configuration
source "$BIN_PATH/env-configuration.sh"

# Load utils
source "$BIN_PATH/utils.sh"

# Load AWS configuration
source "$BIN_PATH/aws-config.sh"




# Amazon ECS project setup

colorecho "Setting up '$AWS_ECS_PROJECT_NAME' project on Amazon ECS" $YELLOW
breakline


# Amazon ECS cluster setup
colorecho "Setting up '$AWS_ECS_CLUSTER_NAME' cluster" $YELLOW
breakline

ecs-cli configure --cluster $AWS_ECS_CLUSTER_NAME --region $AWS_DEFAULT_REGION --default-launch-type $AWS_ECS_DEFAULT_CLUSTER_LAUNCH_TYPE --config-name $AWS_ECS_CLUSTER_CONFIG
ecs-cli configure profile --access-key $AWS_ACCESS_KEY_ID --secret-key $AWS_SECRET_ACCESS_KEY --profile-name $AWS_ECS_CLUSTER_CONFIG

ecs-cli up --verbose -cluster-config $AWS_ECS_CLUSTER_CONFIG --keypair $AWS_KEY_PAIR --size $AWS_ECS_INSTANCE_SIZE --instance-type $AWS_ECS_INSTANCE_TYPE --image-id $AWS_ECS_INSTANCE_IMAGE_ID --launch-type $AWS_ECS_DEFAULT_CLUSTER_LAUNCH_TYPE --vpc $AWS_VPC --subnets $AWS_SUBNETS --security-group $AWS_SECURITY_GROUP --instance-role $AWS_INSTANCE_ROLE
breakline
dekita

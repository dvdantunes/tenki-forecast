#!/usr/bin/env bash

# AWS credentials
# @see https://docs.aws.amazon.com/IAM/latest/UserGuide/console_account-alias.html
# @see https://docs.aws.amazon.com/general/latest/gr/aws-access-keys-best-practices.html
export AWS_ACCESS_KEY_ID=_YOUR_AWS_ACCESS_API_KEY_
export AWS_SECRET_ACCESS_KEY=_YOUR_AWS_SECRET_ACCESS_API_KEY_
export AWS_DEFAULT_REGION=us-east-1
export AWS_ACCOUNT_ID=_YOUR_AWS_ACCOUNT_ID_

# AWS network config
AWS_KEY_PAIR=david
AWS_VPC=vpc-03c47a7627e65047b
AWS_SUBNETS=subnet-0f1713cc8d09256e9,subnet-0374ec6f39de7b754
AWS_SECURITY_GROUP=sg-0da8056f522b9da5f
AWS_INSTANCE_ROLE=ecsInstanceRole


# AWS ECS configuration
AWS_ECS_PROJECT_NAME=tenki-forecast
AWS_ECS_CLUSTER_NAME=tenki-forecast-cluster
AWS_ECS_CLUSTER_CONFIG=tenki-forecast-cluster
AWS_ECS_DEFAULT_CLUSTER_LAUNCH_TYPE=EC2


# AWS instance configuration
# @see https://aws.amazon.com/marketplace/pp/B06XS8WHGJ?qid=1543330791327&sr=0-1&ref_=srh_res_product_title
# @see https://aws.amazon.com/ec2/instance-types/
AWS_ECS_INSTANCE_TYPE=t2.micro
AWS_ECS_INSTANCE_SIZE=1
AWS_ECS_INSTANCE_IMAGE_ID=ami-045f1b3f87ed83659 # Amazon ECS-Optimized Amazon Linux AMI (t2.micro free tier)


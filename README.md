# Tenki Forecast

[![Build Status](https://travis-ci.org/dvdantunes/tenki-forecast.svg?branch=master)](https://travis-ci.org/dvdantunes/tenki-forecast)
[![Commitizen friendly](https://img.shields.io/badge/commitizen-friendly-brightgreen.svg)](http://commitizen.github.io/cz-cli/)


## Overview

Yet another amazing simple weather app




## Quick Start

The app consist on 2 microservices, both of them containerized with Docker, and a reverse proxy, that manages the discovery and routing activities for both microservices. They were named as follow:

- `Tenki forecast client`: or the frontend web UI to use the app
- `Tenki forecast server`: backend that expose an API that fetchs the weather data on public APIs on [Google Maps](https://cloud.google.com/maps-platform/) and [DarkSky](https://darksky.net/dev)
- `Traefik reverse proxy`: that uses [Traefik](https://traefik.io/) to handle the discovery, routing and exposure of the previous microservices


This documentation will help you to build and deploy them to Amazon ECS, which will run a cluster with an EC2 instance specially optimized to run docker containers.



## Demo

You can see `Tenki forecast client` in action through your browser on its [demo web UI](http://ec2-54-172-9-142.compute-1.amazonaws.com/)


Also, you can reach `Tenki forecast server` running on its [demo API entrypoint](http://ec2-54-172-9-142.compute-1.amazonaws.com/api/tenki-forecast). You need to request it through `POST` method. For example:

    $ curl -v -H 'Content-Type: application/json' -d '{"latitude":-33.4446699,"longitude":-70.6493836}' -X POST http://ec2-54-172-9-142.compute-1.amazonaws.com/api/tenki-forecast


Finally, you can view `Traefik reverse proxy` routing architecture and statistics on:

- [Dashboard](http://ec2-54-172-9-142.compute-1.amazonaws.com:8080/dashboard/)
- [Requests status](http://ec2-54-172-9-142.compute-1.amazonaws.com:8080/dashboard/status/)
- [Health statistics](http://ec2-54-172-9-142.compute-1.amazonaws.com:8080/health/)



## Prerequisites

You will need a AWS account to fully deploy this project. It is recommended to use a Free Tier account.

To follow CI best practices, you can activate your repository on [travis.org](https://travis.org) and use the `travis.yml` provided file.

Also, you will need to install the following tools and technologies:

- gcc >= 5.4.0
- yarn == 1.12.3
- Node.js >= 8.12.0
- Express >= 4.16.3
- React >= 16.6.3
- Next.js == 7.0.2
- dark-sky == 1.1.4
- google-map-react >= 1.1.1
- Traefik == 1.7.4
- redis-cli >= 5.0.2
- redis-server >= 3.0.6
- aws-cli >= 1.16.59
- ecs-cli >= 1.12.0



## Local development environment

- `make dev-install` to define and install dependencies for local development environment
- `make dev-run-server` to run server app on development mode
- `make dev-run-client` to run client app on development mode



## Local production environment

- `make install` to define and install dependencies for local production environment
- `make run-server` to run server app on production mode
- `make run-client` to run client app on production mode



## Running tests

- `make test` to run mocha tests on server and client microservices



## Production building and deployment

Firs of all, you need to activate Amazon ECR, Amazon ECS services and Amazon ElastiCache.

Please adjust your AWS credentials and configuration on `bin/aws-config.sh`. You need to enter a VPC and its Subnets, Security Group and Instance Role.


### AWS Security group

For the `Security group`, you need to expose traffic to the following ports:

- 3000 (to allow `Tenki forecast client` requests)
- 4040 (to allow `Tenki forecast server` requests)
- 80 (to allow `Traefik reverse proxy` requests and routing traffic)
- 8080 (to allow `Traefik reverse proxy` dashboard requests)


### AWS Instance Role

For the `Instance Role`, you need to attach the following AWS policies:

- AmazonElastiCacheFullAccess
- AmazonEC2ContainerServiceFullAccess
- AmazonECSTaskExecutionRolePolicy
- AmazonEC2ContainerServiceforEC2Role

And create the following custom policy for `Traefik` to work:

    Name:
    traefik-policy

    Contents (JSON):
        {
            "Version": "2012-10-17",
            "Statement": [
                {
                    "Sid": "TraefikECSReadAccess",
                    "Effect": "Allow",
                    "Action": [
                        "ecs:ListClusters",
                        "ecs:DescribeClusters",
                        "ecs:ListTasks",
                        "ecs:DescribeTasks",
                        "ecs:DescribeContainerInstances",
                        "ecs:DescribeTaskDefinition",
                        "ec2:DescribeInstances"
                    ],
                    "Resource": [
                        "*"
                    ]
                }
            ]
        }


### Redis on Amazon ElastiCache

On Amazon ElastiCache, create a `Redis` cluster with the created role and then search for its `Primary Endpoint` and adjust the `REDIS_HOST` env variable on the `docker-compose.yml` file


### Setup Amazon ECS cluster

Then you need to setup the Amazon ECS Cluster. To do that, please adjust your credentials and configuration on `bin/aws-config.sh` file and then run `make setup-production`. You need to do this only once per cluster.


### Build and deploy

Finally, run `make build` to build Docker images for each microservice and send them to repositories on Amazon ECR. Then, run `make deploy` to scale up the instance on the Cluster, create a Service and run a Task Definition which runs and exposes the 3 microservices. You can find the deployment configuration and policies on `docker-compose.yml` and `ecs-params.yml` files.

To view the running microservices public IPs, you can use `make status` rule.


### List of building and deployment utilities

Below is the full list of the utilities used to build and deploy the project:

- `make setup-production` to setup a custom cluster on Amazon ECS to be able to deploy the project. You need to adjust `bin/aws-config.sh` file
- `make build` to build Docker images and push them to Amazon ECR
- `make deploy` to deploy a Service with defined Task Definitions to an EC2 instance with Docker container support, through Amazon ECS
- `make status` to check Docker images history on Amazon ECR and Task Definitions status (RUNNING, STOPPED, DRAINING, etc) on Amazon ECS
- `make scale-down` to scale-down the current running Service and its Task Definitions
- `make scale-up` to scale-up the last created Service and its Task Definitions
- `make remove-production` to scale-down the current running Services and its Task Definitions and permanently delete the Amazon ECS cluster



## Other utilities

- `make commit` better commits with [Commitizen](http://commitizen.github.io/cz-cli/), using AngularJS's commit message convention (cz-conventional-changelog)

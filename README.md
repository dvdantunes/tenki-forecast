# Tenki Forecast

[![Build Status](https://travis-ci.org/dvdantunes/tenki-forecast.svg?branch=master)](https://travis-ci.org/dvdantunes/tenki-forecast)
[![Commitizen friendly](https://img.shields.io/badge/commitizen-friendly-brightgreen.svg)](http://commitizen.github.io/cz-cli/)


## Overview

Yet another amazing simple weather app



## Demo

You can see Tenki Forecast in action through your browser on its [demo endpoint](http://ec2-54-172-9-142.compute-1.amazonaws.com/)

Also, you can view Traefik on:

http://ec2-54-172-9-142.compute-1.amazonaws.com:8080/dashboard
http://ec2-54-172-9-142.compute-1.amazonaws.com:8080/status
http://ec2-54-172-9-142.compute-1.amazonaws.com:8080/health


Tenki Forecast Server:
http://ec2-54-172-9-142.compute-1.amazonaws.com/api/tenki-forecast


Alternatively, you can request it through `curl`. For example:

    $ curl -v -H 'Content-Type: application/json' -d '{"latitude":-33.4446699,"longitude":-70.6493836}' -X POST http://ec2-54-172-9-142.compute-1.amazonaws.com/api/tenki-forecast



## Quick Start




## Prerequisites

- gcc >= 5.4.0
- yarn == 1.12.3
- Node.js >= 8.12.0
- Express >= 4.16.3
- React >= 16.6.3
- Next.js == 7.0.2
- dark-sky == 1.1.4
- google-map-react >= 1.1.1
- Traefik == 1.7.4
- aws-cli >= 1.16.59
- ecs-cli >= 1.12.0
- AWS Free Tier account (recommended)
- travis.org account (recommended)




## Local development environment

- `make dev-install` to define local development environment
- `make dev-run-server`
- `make dev-run-client`



## Local production environment

- `make install` to define local production environment
- `make run-server`
- `make run-client`



## Running tests

- `make test` to run mocha tests on server and client microservices



## Production building and deployment

- `make setup-production` to setup a custom cluster on Amazon ECS to be able to deploy the project. You need to adjust `bin/aws-config.sh` file
- `make build` to build Docker images and push them to Amazon ECR
- `make deploy` to deploy a Service with defined Task Definitions to an EC2 instance with Docker container support, through Amazon ECS
- `make status` to check Docker images history on Amazon ECR and Task Definitions status (RUNNING, STOPPED, DRAINING, etc) on Amazon ECS
- `make scale-down` to scale-down the current running Service and its Task Definitions
- `make scale-up` to scale-up the last created Service and its Task Definitions
- `make remove-production` to scale-down the current running Services and its Task Definitions and permanently delete the Amazon ECS cluster



## Other utilities

- `make commit` to commit with [Commitizen](http://commitizen.github.io/cz-cli/), using AngularJS's commit message convention (cz-conventional-changelog)

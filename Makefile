# Makefile rules for development, testing, building and deployment duties

# ENV configuration
BIN_PATH=./bin
SERVER_PATH=./server
CLIENT_PATH=./client




# Utils

# Breaks output
define breakline
	@tput setaf 2
	@echo $1
	@tput sgr0
endef


# Outputs to sdout with color
# @see https://eli.thegreenplace.net/2013/12/18/makefile-functions-and-color-output
# @see https://linux.101hacks.com/ps1-examples/prompt-color-using-tput/
RED = 1
GREEN = 2
YELLOW = 3
BLUE = 4
MAGENTA = 5
CYAN = 6
define colorecho
	@tput setaf $2
	@echo $1
	@tput sgr0
endef





# Default rule
all: dev-run


# Remove local installed dependencies and modules
clean:
	$(call colorecho, "Removing installed dependencies and modules", $(RED))
	rm -rf $(SERVER_PATH)/node_modules
	rm -rf $(CLIENT_PATH)/node_modules
	$(call breakline, "できた (Done!)")




# Local development rules

# Install the server and client apps
dev-install: dev-install-base dev-install-server dev-install-client
	$(call breakline, "できた (Done!)")


# Install base dependencies
dev-install-base:
	$(call colorecho, "Installing base dependencies for development", $(YELLOW))
	yarn
	$(call breakline, "")


# Install server dependencies
dev-install-server:
	$(call colorecho, "Installing server dependencies", $(YELLOW))
	cd $(SERVER_PATH) && yarn
	$(call breakline, "")


# Install client dependencies
dev-install-client:
	$(call colorecho, "Installing client dependencies", $(YELLOW))
	cd $(CLIENT_PATH) && yarn
	$(call breakline, "")


# Run the server microservice on local development env
dev-run-server: install dev-run-server-fast


# Run the server microservice on local development env (no-check)
dev-run-server-fast:
	$(call colorecho, "Running server on local development mode", $(GREEN))
	cd $(SERVER_PATH) && yarn start


# Run the server microservice on local development env
dev-run-client: install dev-run-client-fast


# Run the client microservice on local development env (no-check)
dev-run-client-fast:
	$(call colorecho, "Running client on development production mode", $(GREEN))
	cd $(CLIENT_PATH) && yarn dev





# Local production rules


# Install the server and client apps
install: install-base install-server install-client
	$(call breakline, "できた (Done!)")


# Install base dependencies
install-base:
	$(call colorecho, "Installing base dependencies for production", $(YELLOW))
	yarn --production
	$(call breakline, "")


# Install server dependencies
install-server:
	$(call colorecho, "Installing server dependencies", $(YELLOW))
	cd $(SERVER_PATH) && yarn --production
	$(call breakline, "")


# Install client dependencies
install-client:
	$(call colorecho, "Installing client dependencies", $(YELLOW))
	cd $(CLIENT_PATH) && yarn --production
	$(call breakline, "")


# Run the server microservice on local production env
run-server: install run-server-fast


# Run the server microservice on local production env (no-check)
run-server-fast:
	$(call colorecho, "Running server on local production mode", $(GREEN))
	cd $(SERVER_PATH) && NODE_ENV=production yarn start


# Run the server microservice on local production env
run-client: install run-client-fast


# Run the client microservice on local production env (no-check)
run-client-fast:
	$(call colorecho, "Running client on local production mode", $(GREEN))
	cd $(CLIENT_PATH) && yarn build && yarn start




# Test env rules

# Run tests
test: dev-install test-server test-client
	$(call breakline, "できた (Done!)")


# Run tests for server app
test-server:
	$(call colorecho, "Running tests for server app", $(MAGENTA))
	cd $(SERVER_PATH) && yarn test
	$(call breakline, "")


# Run tests for client app
test-client:
	$(call colorecho, "Running tests for client app", $(MAGENTA))
	cd $(CLIENT_PATH) && yarn test
	$(call breakline, "")





# Production env rules

# Setup production env
setup-production:
	$(BIN_PATH)/setup.sh


# Build project
build:
	$(BIN_PATH)/build.sh


# Deploy project
deploy:
	$(BIN_PATH)/deploy.sh


# Scale up (turn on)
scale-up:
	$(BIN_PATH)/scale-up.sh


# Scale down (turn off)
scale-down:
	$(BIN_PATH)/scale-down.sh


# Get production env status
status:
	$(BIN_PATH)/status.sh


# Remove production env
remove-production:
	$(BIN_PATH)/remove.sh





# Other rules

# Commit with Commitizen, using AngularJS's commit message
# convention (cz-conventional-changelog)
commit:
	$(call colorecho, "Making git-commit with Commitizen", $(BLUE))
	git-cz --no-verify
	# git-cz



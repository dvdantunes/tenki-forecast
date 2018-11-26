# Makefile rules for development, testing, building and deployment duties

# ENV configuration
SERVER_PATH=server/
CLIENT_PATH=client/
BIN_PATH=bin/



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
define colorecho
	@tput setaf $2
	@echo $1
	@tput sgr0
endef




# Default rule
all: run-dev


# Remove installed dependencies and modules
clean:
	$(call colorecho, "Removing installed dependencies and modules", $(RED))
	rm -rf $(SERVER_PATH)node_modules
	rm -rf $(CLIENT_PATH)node_modules
	$(call breakline, "できた (Done!)")




# Install the server and client apps
install: install-base install-server install-client
	$(call breakline, "できた (Done!)")


# Install base dependencies
install-base:
	$(call colorecho, "Installing base dependencies", $(YELLOW))
	yarn
	$(call breakline, "")


# Install server dependencies
install-server:
	$(call colorecho, "Installing server dependencies", $(YELLOW))
	cd $(SERVER_PATH) && yarn
	$(call breakline, "")


# Install client dependencies
install-client:
	$(call colorecho, "Installing client dependencies", $(YELLOW))
	cd $(CLIENT_PATH) && yarn
	$(call breakline, "")



# Run the app on development env
run-dev: install run-dev-fast


# Run the app on development env (no-check)
run-dev-fast:
	$(call colorecho, "Running server on development mode", $(GREEN))
	cd $(SERVER_PATH) && yarn start



# Run tests
test: test-server test-client
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



# Deploy entire project
deploy:
	./$(BIN_PATH)deploy.sh



# Commit with Commitizen, using AngularJS's commit message
# convention (cz-conventional-changelog)
commit:
	$(call colorecho, "Making git-commit with Commitizen", $(BLUE))
	git-cz --no-verify
	# git-cz



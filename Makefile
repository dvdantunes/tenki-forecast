# Makefile rules for development, testing, building and deployment duties


# Default rule
all: run-dev


# Remove virtualenv and installed deployment files
clean:
	rm -rf server/node_modules
	rm -rf client/node_modules



# Install the server and client apps
install: install-server install-client



# Install server dependencies
install-server:
	cd server && yarn
	cd ..


# Install client dependencies
install-client:
	cd server && yarn
	cd ..



# Run the app on development env
run-dev: install
	cd server && yarn start



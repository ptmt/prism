# TODO: get rid of gulpfile eventually
BIN = ./node_modules/.bin

build:
	echo "Building image..."
	docker build -t unknownexception/prism .

start:
	echo "Starting image..."
	docker run -ti unknownexception/prism

debug:
	docker run -ti unknownexception/prism sh

clean:
	echo "Cleaning docker containers and images..."
	docker ps -aq | xargs docker rm
	docker rmi unknownexception/prism
	docker images -a | grep "^<none>" | awk '{print $$3}' | xargs docker rmi

.PHONY: build

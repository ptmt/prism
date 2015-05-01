# TODO: get rid of gulpfile eventually
BIN = ./node_modules/.bin

build:
	echo "Building image..."
	docker build -t unknownexception/prism .

init:
	boot2docker init
	boot2docker up

start:
	echo "Starting image..."
	docker run -ti unknownexception/prism

debug:
	docker run -ti unknownexception/prism sh

deploy:
	docker tag -f unknownexception/prism tutum.co/unknownexception/prism
	docker push tutum.co/unknownexception/prism

clean:
	echo "Cleaning docker containers and images..."
	docker ps -aq | xargs docker rm
	docker rmi unknownexception/prism
	docker rmi tutum.co/unknownexception/prism
	docker images -a | grep "^<none>" | awk '{print $$3}' | xargs docker rmi

.PHONY: build

.PHONY: start debug build test watch lint

start:
	npm start

debug:
	npm run start:debug

build:
	npm run build

test:
	npm run test

watch:
	npm run test:watch

lint:
	npm run lint

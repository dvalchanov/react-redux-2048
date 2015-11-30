.PHONY: start test

start:
	npm start

debug:
	npm run start:debug

test:
	npm run test

watch:
	npm run test:watch

lint:
	npm run lint

REPORTER = spec

all: jshint test

test:
	@NODE_ENV=test ./node_modules/.bin/mocha --recursive --reporter $(REPORTER) --timeout 3000

jshint:
	jshint lib test index.js

tests: test

skel:
	mkdir example test
	touch index.js
	npm install mocha chai --save-dev

clean:
	rm var/*

.PHONY: clean test jshint skel

all: code.js

code.js: config.js global.js main.js utility.js
	cat config.js global.js main.js utility.js > code.js

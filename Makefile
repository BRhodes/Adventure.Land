all: code.js

code.js: config.js global.js main.js utility.js combat.js movement.js upgrade.js
	cat config.js global.js main.js utility.js combat.js movement.js upgrade.js > code.js

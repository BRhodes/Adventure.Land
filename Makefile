all: .makeclean code.js

code.js: config.js global.js main.js utility.js combat.js movement.js upgrade.js theta_star.js
	cat config.js global.js main.js utility.js combat.js movement.js upgrade.js theta_star.js > code.js

theta_star.js: theta_star/box.js theta_star/move.js theta_star/node_tree.js
	cat theta_star/box.js theta_star/move.js theta_star/node_tree.js > theta_star.js

.makeclean: Makefile
	make clean
	touch .makeclean

clean:
	rm theta_star.js
	rm code.js

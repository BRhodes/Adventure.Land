all: .makeclean code.js

code.js: config.js global.js main.js utility.js combat.js movement.js upgrade.js theta_star.js banking.js server_calls.js
	echo '(function() {' > code.js
	cat config.js global.js main.js utility.js combat.js movement.js upgrade.js theta_star.js banking.js server_calls.js >> code.js
	echo '}())' >> code.js

theta_star.js: theta_star/adventure-finder.js theta_star/heap.js theta_star/front.js
	cat theta_star/adventure-finder.js theta_star/heap.js theta_star/front.js > theta_star.js

.makeclean: Makefile
	make clean
	touch .makeclean

clean:
	rm theta_star.js
	rm code.js

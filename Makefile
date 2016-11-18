all: .makeclean code.js

code.js: config.js global.js main.js utility.js combat.js movement.js upgrade.js theta_star.js banking.js server_calls.js hud.js wish_list.js
	echo '(function() {' > code.js
	cat config.js global.js main.js utility.js combat.js movement.js upgrade.js theta_star.js banking.js server_calls.js hud.js wish_list.js >> code.js
	echo '}())' >> code.js

wish_list.js: wish_list/list.js wish_list/data.js
	cat wish_list/data.js wish_list/list.js > wish_list.js

wish_list/data.js: wish_list/data/warrior.js wish_list/data/roles.js
	cat wish_list/data/roles.js wish_list/data/warrior.js > wish_list/data.js

wish_list/data/warrior.js: wish_list/data/warrior/dps.js
	cat wish_list/data/warrior/dps.js > wish_list/data/warrior.js

theta_star.js: theta_star/adventure-finder.js theta_star/heap.js theta_star/front.js
	cat theta_star/adventure-finder.js theta_star/heap.js theta_star/front.js > theta_star.js

.makeclean: Makefile
	make clean
	touch .makeclean

clean:
	rm theta_star.js
	rm code.js

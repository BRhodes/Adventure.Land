class Point {
    constructor(map, x, y) {
        this.x = x;
        this.y = y;
        this.map = map;
    }
}

var ListServerCalls = [];
var LetLoad = true;
on_interval(Main, runDelay);
//var notHunting = true;



async function Main() {
  if (LetLoad) {
    LetLoad = false;
    return;
  }

  InitTime();
  debugger;
  //RelativeMove(0, 2);
    //debugger;

  if (!ranOnce) {
    ranOnce = true;
    debugger;
    var p = new Point("halloween", 200, -100);
    await go_to_point(p);


    //initialize_graph(character.map);
    //debugger;
    //Move(100, 100);
    //InitThetaStar();
    //TSMove(0,0);
    //CreateBuyList();
		//CreateSellList();
    Respawn();

		return;
  }

  //debugger;
  //await
  // Run(Bank);
  // if (Bank.state < 1) {
  //   if (character.map == "bank") {
  //     notHunting = true;
  //   }
  //   if (notHunting) {
  //     if (Awake(MoveToBoss) && !SmartMove.done) {
  //       MoveToBoss("mrpumpkin");
  //     }) {
  //       notHunting = false;
  //     }
  //   } else {
  //   //Run(Upgrade);
  //
  //     Run(UsePotion);
  //     Run(Loot);
  //     Run(Tag);
  //   }
  // }
}
  //use_hp_or_mp();
  //loot();
  //return;

	//if (PartyManagement()) return;
  //if (ItemManagement()) return;
  //if (Trade()) return;
  //if (Upgrade()) return;
  //if (ExchangeItems()) return;
  //if (Move()) return;
  //if (Kite()) return;
  //if (Fight()) return;
  //if (exchangeItems()) return;



    //use_hp_or_mp();
    //loot();
    //gear_up();

    //if(classaction()) return;

    //if(followname("Vehnato", 200, false)) return;

    //if(!attack_mode || character.moving) return;

    // var target=get_targeted_monster();
    // if(!target && !(controlled && character.name == "Vehnato"))
    // {
    //   if (!bossMode || character.name == "Vehnato") {
    //     target = GetTarget();
	  // } else {
    //     target=get_target_of(get_player("Vehnato"));
		// if (!target || (target.target != "Vehnato" && !goBeforeAggro && target.mtype != "gscorpion"))
		// 	target=undefined;
    //
    //   }
    //   if(target) change_target(target);
    //   else
    //   {
    //     set_message("No Monsters");
    //     return;
    //   }
    // }
    //
    // if(!in_attack_range(target))
    // {
    //   move(
    //       character.real_x+(target.real_x-character.real_x)/2,
    //       character.real_y+(target.real_y-character.real_y)/2
    //       );
    //   // Walk half the distance
    // }
    // else if(can_attack(target))
    // {
    //   set_message("Attacking");
    //   attack(target);
    // }

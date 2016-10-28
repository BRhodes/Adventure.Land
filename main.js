setInterval(Main, runDelay);

function Main() {

  InitTime();

  if (!ranOnce) {
    ranOnce = true;
    initialize_graph(character.map);
    go_to_point(new Point("halloween", 0, 0));
    //InitThetaStar();
    //TSMove(0,0);
    //CreateBuyList();
		//CreateSellList();
    Respawn();

    DebugException();
		return;
  }

  Run(Upgrade);
  Run(UsePotion);
  Run(Loot);
  Run(Tag);
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

}

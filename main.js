var party1="Vehnato";
var party2="Vehn";
var party3="Vehnifer";
var party4="Dinasis";
var party5="Valazi";
var partyLeader=party1;

// var party1="Bess";
// var party2="Bess1";
// var party3="Bess2";
// var party4="Bess3";
// var party5="Bess4";
// var partyLeader=party1;

var attack_mode=true;
var ranOnce=false;
var bossMode=true;
var goBeforeAggro=false;
var controlled=false;
var buyList;
var sellList;
var itemUpgrade;
var runDelay = 1000/10;

setInterval(Main, runDelay);
function Main() {

    if (!ranOnce) {
    ranOnce = true
    //set_message("butts");
	//set_message({});
    CreateBuyList();
		CreateSellList();
	//show_json(get_targeted_monster());
	//show_json(character);

		get_socket().emit("respawn");
		return true;
    }
	  //return;
	  //return;

    //return;

    if (Trade()) return;
	//return;
	if (PartyManagement()) return;


  //   if (character.ctype == "mage") {
  //     if (upgradeEquip("staff", "mainhand", 10, true, 10000000)) return;
  //   } else if (character.ctype == "priest") {
  //     if (upgradeEquip("staff", "mainhand", 10, true, 10000000)) return;
  //   } else if (character.ctype == "rogue") {
  //     if (upgradeEquip("claw", "mainhand", 10, true, 10000000)) return;
  //   } else if (character.ctype == "warrior") {
  //     if (upgradeEquip("blade", "mainhand", 10, true, 10000000)) return;
  //     if (upgradeEquip("phelmet", "helmet", 7, true, 100000, {statLevel: 0, rareLevel: 0})) return;
  //   } else if (character.ctype == "ranger") {
  //     if (upgradeEquip("bow", "mainhand", 10, true, 10000000)) return;
  //   }
  //
  //   //if (upgradeEquip("helmet", "helmet", 7, true, 100000)) return;
  //   if (upgradeEquip("shoes", "shoes", 7, true, 100000)) return;
  //   if (upgradeEquip("coat", "chest", 7, true, 100000)) return;
  //   if (upgradeEquip("gloves", "gloves", 7, true, 100000)) return;
  //   if (upgradeEquip("pants", "pants", 7, true, 100000)) return;
     if (upgradeAccessory("wbook0", 0, 50000)) return;
	 if (upgradeAccessory("wbook0", 1, 50000)) return;
	// if (upgradeAccessory("wbook0", 2, 50000)) return;
     if (upgradeAccessory("intamulet", 0, 50000)) return;
     if (upgradeAccessory("intamulet", 1, 50000)) return;
     if (upgradeAccessory("dexamulet", 0, 50000)) return;
     if (upgradeAccessory("stramulet", 0, 50000)) return;
     if (upgradeAccessory("hpamulet", 0, 50000)) return;
     if (upgradeAccessory("hpamulet", 1, 50000)) return;
     if (upgradeAccessory("hpbelt", 0, 50000)) return;
     if (upgradeAccessory("hpbelt", 1, 50000)) return;
     if (upgradeAccessory("ringsj", 0, 50000)) return;

    if (exchangeItems()) return;


    var my_upgrade=function(itemName) {

    }



    var follow=function(char, distance, followmovement) {
	if (!char) return;
    var dist_x=character.real_x - char.real_x;
    var dist_y=character.real_y - char.real_y;

    var from_char=sqrt(dist_x*dist_x + dist_y*dist_y);

    if (followmovement && char.moving) distance = 1;

    var perc=from_char/distance;

    if (perc > 1.01) {
      move(
          character.real_x-(dist_x-dist_x/perc),
          character.real_y-(dist_y-dist_y/perc)
          );
      change_target("");
      set_message("Following");
      return true;
    }
    return false;
    };

    var followname=function(charname, distance, followmovement) {
      var char=get_player(charname);
      return follow(char, distance, followmovement);
    };

    var assistname=function(charname) {
      var char=get_player(charname);
      return assist(char);
    };

    var assist=function(char){

    };

    var classaction=function(){
      if (character.ctype == "priest") {
        if (heal_party())return true;
      }
    };

    var gear_up=function(){

    };


    var aheal=function(char) {
      if (char == undefined) return false;
      if (char.hp/char.max_hp < .8) {
        change_target(char);
        if(!in_attack_range(char))
        {
          move(
              character.real_x+(target.real_x-character.real_x)/2,
              character.real_y+(target.real_y-character.real_y)/2
              );
          // Walk half the distance
        }
        else if(can_attack(char))
        {
          set_message("Healing");
          heal(char);
          return true;
        }
      }
      return false;

    }
    var healName=function(charname) {
      var char=get_player(charname);
      return aheal(char);
    }
    var heal_party=function(){
      if (healName("Vehnato")
          ||  healName("Vehnifer")
          ||  healName("Dinasis")
          ||  healName("Valazi")
          ||  healName("Vehn")) return true;
    };

    use_hp_or_mp();
    loot();
    gear_up();

    if(classaction()) return;

    if(followname("Vehnato", 200, false)) return;

    if(!attack_mode || character.moving) return;

    var target=get_targeted_monster();
    if(!target && !(controlled && character.name == "Vehnato"))
    {
      if (!bossMode || character.name == "Vehnato") {
        target = GetTarget();
	  } else {
        target=get_target_of(get_player("Vehnato"));
		if (!target || (target.target != "Vehnato" && !goBeforeAggro && target.mtype != "gscorpion"))
			target=undefined;

      }
      if(target) change_target(target);
      else
      {
        set_message("No Monsters");
        return;
      }
    }

    if(!in_attack_range(target))
    {
      move(
          character.real_x+(target.real_x-character.real_x)/2,
          character.real_y+(target.real_y-character.real_y)/2
          );
      // Walk half the distance
    }
    else if(can_attack(target))
    {
      set_message("Attacking");
      attack(target);
    }

}



function foo() {
  set_message();
}

function find_item_level(itemName, level, start) {
  var i;

  for (i = start; i < 42; i++) {
    if (character.items[i] != undefined &&
        character.items[i].name == itemName &&
        (character.items[i].level == level
           //|| (!character.items[i].level && level == 0)
         )) {
          return i;
        }
  }
  return -1;
}

function FindItem(itemName) {
  var i;

  for (i = 0; i < 42; i++) {
    if (character.items[i] != undefined &&
        character.items[i].name == itemName) {
          return i;
        }
  }
  return -1;
}

function find_item(itemName) {
  return FindItem(itemName);
}

function equipItem(invSlot) {
  var sock = get_socket();
  sock.emit("equip", {num: invSlot});
}

function upgradeAccessory(itemName, level, goldStop) {
  var invSlot1;
  var invSlot2;
  var invSlot3;

  var scroll;

  if (character.gold < goldStop) return false;

  invSlot1 = find_item_level(itemName, level, 0);
  if (invSlot1 == -1) return false;
  invSlot2 = find_item_level(itemName, level, invSlot1+1);
  if (invSlot2 == -1) return false;
  invSlot3 = find_item_level(itemName, level, invSlot2+1);
  if (invSlot3 == -1) return false;

  scroll = find_item("cscroll0");
  if (scroll == -1) {
    buy("cscroll0", 1);
    return true;
  }

  compound(invSlot1, invSlot2, invSlot3, scroll);
  return true;
}


function BuyItemIfLow(itemName) {
  var itemPos = FindItem(itemName);
  if (itemPos == -1 || character.items[itemPos].q < 5) {
    buy(itemName, 5);
    return true;
  }
  return false;
}

function DetermineClassScroll() {
  var statScrollName;
  if (character.ctype == "mage") {
    statScrollName = "intscroll";
  } else if (character.ctype == "priest") {
    statScrollName = "intscroll";
  } else if (character.ctype == "rogue") {
    statScrollName = "dexscroll";
  } else if (character.ctype == "warrior") {
    statScrollName = "strscroll";
  } else if (character.ctype == "ranger") {
    statScrollName = "dexscroll";
  }
  return statScrollName;
}

function BuyScrolls(classScrollName) {
  var rv;
  rv = BuyItemIfLow("scroll0")
    || BuyItemIfLow("scroll1")
    || BuyItemIfLow("cscroll0")
    || BuyItemIfLow("cscroll1")
    || BuyClassScroll(classScrollName);
  return rv;
}

function upgradeEquip(itemName, equipSlot, level, buyable, goldStop, args) {
  var invSlot;
  var invItem;
  var equippedItem;
  var scrollSlot;
  var statScrollName = DetermineClassScroll();
  var statScrollSlot;

  if (!args) args = {};

  // Stop on low Gold
  if (character.gold < goldStop) return false;
  if (args.goldReq && character.gold < args.goldReq) return false;

  equippedItem = character.slots[equipSlot];

  //ensure item in inv
  invSlot = find_item(itemName);
  if (invSlot == -1) {
    if (buyable && (!equippedItem || equippedItem.level < level)) {
      buy(itemName, 1);
      return true;
    }
    return false;
  } else {
    invItem = character.items[invSlot];
  }

  //ensure item is equipped
  if (equippedItem == undefined || equippedItem.name != itemName) {
    equipItem(invSlot);
    return true;
  }

  //ensure equipped item is not at level
  // if (equippedItem.level >= level) {
  //   return false;
  // }



  //ensure have stat scroll
  statScrollSlot = find_item(statScrollName);
  if (statScrollSlot == -1) {
	  buy(statScrollName, 1);
    return true;
  }

  //equip the better
  if (invItem.level > equippedItem.level) {
    //give the inv item stats
    if (!invItem.stat_type && (invItem.level >= 7 || args.statLevel && args.statLevel <= invItem.level) ) {
      upgrade(invSlot, statScrollSlot);
      return true;
    }
    equipItem(invSlot);
    return true;
  }


  if (invItem.level < 7 || (args.rareLevel && args.rareLevel > invItem.level)) {
  //ensure have scroll
    scrollSlot = find_item("scroll1");
    if (scrollSlot == -1) {
      buy("scroll1", 1);
      return true;
    }

    //upgrade the inv
    upgrade(invSlot, scrollSlot);
    return true;
  }
  else {
    scrollSlot = find_item("scroll0");
    if (scrollSlot == -1) {
      buy("scroll0", 1);
      return true;
    }

    var cat;
    cat[50] = 1
    //upgrade the inv
    upgrade(invSlot, scrollSlot);
    return true;
  }
}

function exchangeName(itemName) {
  var invSlot = find_item(itemName);
  if (invSlot != -1) {
    exchange(invSlot);
    return true;
  };
  return false;
}

function exchangeItems() {
  return (exchangeName("candy0")
        ||exchangeName("candy1")
        ||exchangeName("armorbox")
        ||exchangeName("weaponbox")
      );
}

function PartyInvite(characterName) {
	if (characterName == character.name) return false;
	var char=get_player(characterName);
	if (char && !char.party) {
		get_socket().emit("party", {event:"invite", id: char.id});
		return true;
	}
  return false;
}

function PartyManagement() {
	if (character.name == partyLeader) {
		if (PartyInvite("Vehnato")
		   ||PartyInvite("Vehnifer")
		   ||PartyInvite("Vehn")
		   ||PartyInvite("Valazi")
		   ||PartyInvite("Dinasis")) return true;
	} else {
		if (!character.party) {
			get_socket().emit("party", {event:"accept", name:partyLeader});
			return true;
		}
		if (character.party != partyLeader) {
			get_socket().emit("party", {event:"leave"});
			return true;
		}
	}

	return false;
}

function GetNearestMonster(args)
{
	//args:
	// max_att - max attack
	// min_xp - min XP
  // m_type:
	// target: Only return monsters that target this "name" or player object
	// no_target: Only pick monsters that don't have any target
	var min_d=999999,target=null;

	if(!args) args={};
	if(args && args.target && args.target.name) args.target=args.target.name;

	for(id in parent.entities)
	{
		var current=parent.entities[id];
		if(current.type!="monster" || args.min_xp && current.xp<args.min_xp || args.max_att && current.attack>args.max_att || current.dead) continue;
    if(args.mtype && current.mtype != args.mtype) continue;
		if(args.target && current.target!=args.target) continue;
		if(args.no_target && current.target && current.target!=character.name) continue;
		var c_dist=parent.distance(character,current);
		if(c_dist<min_d) min_d=c_dist,target=current;
	}
	return target;
}

function GetTarget() {
  //target=GetNearestMonster({min_xp:100,max_att:100});
  var target;
  if (!target) target=GetNearestMonster({mtype: "mrpumpkin"});
  if (!target) target=GetNearestMonster({mtype: "gscorpion"});
  if (!target && bossMode) target=GetNearestMonster({mtype: "phoenix"});
  if (!target && bossMode) target=GetNearestMonster({mtype: "dknight2"});
  if (!target) target=GetNearestMonster({mtype: "osnake"});
  if (!target) target=GetNearestMonster({mtype: "worm"});
  if (!target) target=GetNearestMonster({mtype: "goo"});
  if (!target) target=GetNearestMonster({mtype: "scorpion"});
  if (!target) target=GetNearestMonster({mtype: "mvampire"});
  if (!target) target=GetNearestMonster({mtype: "bat"});
  if (!target) target=GetNearestMonster({mtype: "fvampire"});
  if (!target) target=GetNearestMonster({mtype: "ghost"});

  //if (target && !(target.mtype == "goo" || target.mtype == "osnake" || target.mtype == "worm"))
    //target=undefined;


  return target;
}

function CreateBuyList() {
  buyList = {};
  buyList.scroll1 = true;
  if (character.ctype == "priest") {
  	buyList.wbook0 = true;
	buyList.intamulet = true;
  } else if (character.ctype == "warrior") {
	  buyList.hpamulet= true;
	  buyList.hpbelt = true;
	  buyList.phelmet = true;
	  buyList.shield = true;
  } else if (character.ctype == "ranger") {
	  buyList.dexamulet= true;
  }

}

function CreateSellList() {
	sellList = {};
  if (character.ctype != "priest") {
    sellList.wbook0 = true;
	sellList.intamulet = true;
  }
	if (character.ctype != "warrior") {
	  sellList.hpamulet = true;
	  sellList.hpbelt = true;
	  sellList.phelmet = true;
	sellList.shield = true;
  }
	if (character.ctype != "ranger") {
	  sellList.dexamulet= true;
  }
}

function BuyItem(char, slot) {
  var item = char.slots[slot];
  if (!item) return false;
  if (buyList[item.name]) {
    parent.trade_buy(slot, char.id);
    return true;
  }
  return false;
}

function BuyFrom(charName) {
  var char = get_player(charName);
  if (!char || char.name == character.name) return false;
  return (BuyItem(char, "trade4")
        ||BuyItem(char, "trade3")
        ||BuyItem(char, "trade2")
        ||BuyItem(char, "trade1")
      );
  //if (char.slots["Trade1"])
}

function Buy() {
  return (BuyFrom("Vehnato")
        ||BuyFrom("Vehnifer")
        ||BuyFrom("Vehn")
        ||BuyFrom("Valazi")
        ||BuyFrom("Dinasis"));
}

function SellItemInSlot(slot, inv, price) {
  if (!character.slots[slot]) {
    parent.trade(slot, inv, price);
    return true;
  }
  return false;
}

function SellItem(inv, price) {
  return (SellItemInSlot("trade1", inv, price)
        ||SellItemInSlot("trade2", inv, price)
        ||SellItemInSlot("trade3", inv, price)
        ||SellItemInSlot("trade4", inv, price));
}

function SellInventory() {
  var i;
	var item;
  for (i = 0; i < 42; i++) {
	item = character.items[i];
    if (item && sellList[item.name]) {
      SellItem(i, 500000);
      return true;
    }
  }
  return false;
}

function SellForMoney() {
	var scrollSlot = find_item("scroll1");
	if (scrollSlot == -1 || character.items[scrollSlot].q < 10) {
		buy("scroll1", 10);
		return true;
	}

	if (character.gold < 700000) {

    return SellItem(scrollSlot, 500000);
  }
	return false;
}

function Sell() {
    return SellInventory();
}

function Trade() {

 	return SellForMoney()
		  || Buy()
		  || Sell();
}
 // Loops every 1/4 seconds.


// NOTE: If the tab isn't focused, browsers slow down the game
// Learn Javascript: https://www.codecademy.com/learn/javascript
// Write your own CODE: https://github.com/kaansoral/adventureland

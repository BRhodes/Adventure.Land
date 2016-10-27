(function() {
//var parties =[["Vehnato", "Vehnifer", "Valazi"], ["Vehnjamin", "Vehnifer", "Valazi"]];
// var party;
// var party2="Vehn";
// var party3="Vehnifer";
// var party4="Dinasis";
// var party5="Valazi";
// var partyLeader=party1;
//
// // var party1="Bess";
// // var party2="Bess1";
// // var party3="Bess2";
// // var party4="Bess3";
// // var party5="Bess4";
// // var partyLeader=party1;
//
// var attack_mode=true;
// var ranOnce=false;
// var bossMode=true;
// var goBeforeAggro=false;
// var controlled=false;
// var buyList;
// var sellList;
// var itemUpgrade;
var runDelay = 1000/1000;

// function InitConfig() {
//   InitParty();
// }
//
// function InitParty() {
//   party = [""]
//
//
// }
// Used by main to have a body that runs once on code start up
var ranOnce = false;
var currentDate;
var currentTime;
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
// Set the current times
function InitTime() {
  // The current time, to use for time based events
  currentDate = new Date();
  currentTime = currentDate.getTime();
}

// Run the function, pause execution if needed
function Run(func) {
  if (Awake(func))
    func();
}

// Timeout an object for time miliseconds
function Sleep(obj, time) {
  if (!obj)
    obj = {};
  obj.sleep = currentTime + time;
}

// Check to see if object is timed out
function Awake(obj) {
  if (!obj || !obj.sleep || obj.sleep <= currentTime) return true;
  return false;
}

// Respawn the character if it's dead
function Respawn() {
  if (character.rip) {
    get_socket().emit("respawn");
    return true;
  }
  return false;
}

// Use potions as neccesary
function UsePotion() {
  if (currentTime<parent.next_pot) return false;

  // default health potions heal 200
  if (character.hp < 100) {
    parent.use('hp');
    Sleep(UsePotion, 500);
  } else if (character.mp < 100) {
    parent.use('mp');
    Sleep(UsePotion, 500);
  } else if (character.max_hp - character.hp > 200) {
    parent.use('hp');
    Sleep(UsePotion, 500);
  } else if (character.max_mp - character.mp > 300) {
    parent.use('mp');
    Sleep(UsePotion, 500);
  }

  return true;
}

// Always throw an error- makes break points easy to set
function DebugException() {
  var cat;
  cat[50] = "error";
}

// Loot the chests on the ground
function Loot() {
  for(id in parent.chests) {
    parent.socket.emit("open_chest",{id:id});
    Sleep(Loot, 500);
  }
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
//
function find_item(itemName) {
  var i;

  for (i = 0; i < 42; i++) {
    if (character.items[i] != undefined &&
        character.items[i].name == itemName) {
          return i;
        }
  }
  return -1;
}


function InfoGraphic() {
  parent.maincode.width=parent.bottomrightcorner.width;
  parent.maincode.style.bottom = "273px";
  parent.maincode.height=312+12;
  set_message("header<table><tr><td width=\"50%\">XPR: ###</td><td>TTL: HH:MM:DD</td></tr><tr><td>small but</td><td>this will be long</td></tr>");
}
// Attack a monster only if no targets
function Tag() {
  if (!Tag.Follow) Tag.Follow = {};
  if (!Tag.Attack) Tag.Attack = {};
  	// max_att - max attack
  	// min_xp - min XP
    // m_type:
  	// target: Only return monsters that target this "name" or player object
  	// no_target: Only pick monsters that don't have any target
  	var min_d=999999,target=null;
	var tagged = 0;
	var tagmin_d=999999,tagtarget=null;
  	//if(!args) args={};
  	//if(args && args.target && args.target.name) args.target=args.target.name;

  	for(id in parent.entities)
  	{
  		var current=parent.entities[id];
  		if(current.type!="monster" || current.dead) continue;
      if(current.mtype=="ghost") continue;
      if(current.mtype=="gscorpion") continue;
      if(current.mtype=="mrpumpkin") continue;
      //if(args.mtype && current.mtype != args.mtype) continue;
  		//if(args.target&& current.target!=args.target) continue;
  		if(current.target && character.max_hp - character.hp < 300) {
			var tagc_dist=parent.distance(character,current);
  			if(tagc_dist<tagmin_d) tagmin_d=tagc_dist,tagtarget=current;
			tagged = tagged + 1;
        continue;
      }

  		var c_dist=parent.distance(character,current);
  		if(c_dist<min_d) min_d=c_dist,target=current;
  	}
	if (tagged > 3) target=tagtarget;

    if (Awake(Tag.Follow) && !in_attack_range(target)) {
      //Follow(target, character.range);
      Sleep(Tag.Follow, 100);
    }

  	if (Awake(Tag.Attack) && can_attack(target)) {
      attack(target);
      Sleep(Tag.Attack, 700);
    };
}

// function FindTarget() {
//
// }
//
// var aheal=function(char) {
//   if (char == undefined) return false;
//   if (char.hp/char.max_hp < .8) {
//     change_target(char);
//     if(!in_attack_range(char))
//     {
//       move(
//           character.real_x+(target.real_x-character.real_x)/2,
//           character.real_y+(target.real_y-character.real_y)/2
//           );
//       // Walk half the distance
//     }
//     else if(can_attack(char))
//     {
//       set_message("Healing");
//       heal(char);
//       return true;
//     }
//   }
//   return false;
//
// }
// var healName=function(charname) {
//   var char=get_player(charname);
//   return aheal(char);
// }
// var heal_party=function(){
//   if (healName("Vehnato")
//       ||  healName("Vehnifer")
//       ||  healName("Dinasis")
//       ||  healName("Valazi")
//       ||  healName("Vehn")) return true;
// };
//
//
// function GetNearestMonster(args)
// {
// 	//args:
// 	// max_att - max attack
// 	// min_xp - min XP
//   // m_type:
// 	// target: Only return monsters that target this "name" or player object
// 	// no_target: Only pick monsters that don't have any target
// 	var min_d=999999,target=null;
//
// 	if(!args) args={};
// 	if(args && args.target && args.target.name) args.target=args.target.name;
//
// 	for(id in parent.entities)
// 	{
// 		var current=parent.entities[id];
// 		if(current.type!="monster" || args.min_xp && current.xp<args.min_xp || args.max_att && current.attack>args.max_att || current.dead) continue;
//     if(args.mtype && current.mtype != args.mtype) continue;
// 		if(args.target && current.target!=args.target) continue;
// 		if(args.no_target && current.target && current.target!=character.name) continue;
// 		var c_dist=parent.distance(character,current);
// 		if(c_dist<min_d) min_d=c_dist,target=current;
// 	}
// 	return target;
// }
//
// function GetTarget() {
//   //target=GetNearestMonster({min_xp:100,max_att:100});
//   var target;
//   if (!target) target=GetNearestMonster({mtype: "mrpumpkin"});
//   if (!target) target=GetNearestMonster({mtype: "gscorpion"});
//   if (!target && bossMode) target=GetNearestMonster({mtype: "phoenix"});
//   if (!target && bossMode) target=GetNearestMonster({mtype: "dknight2"});
//   if (!target) target=GetNearestMonster({mtype: "osnake"});
//   if (!target) target=GetNearestMonster({mtype: "worm"});
//   if (!target) target=GetNearestMonster({mtype: "goo"});
//   if (!target) target=GetNearestMonster({mtype: "scorpion"});
//   if (!target) target=GetNearestMonster({mtype: "mvampire"});
//   if (!target) target=GetNearestMonster({mtype: "bat"});
//   if (!target) target=GetNearestMonster({mtype: "fvampire"});
//   if (!target) target=GetNearestMonster({mtype: "ghost"});
//
//   //if (target && !(target.mtype == "goo" || target.mtype == "osnake" || target.mtype == "worm"))
//     //target=undefined;
//
//
//   return target;
// }
function RelativeMove(relX, relY) {
  move(character.real_x + relX, character.real_y + relY);
}

function Follow(char, distance, followMovement) {
  if (!char) return;
  var dist_x=character.real_x - char.real_x;
  var dist_y=character.real_y - char.real_y;

  var from_char=sqrt(dist_x*dist_x + dist_y*dist_y);

  if (followMovement && char.moving) distance = 1;

  var perc=from_char/distance;

  if (perc > 1.01) {
    RelativeMove(-(dist_x-dist_x/perc), -(dist_y-dist_y/perc));
    //change_target("");
    //set_message("Following");
    return true;
  }
  return false;
};

function FollowName(charName, distance, followMovement) {
  var char=get_player(charName);
  return Follow(char, distance, followMovement);
}
function Upgrade() {
  Sleep(Upgrade, 1000);
  if (upgradeAccessory("intamulet", 0, 50000)) return true;
  if (upgradeAccessory("intamulet", 1, 50000)) return true;
  if (upgradeAccessory("dexamulet", 0, 50000)) return true;
  if (upgradeAccessory("dexamulet", 1, 50000)) return true;
  if (upgradeAccessory("stramulet", 0, 50000)) return true;
  if (upgradeAccessory("stramulet", 1, 50000)) return true;
  if (upgradeAccessory("hpamulet", 0, 50000)) return true;
  if (upgradeAccessory("hpamulet", 1, 50000)) return true;
//   if (character.ctype == "mage") {
//     if (upgradeEquip("staff", "mainhand", 10, true, 10000000)) return true;
//   } else if (character.ctype == "priest") {
//     if (upgradeEquip("staff", "mainhand", 10, true, 10000000)) return true;
//   } else if (character.ctype == "rogue") {
//     if (upgradeEquip("claw", "mainhand", 10, true, 10000000)) return true;
//   } else if (character.ctype == "warrior") {
//     if (upgradeEquip("blade", "mainhand", 10, true, 10000000)) return true;
//     if (upgradeEquip("phelmet", "helmet", 7, true, 100000, {statLevel: 0, rareLevel: 0})) return true;
//   } else if (character.ctype == "ranger") {
//     if (upgradeEquip("bow", "mainhand", 10, true, 10000000)) return true;
//   }
//
//   //if (upgradeEquip("helmet", "helmet", 7, true, 100000)) return true;
//   if (upgradeEquip("shoes", "shoes", 7, true, 100000)) return true;
//   if (upgradeEquip("coat", "chest", 7, true, 100000)) return true;
//   if (upgradeEquip("gloves", "gloves", 7, true, 100000)) return true;
//   if (upgradeEquip("pants", "pants", 7, true, 100000)) return true;
//   if (upgradeAccessory("wbook0", 0, 50000)) return true;
//   if (upgradeAccessory("wbook0", 1, 50000)) return true;
// // if (upgradeAccessory("wbook0", 2, 50000)) return true;
//   if (upgradeAccessory("hpbelt", 1, 50000)) return true;
//   if (upgradeAccessory("hpbelt", 0, 50000)) return true;
//   if (upgradeAccessory("ringsj", 0, 50000)) return true;
  // return false;
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

// function BuyItemIfLow(itemName) {
//   var itemPos = FindItem(itemName);
//   if (itemPos == -1 || character.items[itemPos].q < 5) {
//     buy(itemName, 5);
//     return true;
//   }
//   return false;
// }
//
// function DetermineClassScroll() {
//   var statScrollName;
//   if (character.ctype == "mage") {
//     statScrollName = "intscroll";
//   } else if (character.ctype == "priest") {
//     statScrollName = "intscroll";
//   } else if (character.ctype == "rogue") {
//     statScrollName = "dexscroll";
//   } else if (character.ctype == "warrior") {
//     statScrollName = "strscroll";
//   } else if (character.ctype == "ranger") {
//     statScrollName = "dexscroll";
//   }
//   return statScrollName;
// }
//
// function BuyScrolls(classScrollName) {
//   var rv;
//   rv = BuyItemIfLow("scroll0")
//     || BuyItemIfLow("scroll1")
//     || BuyItemIfLow("cscroll0")
//     || BuyItemIfLow("cscroll1")
//     || BuyClassScroll(classScrollName);
//   return rv;
// }
//
// function upgradeEquip(itemName, equipSlot, level, buyable, goldStop, args) {
//   var invSlot;
//   var invItem;
//   var equippedItem;
//   var scrollSlot;
//   var statScrollName = DetermineClassScroll();
//   var statScrollSlot;
//
//   if (!args) args = {};
//
//   // Stop on low Gold
//   if (character.gold < goldStop) return false;
//   if (args.goldReq && character.gold < args.goldReq) return false;
//
//   equippedItem = character.slots[equipSlot];
//
//   //ensure item in inv
//   invSlot = find_item(itemName);
//   if (invSlot == -1) {
//     if (buyable && (!equippedItem || equippedItem.level < level)) {
//       buy(itemName, 1);
//       return true;
//     }
//     return false;
//   } else {
//     invItem = character.items[invSlot];
//   }
//
//   //ensure item is equipped
//   if (equippedItem == undefined || equippedItem.name != itemName) {
//     equipItem(invSlot);
//     return true;
//   }
//
//   //ensure equipped item is not at level
//   // if (equippedItem.level >= level) {
//   //   return false;
//   // }
//
//
//
//   //ensure have stat scroll
//   statScrollSlot = find_item(statScrollName);
//   if (statScrollSlot == -1) {
// 	  buy(statScrollName, 1);
//     return true;
//   }
//
//   //equip the better
//   if (invItem.level > equippedItem.level) {
//     //give the inv item stats
//     if (!invItem.stat_type && (invItem.level >= 7 || args.statLevel && args.statLevel <= invItem.level) ) {
//       upgrade(invSlot, statScrollSlot);
//       return true;
//     }
//     equipItem(invSlot);
//     return true;
//   }
//
//
//   if (invItem.level < 7 || (args.rareLevel && args.rareLevel > invItem.level)) {
//   //ensure have scroll
//     scrollSlot = find_item("scroll1");
//     if (scrollSlot == -1) {
//       buy("scroll1", 1);
//       return true;
//     }
//
//     //upgrade the inv
//     upgrade(invSlot, scrollSlot);
//     return true;
//   }
//   else {
//     scrollSlot = find_item("scroll0");
//     if (scrollSlot == -1) {
//       buy("scroll0", 1);
//       return true;
//     }
//
//     var cat;
//     cat[50] = 1
//     //upgrade the inv
//     upgrade(invSlot, scrollSlot);
//     return true;
//   }
// }
//
// function equipItem(invSlot) {
//   var sock = get_socket();
//   sock.emit("equip", {num: invSlot});
// }
const GRAPH_RESOLUTION = 10;

class Box {
    constructor(x1, y1, x2, y2) {
        this.x1 = x1;
        this.y1 = y1;
        this.x2 = x2;
        this.y2 = y2;
    }

    square() {
        let width = this.width();
        let height = this.height();
        let difference = Math.abs(height - width) / 2;

        if (width < height) {
            this.x1 -= difference;
            this.x2 += difference;
        } else {
            this.y1 -= difference;
            this.y2 += difference;
        }
    }

    width() {
        return this.x2 - this.x1;
    }

    height() {
        return this.y2 - this.y1;
    }

    contains(x, y) {
        return (this.x1 < x && x < this.x2 &&
                this.y1 < y && y < this.y2);
    }

    intersects(box) {
        return (this.x1 <= box.x2 &&
                box.x1 <= this.x2 &&
                this.y1 <= box.y2 &&
                box.y1 <= this.y2);
    }

    intersects_segment(ox, oy, invdx, invdy) {
        let t1 = (this.x1 - ox) * invdx;
        let t2 = (this.x2 - ox) * invdx;
        let t3 = (this.y1 - oy) * invdy;
        let t4 = (this.y2 - oy) * invdy;

        let tmin = Math.max(Math.min(t1, t2), Math.min(t3, t4));
        let tmax = Math.min(Math.max(t1, t2), Math.max(t3, t4));

        if (tmax < 0) return false;
        if (tmax > 1 || tmin > tmax) return false;

        return true;
    }
}


class NodeTree {
    constructor(region, obstacles, root, level) {
        if (!level) {
            this.level = Math.ceil(Math.log2(region.width() / GRAPH_RESOLUTION));
        } else {
            this.level = level;
        }

        if (root) {
            this.root = root;
        } else {
            this.root = this;
        }

        this.region = region;

        this.x = (region.x1 + region.x2) / 2;
        this.y = (region.y1 + region.y2) / 2;

        this.obstacles = obstacles;

        this.crossable = true;
        this.is_leaf = false;

        if (this.obstacles.length == 0) {
            this.is_leaf = true;
        }

        if (region.width() <= GRAPH_RESOLUTION) {
            this.is_leaf = true;
            this.crossable = obstacles.length == 0;
        }

        this.quads = [];
        this.neighbors = null;

        this.list_id = 0;
        this.heuristic = 0;

        if (!this.is_leaf) {
            this.subdivide();
        }
    }

    get_quad(x, y) {
        if (x < this.x && y < this.y) return this.quads[0];
        else if (x >= this.x && y < this.y) return this.quads[1];
        else if (x < this.x && y >= this.y) return this.quads[2];
        return this.quads[3];
    }

    subdivide() {
        let l = this.region.x1;
        let r = this.region.x2;
        let t = this.region.y1;
        let b = this.region.y2;

        let x = this.x;
        let y = this.y;

        let subregions = [
            new Box(l, t, x, y),
            new Box(x, t, r, y),
            new Box(l, y, x, b),
            new Box(x, y, r, b),
        ];

        let obstacles = this.obstacles;
        for (let i = 0; i < subregions.length; i++) {
            let subregion = subregions[i];
            let subregion_obstacles = [];

            for (let j = 0; j < obstacles.length; j++) {
                let obstacle = obstacles[j];
                if (subregion.intersects(obstacle)) {
                    subregion_obstacles.push(obstacle);
                }
            }

            this.quads[i] = new NodeTree(subregion, subregion_obstacles, this.root);
        }
    }

    get(x, y) {
        if (!this.region.contains(x, y)) return null;
        if (this.is_leaf) return this;
        return this.get_quad(x, y).get(x, y);
    }

    get_neighbors() {
        if (!this.is_leaf) throw new Error('Tried getting neighbors of non-leaf node');
        if (this.neighbors) return this.neighbors;

        this.neighbors = [];

        let left = this.region.x1;
        let right = this.region.x2;
        let top = this.region.y1;
        let bottom = this.region.y2;

        let min_size = this.region.width() * (2 ** -this.level);
        let num_neighbors = 2 ** this.level;

        let neighbor_set = new Set();

        // Top and bottom (and corners).
        for (let x = -(num_neighbors + 1); x <= (num_neighbors + 1); x += 2) {
            let real_x = this.x + min_size * (x / 2);

            let neighbor = this.root.get(real_x, top - min_size / 2);
            if (neighbor && neighbor.crossable) neighbor_set.add(neighbor);

            neighbor = this.root.get(real_x, bottom + min_size / 2);
            if (neighbor && neighbor.crossable) neighbor_set.add(neighbor);
        }

        // Left and right.
        for (let y = -(num_neighbors - 1); y <= (num_neighbors - 1); y += 2) {
            let real_y = this.y + min_size * (y / 2);

            let neighbor = this.root.get(left - min_size / 2, real_y);
            if (neighbor && neighbor.crossable) neighbor_set.add(neighbor);

            neighbor = this.root.get(right + min_size / 2, real_y);
            if (neighbor && neighbor.crossable) neighbor_set.add(neighbor);
        }

        this.neighbors = [...neighbor_set];

        return this.neighbors;
    }

    get_containing(a, b) {
        if (this.is_leaf) return this;

        let a_quad = this.get_quad(a.x, a.y);
        let b_quad = this.get_quad(b.x, b.y);

        if (a_quad == b_quad) return a_quad.get_containing(a, b);

        return this;
    }

    has_sight(node) {
        let ancestor = this.root.get_containing(this, node);
        let obstacles = ancestor.obstacles;

        let min_x = Math.min(node.x, this.x);
        let max_x = Math.max(node.x, this.x);
        let min_y = Math.min(node.y, this.y);
        let max_y = Math.max(node.y, this.y);

        let invdx = 1 / (node.x - this.x);
        let invdy = 1 / (node.y - this.y);

        for (let i = 0; i < obstacles.length; i++) {
            let obstacle = obstacles[i];
            if (max_x >= obstacle.x1 && min_x <= obstacle.x2 &&
                max_y >= obstacle.y1 && min_y <= obstacle.y2 &&
                obstacle.intersects_segment(this.x, this.y, invdx, invdy)) {
                return false;
            }
        }

        return true;
    }
}

class VirtualNode extends NodeTree {
    constructor(parent, x, y) {
        super(parent.region, [], parent.root, -1);

        this.x = x;
        this.y = y;

        this.neighbors = [parent];

        this.parent = parent;
        parent.get_neighbors().push(this);
    }

    destroy() {
        let parent_neighbors = this.parent.get_neighbors();
        parent_neighbors.splice(parent_neighbors.indexOf(this), 1);
    }
}

// function distance(a, b) {
//     let x_dist = b.x - a.x;
//     let y_dist = b.y - a.y;
//     return Math.sqrt(x_dist * x_dist + y_dist * y_dist);
// }

let list_id = 0;
function find_path(source, target) {
    /* eslint func-names:0, prefer-arrow-callback:0 */
    list_id += 2;
    let closed_id = list_id - 1;
    let open_id = list_id;

    let open = new Heap(function (a, b) { return a.heuristic - b.heuristic; });

    let traveled = new Map();
    let parents = new Map();

    traveled.set(source, 0);
    parents.set(source, source);

    source.heuristic = distance(source, target);
    open.push(source);
    source.list_id = open_id;

    while (open.size()) {
        let current = open.pop();

        if (current == target) {
            break;
        }

        current.list_id = closed_id;

        let neighbors = current.get_neighbors();
        for (let i = 0; i < neighbors.length; i++) {
            let neighbor = neighbors[i];

            if (neighbor.list_id == closed_id) continue;

            let old_path = traveled.get(neighbor) || Infinity;
            let replaced_path = null;

            let parent = parents.get(current);
            if (parent.has_sight(neighbor)) {
                let parent_path = traveled.get(parent) + distance(parent, neighbor);
                if (parent_path < old_path) {
                    traveled.set(neighbor, parent_path);
                    parents.set(neighbor, parent);
                    replaced_path = parent_path;
                }
            } else {
                let new_path = traveled.get(current) + distance(current, neighbor);
                if (new_path < old_path) {
                    traveled.set(neighbor, new_path);
                    parents.set(neighbor, current);
                    replaced_path = new_path;
                }
            }

            if (replaced_path !== null) {
                neighbor.heuristic = replaced_path + distance(neighbor, target);

                if (neighbor.list_id == open_id) {
                    open.updateItem(neighbor);
                } else {
                    open.push(neighbor);
                    neighbor.list_id = open_id;
                }
            }
        }
    }

    if (!parents.has(target)) return [];

    let path = [];
    let current = target;
    while (current && current != source) {
        path.unshift(current);
        current = parents.get(current);
    }

    return path;
}

function initialize_graph(map_name) {
    let map_data = parent.G.maps[map_name].data;

    let min_x = Infinity;
    let max_x = -Infinity;
    let min_y = Infinity;
    let max_y = -Infinity;


    let obstacles = [];

    for (let line of map_data.x_lines) {
        min_x = Math.min(min_x, line[0]);
        max_x = Math.max(max_x, line[0]);
        obstacles.push(new Box(
            line[0] - 3,
            Math.min(line[1], line[2]) - 3,
            line[0] + 3,
            Math.max(line[1], line[2]) + 7
        ));
    }

    for (let line of map_data.y_lines) {
        min_y = Math.min(min_y, line[0]);
        max_y = Math.max(max_y, line[0]);
        obstacles.push(new Box(
            Math.min(line[1], line[2]) - 3,
            line[0] - 3,
            Math.max(line[1], line[2]) + 3,
            line[0] + 7
        ));
    }

    let region = new Box(min_x, min_y, max_x, max_y);
    region.square();

    return new NodeTree(region, obstacles);
}
// Generated by CoffeeScript 1.8.0
let Heap = (function() {
  var Heap, defaultCmp, floor, heapify, heappop, heappush, heappushpop, heapreplace, insort, min, nlargest, nsmallest, updateItem, _siftdown, _siftup;

  floor = Math.floor, min = Math.min;


  /*
  Default comparison function to be used
   */

  defaultCmp = function(x, y) {
    if (x < y) {
      return -1;
    }
    if (x > y) {
      return 1;
    }
    return 0;
  };


  /*
  Insert item x in list a, and keep it sorted assuming a is sorted.

  If x is already in a, insert it to the right of the rightmost x.

  Optional args lo (default 0) and hi (default a.length) bound the slice
  of a to be searched.
   */

  insort = function(a, x, lo, hi, cmp) {
    var mid;
    if (lo == null) {
      lo = 0;
    }
    if (cmp == null) {
      cmp = defaultCmp;
    }
    if (lo < 0) {
      throw new Error('lo must be non-negative');
    }
    if (hi == null) {
      hi = a.length;
    }
    while (lo < hi) {
      mid = floor((lo + hi) / 2);
      if (cmp(x, a[mid]) < 0) {
        hi = mid;
      } else {
        lo = mid + 1;
      }
    }
    return ([].splice.apply(a, [lo, lo - lo].concat(x)), x);
  };


  /*
  Push item onto heap, maintaining the heap invariant.
   */

  heappush = function(array, item, cmp) {
    if (cmp == null) {
      cmp = defaultCmp;
    }
    array.push(item);
    return _siftdown(array, 0, array.length - 1, cmp);
  };


  /*
  Pop the smallest item off the heap, maintaining the heap invariant.
   */

  heappop = function(array, cmp) {
    var lastelt, returnitem;
    if (cmp == null) {
      cmp = defaultCmp;
    }
    lastelt = array.pop();
    if (array.length) {
      returnitem = array[0];
      array[0] = lastelt;
      _siftup(array, 0, cmp);
    } else {
      returnitem = lastelt;
    }
    return returnitem;
  };


  /*
  Pop and return the current smallest value, and add the new item.

  This is more efficient than heappop() followed by heappush(), and can be
  more appropriate when using a fixed size heap. Note that the value
  returned may be larger than item! That constrains reasonable use of
  this routine unless written as part of a conditional replacement:
      if item > array[0]
        item = heapreplace(array, item)
   */

  heapreplace = function(array, item, cmp) {
    var returnitem;
    if (cmp == null) {
      cmp = defaultCmp;
    }
    returnitem = array[0];
    array[0] = item;
    _siftup(array, 0, cmp);
    return returnitem;
  };


  /*
  Fast version of a heappush followed by a heappop.
   */

  heappushpop = function(array, item, cmp) {
    var _ref;
    if (cmp == null) {
      cmp = defaultCmp;
    }
    if (array.length && cmp(array[0], item) < 0) {
      _ref = [array[0], item], item = _ref[0], array[0] = _ref[1];
      _siftup(array, 0, cmp);
    }
    return item;
  };


  /*
  Transform list into a heap, in-place, in O(array.length) time.
   */

  heapify = function(array, cmp) {
    var i, _i, _j, _len, _ref, _ref1, _results, _results1;
    if (cmp == null) {
      cmp = defaultCmp;
    }
    _ref1 = (function() {
      _results1 = [];
      for (var _j = 0, _ref = floor(array.length / 2); 0 <= _ref ? _j < _ref : _j > _ref; 0 <= _ref ? _j++ : _j--){ _results1.push(_j); }
      return _results1;
    }).apply(this).reverse();
    _results = [];
    for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
      i = _ref1[_i];
      _results.push(_siftup(array, i, cmp));
    }
    return _results;
  };


  /*
  Update the position of the given item in the heap.
  This function should be called every time the item is being modified.
   */

  updateItem = function(array, item, cmp) {
    var pos;
    if (cmp == null) {
      cmp = defaultCmp;
    }
    pos = array.indexOf(item);
    if (pos === -1) {
      return;
    }
    _siftdown(array, 0, pos, cmp);
    return _siftup(array, pos, cmp);
  };


  /*
  Find the n largest elements in a dataset.
   */

  nlargest = function(array, n, cmp) {
    var elem, result, _i, _len, _ref;
    if (cmp == null) {
      cmp = defaultCmp;
    }
    result = array.slice(0, n);
    if (!result.length) {
      return result;
    }
    heapify(result, cmp);
    _ref = array.slice(n);
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      elem = _ref[_i];
      heappushpop(result, elem, cmp);
    }
    return result.sort(cmp).reverse();
  };


  /*
  Find the n smallest elements in a dataset.
   */

  nsmallest = function(array, n, cmp) {
    var elem, i, los, result, _i, _j, _len, _ref, _ref1, _results;
    if (cmp == null) {
      cmp = defaultCmp;
    }
    if (n * 10 <= array.length) {
      result = array.slice(0, n).sort(cmp);
      if (!result.length) {
        return result;
      }
      los = result[result.length - 1];
      _ref = array.slice(n);
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        elem = _ref[_i];
        if (cmp(elem, los) < 0) {
          insort(result, elem, 0, null, cmp);
          result.pop();
          los = result[result.length - 1];
        }
      }
      return result;
    }
    heapify(array, cmp);
    _results = [];
    for (i = _j = 0, _ref1 = min(n, array.length); 0 <= _ref1 ? _j < _ref1 : _j > _ref1; i = 0 <= _ref1 ? ++_j : --_j) {
      _results.push(heappop(array, cmp));
    }
    return _results;
  };

  _siftdown = function(array, startpos, pos, cmp) {
    var newitem, parent, parentpos;
    if (cmp == null) {
      cmp = defaultCmp;
    }
    newitem = array[pos];
    while (pos > startpos) {
      parentpos = (pos - 1) >> 1;
      parent = array[parentpos];
      if (cmp(newitem, parent) < 0) {
        array[pos] = parent;
        pos = parentpos;
        continue;
      }
      break;
    }
    return array[pos] = newitem;
  };

  _siftup = function(array, pos, cmp) {
    var childpos, endpos, newitem, rightpos, startpos;
    if (cmp == null) {
      cmp = defaultCmp;
    }
    endpos = array.length;
    startpos = pos;
    newitem = array[pos];
    childpos = 2 * pos + 1;
    while (childpos < endpos) {
      rightpos = childpos + 1;
      if (rightpos < endpos && !(cmp(array[childpos], array[rightpos]) < 0)) {
        childpos = rightpos;
      }
      array[pos] = array[childpos];
      pos = childpos;
      childpos = 2 * pos + 1;
    }
    array[pos] = newitem;
    return _siftdown(array, startpos, pos, cmp);
  };

  Heap = (function() {
    Heap.push = heappush;

    Heap.pop = heappop;

    Heap.replace = heapreplace;

    Heap.pushpop = heappushpop;

    Heap.heapify = heapify;

    Heap.updateItem = updateItem;

    Heap.nlargest = nlargest;

    Heap.nsmallest = nsmallest;

    function Heap(cmp) {
      this.cmp = cmp != null ? cmp : defaultCmp;
      this.nodes = [];
    }

    Heap.prototype.push = function(x) {
      return heappush(this.nodes, x, this.cmp);
    };

    Heap.prototype.pop = function() {
      return heappop(this.nodes, this.cmp);
    };

    Heap.prototype.peek = function() {
      return this.nodes[0];
    };

    Heap.prototype.contains = function(x) {
      return this.nodes.indexOf(x) !== -1;
    };

    Heap.prototype.replace = function(x) {
      return heapreplace(this.nodes, x, this.cmp);
    };

    Heap.prototype.pushpop = function(x) {
      return heappushpop(this.nodes, x, this.cmp);
    };

    Heap.prototype.heapify = function() {
      return heapify(this.nodes, this.cmp);
    };

    Heap.prototype.updateItem = function(x) {
      return updateItem(this.nodes, x, this.cmp);
    };

    Heap.prototype.clear = function() {
      return this.nodes = [];
    };

    Heap.prototype.empty = function() {
      return this.nodes.length === 0;
    };

    Heap.prototype.size = function() {
      return this.nodes.length;
    };

    Heap.prototype.clone = function() {
      var heap;
      heap = new Heap();
      heap.nodes = this.nodes.slice(0);
      return heap;
    };

    Heap.prototype.toArray = function() {
      return this.nodes.slice(0);
    };

    Heap.prototype.insert = Heap.prototype.push;

    Heap.prototype.top = Heap.prototype.peek;

    Heap.prototype.front = Heap.prototype.peek;

    Heap.prototype.has = Heap.prototype.contains;

    Heap.prototype.copy = Heap.prototype.clone;

    return Heap;

  })();

  return Heap;
})();
class Point {
    constructor(map, x, y) {
        this.x = x;
        this.y = y;
        this.map = map;
    }
}

const graph_cache = {};
function go_to_point(point) {
    if (!graph_cache[point.map]) {
        //console.time('Initialize Graph');
        graph_cache[point.map] = initialize_graph(point.map);
        //console.timeEnd('Initialize Graph');
    }

    let map = graph_cache[point.map];

    let current_node = map.get(character.real_x, character.real_y);
    let target_node = map.get(point.x, point.y);

    let current_virtual = new VirtualNode(current_node, character.real_x, character.real_y);
    let target_virtual = new VirtualNode(target_node, point.x, point.y);

//    console.time('Find path');
    let path = find_path(current_virtual, target_virtual);
    //console.timeEnd('Find path');

    let target = current_virtual;
    move(target.x, target.y);

    while (path.length) {
        //await sleep(1000 / 20);

        if (character.moving) continue;

        let pos = new Vec(character);

        // Unexpected movement (probably by the player), so cancel
        // the path movement.
        if (!pos.equals(target)) break;

        target = path.shift();
        move(target.x, target.y);
    }

    current_virtual.destroy();
    target_virtual.destroy();
}
}())

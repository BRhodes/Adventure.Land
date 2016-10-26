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
    InitThetaStar();
    TSMove(0,0);
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
        continue;
      }
  		var c_dist=parent.distance(character,current);
  		if(c_dist<min_d) min_d=c_dist,target=current;
  	}
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
function Box(x1, y1, x2, y2) {
    this.x1 = x1;
    this.y1 = y1;
    this.x2 = x2;
    this.y2 = y2;
}

Box.prototype.square = function() {
    let h_center = (this.x1 + this.x2) / 2;
    let v_center = (this.y1 + this.y2) / 2;

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

Box.prototype.width = function() {
    return this.x2 - this.x1;
}

Box.prototype.height = function() {
    return this.y2 - this.y1;
}

Box.prototype.contains = function(x, y) {
    return this.x1 < x && x < this.x2 &&
           this.y1 < y && y < this.y2;
}

Box.prototype.intersects = function(box) {
    return (this.x1 <= box.x2 &&
            box.x1 <= this.x2 &&
            this.y1 <= box.y2 &&
            box.y1 <= this.y2)
}

Box.prototype.intersects_segment = function(start, end) {
    let dx = end.x - start.x;
    let dy = end.y - start.y;

    let len = Math.sqrt(dx * dx + dy * dy);

    let ndx = 1 / dx;
    let ndy = 1 / dy;

    let t1 = (this.x1 - start.x) * ndx;
    let t2 = (this.x2 - start.x) * ndx;
    let t3 = (this.y1 - start.y) * ndy;
    let t4 = (this.y2 - start.y) * ndy;

    let tmin = Math.max(Math.min(t1, t2), Math.min(t3, t4));
    let tmax = Math.min(Math.max(t1, t2), Math.max(t3, t4));

    if (tmax < 0) return false;
    if (tmin > 1) return false;

    return true;
}
var GRAPH_RESOLUTION;
var min_x;
var max_x;
var min_y;
var max_y;
var obstacles;
var map_region;
var _map;


function InitThetaStar() {
  //other inits
  GRAPH_RESOLUTION = 10;

  min_x = Infinity;
  max_x = -Infinity;
  min_y = Infinity;
  max_y = -Infinity;

  obstacles = [];

  // mapping data Init
  for (let line of parent.M.x_lines) {
      min_x = Math.min(min_x, line[0]);
      max_x = Math.max(max_x, line[0]);
      obstacles.push(new Box(line[0] - 3, Math.min(line[1], line[2]) - 3, line[0] + 3, Math.max(line[1], line[2]) + 7));
  }

  for (let line of parent.M.y_lines) {
      min_y = Math.min(min_y, line[0]);
      max_y = Math.max(max_y, line[0]);
      obstacles.push(new Box(Math.min(line[1], line[2]) - 3, line[0] - 3, Math.max(line[1], line[2]) + 3, line[0] + 7));
  }

  map_region = new Box(min_x, min_y, max_x, max_y);
  map_region.square();

  _map = new NodeTree(map_region, obstacles);
}

// part of the "move"
function find_path(source, target) {
    let closed = new Set();
    let open = new Set();

    let traveled = new Map();
    let heuristic = new Map();
    let parents = new Map();

    open.add(source);

    traveled.set(source, 0);
    heuristic.set(source, distance(source, target));
    parents.set(source, source);

    while (open.size) {
        let current = null;
        let min_heuristic = Infinity;

        for (let node of open) {
            let node_heuristic = heuristic.get(node);

            if (node_heuristic < min_heuristic) {
                min_heuristic = node_heuristic;
                current = node;
            }
        }

        if (current == target) {
            break;
        }

        open.delete(current);
        closed.add(current);

        for (let neighbor of current.get_neighbors()) {
            if (closed.has(neighbor)) continue;

            let old_path = traveled.get(neighbor);
            if (!open.has(neighbor)) {
                old_path = Infinity;
                open.add(neighbor);
            }

            let parent = parents.get(current);
            if (parent.has_sight(neighbor)) {
                let parent_path = traveled.get(parent) + distance(parent, neighbor);
                if (parent_path < old_path) {
                    parents.set(neighbor, parent);
                    traveled.set(neighbor, parent_path);
                    heuristic.set(neighbor, parent_path + distance(neighbor, target));
                }
            } else {
                let new_path = traveled.get(current) + distance(current, neighbor);
                if (new_path < old_path) {
                    parents.set(neighbor, current);
                    traveled.set(neighbor, new_path);
                    heuristic.set(neighbor, new_path + distance(neighbor, target));
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


function TSMove(x, y) {
  var current_node = _map.get(character.real_x, character.real_y);
  var target_node = _map.get(x, y);

  var path = find_path(current_node, target_node);

  path.unshift(current_node);

  // drawings = [];
  // for (let i = 0; i < path.length - 1; i++) {
  //     let n1 = path[i];
  //     let n2 = path[i + 1];
  //     let line = draw_line(n1.x, n1.y, n2.x, n2.y, 3);
  //     drawings.push(line);
  //     //map.addChild(line);
  // }

  var cur_point = 0;
  var move_interval = setInterval(() => {
      if (character.moving) return;

      if (cur_point == path.length) {
          clearInterval(move_interval);
          drawings.forEach(e => e.destroy());
          drawings = [];
      } else {
          let node = path[cur_point++];
          move(node.x, node.y);
      }
  }, 1000 / 20);
}
function NodeTree(region, obstacles, root) {
    if (root) {
        this.root = root;
    } else {
        this.root = this;
    }

    this.region = region;

    this.x = (region.x1 + region.x2) / 2;
    this.y = (region.y1 + region.y2) / 2;

    this.obstacles = obstacles;
    this.subdivided = false;

    this.is_leaf = false;
    this.crossable = true;

    if (region.x2 <= min_x || region.x1 >= max_x ||
        region.y2 <= min_y || region.y1 >= max_y) {
        this.crossable = false;
    }

    if (region.width() <= GRAPH_RESOLUTION) {
        this.is_leaf = true;
        this.crossable = obstacles.length == 0;
    }

    this.quads = [];
    this.nodes = [];

    this.neighbors = null;
}

NodeTree.prototype.get_quad = function(x, y) {
    if (x < this.x && y < this.y) return this.quads[0];
    if (x > this.x && y < this.y) return this.quads[1];
    if (x < this.x && y > this.y) return this.quads[2];
    if (x > this.x && y > this.y) return this.quads[3];
}

NodeTree.prototype.subdivide = function() {
    this.subdivided = true;

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

    for (let i = 0; i < subregions.length; i++) {
        let subregion = subregions[i];
        let subregion_obstacles = [];

        for (let obstacle of obstacles) {
            if (subregion.intersects(obstacle)) {
                subregion_obstacles.push(obstacle);
            }
        }

        this.quads[i] = new NodeTree(subregion, subregion_obstacles, this.root);
    }
}

NodeTree.prototype.get = function(x, y) {
    if (!this.crossable || this.is_leaf) return this;

    if (!this.subdivided) {
        this.subdivide();
    }

    return this.get_quad(x, y).get(x, y);
}

NodeTree.prototype.get_neighbors = function() {
    if (!this.is_leaf) throw new Exception('Tried getting neighbors of non-leaf node');
    if (this.neighbors) return this.neighbors;

    this.neighbors = [];

    let x = this.x;
    let y = this.y;
    let width = this.region.width();
    let height = this.region.height();

    for (let i = -1; i <= 1; i++) {
        for (let j = -1; j <= 1; j++) {
            if (i == 0 && j == 0) continue;

            let neighbor = this.root.get(x + width * i, y + height * j);
            if (neighbor && neighbor.crossable) {
                this.neighbors.push(neighbor);
            }
        }
    }

    return this.neighbors;
}

NodeTree.prototype.get_containing = function(a, b) {
    let a_quad = this.get_quad(a.x, a.y);
    let b_quad = this.get_quad(b.x, b.y);

    if (a_quad == b_quad) return a_quad.get_containing(a, b);

    return this;
}

NodeTree.prototype.has_sight = function(node) {
  return false;
    let ancestor = this.root.get_containing(this, node);

    for (let obstacle of ancestor.obstacles) {
        if (obstacle.intersects_segment(this, node)) {
            return false;
        }
    }

    return true;
}

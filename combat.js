// // Attack a monster only if no targets
// function Tag() {
//   if (!Tag.Follow) Tag.Follow = {};
//   if (!Tag.Attack) Tag.Attack = {};
//   	// max_att - max attack
//   	// min_xp - min XP
//     // m_type:
//   	// target: Only return monsters that target this "name" or player object
//   	// no_target: Only pick monsters that don't have any target
//   	var min_d=999999,target=null;
// 	var tagged = 0;
// 	var tagmin_d=999999,tagtarget=null;
//   	//if(!args) args={};
//   	//if(args && args.target && args.target.name) args.target=args.target.name;
//
//   	for(id in parent.entities)
//   	{
//   		var current=parent.entities[id];
//   		if(current.type!="monster" || current.dead) continue;
//       if(current.mtype=="ghost") continue;
//       if(current.mtype=="gscorpion") continue;
//       if(current.mtype=="mrpumpkin") continue;
//       //if(args.mtype && current.mtype != args.mtype) continue;
//   		//if(args.target&& current.target!=args.target) continue;
//   		if(current.target && character.max_hp - character.hp < 300) {
// 			var tagc_dist=parent.distance(character,current);
//   			if(tagc_dist<tagmin_d) tagmin_d=tagc_dist,tagtarget=current;
// 			tagged = tagged + 1;
//         continue;
//       }
//
//   		var c_dist=parent.distance(character,current);
//   		if(c_dist<min_d) min_d=c_dist,target=current;
//   	}
// 	if (tagged > 3) target=tagtarget;
//
//     if (Awake(Tag.Follow) && !in_attack_range(target)) {
//       Follow(target, character.range);
//       Sleep(Tag.Follow, 100);
//     }
//
//   	if (Awake(Tag.Attack) && can_attack(target)) {
//       attack(target);
//       Sleep(Tag.Attack, 700);
//     };
// }

async function FarmTillBoss(bossName, grindMobName) {
  // while no boss in sight
  //   kill shift
  // tag boss
  // clean trash
  // kill boss
  //
  //while no boss in sight
  var boss = GetTarget(bossName);
  while (!boss) {
    // kill shit
    trash = GetBiggestThreat();
    if (!trash) trash = GetTarget(grindMobName);
    if (trash) Attack(trash);

    var boss = GetTarget(bossName);
    await sleep(10);
  }
  // tag boss
  change_target(boss);
  while (!boss.target) {
    Attack(boss);
    boss = RefreshID(boss.id);
    await sleep(10);
  }

  target = GetBiggestThreat();
  change_target(target);
  while (target) {
    Attack(target);

    await sleep(10);
    target = GetBiggestThreat();
    change_target(target);
  }
}

function RefreshID(toRefresh) {
  return parent.entities[toRefresh];
}

function Attack(target) {
  if (in_attack_range(target)) {
    if(can_attack(target)) {
      attack(target);
    }
  } else {
    if (!character.moving)
      Move(target.x, target.y);
  }
}

function GetBiggestThreat() {
  var target = null;
  for (id in parent.entities) {
    var current=parent.entities[id];
    if (!current || current.type != "monster" || current.dead) continue;
    if (!current.target) continue;

    player = get_player(current.target);
    //if (player) debugger;

    if (player) {
      if (!player.party) continue;
      if (player.party != character.party) continue;
    } else {
      continue; // character is out of render distance
    }

    if (!target || current.attack/current.hp > target.attack/target.hp) {
      target = current;
    }
  }

  return target;
}
  //Attack(boss);

  //clean trash

  //finish killing boss



  // Tag(boss)
  //
  // var target = null;
  // debugger;
  // while (!target || (target.mtype && target.mtype != boss)) {
  //   target = GetTarget(boss);
  //   await sleep(20);
  // }
  // change_target(target);
  // //if(current.target && (get_player(current.target).party != character.party)) {
  // while (target && (!target.target || get_player(target.target).party == character.party)) {
  //   RelativeMove(10, 0);
  //   await sleep(10);
  //   RelativeMove(-10, 0);
  //   await sleep(10);
  //   target=get_targeted_monster();
  // }

function GetTarget(type) {
  	for(id in parent.entities)
  	{
  		var current=parent.entities[id];
  		if(current.type!="monster" || current.dead) continue;
      if(current.mtype!=type) continue;
      return current;
  	}
    return null;
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


var attack_mode=true
var ranOnce=false

function foo() {
  set_message();
}

setInterval(
  function() {
    //show_json(get_player("Vehnifer"));
    //buy("scroll0", 1);
    //buy("staff", 1);
    //upgrade(0, 2);
    if (!ranOnce) {
    ranOnce = true
    }
    var my_upgrade=function(itemName) {

    }



    var follow=function(char, distance, followmovement){
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


    var heal=function(char) {
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
    var healname=function(charname) {
      var char=get_player(charname);
      return heal(char);
    }
    var heal_party=function(){
      if (healname("Vehnifer")
          || healname("Vehn")
          ||healname("Dinasis")
          || healname("Valazi")
          ||healname("Vehnato")) return true;
    };

    use_hp_or_mp();
    loot();
    gear_up();

    if(classaction()) return;

    if(followname("Vehn", 100, true)) return;

    if(!attack_mode || character.moving) return;

    var target=get_targeted_monster();
    if(!target)
    {
      target=get_nearest_monster({min_xp:100,max_att:120});
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



},1000/10); // Loops every 1/4 seconds.


// NOTE: If the tab isn't focused, browsers slow down the game
// Learn Javascript: https://www.codecademy.com/learn/javascript
// Write your own CODE: https://github.com/kaansoral/adventureland


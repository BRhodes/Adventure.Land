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





function sleep(timeout) {
    return new Promise((res) => {
        setTimeout(res, timeout);
    });
}

async function on_interval(task, interval) {
    /* eslint no-constant-condition: 0 */
    while (true) {
        await sleep(interval);
        await task();
    }
}

class VirtualBank {
  constructor() {
    this.bankRanges = [];
    this.totalItems = 0;
  }

  add(bankName, items) {
    this.bankRanges.push([bankName, this.totalItems, this.totalItems+=items]);
  }

  item(i) {
    var index = this.itemIndex(i);
    return character.user[index.name][index.slot];
  }

  itemIndex(i) {
    var index = new Object();
    for (let r in this.bankRanges) {
      if (i >= this.bankRanges[r][1] && i < this.bankRanges[r][2]) {
        index.name = this.bankRanges[r][0];
        index.slot = i - this.bankRanges[r][1];
        return index;
      }
    }
  }
  async get(invSlot, vBankSlot) {
    var bank = this.itemIndex(vBankSlot);
    await SwapBank(invSlot, bank.slot, bank.name);
  }
}


async function Bank() {
  await Transport("bank", true);
  await DepositInv();
  await sleep(1000);
  await Stack();
  await sleep(1000);
  await CraftForWishlist();
  await sleep(1000);
  //await UpgradeGear();
  await DepositInv();
  await sleep(1000);
  await Sort();
}

async function CraftForWishlist() {
  var bank = new VirtualBank();
  bank.add("items0", 42);
  bank.add("items1", 42);
  let wishlist = {};
  wishlist["blade"] = 7;
  wishlist["pants"] = 7;
  wishlist["pants1"] = 5;
  wishlist["boots1"] = 5;
  wishlist["phelmet"] = 5;

  wishlist.CheckUpgrade = function (item) {
    //var rv = false;
    if (!item) return -1;
    if (wishlist[item.name] && wishlist[item.name] > item.level) {
      return wishlist[item.name];
    }
    return -1;
  }

  var x = 30;
  for (let i = 0; i < bank.totalItems; i++) {
    var levelNeeded = wishlist.CheckUpgrade(bank.item(i))
    if (levelNeeded > 0) {
      bank.get(x, i);
      await Transport("main");
      await sleep(1000);
      await UpgradeSlot(x, levelNeeded)
      await sleep(1000);
      await Transport("bank");
    }
  }

}


function find_slot(starting_slot, filter) {
    if (typeof starting_slot == 'function') {
        filter = starting_slot;
        starting_slot = 0;
    }

    for (let i = starting_slot; i < character.items.length; i++) {
        let item = character.items[i];
        if (item && filter(item)) return i;
    }

    return -1;
}

function find_item(starting_slot, filter) {
    let slot = find_slot(starting_slot, filter);
    if (slot == -1) return [-1, null];
    return [slot, character.items[slot]];
}

function scroll_type(name, level) {
    if (level >= parent.G.items[name].grades[0]) {
      return 'scroll1';
    } else if (level >= parent.G.items[name].grades[1]) {
      return 'scroll2';
    } else {
      return 'scroll0';
    }
}

function calculate_scrolls_needed(item, max_level) {
    let scroll0_needed = 0;
    let scroll1_needed = 0;

    for (let i = item.level; i < max_level; i++) {
        if (scroll_type(item.name, i) == 'scroll1') scroll1_needed++;
        else scroll0_needed++;
    }

    return [scroll0_needed, scroll1_needed];
}

var upgrade_running = false;
function preemptive_upgrades(item_slot, scroll0_slot, scroll1_slot, max_level) {
    let item = character.items[item_slot];
    let scroll0 = character.items[scroll0_slot];
    let scroll1 = character.items[scroll1_slot];

    let [scroll0_needed, scroll1_needed] = calculate_scrolls_needed(item, max_level);
    if ((scroll0_needed > 0 && (scroll0.name != "scroll0" || scroll0.q < scroll0_needed)) ||
        (scroll1_needed > 0 && (scroll1.name != "scroll1" || scroll1.q < scroll1_needed))) {
        parent.add_log('Preemptive upgrade called without prerequisites!');
        return;
    }

    if (upgrade_running) return;
    upgrade_running = true;


    let starting_level = item.level;
    let current_level = item.level;

    let success_listener = data => {
        if (data && data.message == 'Item upgrade succeeded') {
            current_level++;

            if (current_level == max_level) {
                clear_listeners();
                console.log(`%cUpgraded to +${max_level} successfully!`, 'color: green');
            }
        }
    };

    let failure_listener = data => {
        if (data == 'Item upgrade failed') {
            clear_listeners();
            console.log(`%cItem upgrade failed going from +${current_level} to +${current_level + 1}`, 'color: red');
        }
    };

    let parent = window.parent;
    let clear_listeners = () => {
        clear_listeners = () => {};
        parent.socket.removeListener('game_log', success_listener);
        parent.socket.removeListener('game_error', failure_listener);
        upgrade_running = false;
    };

    // Safe cleanup in case something goes wrong
    setTimeout(clear_listeners, 500);

    parent.socket.on('game_log', success_listener);
    parent.socket.on('game_error', failure_listener);

    for(let i = starting_level; i < max_level; i++) {
        let scroll_slot = scroll0_slot;
        if (scroll_type(item.name, i) == 'scroll1') {
            scroll_slot = scroll1_slot;
        }

        parent.socket.emit('upgrade', {
            item_num: item_slot,
            scroll_num: scroll_slot,
            offering_num: null,
            clevel: i
        });
    }
}

function upgrade_or_buy(item_slot, max_level) {
    let item = character.items[item_slot];
    if (item_slot == -1) {
        return parent.buy(item_name);
    }


    let [scroll0_slot, scroll0] = find_item(i => i.name == 'scroll0');
    let [scroll1_slot, scroll1] = find_item(i => i.name == 'scroll1');

    let scroll0_num = scroll0_slot != -1 ? scroll0.q : 0;
    let scroll1_num = scroll1_slot != -1 ? scroll1.q : 0;

    let [scroll0_needed, scroll1_needed] = calculate_scrolls_needed(item, max_level);
    if (scroll0_num < 25) {
        parent.buy('scroll0', 100);
    }

    if (scroll1_num < 25) {
        parent.buy('scroll1', 100);
    }

    if (scroll0_num >= scroll0_needed && scroll1_num >= scroll1_needed) {
        preemptive_upgrades(item_slot, scroll0_slot, scroll1_slot, max_level);
    }
}

async function UpgradeSlot(invSlot, level) {

  //var foo = character.items[invSlot];
  //debugger;
  upgrade_or_buy(invSlot, level);
  await sleep(1000);




}

async function Stack() {
  var bank = new VirtualBank();
  bank.add("items0", 42);
  bank.add("items1", 42);
  let inv = 0;
  for (let i = 0; i < bank.totalItems; i++) {
    if (bank.item(i) && bank.item(i).q) {
      bank.get(inv, i);
      inv++;
    }
  }

  await sleep(1000);
  for (let i = 0; i < 41; i++) {
    if (character.items[i] && character.items[i+1] &&
        character.items[i].name == character.items[i+1].name) {
          ForceServerCall(() => Emit("imove", {a: i+1, b: i}));
        }
  }
  await sleep(1000);

}




async function Sort() {
  let bank = [];
  for (let i = 0; i < 42; i++) {
    //bank.push(character.user["items0"][i]);//, "items0", i]);
    bank.push([character.user["items0"][i], "items0", i]);
  }
  for (let i = 0; i < 42; i++) {
    //bank.push(character.user["items1"][i]);//, "items1", i]);
    bank.push([character.user["items1"][i], "items1", i]);
  }

  var swapped = true;


  while (swapped) {
    swapped = false;
    for (let i = 1; i < 84; i++) {
      if (ItemCompare(bank[i-1][0], bank[i][0])) {
        let tmp = bank[i-1];
        bank[i-1] = bank[i];
        bank[i] = tmp;
        swapped = true;
      }
    }
  }

  for (let i = 0; i < 84; i++) {
    var x = i;

    if (bank[x]) {

      if (x < 42) {
        toBank = "items0"
        slot = x;
      } else {
        toBank = "items1"
        slot = x - 42;
      }
      if (toBank != bank[x][1] || slot != bank[x][2]) {
        await SwapBank(15, bank[x][2], bank[x][1]); // item is at 15 in inv
        await SwapBank(15, slot, toBank)
        await SwapBank(15, bank[x][2], bank[x][1]);
        for (let f = 0; f < 84; f++) {
          if (bank[f][1] == toBank && bank[f][2] == slot) {
            bank[f][1] = bank[x][1];
            bank[f][2] = bank[x][2];
          }
        }
      }

      // let y = bank[x][1];
      // if (bank[x][2] == "items1") y += 42;
      // let tmp = bank[x];
      // bank[x] = bank[y];
      // bank[y] = tmp;
    }
  }
}

function ItemCompare(a, b) {
  if (!a && !b) return false;
  if (!a) return true;
  if (!b) return false;
  if (a.name > b.name) return true;
  if (a.name == b.name && (a.level || b.level) && a.level < b.level) return true;
  else return false;
}


async function DepositInv() {
  var invSlot;
  var bankName;
  var bankSlot;
  var finished = false;

  invSlot = 0;
  bankName = "items0";
  bankSlot = 0;

  while (!finished) {
    while (!character.items[invSlot] && invSlot < 42) invSlot++;
    while (character.user[bankName][bankSlot] && bankSlot < 42) bankSlot++;
    if (invSlot < 42 && bankSlot < 42) {
      await SwapBank(invSlot, bankSlot, bankName);
      invSlot++;
      bankSlot++;
    } else {
      finished = true;
    }
  }
  finished = false;
  bankName = "items1";
  bankSlot = 0;
  while (!finished) {
    while (!character.items[invSlot] && invSlot < 42) invSlot++;
    while (character.user[bankName][bankSlot] && bankSlot < 42) bankSlot++;
    if (invSlot < 42 && bankSlot < 42) {
      await SwapBank(invSlot, bankSlot, bankName);
      invSlot++;
      bankSlot++;
    } else {
      finished = true;
    }
  }

  // for (var inv in character.items) {
  //   if (character.items[inv]) {
  //     if (!DepositItem(inv)) break; //sleep(50);
  //     //else break;
  //   }
  // }
}

function DepositItem(inv) {
  return (DepositItemInto("items0", inv)
       || DepositItemInto("items1", inv));
}


// function DepositInv() {
//   var invItem;
//   for (var inv in character.items) {
//     if (character.items[inv]) {
//       if (DepositItem(inv)) {
//         return;
//       } else {
//         Bank.state = -1;
//         return;
//       }
//     }
//   }
//   Bank.state = 3;
// }



function DepositItemInto(bankName, inv) {
  //Sleep(Bank, 1000);

  var bankSlot = null;
  for (let i in character.user[bankName]) {
    if (!character.user[bankName][i]) {
      bankSlot = i;
      break;
    }
  }

  if (bankSlot) {
    SwapBank(inv, bankSlot, bankName);
    return true;
  } else {
    return false;
  }
  //           ["bank",{"operation":"swap","inv":31,"str":38,"pack":"items0"}]
}

async function SwapBank(inv, bankSlot, bankName) {
  //debugger;
  await ForceServerCall(() => Emit("bank", {operation: "swap", inv:inv, str: bankSlot, pack: bankName}));
  //get_socket().emit();
}


function InvCount() {
  var count = 0;
  for (let id in character.items) {
    if (character.items[id]) {
      count++;
    }
  }

  return count;
}

function CraftingItem(item) {
  if (!item) return false;
  return (item.name == "candy0"
       || item.name == "candy1"
       || item.name == "scroll0"
       || item.name == "scroll1"
       || item.name == "cscroll0"
       || item.name == "cscroll1"
     );
}

function WithdrawCrafting() {
  var openInv = 0;
  for (let i = 0; i < 42; i++) {
    if (!character.items[i]) {
      openInv = i;
      break;
    }
  }

  bankName = "items0"
  bank = character.user[bankName]
  for (let i in bank) {
    if (CraftingItem(bank[i])) {
      SwapBank(openInv, i, bankName);
      Sleep(Bank, 1000);
      openInv++;
      return;
    }
  }
  bankName = "items1"
    bank = character.user[bankName]
    for (let i in bank) {
      if (CraftingItem(bank[i])) {
        SwapBank(openInv, i, bankName);
        Sleep(Bank, 1000);
        openInv++;
        return;
      }
    }
}

function StackInv() {
  debugger;
}

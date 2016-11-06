async function Bank() {
  await Transport("bank", true);
  await DepositInv();
  //await Sort();
}



// async function Sort() {
//   let bank = [];
//   for (let i = 0; i < 42; i++) {
//     bank.push([character.user["items0"][i], "items0", i]);
//   }
//   for (let i = 0; i < 42; i++) {
//     bank.push([character.user["items1"][i], "items1", i]);
//   }
//
//   while (swapped) {
//     for (let i = 0; i < 84; i++) {
//
//     }
//   }
//
// }


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
  debugger;
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

function Bank() {
  set_message(Bank.state);
  if (!Bank.state && InvCount() > 5) {
    Bank.state = 1;
    return;
  }

  switch (Bank.state) {
    case 1:
      if (Transport("bank")) Bank.state = 2;
      break;
    case 2:
      DepositInv();
      break;
    case 3:
      Bank.state = 0;
      //WithdrawCrafting();
      break;

    default:

  }
  // set
}

function DepositInv() {
  var invItem;
  for (var inv in character.items) {
    if (character.items[inv]) {
      if (DepositItem(inv)) {
        return;
      } else {
        Bank.state = -1;
        return;
      }
    }
  }
  Bank.state = 3;
}

function DepositItem(inv) {
  return (DepositItemInto("items0", inv)
       || DepositItemInto("items1", inv));
}

function DepositItemInto(bankName, inv) {
  Sleep(Bank, 1000);

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

function SwapBank(inv, bankSlot, bankName) {
  get_socket().emit("bank", {operation: "swap", inv:inv, str: bankSlot, pack: bankName});
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

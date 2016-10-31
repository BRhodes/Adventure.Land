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

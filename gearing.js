// function GearUpgrade() {
//   if (character.map != "bank") {
//     if (CheckForUpgrades()) {
//       // go to bank
//     }
//   } else {
//     UpgradeItems();
//   }
//
//
// }
//
// function UpgradeItems() {
//   for (let a in character.user["item0"]) {
//     var bank = character.user["item0"][a];
//     if (inv) {
//       for (let b in character.slots) {
//         var equip = character.slots[b];
//         if (a.name == b.name && a.level > b.level) {
//           ["bank",{"operation":"swap","inv":31,"str":38,"pack":"items0"}]
//         }
//       }
//     }
//   }
//
// }
//
// function CheckForUpgrades() {
//   return (CheckUpgradeStorage("items0")
//        || CheckUpgradeStorage("items1"));
//
// function CheckUpgradeStorage(storage) {
//   items = GetStored(storage);
//
//   for (id in items) {
//     if (id) {
//       if (IsUpgrades(items[i])) {
//         return i;
//       }
//     }
//   }
//   return -1;
// }
//
// function IsUpgrade(newItem) {
//   var currentItem;
//
//
// }

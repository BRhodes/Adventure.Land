// class WishList {
//   constructor(roles) {
//
//   }
// }
//
// class List {
//   constructor
// }
class WishList {
  constructor() {
    this.list = {};
  }


  AddItem(itemName, level) {
    if (!this.list[itemName] // item not in list yet
      || this.list[itemName] > level) { // item lower level that item in list
      this.list[itemName] = level;
    }
  }

  AddAllItems(list, slot) {
    for (let item in list) {
      if (character.slots[slot] && character.slots[slot].name == list[item][0] && character.slots[slot].level == list[item][1])
        break;
      this.AddItem(list[item][0], list[item][1]);
    }
  }

  AddAllSlots(slots) {
    for (let slot in slots) {
      this.AddAllItems(slots[slot], slot);
    }
  }

  AddRoleList(roleClass, roleType) {
    this.AddAllSlots(roles[roleClass][roleType]);
  }
}

debugger;
var wishlist = new WishList();
wishlist.AddRoleList("warrior", "dps");
debugger;





// function GetWishlist() {
//   var list = roles["warrior"]["dps"];
//   var wishlist = Object();
//   for (let slot in list) {
//     if (!character.slots[slot]) {
//       for (let item in list[slot]) {
//         wishlist.AddAll(list[])
//       }
//     }
//   }
//
// }

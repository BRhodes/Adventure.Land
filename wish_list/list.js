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

  AddRoleList(roleClass, roleType) {
    AddAll(roles[roleClass][roleType]);
  }

  AddItem(itemName, level) {
    if (!this.list[itemName] // item not in list yet
      || this.list[itemName] > level) { // item lower level that item in list
      this.list[itemName] = level;
    }
  }

  AddAll(list) {
    for (let item in list) {
      AddItem(list[item][0], list[item][1]);
    }
  }
}

var wishlist = new WishList("warrior", "dps");
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

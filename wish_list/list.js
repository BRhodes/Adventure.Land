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
    this.roles = [];
  }

  SetItem(itemName, level, slot) {
    if (!this.list[itemName] // item not in list yet
      || this.list[itemName][0] > level) { // item lower level that item in list
      this.list[itemName] = [level, slot];
    }
  }

  SetAllItems(list, slot) {
    for (let item in list) {
      if (character.slots[slot] && character.slots[slot].name == list[item][0] && character.slots[slot].level == list[item][1])
        break;
      this.SetItem(list[item][0], list[item][1], slot);
    }
  }

  SetAllSlots(slots) {
    for (let slot in slots) {
      this.SetAllItems(slots[slot], slot);
    }
  }

  SetRoleList(className, roleType) {
    this.SetAllSlots(roles[className][roleType]);
  }

  AddRoleList(className, roleType) {
    this.roles.push([className, roleType]);
    this.SetRoleList(className, roleType);
  }

  RefreshList() {
    this.list = {};
    for (let r in this.roles) {
      let role = this.roles[r];
      this.SetRoleList(role[0], role[1]);
    }
  }

  IsUpgrade(item) {
    var equipped;
    var upgrade;
    var slot;

    if (!item) {
      return [false, equipped, slot];
    }

    if (this.list[item.name] && this.list[item.name][0] <= item.level) {
      return [true, equipped, this.list[item.name][1]];
    } else {
      return [false, equipped, slot];
    }


  }
}

var wishlist = new WishList();

async function test() {
  wishlist.AddRoleList("warrior", "dps");
  for (let i in character.items)
  {
    if (!character.items[i]) continue;
    if (wishlist.IsUpgrade(character.items[i])[0]) {
      var a = character.items[i];
      var b = wishlist.IsUpgrade(character.items[i]);
      console.log("Yes: " + a.name + " - " + a.level)
      debugger;
      Emit("unequip", {slot: b[1]});
      upgrade(i, 3);
      Emit("equip", {num: i});
      await sleep(1000);
      wishlist.RefreshList();
      //wishlist.AddRoleList("warrior", "dps");
    } else {
      var a = character.items[i];
      console.log("No: " + a.name + " - " + a.level)
    }
  }
  debugger;
}
test();





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

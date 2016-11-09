class GearSafe() {
  constructor() {

  }


}



//inventory manager reserves inventory slots

//crafting item manager manages crafting materials


class Gear {
  constructor() {
    roles = [];
    current_role = -1;
  }

  AddRole(role) {
    roles.push(role);
    if (roles.length == 1) {
      current_role = 0;
    }
    OrganizeInv(role);
    Switch(role);
  }

  OrganizeInv(role) {
    for (let slot in role) {
      for (let i = 0; i < 42; i++) {
        if (IsUpgrade(character.items[i])) {

        }
      }
    }
  }
}
//gear swap managers gear from extra roles
// - on load equip first set
// - on gear add, move items into reserved region
// - on swap, move gear from invo to equipped

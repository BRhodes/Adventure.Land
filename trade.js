function CreateBuyList() {
  buyList = {};
  buyList.scroll1 = true;
  if (character.ctype == "priest") {
  	buyList.wbook0 = true;
	buyList.intamulet = true;
  } else if (character.ctype == "warrior") {
	  buyList.hpamulet= true;
	  buyList.hpbelt = true;
	  buyList.phelmet = true;
	  buyList.shield = true;
  } else if (character.ctype == "ranger") {
	  buyList.dexamulet= true;
  }

}

function CreateSellList() {
	sellList = {};
  if (character.ctype != "priest") {
    sellList.wbook0 = true;
	sellList.intamulet = true;
  }
	if (character.ctype != "warrior") {
	  sellList.hpamulet = true;
	  sellList.hpbelt = true;
	  sellList.phelmet = true;
	sellList.shield = true;
  }
	if (character.ctype != "ranger") {
	  sellList.dexamulet= true;
  }
}

function BuyItem(char, slot) {
  var item = char.slots[slot];
  if (!item) return false;
  if (buyList[item.name]) {
    parent.trade_buy(slot, char.id);
    return true;
  }
  return false;
}

function BuyFrom(charName) {
  var char = get_player(charName);
  if (!char || char.name == character.name) return false;
  return (BuyItem(char, "trade4")
        ||BuyItem(char, "trade3")
        ||BuyItem(char, "trade2")
        ||BuyItem(char, "trade1")
      );
  //if (char.slots["Trade1"])
}

function Buy() {
  return (BuyFrom("Vehnato")
        ||BuyFrom("Vehnifer")
        ||BuyFrom("Vehn")
        ||BuyFrom("Valazi")
        ||BuyFrom("Dinasis"));
}

function SellItemInSlot(slot, inv, price) {
  if (!character.slots[slot]) {
    parent.trade(slot, inv, price);
    return true;
  }
  return false;
}

function SellItem(inv, price) {
  return (SellItemInSlot("trade1", inv, price)
        ||SellItemInSlot("trade2", inv, price)
        ||SellItemInSlot("trade3", inv, price)
        ||SellItemInSlot("trade4", inv, price));
}

function SellInventory() {
  var i;
	var item;
  for (i = 0; i < 42; i++) {
	item = character.items[i];
    if (item && sellList[item.name]) {
      SellItem(i, 500000);
      return true;
    }
  }
  return false;
}

function SellForMoney() {
	var scrollSlot = find_item("scroll1");
	if (scrollSlot == -1 || character.items[scrollSlot].q < 10) {
		buy("scroll1", 10);
		return true;
	}

	if (character.gold < 700000) {

    return SellItem(scrollSlot, 500000);
  }
	return false;
}

function Sell() {
    return SellInventory();
}

function Trade() {

 	return SellForMoney()
		  || Buy()
		  || Sell();
}

function exchangeName(itemName) {
  var invSlot = find_item(itemName);
  if (invSlot != -1) {
    exchange(invSlot);
    return true;
  };
  return false;
}

function exchangeItems() {
  return (exchangeName("candy0")
        ||exchangeName("candy1")
        ||exchangeName("armorbox")
        ||exchangeName("weaponbox")
      );
}

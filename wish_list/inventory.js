class ItemTag {
  constructor() {
    this.tags = null;
    this.item = null;
  }

  SetTag(tag, item) {
    if (!this.tags) this.tags = [];
    this.tags.push(tag);
    this.item = item;
  }

  HasTag(tag) {
    for (let i in this.tags) {
      if (this.tags[i] = tag) {
        return true;
      }
    }
    return false;
  }

  HasChangedFrom(item) {
    return (this.item == item);
  }
}

class Inventory {
  constructor() {
    this.invTags = {};
    this.equipTags = [];
    this.Refresh();
  }

  Refresh() {
    for (let i = 0; i < character.items.length; i++) {
      this.invTags.push(new ItemTag());
    }
  }

}

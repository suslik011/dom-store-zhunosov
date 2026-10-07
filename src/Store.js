export class Store {
  #items = [];

  constructor(initialItems = []) {
    if (Array.isArray(initialItems)) {
      initialItems.forEach(item => this.add(item));
    }
  }

  get count() {
    return this.#items.length;
  }

  add(item) {
    if (item && typeof item.name === 'string' && typeof item.price === 'number' && typeof item.qty === 'number') {
      const newItem = {
        id: Date.now().toString() + Math.random().toString(36).substring(2, 5),
        name: item.name.trim(),
        price: Number(item.price),
        qty: Number(item.qty)
      };
      this.#items.push(newItem);
      return newItem;
    }
    return null;
  }

  remove(id) {
    this.#items = this.#items.filter(item => item.id !== id);
  }

  updateQty(id, newQty) {
    const item = this.#items.find(i => i.id === id);
    if (item && newQty > 0) {
      item.qty = Number(newQty);
    }
  }

  total() {
    return this.#items.reduce((sum, item) => sum + item.price * item.qty, 0);
  }

  getItems() {
    return this.#items.map(item => ({ ...item }));
  }
}
import Alpine from 'alpinejs';

window.Alpine = Alpine;

Alpine.store('cart', {
  items: [],
  isOpen: false,
  isLoading: false,
  total: 0,
  itemCount: 0,
  freeShippingThreshold: window.themeSettings?.freeShippingThreshold || 15000,

  get freeShippingProgress() {
    return Math.min((this.total / (this.freeShippingThreshold / 100)) * 100, 100);
  },
  get freeShippingRemaining() {
    const remaining = (this.freeShippingThreshold - this.total * 100) / 100;
    return Math.max(remaining, 0);
  },
  get hasFreeShipping() {
    return this.total * 100 >= this.freeShippingThreshold;
  },

  async init() {
    try {
      const res = await fetch('/cart.js');
      const cart = await res.json();
      this.syncCart(cart);
    } catch (e) {
      console.error('Failed to fetch cart:', e);
    }
  },

  async addItem(variantId, quantity = 1) {
    this.isLoading = true;
    try {
      const addRes = await fetch('/cart/add.js', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ items: [{ id: variantId, quantity }] }),
      });
      if (!addRes.ok) {
        const err = await addRes.json();
        console.error('Failed to add item:', err.description);
        return;
      }
      const cart = await fetch('/cart.js').then(r => r.json());
      this.syncCart(cart);
      this.open();
    } catch (e) {
      console.error('Failed to add item:', e);
    } finally {
      this.isLoading = false;
    }
  },

  async updateItem(key, quantity) {
    this.isLoading = true;
    try {
      const changeRes = await fetch('/cart/change.js', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: key, quantity }),
      });
      if (!changeRes.ok) {
        const err = await changeRes.json();
        console.error('Failed to update item:', err.description);
        return;
      }
      const cart = await fetch('/cart.js').then(r => r.json());
      this.syncCart(cart);
    } catch (e) {
      console.error('Failed to update item:', e);
    } finally {
      this.isLoading = false;
    }
  },

  async removeItem(key) {
    await this.updateItem(key, 0);
  },

  syncCart(cart) {
    this.items = cart.items;
    this.total = cart.total_price / 100;
    this.itemCount = cart.item_count;
    document.dispatchEvent(new CustomEvent('cart:updated', { detail: cart }));
  },

  open() {
    this.isOpen = true;
    document.body.style.overflow = 'hidden';
  },
  close() {
    this.isOpen = false;
    document.body.style.overflow = '';
  },
});

Alpine.start();

import Alpine from 'alpinejs';
import Collapse from '@alpinejs/collapse';

window.Alpine = Alpine;
Alpine.plugin(Collapse);

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

Alpine.data('predictiveSearch', () => ({
  MIN_CHARS: 2,
  DEBOUNCE_MS: 300,
  RESULT_LIMIT: 10,

  query: '',
  results: [],
  total: 0,
  loading: false,
  error: false,

  _debounceTimer: null,
  _abortController: null,

  onInput(value) {
    this.query = value;
    this.scheduleSearch();
  },

  scheduleSearch() {
    if (this._debounceTimer) clearTimeout(this._debounceTimer);
    if (this.query.length < this.MIN_CHARS) {
      this.results = [];
      this.total = 0;
      this.loading = false;
      this.error = false;
      return;
    }
    this.loading = true;
    this.error = false;
    this._debounceTimer = setTimeout(() => this.runSearch(), this.DEBOUNCE_MS);
  },

  async runSearch() {
    if (this._abortController) this._abortController.abort();
    this._abortController = new AbortController();

    const params = new URLSearchParams({
      q: this.query,
      'resources[type]': 'product',
      'resources[limit]': String(this.RESULT_LIMIT),
      'resources[options][unavailable_products]': 'last',
    });

    try {
      const res = await fetch(`/search/suggest.json?${params.toString()}`, {
        signal: this._abortController.signal,
        headers: { 'Accept': 'application/json' },
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      const products = (data?.resources?.results?.products || []).map((p) => ({
        id: p.id,
        title: p.title,
        url: p.url,
        image: p.featured_image?.url || p.image || '',
        priceFormatted: p.price,
      }));
      this.results = products;
      this.total = products.length;
      this.loading = false;
      this.error = false;
    } catch (e) {
      if (e.name === 'AbortError') return;
      console.error('Predictive search failed:', e);
      this.results = [];
      this.total = 0;
      this.loading = false;
      this.error = true;
    }
  },

  clear() {
    if (this._debounceTimer) clearTimeout(this._debounceTimer);
    if (this._abortController) this._abortController.abort();
    this.query = '';
    this.results = [];
    this.total = 0;
    this.loading = false;
    this.error = false;
  },
}));

Alpine.start();

import Alpine from 'alpinejs';

document.addEventListener('alpine:init', () => {
  Alpine.store('productForm', {
    productData: null,
    currentVariant: null,
    selectedOptions: {},
    quantity: 1,

    init() {
      const dataEl = document.querySelector('[data-product-json]');
      if (!dataEl) return;

      this.productData = JSON.parse(dataEl.textContent);
      if (this.productData.variants.length > 0) {
        this.currentVariant = this.productData.variants[0];
        this.productData.options.forEach((optionName, index) => {
          this.selectedOptions[optionName] = this.currentVariant.options[index];
        });
      }
    },

    selectOption(name, value) {
      this.selectedOptions[name] = value;
      this.updateVariant();
    },

    updateVariant() {
      const variant = this.productData.variants.find(v => {
        return this.productData.options.every((optionName, index) => {
          return v.options[index] === this.selectedOptions[optionName];
        });
      });

      if (variant) {
        this.currentVariant = variant;
        this.updateUrl(variant);
        document.dispatchEvent(new CustomEvent('variant:changed', { detail: variant }));
      }
    },

    updateUrl(variant) {
      const url = new URL(window.location.href);
      url.searchParams.set('variant', variant.id);
      window.history.replaceState({}, '', url.toString());
    },

    get price() {
      if (!this.currentVariant) return '';
      return this.formatMoney(this.currentVariant.price);
    },

    get compareAtPrice() {
      if (!this.currentVariant || !this.currentVariant.compare_at_price) return '';
      if (this.currentVariant.compare_at_price <= this.currentVariant.price) return '';
      return this.formatMoney(this.currentVariant.compare_at_price);
    },

    get isAvailable() {
      return this.currentVariant?.available ?? false;
    },

    get buttonText() {
      if (!this.currentVariant) return '';
      return this.currentVariant.available
        ? (window.themeStrings?.addToCart || 'In den Warenkorb')
        : (window.themeStrings?.soldOut || 'Ausverkauft');
    },

    formatMoney(cents) {
      const format = window.themeSettings?.moneyFormat || '€{{amount}}';
      const amount = (cents / 100).toFixed(2).replace('.', ',');
      return format.replace('{{amount}}', amount).replace('{{amount_with_comma_separator}}', amount);
    },

    async addToCart() {
      if (!this.currentVariant || !this.currentVariant.available) return;
      await Alpine.store('cart').addItem(this.currentVariant.id, this.quantity);
    },
  });
});

// Listen for option changes dispatched by variant swatches
document.addEventListener('option:change', (e) => {
  const store = Alpine.store('productForm');
  if (store) {
    store.selectOption(e.detail.name, e.detail.value);
  }
});

import Splide from '@splidejs/splide';

document.addEventListener('DOMContentLoaded', () => {
  const mainEl = document.querySelector('.product-gallery-main');
  const thumbEl = document.querySelector('.product-gallery-thumbs');

  if (!mainEl) return;

  const mainSplide = new Splide(mainEl, {
    type: 'slide',
    perPage: 1,
    arrows: true,
    pagination: false,
    speed: 400,
  });

  if (thumbEl) {
    const thumbSplide = new Splide(thumbEl, {
      perPage: 5,
      gap: '0.5rem',
      rewind: true,
      pagination: false,
      arrows: false,
      isNavigation: true,
      breakpoints: {
        640: { perPage: 4 },
      },
    });

    mainSplide.sync(thumbSplide);
    mainSplide.mount();
    thumbSplide.mount();
  } else {
    mainSplide.mount();
  }

  // Listen for variant change to jump to the matching image
  document.addEventListener('variant:changed', (e) => {
    const variant = e.detail;
    if (variant && variant.featured_image) {
      const imageId = variant.featured_image.id;
      const slides = mainEl.querySelectorAll('.splide__slide');
      slides.forEach((slide, index) => {
        if (slide.dataset.imageId == imageId) {
          mainSplide.go(index);
        }
      });
    }
  });
});

import Splide from '@splidejs/splide';

document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.cross-selling-slider').forEach(el => {
    new Splide(el, {
      perPage: 4,
      perMove: 1,
      gap: '1.5rem',
      pagination: false,
      breakpoints: {
        640: { perPage: 2, gap: '1rem' },
        768: { perPage: 2 },
        1024: { perPage: 3 },
      },
    }).mount();
  });
});

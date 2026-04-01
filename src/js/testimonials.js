import Splide from '@splidejs/splide';

document.addEventListener('DOMContentLoaded', () => {
  const el = document.querySelector('.testimonials-slider');
  if (!el) return;
  new Splide(el, {
    type: 'loop',
    perPage: 1,
    autoplay: true,
    interval: 6000,
    pauseOnHover: true,
    speed: 600,
    arrows: true,
    pagination: true,
  }).mount();
});

import Splide from '@splidejs/splide';

document.addEventListener('DOMContentLoaded', () => {
  const heroEl = document.querySelector('.hero-slider');
  if (!heroEl) return;

  new Splide(heroEl, {
    type: 'fade',
    rewind: true,
    autoplay: true,
    interval: 5000,
    pauseOnHover: false,
    pauseOnFocus: false,
    arrows: heroEl.querySelectorAll('.splide__slide').length > 1,
    pagination: heroEl.querySelectorAll('.splide__slide').length > 1,
    speed: 800,
  }).mount();
});

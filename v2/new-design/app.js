const menuButton = document.querySelector('.menu-button');
const nav = document.querySelector('#site-nav');
const closeButton = nav?.querySelector('.menu-close');

const closeMenu = () => {
  nav.classList.remove('open');
  menuButton.setAttribute('aria-expanded', 'false');
};

menuButton.addEventListener('click', () => {
  const isOpen = nav.classList.toggle('open');
  menuButton.setAttribute('aria-expanded', String(isOpen));
});

closeButton.addEventListener('click', closeMenu);
document.querySelectorAll('#site-nav a').forEach((link) => link.addEventListener('click', closeMenu));
document.addEventListener('click', (event) => {
  if (nav.classList.contains('open') && !nav.contains(event.target) && !menuButton.contains(event.target)) closeMenu();
});
document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && nav.classList.contains('open')) closeMenu();
});

const setupCarousel = (selector, slideSelector, label) => {
  document.querySelectorAll(selector).forEach((carousel) => {
    const slides = [...carousel.querySelectorAll(slideSelector)];
    const status = carousel.querySelector('[aria-live]');
    const pagination = carousel.querySelector('.carousel-pagination');
    let currentSlide = 0;
    const dots = slides.map((_, index) => {
      const dot = document.createElement('button');
      dot.type = 'button';
      dot.setAttribute('aria-label', `前往第 ${index + 1} 張${label}`);
      dot.addEventListener('click', () => showSlide(index));
      pagination.append(dot);
      return dot;
    });

    const showSlide = (index) => {
      currentSlide = (index + slides.length) % slides.length;
      slides.forEach((slide, slideIndex) => {
        slide.classList.toggle('is-active', slideIndex === currentSlide);
      });
      dots.forEach((dot, dotIndex) => {
        dot.classList.toggle('is-active', dotIndex === currentSlide);
        dot.setAttribute('aria-current', dotIndex === currentSlide ? 'true' : 'false');
      });
      status.textContent = `目前為第 ${currentSlide + 1} 張${label}，共 ${slides.length} 張。`;
    };

    const previousButton = carousel.querySelector('.carousel-prev');
    const nextButton = carousel.querySelector('.carousel-next');
    previousButton?.addEventListener('click', () => showSlide(currentSlide - 1));
    nextButton?.addEventListener('click', () => showSlide(currentSlide + 1));
    showSlide(0);
    if (carousel.matches('.hero-carousel') && window.matchMedia('(max-width: 1023px) and (prefers-reduced-motion: no-preference)').matches) {
      window.setInterval(() => showSlide(currentSlide + 1), 1500);
    }
  });
};

setupCarousel('.history-carousel', '.history-slide, .history-card', '歷程卡片');
setupCarousel('.project-carousel', '.project-slide, .project-card', '實績卡片');
setupCarousel('.hero-carousel', '.hero-slide', '首頁主視覺');
setupCarousel('.desktop-hero-carousel', '.desktop-hero-slide', '首頁主視覺');
setupCarousel('.essential-carousel', '.mobile-essential-slide', '本質圖片');
setupCarousel('.journey-carousel', '.journey-card', '歷程卡片');

if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  document.querySelectorAll('.reveal').forEach((section) => observer.observe(section));
}

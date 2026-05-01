document.querySelectorAll("[data-practice-carousel]").forEach((carousel) => {
  const track = carousel.querySelector("[data-practice-track]");
  const slides = Array.from(track.children);
  const prevButton = carousel.querySelector("[data-practice-prev]");
  const nextButton = carousel.querySelector("[data-practice-next]");
  const dotsWrap = carousel.querySelector("[data-practice-dots]");
  const autoSlideDelay = 3500;
  let autoSlideTimer;

  const getSlideStep = () => {
    const firstSlide = slides[0];
    const gap = Number.parseFloat(getComputedStyle(track).columnGap) || 0;
    return firstSlide.getBoundingClientRect().width + gap;
  };

  const getActiveIndex = () => {
    const step = getSlideStep();
    return step ? Math.round(track.scrollLeft / step) : 0;
  };

  const getMaxIndex = () => {
    const step = getSlideStep();
    const maxScrollLeft = track.scrollWidth - track.clientWidth;
    return step ? Math.max(Math.ceil(maxScrollLeft / step), 0) : 0;
  };

  const scrollToSlide = (index) => {
    track.scrollTo({
      left: getSlideStep() * Math.min(Math.max(index, 0), getMaxIndex()),
      behavior: "smooth",
    });
  };

  const stopAutoSlide = () => {
    window.clearInterval(autoSlideTimer);
  };

  const startAutoSlide = () => {
    stopAutoSlide();

    autoSlideTimer = window.setInterval(() => {
      const activeIndex = Math.min(getActiveIndex(), getMaxIndex());
      const nextIndex = activeIndex >= getMaxIndex() ? 0 : activeIndex + 1;
      scrollToSlide(nextIndex);
    }, autoSlideDelay);
  };

  const restartAutoSlide = () => {
    startAutoSlide();
  };

  const renderDots = () => {
    const dotCount = getMaxIndex() + 1;

    if (dotsWrap.children.length === dotCount) {
      return;
    }

    dotsWrap.replaceChildren();

    Array.from({ length: dotCount }).forEach((_, index) => {
      const dot = document.createElement("button");
      dot.type = "button";
      dot.className =
        "h-[9px] w-[9px] rounded-full border border-brand-accent/65 bg-brand-accent/15 transition-[width,background-color] duration-200";
      dot.setAttribute("aria-label", `Go to practice lab slide ${index + 1}`);
      dot.addEventListener("click", () => {
        scrollToSlide(index);
        restartAutoSlide();
      });
      dotsWrap.appendChild(dot);
    });
  };

  const updateControls = () => {
    renderDots();

    const activeIndex = Math.min(getActiveIndex(), getMaxIndex());
    const maxScrollLeft = track.scrollWidth - track.clientWidth - 1;
    const dots = Array.from(dotsWrap.children);

    dots.forEach((dot, index) => {
      const isActive = index === activeIndex;
      dot.classList.toggle("w-7", isActive);
      dot.classList.toggle("bg-brand-accent", isActive);
      dot.classList.toggle("bg-brand-accent/15", !isActive);
    });

    prevButton.disabled = track.scrollLeft <= 1;
    nextButton.disabled = track.scrollLeft >= maxScrollLeft;
  };

  prevButton.addEventListener("click", () => {
    scrollToSlide(Math.max(getActiveIndex() - 1, 0));
    restartAutoSlide();
  });
  nextButton.addEventListener("click", () => {
    const activeIndex = Math.min(getActiveIndex(), getMaxIndex());
    scrollToSlide(activeIndex >= getMaxIndex() ? 0 : activeIndex + 1);
    restartAutoSlide();
  });
  carousel.addEventListener("mouseenter", stopAutoSlide);
  carousel.addEventListener("mouseleave", startAutoSlide);
  carousel.addEventListener("focusin", stopAutoSlide);
  carousel.addEventListener("focusout", startAutoSlide);
  track.addEventListener("scroll", updateControls, { passive: true });
  window.addEventListener("resize", updateControls);
  updateControls();
  startAutoSlide();
});

document.querySelectorAll("[data-trusted-marquee]").forEach((track) => {
  const cards = Array.from(track.children);

  cards.forEach((card) => {
    const clone = card.cloneNode(true);
    clone.setAttribute("aria-hidden", "true");
    track.appendChild(clone);
  });
});

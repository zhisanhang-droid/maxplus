import { onBeforeUnmount, onMounted, ref } from "vue";

export function useHeroSlider(getSlideCount: () => number) {
  const activeIndex = ref(0);
  let autoplayId: number | undefined;

  const slideCount = () => getSlideCount();

  const stopAutoplay = () => {
    if (autoplayId) {
      window.clearInterval(autoplayId);
      autoplayId = undefined;
    }
  };

  const setSlide = (index: number) => {
    const total = slideCount();

    if (!total) {
      return;
    }

    activeIndex.value = (index + total) % total;
  };

  const nextSlide = () => {
    setSlide(activeIndex.value + 1);
  };

  const startAutoplay = () => {
    stopAutoplay();

    if (slideCount() < 2) {
      return;
    }

    autoplayId = window.setInterval(nextSlide, 5200);
  };

  const handleVisibilityChange = () => {
    if (document.hidden) {
      stopAutoplay();
      return;
    }

    startAutoplay();
  };

  onMounted(() => {
    startAutoplay();
    document.addEventListener("visibilitychange", handleVisibilityChange);
  });

  onBeforeUnmount(() => {
    stopAutoplay();
    document.removeEventListener("visibilitychange", handleVisibilityChange);
  });

  return {
    activeIndex,
    setSlide,
    startAutoplay,
    stopAutoplay
  };
}

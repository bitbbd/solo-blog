<template>
  <section class="carousel-section">
    <div class="carousel-container">
      <div class="carousel-wrapper">
        <transition name="fade" mode="out-in">
          <div 
            class="carousel-slide"
            :key="currentIndex"
            :style="{ backgroundImage: `url(${currentImage.url})` }"
          >
            <div class="carousel-overlay"></div>
            <div class="carousel-content">
              <h1 class="carousel-title">{{ currentTitle }}</h1>
              <p class="carousel-subtitle">{{ currentSubtitle }}</p>
              <div class="carousel-indicator">
                <span 
                  v-for="(_, index) in store.carouselImages" 
                  :key="index"
                  class="indicator-dot"
                  :class="{ active: index === currentIndex }"
                  @click="goToSlide(index)"
                ></span>
              </div>
            </div>
          </div>
        </transition>
      </div>
      <div class="carousel-particles">
        <div v-for="i in 20" :key="i" class="particle" :style="getParticleStyle(i)"></div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useBlogStore } from '../store/blog'

const store = useBlogStore()
const currentIndex = ref(0)
let interval = null

const currentImage = computed(() => {
  return store.carouselImages[currentIndex.value] || { url: '', alt: '' }
})

const carouselContent = computed(() => {
  const contentKeys = ['carousel.slide1', 'carousel.slide2', 'carousel.slide3']
  return store.t(contentKeys[currentIndex.value] || 'carousel.slide1')
})

const currentTitle = computed(() => {
  return carouselContent.value.title || ''
})

const currentSubtitle = computed(() => {
  return carouselContent.value.subtitle || ''
})

const goToSlide = (index) => {
  currentIndex.value = index
  store.setCarouselIndex(index)
}

const nextSlide = () => {
  currentIndex.value = (currentIndex.value + 1) % store.carouselImages.length
  store.setCarouselIndex(currentIndex.value)
}

const getParticleStyle = (index) => {
  const random = (seed) => {
    const x = Math.sin(seed) * 10000
    return x - Math.floor(x)
  }
  
  return {
    left: `${random(index * 1.1) * 100}%`,
    top: `${random(index * 2.2) * 100}%`,
    animationDelay: `${random(index * 3.3) * 5}s`,
    animationDuration: `${3 + random(index * 4.4) * 4}s`,
    width: `${2 + random(index * 5.5) * 4}px`,
    height: `${2 + random(index * 5.5) * 4}px`,
    opacity: 0.3 + random(index * 6.6) * 0.4
  }
}

onMounted(() => {
  interval = setInterval(nextSlide, 5000)
})

onUnmounted(() => {
  if (interval) clearInterval(interval)
})
</script>

<style scoped>
.carousel-section {
  width: 100%;
  height: 450px;
  margin-top: 72px;
  position: relative;
  overflow: hidden;
}

.carousel-container {
  width: 100%;
  height: 100%;
  position: relative;
}

.carousel-wrapper {
  width: 100%;
  height: 100%;
}

.carousel-slide {
  width: 100%;
  height: 100%;
  background-size: cover;
  background-position: center;
  position: relative;
}

.carousel-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(
    135deg,
    rgba(10, 14, 23, 0.85) 0%,
    rgba(26, 35, 50, 0.7) 50%,
    rgba(10, 14, 23, 0.85) 100%
  );
}

[data-theme="light"] .carousel-overlay {
  background: linear-gradient(
    135deg,
    rgba(248, 250, 252, 0.9) 0%,
    rgba(226, 232, 240, 0.8) 50%,
    rgba(248, 250, 252, 0.9) 100%
  );
}

.carousel-content {
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
  padding: 40px;
  z-index: 1;
}

.carousel-title {
  font-family: 'Outfit', sans-serif;
  font-size: 56px;
  font-weight: 700;
  margin-bottom: 20px;
  background: linear-gradient(135deg, var(--accent) 0%, var(--accent-secondary) 50%, var(--accent) 100%);
  background-size: 200% auto;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  animation: gradientShift 4s ease-in-out infinite;
  letter-spacing: 2px;
}

.carousel-subtitle {
  font-size: 20px;
  color: var(--text-secondary);
  max-width: 600px;
  line-height: 1.8;
  letter-spacing: 0.5px;
}

.carousel-indicator {
  display: flex;
  gap: 12px;
  margin-top: 40px;
}

.indicator-dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: var(--border);
  cursor: pointer;
  transition: all var(--transition-normal);
  position: relative;
}

.indicator-dot::before {
  content: '';
  position: absolute;
  inset: -4px;
  border-radius: 50%;
  border: 1px solid transparent;
  transition: all var(--transition-normal);
}

.indicator-dot:hover {
  background: var(--text-secondary);
  transform: scale(1.2);
}

.indicator-dot.active {
  background: var(--accent);
  box-shadow: 0 0 10px var(--accent-glow);
}

.indicator-dot.active::before {
  border-color: var(--accent);
}

.carousel-particles {
  position: absolute;
  inset: 0;
  pointer-events: none;
  overflow: hidden;
}

.particle {
  position: absolute;
  background: var(--accent);
  border-radius: 50%;
  animation: float 4s ease-in-out infinite;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 800ms ease-in-out;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

@media (max-width: 768px) {
  .carousel-section {
    height: 350px;
  }
  
  .carousel-title {
    font-size: 36px;
  }
  
  .carousel-subtitle {
    font-size: 16px;
  }
}
</style>

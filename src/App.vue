<template>
  <div class="app">
    <NavBar v-if="showLayout" />
    <Carousel v-if="showLayout" />
    <main class="main-content">
      <router-view v-slot="{ Component }">
        <transition name="fade" mode="out-in">
          <component :is="Component" />
        </transition>
      </router-view>
    </main>
    <FooterBar v-if="showLayout" />
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { onMounted } from 'vue'
import { useBlogStore } from './store/blog'
import NavBar from './components/NavBar.vue'
import Carousel from './components/Carousel.vue'
import FooterBar from './components/Footer.vue'

const route = useRoute()
const store = useBlogStore()

const showLayout = computed(() => {
  return route.name === 'Home' || !route.name
})

onMounted(() => {
  store.initFromStorage()
  store.loadData()
})
</script>

<style scoped>
.app {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.main-content {
  flex: 1;
  background: linear-gradient(180deg, var(--bg-primary) 0%, var(--bg-secondary) 100%);
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>

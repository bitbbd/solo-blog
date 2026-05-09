<template>
  <div class="app">
    <NavBar />
    <Carousel />
    <main class="main-content">
      <div class="content-wrapper">
        <TagCloud />
        <ArticleList />
        <Timeline />
      </div>
    </main>
    <FooterBar />
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import { useBlogStore } from './store/blog'
import NavBar from './components/NavBar.vue'
import Carousel from './components/Carousel.vue'
import ArticleList from './components/ArticleList.vue'
import TagCloud from './components/TagCloud.vue'
import Timeline from './components/Timeline.vue'
import FooterBar from './components/Footer.vue'

const store = useBlogStore()

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
  padding: 40px 24px;
  background: linear-gradient(180deg, var(--bg-primary) 0%, var(--bg-secondary) 100%);
}

.content-wrapper {
  max-width: 1400px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: 260px 1fr 220px;
  gap: 32px;
  align-items: start;
}

@media (max-width: 1199px) {
  .content-wrapper {
    grid-template-columns: 1fr 200px;
  }
}

@media (max-width: 768px) {
  .content-wrapper {
    grid-template-columns: 1fr;
  }
  
  .main-content {
    padding: 24px 16px;
  }
}
</style>

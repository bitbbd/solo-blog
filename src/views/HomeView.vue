<template>
  <div class="home-view">
    <div class="content-wrapper">
      <TagCloud />
      <ArticleList />
      <Timeline />
    </div>
  </div>
</template>

<script setup>
import TagCloud from '@/components/TagCloud.vue'
import ArticleList from '@/components/ArticleList.vue'
import Timeline from '@/components/Timeline.vue'
</script>

<style scoped>
.home-view {
  max-width: 1400px;
  margin: 0 auto;
  padding: 40px 24px;
}

.content-wrapper {
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
  .home-view {
    padding: 24px 16px;
  }
  
  .content-wrapper {
    grid-template-columns: 1fr;
  }
}
</style>

<template>
  <section class="article-list">
    <div class="article-list-header">
      <h2 class="section-title">
        <svg class="title-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
          <polyline points="14 2 14 8 20 8"/>
          <line x1="16" y1="13" x2="8" y2="13"/>
          <line x1="16" y1="17" x2="8" y2="17"/>
          <polyline points="10 9 9 9 8 9"/>
        </svg>
        <span v-if="store.selectedTag">{{ store.getTagName(store.selectedTag) }}</span>
        <span v-else>{{ store.t('tags.all') }}</span>
      </h2>
      <span class="article-count">{{ store.filteredArticles.length }} {{ store.currentLang === 'zh' ? '篇文章' : 'articles' }}</span>
    </div>

    <div class="articles-container">
      <transition-group name="list" tag="div" class="articles-grid">
        <article 
          v-for="(article, index) in store.sortedArticles" 
          :key="article.id"
          :data-article-id="article.id"
          :ref="(el) => { if (el) articleRefs[index] = el }"
          class="article-card"
          :class="{ 'featured': index === 0 && !store.selectedTag }"
          :style="{ '--delay': `${index * 100}ms` }"
          @click="handleArticleClick(article)"
          @mouseenter="handleMouseEnter(article.id)"
          @mouseleave="handleMouseLeave"
        >
          <div class="card-image">
            <img :src="article.coverImage" :alt="store.getArticleTitle(article)" loading="lazy" />
            <div class="image-overlay"></div>
            <div class="card-date-badge">
              <span class="day">{{ formatDay(article.date) }}</span>
              <span class="month">{{ formatMonth(article.date) }}</span>
            </div>
          </div>

          <div class="card-content">
            <div class="card-tags">
              <span 
                v-for="tag in article.tags" 
                :key="tag"
                class="card-tag"
                :style="{ '--tag-color': getTagColor(tag) }"
                @click.stop="store.selectTag(tag)"
              >
                {{ store.getTagName(tag) }}
              </span>
            </div>

            <h3 class="card-title">{{ store.getArticleTitle(article) }}</h3>
            <p class="card-excerpt">{{ store.getArticleExcerpt(article) }}</p>

            <div class="card-footer">
              <div class="card-meta">
                <span class="meta-item views">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                    <circle cx="12" cy="12" r="3"/>
                  </svg>
                  {{ formatViews(article.views) }}
                </span>
                <span class="meta-item author">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                    <circle cx="12" cy="7" r="4"/>
                  </svg>
                  {{ article.author }}
                </span>
              </div>
              <button class="read-more">
                {{ store.t('article.readMore') }}
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <line x1="5" y1="12" x2="19" y2="12"/>
                  <polyline points="12 5 19 12 12 19"/>
                </svg>
              </button>
            </div>
          </div>

          <div class="card-glow"></div>
        </article>
      </transition-group>

      <div v-if="store.sortedArticles.length === 0" class="empty-state">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
          <circle cx="12" cy="12" r="10"/>
          <path d="M8 15h8M9 9h.01M15 9h.01"/>
        </svg>
        <p>{{ store.currentLang === 'zh' ? '暂无文章' : 'No articles found' }}</p>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted, onUnmounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useBlogStore } from '../store/blog'

const router = useRouter()
const store = useBlogStore()
const hoveredArticleId = ref(null)
const articleRefs = ref([])
let observer = null

const setupIntersectionObserver = () => {
  if (observer) {
    observer.disconnect()
  }
  
  observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const articleId = parseInt(entry.target.dataset.articleId)
        store.setCurrentArticle(articleId)
      }
    })
  }, {
    root: null,
    rootMargin: '-20% 0px -60% 0px',
    threshold: 0
  })
  
  articleRefs.value.forEach(el => {
    if (el) {
      observer.observe(el)
    }
  })
}

watch(() => store.sortedArticles, async () => {
  await new Promise(resolve => setTimeout(resolve, 100))
  setupIntersectionObserver()
}, { deep: true })

onMounted(() => {
  setupIntersectionObserver()
})

onUnmounted(() => {
  if (observer) {
    observer.disconnect()
  }
})

const handleArticleClick = (article) => {
  router.push(`/article/${article.id}`)
}

const handleMouseEnter = (articleId) => {
  hoveredArticleId.value = articleId
}

const handleMouseLeave = () => {
  hoveredArticleId.value = null
}

const getTagColor = (tagId) => {
  const tag = store.tags.find(t => t.id === tagId)
  return tag?.color || '#00d4aa'
}

const formatDay = (dateStr) => {
  const date = new Date(dateStr)
  return date.getDate()
}

const formatMonth = (dateStr) => {
  const date = new Date(dateStr)
  const months = store.currentLang === 'zh' 
    ? ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月']
    : ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
  return months[date.getMonth()]
}

const formatViews = (views) => {
  if (views >= 1000) {
    return `${(views / 1000).toFixed(1)}k`
  }
  return views
}
</script>

<style scoped>
.article-list {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.article-list-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-bottom: 16px;
  border-bottom: 1px solid var(--border);
}

.section-title {
  display: flex;
  align-items: center;
  gap: 12px;
  font-family: 'Outfit', sans-serif;
  font-size: 24px;
  font-weight: 600;
  color: var(--text-primary);
}

.title-icon {
  width: 28px;
  height: 28px;
  color: var(--accent);
}

.article-count {
  font-family: 'JetBrains Mono', monospace;
  font-size: 14px;
  color: var(--text-secondary);
  padding: 6px 14px;
  background: var(--bg-secondary);
  border-radius: var(--radius-full);
}

.articles-container {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.articles-grid {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.article-card {
  display: grid;
  grid-template-columns: 200px 1fr;
  gap: 0;
  background: var(--bg-secondary);
  border: 1px solid var(--border);
  border-radius: var(--radius-lg);
  overflow: hidden;
  cursor: pointer;
  transition: all var(--transition-normal);
  position: relative;
  opacity: 0;
  animation: slideUp 500ms cubic-bezier(0.16, 1, 0.3, 1) forwards;
  animation-delay: var(--delay);
}

.article-card:hover {
  border-color: var(--accent);
  transform: translateY(-4px);
  box-shadow: 0 20px 40px var(--shadow), 0 0 30px var(--accent-glow);
}

.article-card.featured {
  grid-template-columns: 280px 1fr;
}

.card-image {
  position: relative;
  height: 100%;
  min-height: 180px;
  overflow: hidden;
}

.article-card.featured .card-image {
  min-height: 220px;
}

.card-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform var(--transition-slow);
}

.article-card:hover .card-image img {
  transform: scale(1.08);
}

.image-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(90deg, transparent 50%, var(--bg-secondary) 100%);
  pointer-events: none;
}

.card-date-badge {
  position: absolute;
  top: 16px;
  left: 16px;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 8px 12px;
  background: var(--glass);
  backdrop-filter: blur(8px);
  border-radius: var(--radius-md);
  border: 1px solid var(--border);
}

.card-date-badge .day {
  font-family: 'JetBrains Mono', monospace;
  font-size: 24px;
  font-weight: 600;
  color: var(--accent);
  line-height: 1;
}

.card-date-badge .month {
  font-size: 11px;
  color: var(--text-secondary);
  margin-top: 4px;
}

.card-content {
  padding: 24px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.card-tags {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.card-tag {
  font-size: 12px;
  padding: 4px 10px;
  border-radius: var(--radius-full);
  background: var(--bg-primary);
  color: var(--tag-color);
  border: 1px solid var(--tag-color);
  transition: all var(--transition-fast);
}

.card-tag:hover {
  background: var(--tag-color);
  color: var(--bg-primary);
}

.card-title {
  font-family: 'Outfit', sans-serif;
  font-size: 20px;
  font-weight: 600;
  color: var(--text-primary);
  line-height: 1.4;
  transition: color var(--transition-fast);
}

.article-card.featured .card-title {
  font-size: 24px;
}

.article-card:hover .card-title {
  color: var(--accent);
}

.card-excerpt {
  font-size: 14px;
  color: var(--text-secondary);
  line-height: 1.7;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.article-card.featured .card-excerpt {
  -webkit-line-clamp: 3;
}

.card-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: auto;
  padding-top: 16px;
  border-top: 1px solid var(--border);
}

.card-meta {
  display: flex;
  gap: 16px;
}

.meta-item {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 13px;
  color: var(--text-muted);
}

.meta-item svg {
  width: 16px;
  height: 16px;
}

.read-more {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  font-weight: 500;
  color: var(--accent);
  padding: 8px 16px;
  border-radius: var(--radius-md);
  background: transparent;
  border: 1px solid var(--accent);
  transition: all var(--transition-fast);
}

.read-more:hover {
  background: var(--accent);
  color: var(--bg-primary);
}

.read-more svg {
  width: 16px;
  height: 16px;
  transition: transform var(--transition-fast);
}

.read-more:hover svg {
  transform: translateX(4px);
}

.card-glow {
  position: absolute;
  inset: 0;
  border-radius: var(--radius-lg);
  pointer-events: none;
  opacity: 0;
  transition: opacity var(--transition-normal);
  background: radial-gradient(circle at 50% 0%, var(--accent-glow) 0%, transparent 70%);
}

.article-card:hover .card-glow {
  opacity: 0.3;
}

.list-enter-active,
.list-leave-active {
  transition: all var(--transition-normal);
}

.list-enter-from,
.list-leave-to {
  opacity: 0;
  transform: translateY(20px);
}

.list-move {
  transition: transform var(--transition-normal);
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 80px 40px;
  text-align: center;
  color: var(--text-secondary);
}

.empty-state svg {
  width: 80px;
  height: 80px;
  margin-bottom: 20px;
  opacity: 0.5;
}

.empty-state p {
  font-size: 18px;
}

@media (max-width: 768px) {
  .article-card {
    grid-template-columns: 1fr;
  }
  
  .article-card.featured {
    grid-template-columns: 1fr;
  }
  
  .card-image {
    height: 180px;
    min-height: 180px;
  }
  
  .image-overlay {
    background: linear-gradient(180deg, transparent 50%, var(--bg-secondary) 100%);
  }
  
  .card-content {
    padding: 20px;
  }
  
  .card-title {
    font-size: 18px;
  }
  
  .article-card.featured .card-title {
    font-size: 20px;
  }
  
  .card-footer {
    flex-direction: column;
    gap: 16px;
    align-items: flex-start;
  }
  
  .read-more {
    width: 100%;
    justify-content: center;
  }
}
</style>

<template>
  <aside class="timeline">
    <div class="timeline-header">
      <svg class="timeline-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <circle cx="12" cy="12" r="10"/>
        <polyline points="12 6 12 12 16 14"/>
      </svg>
      <h3>{{ store.t('timeline.title') }}</h3>
    </div>

    <div class="timeline-content" ref="timelineRef">
      <div class="timeline-line"></div>
      
      <template v-for="(articles, yearMonth) in store.articlesByMonth" :key="yearMonth">
        <div class="timeline-month-group">
          <div class="month-label">
            <span class="month-dot"></span>
            <span class="month-text">{{ formatMonthLabel(yearMonth) }}</span>
          </div>
          
          <div class="timeline-articles">
            <div 
              v-for="article in articles" 
              :key="article.id"
              class="timeline-item"
              :class="{ 
                'current': store.currentArticleId === article.id,
                'hovered': hoveredArticleId === article.id
              }"
              @click="handleItemClick(article)"
              @mouseenter="hoveredArticleId = article.id"
              @mouseleave="hoveredArticleId = null"
            >
              <div class="timeline-dot"></div>
              <div class="timeline-date">
                <span class="date-day">{{ formatDate(article.date) }}</span>
              </div>
              <div class="timeline-info">
                <span class="article-title">{{ store.getArticleTitle(article) }}</span>
                <span class="article-tags">
                  <span 
                    v-for="tag in article.tags.slice(0, 2)" 
                    :key="tag"
                    class="mini-tag"
                    :style="{ '--tag-color': getTagColor(tag) }"
                  >
                    {{ store.getTagName(tag) }}
                  </span>
                </span>
              </div>
            </div>
          </div>
        </div>
      </template>
    </div>
  </aside>
</template>

<script setup>
import { ref } from 'vue'
import { useBlogStore } from '../store/blog'

const store = useBlogStore()
const timelineRef = ref(null)
const hoveredArticleId = ref(null)

const handleItemClick = (article) => {
  store.setCurrentArticle(article.id)
  console.log('Navigate to article from timeline:', article.id)
}

const getTagColor = (tagId) => {
  const tag = store.tags.find(t => t.id === tagId)
  return tag?.color || '#00d4aa'
}

const formatDate = (dateStr) => {
  const date = new Date(dateStr)
  return `${date.getMonth() + 1}.${date.getDate()}`
}

const formatMonthLabel = (yearMonth) => {
  const [year, month] = yearMonth.split('-')
  if (store.currentLang === 'zh') {
    return `${year}年${month}月`
  }
  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
  return `${monthNames[parseInt(month) - 1]} ${year}`
}
</script>

<style scoped>
.timeline {
  background: var(--bg-secondary);
  border-radius: var(--radius-lg);
  border: 1px solid var(--border);
  overflow: hidden;
  position: sticky;
  top: 100px;
  max-height: calc(100vh - 200px);
  display: flex;
  flex-direction: column;
}

.timeline-header {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 20px;
  border-bottom: 1px solid var(--border);
  background: linear-gradient(135deg, var(--bg-tertiary) 0%, var(--bg-secondary) 100%);
}

.timeline-icon {
  width: 22px;
  height: 22px;
  color: var(--accent-secondary);
}

.timeline-header h3 {
  font-family: 'Outfit', sans-serif;
  font-size: 16px;
  font-weight: 600;
  color: var(--text-primary);
}

.timeline-content {
  flex: 1;
  overflow-y: auto;
  padding: 20px;
  position: relative;
  scrollbar-width: thin;
  scrollbar-color: var(--border) transparent;
}

.timeline-line {
  position: absolute;
  left: 32px;
  top: 0;
  bottom: 0;
  width: 2px;
  background: linear-gradient(
    180deg,
    transparent 0%,
    var(--border) 10%,
    var(--border) 90%,
    transparent 100%
  );
}

.timeline-month-group {
  position: relative;
  margin-bottom: 24px;
}

.month-label {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 16px;
  padding-left: 8px;
}

.month-dot {
  width: 10px;
  height: 10px;
  background: var(--accent-secondary);
  border-radius: 50%;
  box-shadow: 0 0 10px var(--accent-secondary-glow);
  position: relative;
  z-index: 1;
}

.month-text {
  font-family: 'JetBrains Mono', monospace;
  font-size: 12px;
  font-weight: 500;
  color: var(--text-secondary);
  letter-spacing: 0.5px;
}

.timeline-articles {
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding-left: 16px;
}

.timeline-item {
  display: flex;
  align-items: flex-start;
  gap: 16px;
  padding: 14px 16px;
  background: var(--bg-primary);
  border: 1px solid var(--border);
  border-radius: var(--radius-md);
  cursor: pointer;
  transition: all var(--transition-fast);
  position: relative;
}

.timeline-item::before {
  content: '';
  position: absolute;
  left: -22px;
  top: 50%;
  transform: translateY(-50%);
  width: 8px;
  height: 2px;
  background: var(--border);
  transition: all var(--transition-fast);
}

.timeline-dot {
  width: 8px;
  height: 8px;
  background: var(--border);
  border-radius: 50%;
  margin-top: 6px;
  flex-shrink: 0;
  transition: all var(--transition-fast);
}

.timeline-item:hover,
.timeline-item.hovered {
  border-color: var(--accent);
  background: var(--bg-tertiary);
  transform: translateX(4px);
  box-shadow: 0 4px 20px var(--shadow);
}

.timeline-item:hover .timeline-dot,
.timeline-item.hovered .timeline-dot {
  background: var(--accent);
  box-shadow: 0 0 8px var(--accent-glow);
}

.timeline-item:hover::before,
.timeline-item.hovered::before {
  background: var(--accent);
  width: 16px;
}

.timeline-item.current {
  border-color: var(--accent);
  background: linear-gradient(135deg, var(--bg-tertiary) 0%, rgba(0, 212, 170, 0.1) 100%);
}

.timeline-item.current .timeline-dot {
  background: var(--accent);
  box-shadow: 0 0 12px var(--accent-glow);
  transform: scale(1.5);
}

.timeline-date {
  flex-shrink: 0;
}

.date-day {
  font-family: 'JetBrains Mono', monospace;
  font-size: 16px;
  font-weight: 600;
  color: var(--accent);
}

.timeline-item:not(.current):not(.hovered) .date-day {
  font-size: 14px;
  color: var(--text-muted);
  opacity: 0.7;
}

.timeline-info {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.article-title {
  font-size: 13px;
  font-weight: 500;
  color: var(--text-primary);
  line-height: 1.4;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  transition: color var(--transition-fast);
}

.timeline-item.current .article-title {
  font-size: 14px;
  color: var(--accent);
}

.timeline-item:not(.current):not(.hovered) .article-title {
  font-size: 12px;
  opacity: 0.8;
}

.article-tags {
  display: flex;
  gap: 6px;
  flex-wrap: wrap;
}

.mini-tag {
  font-size: 10px;
  padding: 2px 8px;
  border-radius: var(--radius-full);
  background: var(--bg-secondary);
  color: var(--tag-color);
  border: 1px solid var(--tag-color);
}

.timeline-item.current .mini-tag {
  background: rgba(0, 212, 170, 0.15);
}

.timeline-item:not(.current):not(.hovered) .mini-tag {
  opacity: 0.7;
}

@media (max-width: 1199px) {
  .timeline {
    position: sticky;
    top: 100px;
    max-height: calc(100vh - 200px);
  }
}

@media (max-width: 768px) {
  .timeline {
    position: relative;
    top: 0;
    max-height: none;
    border-radius: var(--radius-lg);
  }
  
  .timeline-content {
    max-height: 400px;
  }
  
  .timeline-item {
    padding: 12px;
  }
}
</style>

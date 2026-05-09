<template>
  <div class="article-detail" v-if="article">
    <div class="detail-container">
      <header class="article-header">
        <button class="back-button" @click="goBack">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <line x1="19" y1="12" x2="5" y2="12"></line>
            <polyline points="12 19 5 12 12 5"></polyline>
          </svg>
          <span>{{ isZh ? '返回列表' : 'Back to List' }}</span>
        </button>
      </header>

      <article class="article-content">
        <div class="article-cover">
          <img :src="article.coverImage" :alt="title" />
          <div class="cover-overlay"></div>
        </div>

        <div class="article-info">
          <div class="article-tags">
            <span 
              v-for="tag in article.tags" 
              :key="tag"
              class="article-tag"
              :style="{ '--tag-color': getTagColor(tag) }"
              @click="handleTagClick(tag)"
            >
              {{ getTagName(tag) }}
            </span>
          </div>

          <h1 class="article-title">{{ title }}</h1>

          <div class="article-meta">
            <span class="meta-item author">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                <circle cx="12" cy="7" r="4"></circle>
              </svg>
              {{ article.author }}
            </span>
            <span class="meta-item date">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                <line x1="16" y1="2" x2="16" y2="6"></line>
                <line x1="8" y1="2" x2="8" y2="6"></line>
                <line x1="3" y1="10" x2="21" y2="10"></line>
              </svg>
              {{ formatDate(article.date) }}
            </span>
            <span class="meta-item views">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                <circle cx="12" cy="12" r="3"></circle>
              </svg>
              {{ formatViews(article.views) }} {{ isZh ? '阅读' : 'views' }}
            </span>
          </div>
        </div>

        <div class="article-body">
          <div class="content-wrapper">
            <div class="article-text" v-html="article.content"></div>

            <aside class="article-sidebar">
              <div class="sidebar-toc" v-if="article.toc && article.toc.length">
                <h4 class="toc-title">{{ isZh ? '目录' : 'Table of Contents' }}</h4>
                <nav class="toc-nav">
                  <a 
                    v-for="item in article.toc" 
                    :key="item.id"
                    :href="`#${item.id}`"
                    class="toc-item"
                    :class="{ 'level-2': item.level === 2, 'level-3': item.level === 3 }"
                  >
                    {{ item.text }}
                  </a>
                </nav>
              </div>

              <div class="sidebar-share">
                <h4 class="share-title">{{ isZh ? '分享' : 'Share' }}</h4>
                <div class="share-buttons">
                  <button class="share-btn" @click="copyLink">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path>
                      <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path>
                    </svg>
                  </button>
                  <button class="share-btn">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"></path>
                      <polyline points="16 6 12 2 8 6"></polyline>
                      <line x1="12" y1="2" x2="12" y2="15"></line>
                    </svg>
                  </button>
                </div>
              </div>
            </aside>
          </div>
        </div>

        <div class="article-footer">
          <div class="tags-section">
            <h4 class="section-title">{{ isZh ? '相关标签' : 'Related Tags' }}</h4>
            <div class="related-tags">
              <span 
                v-for="tag in article.tags" 
                :key="tag"
                class="related-tag"
                :style="{ '--tag-color': getTagColor(tag) }"
                @click="handleTagClick(tag)"
              >
                {{ getTagName(tag) }}
              </span>
            </div>
          </div>

          <div class="author-section">
            <div class="author-avatar">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                <circle cx="12" cy="7" r="4"></circle>
              </svg>
            </div>
            <div class="author-info">
              <span class="author-name">{{ article.author }}</span>
              <span class="author-bio">{{ isZh ? '技术博客作者' : 'Tech Blog Author' }}</span>
            </div>
          </div>
        </div>
      </article>

      <section class="related-articles" v-if="relatedArticles.length">
        <h2 class="related-title">{{ isZh ? '相关推荐' : 'Related Articles' }}</h2>
        <div class="related-grid">
          <article 
            v-for="related in relatedArticles" 
            :key="related.id"
            class="related-card"
            @click="goToArticle(related.id)"
          >
            <div class="related-image">
              <img :src="related.coverImage" :alt="getTitle(related)" />
            </div>
            <div class="related-content">
              <div class="related-tags">
                <span 
                  v-for="tag in related.tags.slice(0, 1)" 
                  :key="tag"
                  class="mini-tag"
                  :style="{ '--tag-color': getTagColor(tag) }"
                >
                  {{ getTagName(tag) }}
                </span>
              </div>
              <h3 class="related-article-title">{{ getTitle(related) }}</h3>
              <span class="related-date">{{ formatDate(related.date) }}</span>
            </div>
          </article>
        </div>
      </section>
    </div>
  </div>

  <div class="loading-state" v-else-if="loading">
    <div class="loader"></div>
    <p>{{ isZh ? '加载中...' : 'Loading...' }}</p>
  </div>

  <div class="error-state" v-else>
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
      <circle cx="12" cy="12" r="10"></circle>
      <path d="M12 8v4M12 16h.01"></path>
    </svg>
    <h2>{{ isZh ? '文章未找到' : 'Article Not Found' }}</h2>
    <p>{{ isZh ? '抱歉，您访问的文章不存在或已被删除。' : 'Sorry, the article you are looking for does not exist or has been removed.' }}</p>
    <button class="back-home-btn" @click="goBack">
      {{ isZh ? '返回首页' : 'Back to Home' }}
    </button>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useBlogStore } from '@/store/blog'

const props = defineProps({
  id: {
    type: [String, Number],
    required: true
  }
})

const router = useRouter()
const store = useBlogStore()

const article = ref(null)
const loading = ref(true)

const isZh = computed(() => store.currentLang === 'zh')

const title = computed(() => {
  if (!article.value) return ''
  return isZh.value ? article.value.title : (article.value.titleEn || article.value.title)
})

const relatedArticles = computed(() => {
  if (!article.value) return []
  
  return store.articles
    .filter(a => {
      if (a.id === article.value.id) return false
      return article.value.tags.some(tag => a.tags.includes(tag))
    })
    .slice(0, 3)
})

const fetchArticle = async () => {
  loading.value = true
  try {
    const response = await fetch(`/src/data/${props.id}.json`)
    if (response.ok) {
      article.value = await response.json()
    } else {
      article.value = null
    }
  } catch (error) {
    console.error('Failed to load article:', error)
    article.value = null
  } finally {
    loading.value = false
  }
}

const goBack = () => {
  if (window.history.length > 1) {
    router.back()
  } else {
    router.push('/')
  }
}

const goToArticle = (id) => {
  router.push(`/article/${id}`)
}

const handleTagClick = (tagId) => {
  store.selectTag(tagId)
  router.push('/')
}

const getTagColor = (tagId) => {
  const tag = store.tags.find(t => t.id === tagId)
  return tag?.color || '#00d4aa'
}

const getTagName = (tagId) => {
  return store.getTagName(tagId)
}

const getTitle = (article) => {
  return isZh.value ? article.title : (article.titleEn || article.title)
}

const formatDate = (dateStr) => {
  const date = new Date(dateStr)
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  
  if (isZh.value) {
    return `${year}年${month}月${day}日`
  }
  return `${year}-${month}-${day}`
}

const formatViews = (views) => {
  if (views >= 1000) {
    return `${(views / 1000).toFixed(1)}k`
  }
  return views
}

const copyLink = async () => {
  try {
    await navigator.clipboard.writeText(window.location.href)
    alert(isZh.value ? '链接已复制到剪贴板！' : 'Link copied to clipboard!')
  } catch (error) {
    console.error('Failed to copy link:', error)
  }
}

onMounted(() => {
  fetchArticle()
})

watch(() => props.id, () => {
  fetchArticle()
})
</script>

<style scoped>
.article-detail {
  min-height: 100vh;
  background: var(--bg-primary);
  padding-bottom: 80px;
}

.detail-container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 24px;
}

.article-header {
  padding: 120px 0 40px;
}

.back-button {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px 20px;
  background: var(--bg-secondary);
  border: 1px solid var(--border);
  border-radius: var(--radius-md);
  color: var(--text-secondary);
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all var(--transition-fast);
}

.back-button:hover {
  color: var(--accent);
  border-color: var(--accent);
  transform: translateX(-4px);
  box-shadow: 0 4px 20px var(--accent-glow);
}

.back-button svg {
  width: 18px;
  height: 18px;
}

.article-content {
  background: var(--bg-secondary);
  border-radius: var(--radius-lg);
  border: 1px solid var(--border);
  overflow: hidden;
  margin-bottom: 60px;
}

.article-cover {
  position: relative;
  height: 400px;
  overflow: hidden;
}

.article-cover img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.cover-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(
    to bottom,
    transparent 0%,
    rgba(10, 14, 23, 0.3) 50%,
    var(--bg-secondary) 100%
  );
}

[data-theme="light"] .cover-overlay {
  background: linear-gradient(
    to bottom,
    transparent 0%,
    rgba(248, 250, 252, 0.3) 50%,
    var(--bg-secondary) 100%
  );
}

.article-info {
  padding: 40px;
  text-align: center;
}

.article-tags {
  display: flex;
  justify-content: center;
  gap: 12px;
  margin-bottom: 24px;
  flex-wrap: wrap;
}

.article-tag {
  font-size: 13px;
  padding: 6px 16px;
  border-radius: var(--radius-full);
  background: var(--bg-primary);
  color: var(--tag-color);
  border: 1px solid var(--tag-color);
  cursor: pointer;
  transition: all var(--transition-fast);
}

.article-tag:hover {
  background: var(--tag-color);
  color: var(--bg-primary);
}

.article-title {
  font-family: 'Outfit', sans-serif;
  font-size: 42px;
  font-weight: 700;
  color: var(--text-primary);
  line-height: 1.3;
  margin-bottom: 24px;
  background: linear-gradient(135deg, var(--text-primary) 0%, var(--accent) 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.article-meta {
  display: flex;
  justify-content: center;
  gap: 32px;
  flex-wrap: wrap;
}

.meta-item {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  color: var(--text-secondary);
}

.meta-item svg {
  width: 18px;
  height: 18px;
  color: var(--accent);
}

.article-body {
  padding: 0 40px 40px;
}

.content-wrapper {
  display: grid;
  grid-template-columns: 1fr 280px;
  gap: 48px;
  align-items: start;
}

.article-text {
  font-size: 16px;
  line-height: 1.8;
  color: var(--text-primary);
}

.article-text :deep(h2) {
  font-family: 'Outfit', sans-serif;
  font-size: 28px;
  font-weight: 600;
  margin: 48px 0 24px;
  color: var(--text-primary);
}

.article-text :deep(h3) {
  font-family: 'Outfit', sans-serif;
  font-size: 22px;
  font-weight: 600;
  margin: 36px 0 18px;
  color: var(--text-primary);
}

.article-text :deep(p) {
  margin-bottom: 20px;
  color: var(--text-secondary);
}

.article-text :deep(ul),
.article-text :deep(ol) {
  margin-bottom: 20px;
  padding-left: 24px;
}

.article-text :deep(li) {
  margin-bottom: 12px;
  color: var(--text-secondary);
  list-style: disc;
}

.article-text :deep(code) {
  font-family: 'JetBrains Mono', monospace;
  background: var(--bg-primary);
  padding: 2px 8px;
  border-radius: var(--radius-sm);
  font-size: 14px;
  color: var(--accent);
}

.article-text :deep(pre) {
  background: var(--bg-primary);
  padding: 20px;
  border-radius: var(--radius-md);
  overflow-x: auto;
  margin-bottom: 20px;
}

.article-text :deep(pre code) {
  background: none;
  padding: 0;
}

.article-text :deep(blockquote) {
  border-left: 4px solid var(--accent);
  padding-left: 20px;
  margin: 24px 0;
  font-style: italic;
  color: var(--text-secondary);
}

.article-sidebar {
  position: sticky;
  top: 100px;
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.sidebar-toc,
.sidebar-share {
  background: var(--bg-primary);
  border: 1px solid var(--border);
  border-radius: var(--radius-md);
  padding: 20px;
}

.toc-title,
.share-title {
  font-family: 'Outfit', sans-serif;
  font-size: 16px;
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: 16px;
}

.toc-nav {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.toc-item {
  font-size: 14px;
  color: var(--text-secondary);
  padding: 8px 12px;
  border-radius: var(--radius-sm);
  transition: all var(--transition-fast);
  text-decoration: none;
}

.toc-item:hover {
  color: var(--accent);
  background: var(--bg-secondary);
}

.toc-item.level-2 {
  padding-left: 20px;
}

.toc-item.level-3 {
  padding-left: 32px;
  font-size: 13px;
}

.share-buttons {
  display: flex;
  gap: 12px;
}

.share-btn {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 12px;
  background: var(--bg-secondary);
  border: 1px solid var(--border);
  border-radius: var(--radius-md);
  color: var(--text-secondary);
  cursor: pointer;
  transition: all var(--transition-fast);
}

.share-btn:hover {
  color: var(--accent);
  border-color: var(--accent);
  background: rgba(0, 212, 170, 0.05);
}

.share-btn svg {
  width: 20px;
  height: 20px;
}

.article-footer {
  padding: 40px;
  border-top: 1px solid var(--border);
}

.tags-section {
  margin-bottom: 32px;
}

.section-title {
  font-family: 'Outfit', sans-serif;
  font-size: 18px;
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: 16px;
}

.related-tags {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
}

.related-tag {
  font-size: 14px;
  padding: 8px 20px;
  border-radius: var(--radius-full);
  background: var(--bg-primary);
  color: var(--tag-color);
  border: 1px solid var(--tag-color);
  cursor: pointer;
  transition: all var(--transition-fast);
}

.related-tag:hover {
  background: var(--tag-color);
  color: var(--bg-primary);
  transform: translateY(-2px);
  box-shadow: 0 4px 20px var(--accent-glow);
}

.author-section {
  display: flex;
  align-items: center;
  gap: 20px;
  padding: 24px;
  background: var(--bg-primary);
  border-radius: var(--radius-md);
  border: 1px solid var(--border);
}

.author-avatar {
  width: 64px;
  height: 64px;
  border-radius: 50%;
  background: linear-gradient(135deg, var(--accent) 0%, var(--accent-secondary) 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--bg-primary);
}

.author-avatar svg {
  width: 32px;
  height: 32px;
}

.author-info {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.author-name {
  font-family: 'Outfit', sans-serif;
  font-size: 18px;
  font-weight: 600;
  color: var(--text-primary);
}

.author-bio {
  font-size: 14px;
  color: var(--text-secondary);
}

.related-articles {
  margin-top: 60px;
}

.related-title {
  font-family: 'Outfit', sans-serif;
  font-size: 28px;
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: 32px;
  text-align: center;
}

.related-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 24px;
}

.related-card {
  background: var(--bg-secondary);
  border: 1px solid var(--border);
  border-radius: var(--radius-lg);
  overflow: hidden;
  cursor: pointer;
  transition: all var(--transition-normal);
}

.related-card:hover {
  border-color: var(--accent);
  transform: translateY(-8px);
  box-shadow: 0 20px 40px var(--shadow), 0 0 30px var(--accent-glow);
}

.related-image {
  height: 180px;
  overflow: hidden;
}

.related-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform var(--transition-slow);
}

.related-card:hover .related-image img {
  transform: scale(1.1);
}

.related-content {
  padding: 20px;
}

.related-tags {
  margin-bottom: 12px;
}

.mini-tag {
  font-size: 11px;
  padding: 4px 12px;
  border-radius: var(--radius-full);
  background: var(--bg-primary);
  color: var(--tag-color);
  border: 1px solid var(--tag-color);
}

.related-article-title {
  font-family: 'Outfit', sans-serif;
  font-size: 18px;
  font-weight: 600;
  color: var(--text-primary);
  line-height: 1.4;
  margin-bottom: 12px;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  transition: color var(--transition-fast);
}

.related-card:hover .related-article-title {
  color: var(--accent);
}

.related-date {
  font-size: 13px;
  color: var(--text-muted);
}

.loading-state,
.error-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 60vh;
  text-align: center;
  padding: 40px;
}

.loader {
  width: 60px;
  height: 60px;
  border: 4px solid var(--border);
  border-top-color: var(--accent);
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 24px;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.error-state svg {
  width: 100px;
  height: 100px;
  color: var(--text-muted);
  margin-bottom: 24px;
}

.error-state h2 {
  font-family: 'Outfit', sans-serif;
  font-size: 28px;
  color: var(--text-primary);
  margin-bottom: 12px;
}

.error-state p {
  font-size: 16px;
  color: var(--text-secondary);
  margin-bottom: 32px;
}

.back-home-btn {
  padding: 14px 32px;
  background: var(--accent);
  color: var(--bg-primary);
  border: none;
  border-radius: var(--radius-md);
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  transition: all var(--transition-fast);
}

.back-home-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 30px var(--accent-glow);
}

@media (max-width: 1024px) {
  .content-wrapper {
    grid-template-columns: 1fr;
  }

  .article-sidebar {
    position: relative;
    top: 0;
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 20px;
  }
}

@media (max-width: 768px) {
  .detail-container {
    padding: 0 16px;
  }

  .article-header {
    padding: 100px 0 24px;
  }

  .article-info {
    padding: 24px;
  }

  .article-title {
    font-size: 28px;
  }

  .article-meta {
    gap: 16px;
  }

  .article-body {
    padding: 0 24px 24px;
  }

  .article-sidebar {
    grid-template-columns: 1fr;
  }

  .article-footer {
    padding: 24px;
  }

  .author-section {
    flex-direction: column;
    text-align: center;
  }

  .related-grid {
    grid-template-columns: 1fr;
  }
}
</style>

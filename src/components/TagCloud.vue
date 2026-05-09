<template>
  <aside class="tag-cloud" :class="{ 'collapsed': store.tagCloudCollapsed }">
    <div class="tag-cloud-header">
      <div class="header-title">
        <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"/>
          <line x1="7" y1="7" x2="7.01" y2="7"/>
        </svg>
        <span>{{ store.t('nav.tagCloud') }}</span>
      </div>
      <button class="collapse-btn" @click="store.toggleTagCloud">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <polyline points="15 18 9 12 15 6"/>
        </svg>
      </button>
    </div>

    <div class="tag-cloud-content" v-show="!store.tagCloudCollapsed">
      <button 
        class="tag-item all-tag"
        :class="{ 'active': !store.selectedTag }"
        @click="store.selectTag(null)"
      >
        <svg class="tag-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <rect x="3" y="3" width="7" height="7"/>
          <rect x="14" y="3" width="7" height="7"/>
          <rect x="14" y="14" width="7" height="7"/>
          <rect x="3" y="14" width="7" height="7"/>
        </svg>
        <span>{{ store.t('tags.all') }}</span>
        <span class="tag-count">{{ store.articles.length }}</span>
      </button>

      <div class="tags-grid">
        <button 
          v-for="tag in store.tags" 
          :key="tag.id"
          class="tag-item"
          :class="{ 'active': store.selectedTag === tag.id }"
          :style="{ '--tag-color': tag.color }"
          @click="store.selectTag(tag.id)"
        >
          <span class="tag-name">{{ store.getTagName(tag.id) }}</span>
          <span class="tag-count">{{ getTagCount(tag.id) }}</span>
        </button>
      </div>
    </div>

    <button 
      class="expand-btn"
      v-show="store.tagCloudCollapsed"
      @click="store.toggleTagCloud"
    >
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <polyline points="9 18 15 12 9 6"/>
      </svg>
    </button>
  </aside>
</template>

<script setup>
import { useBlogStore } from '../store/blog'

const store = useBlogStore()

const getTagCount = (tagId) => {
  return store.articles.filter(article => article.tags.includes(tagId)).length
}
</script>

<style scoped>
.tag-cloud {
  background: var(--bg-secondary);
  border-radius: var(--radius-lg);
  border: 1px solid var(--border);
  overflow: hidden;
  transition: all var(--transition-normal);
  position: sticky;
  top: 100px;
}

.tag-cloud.collapsed {
  width: 56px;
}

.tag-cloud-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px;
  border-bottom: 1px solid var(--border);
  background: linear-gradient(135deg, var(--bg-tertiary) 0%, var(--bg-secondary) 100%);
}

.header-title {
  display: flex;
  align-items: center;
  gap: 10px;
  font-family: 'Outfit', sans-serif;
  font-weight: 600;
  font-size: 16px;
  color: var(--text-primary);
}

.header-title .icon {
  width: 20px;
  height: 20px;
  color: var(--accent);
}

.collapse-btn {
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: var(--radius-sm);
  color: var(--text-secondary);
  transition: all var(--transition-fast);
}

.collapse-btn:hover {
  background: var(--bg-primary);
  color: var(--accent);
}

.collapse-btn svg {
  width: 18px;
  height: 18px;
}

.tag-cloud.collapsed .collapse-btn {
  display: none;
}

.tag-cloud-content {
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.all-tag {
  background: linear-gradient(135deg, var(--bg-tertiary) 0%, var(--bg-secondary) 100%);
  border: 1px solid var(--border);
}

.all-tag .tag-icon {
  width: 18px;
  height: 18px;
  color: var(--accent-secondary);
}

.tags-grid {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.tag-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 16px;
  border-radius: var(--radius-md);
  background: var(--bg-primary);
  border: 1px solid var(--border);
  color: var(--text-secondary);
  font-size: 14px;
  transition: all var(--transition-fast);
  position: relative;
  overflow: hidden;
}

.tag-item::before {
  content: '';
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  width: 3px;
  background: var(--tag-color, var(--accent));
  opacity: 0;
  transition: opacity var(--transition-fast);
}

.tag-item:hover {
  border-color: var(--tag-color, var(--accent));
  color: var(--text-primary);
  transform: translateX(4px);
  box-shadow: 0 0 20px var(--accent-glow);
}

.tag-item:hover::before {
  opacity: 1;
}

.tag-item.active {
  background: var(--tag-color, var(--accent));
  color: var(--bg-primary);
  border-color: var(--tag-color, var(--accent));
  box-shadow: 0 0 25px var(--accent-glow);
}

.tag-item.active::before {
  opacity: 0;
}

.tag-item.active .tag-count {
  background: rgba(255, 255, 255, 0.2);
  color: inherit;
}

.tag-name {
  font-weight: 500;
}

.tag-count {
  font-family: 'JetBrains Mono', monospace;
  font-size: 12px;
  padding: 4px 10px;
  background: var(--bg-secondary);
  border-radius: var(--radius-full);
  color: var(--text-muted);
}

.expand-btn {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: var(--radius-md);
  background: var(--bg-secondary);
  border: 1px solid var(--border);
  color: var(--text-secondary);
  transition: all var(--transition-fast);
}

.expand-btn:hover {
  background: var(--accent);
  color: var(--bg-primary);
  border-color: var(--accent);
}

.expand-btn svg {
  width: 20px;
  height: 20px;
}

@media (max-width: 1199px) {
  .tag-cloud {
    position: fixed;
    left: 24px;
    top: 100px;
    width: 240px;
    z-index: 50;
    box-shadow: 0 10px 40px var(--shadow);
  }
  
  .tag-cloud.collapsed {
    width: 56px;
  }
  
  .tag-cloud.collapsed .tag-cloud-content {
    display: none;
  }
}

@media (max-width: 768px) {
  .tag-cloud {
    position: fixed;
    left: 0;
    right: 0;
    top: auto;
    bottom: 0;
    border-radius: var(--radius-lg) var(--radius-lg) 0 0;
    width: 100%;
    max-height: 60vh;
    transform: translateY(calc(100% - 60px));
    transition: transform var(--transition-normal);
  }
  
  .tag-cloud:not(.collapsed) {
    transform: translateY(0);
  }
  
  .tag-cloud.collapsed .expand-btn {
    position: relative;
    transform: none;
    left: auto;
    top: auto;
    margin: 16px auto;
  }
  
  .tags-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 8px;
    max-height: 40vh;
    overflow-y: auto;
  }
}
</style>

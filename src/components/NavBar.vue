<template>
  <header class="navbar" :class="{ 'scrolled': isScrolled }">
    <div class="navbar-container">
      <div class="navbar-left">
        <div class="logo">
          <div class="logo-icon">
            <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="20" cy="20" r="18" stroke="currentColor" stroke-width="2"/>
              <path d="M20 8 L20 32 M12 16 L20 8 L28 16 M12 24 L20 32 L28 24" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              <circle cx="20" cy="20" r="4" fill="currentColor"/>
            </svg>
          </div>
          <div class="logo-text">
            <span class="logo-name">TechBlog</span>
            <span class="logo-slogan">{{ store.t('nav.slogan') }}</span>
          </div>
        </div>
      </div>

      <div class="navbar-right">
        <button class="nav-btn tag-toggle" @click="store.toggleTagCloud">
          <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"/>
            <line x1="7" y1="7" x2="7.01" y2="7"/>
          </svg>
          <span>{{ store.t('nav.tagCloud') }}</span>
          <svg class="chevron" :class="{ 'collapsed': store.tagCloudCollapsed }" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <polyline points="6 9 12 15 18 9"/>
          </svg>
        </button>

        <div class="divider"></div>

        <button class="nav-btn lang-btn" @click="store.toggleLang">
          <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="12" cy="12" r="10"/>
            <line x1="2" y1="12" x2="22" y2="12"/>
            <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
          </svg>
          <span>{{ store.currentLang === 'zh' ? 'EN' : '中文' }}</span>
        </button>

        <button class="nav-btn theme-btn" @click="store.toggleTheme">
          <svg v-if="store.isDark" class="icon sun" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="12" cy="12" r="5"/>
            <line x1="12" y1="1" x2="12" y2="3"/>
            <line x1="12" y1="21" x2="12" y2="23"/>
            <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/>
            <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
            <line x1="1" y1="12" x2="3" y2="12"/>
            <line x1="21" y1="12" x2="23" y2="12"/>
            <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/>
            <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
          </svg>
          <svg v-else class="icon moon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
          </svg>
        </button>
      </div>
    </div>
  </header>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useBlogStore } from '../store/blog'

const store = useBlogStore()
const isScrolled = ref(false)

const handleScroll = () => {
  isScrolled.value = window.scrollY > 20
}

onMounted(() => {
  window.addEventListener('scroll', handleScroll)
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
})
</script>

<style scoped>
.navbar {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 100;
  height: 72px;
  background: var(--glass);
  backdrop-filter: blur(16px);
  border-bottom: 1px solid transparent;
  transition: all var(--transition-normal);
}

.navbar.scrolled {
  background: var(--glass);
  border-bottom-color: var(--border);
  box-shadow: 0 4px 30px var(--shadow);
}

.navbar-container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 32px;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.navbar-left {
  display: flex;
  align-items: center;
}

.logo {
  display: flex;
  align-items: center;
  gap: 14px;
}

.logo-icon {
  width: 44px;
  height: 44px;
  color: var(--accent);
  animation: glowPulse 3s ease-in-out infinite;
}

.logo-icon svg {
  width: 100%;
  height: 100%;
}

.logo-text {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.logo-name {
  font-family: 'Outfit', sans-serif;
  font-size: 22px;
  font-weight: 700;
  background: linear-gradient(135deg, var(--accent) 0%, var(--accent-secondary) 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  letter-spacing: 1px;
}

.logo-slogan {
  font-size: 12px;
  color: var(--text-secondary);
  letter-spacing: 0.5px;
}

.navbar-right {
  display: flex;
  align-items: center;
  gap: 8px;
}

.divider {
  width: 1px;
  height: 28px;
  background: var(--border);
  margin: 0 8px;
}

.nav-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 16px;
  border-radius: var(--radius-md);
  font-size: 14px;
  font-weight: 500;
  color: var(--text-secondary);
  background: transparent;
  transition: all var(--transition-fast);
}

.nav-btn:hover {
  color: var(--text-primary);
  background: var(--bg-secondary);
}

.nav-btn .icon {
  width: 18px;
  height: 18px;
}

.tag-toggle .chevron {
  width: 14px;
  height: 14px;
  transition: transform var(--transition-fast);
}

.tag-toggle .chevron.collapsed {
  transform: rotate(-90deg);
}

.lang-btn,
.theme-btn {
  padding: 10px 14px;
}

.theme-btn .sun {
  color: #fbbf24;
}

.theme-btn .moon {
  color: var(--accent-secondary);
}

@media (max-width: 768px) {
  .navbar-container {
    padding: 0 16px;
  }
  
  .logo-slogan {
    display: none;
  }
  
  .tag-toggle span {
    display: none;
  }
  
  .tag-toggle {
    padding: 10px;
  }
  
  .nav-btn span {
    display: none;
  }
  
  .lang-btn,
  .theme-btn {
    padding: 10px;
  }
}
</style>

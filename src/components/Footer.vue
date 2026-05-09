<template>
  <footer class="footer">
    <div class="footer-container">
      <div class="footer-content">
        <div class="footer-brand">
          <div class="brand-logo">
            <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="20" cy="20" r="18" stroke="currentColor" stroke-width="2"/>
              <path d="M20 8 L20 32 M12 16 L20 8 L28 16 M12 24 L20 32 L28 24" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              <circle cx="20" cy="20" r="4" fill="currentColor"/>
            </svg>
          </div>
          <div class="brand-info">
            <span class="brand-name">TechBlog</span>
            <span class="brand-slogan">{{ store.t('nav.slogan') }}</span>
          </div>
        </div>

        <div class="footer-links">
          <a href="#" class="footer-link">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="12" cy="12" r="10"/>
              <line x1="12" y1="16" x2="12" y2="12"/>
              <line x1="12" y1="8" x2="12.01" y2="8"/>
            </svg>
            <span>{{ store.t('footer.about') }}</span>
          </a>
          <a href="#" class="footer-link">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
              <polyline points="22,6 12,13 2,6"/>
            </svg>
            <span>{{ store.t('footer.contact') }}</span>
          </a>
          <a href="https://github.com" target="_blank" class="footer-link">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"/>
            </svg>
            <span>{{ store.t('footer.github') }}</span>
          </a>
          <a href="#" class="footer-link">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M4 11a9 9 0 0 1 9 9"/>
              <path d="M4 4a16 16 0 0 1 16 16"/>
              <circle cx="5" cy="19" r="1"/>
            </svg>
            <span>{{ store.t('footer.rss') }}</span>
          </a>
        </div>
      </div>

      <div class="footer-bottom">
        <div class="footer-divider"></div>
        <div class="footer-copyright">
          <span class="copyright-symbol">©</span>
          <span class="copyright-year">{{ currentYear }}</span>
          <span class="copyright-text">TechBlog. {{ store.t('footer.copyright') }}</span>
        </div>
      </div>
    </div>
  </footer>
</template>

<script setup>
import { computed } from 'vue'
import { useBlogStore } from '../store/blog'

const store = useBlogStore()
const currentYear = computed(() => new Date().getFullYear())
</script>

<style scoped>
.footer {
  background: var(--bg-secondary);
  border-top: 1px solid var(--border);
  padding: 48px 24px 32px;
  margin-top: auto;
}

.footer-container {
  max-width: 1400px;
  margin: 0 auto;
}

.footer-content {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 40px;
  margin-bottom: 32px;
}

.footer-brand {
  display: flex;
  align-items: center;
  gap: 16px;
}

.brand-logo {
  width: 44px;
  height: 44px;
  color: var(--accent);
  animation: glowPulse 3s ease-in-out infinite;
}

.brand-logo svg {
  width: 100%;
  height: 100%;
}

.brand-info {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.brand-name {
  font-family: 'Outfit', sans-serif;
  font-size: 20px;
  font-weight: 700;
  background: linear-gradient(135deg, var(--accent) 0%, var(--accent-secondary) 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.brand-slogan {
  font-size: 12px;
  color: var(--text-secondary);
  letter-spacing: 0.5px;
}

.footer-links {
  display: flex;
  align-items: center;
  gap: 8px;
}

.footer-link {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 16px;
  border-radius: var(--radius-md);
  font-size: 14px;
  color: var(--text-secondary);
  background: var(--bg-primary);
  border: 1px solid var(--border);
  transition: all var(--transition-fast);
}

.footer-link:hover {
  color: var(--accent);
  border-color: var(--accent);
  background: rgba(0, 212, 170, 0.05);
  transform: translateY(-2px);
  box-shadow: 0 4px 20px var(--accent-glow);
}

.footer-link svg {
  width: 18px;
  height: 18px;
}

.footer-bottom {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
}

.footer-divider {
  width: 100%;
  height: 1px;
  background: linear-gradient(90deg, transparent 0%, var(--border) 50%, transparent 100%);
}

.footer-copyright {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 14px;
  color: var(--text-muted);
}

.copyright-symbol {
  font-size: 16px;
}

.copyright-year {
  font-family: 'JetBrains Mono', monospace;
  color: var(--accent);
}

.copyright-text {
  margin-left: 4px;
}

@media (max-width: 768px) {
  .footer {
    padding: 32px 16px 24px;
  }
  
  .footer-content {
    flex-direction: column;
    gap: 24px;
    text-align: center;
  }
  
  .footer-brand {
    flex-direction: column;
  }
  
  .footer-links {
    flex-wrap: wrap;
    justify-content: center;
  }
  
  .footer-link span {
    display: none;
  }
  
  .footer-link {
    padding: 12px;
  }
}
</style>

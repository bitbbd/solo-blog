import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import zhMessages from '../i18n/zh.json'
import enMessages from '../i18n/en.json'

export const useBlogStore = defineStore('blog', () => {
  const articles = ref([])
  const tags = ref([])
  const carouselImages = ref([])
  const selectedTag = ref(null)
  const currentArticleId = ref(null)
  const currentLang = ref('zh')
  const isDark = ref(true)
  const carouselIndex = ref(0)
  const tagCloudCollapsed = ref(false)

  const messages = computed(() => currentLang.value === 'zh' ? zhMessages : enMessages)

  const filteredArticles = computed(() => {
    if (!selectedTag.value) return articles.value
    return articles.value.filter(article => article.tags.includes(selectedTag.value))
  })

  const sortedArticles = computed(() => {
    return [...filteredArticles.value].sort((a, b) => new Date(b.date) - new Date(a.date))
  })

  const articlesByMonth = computed(() => {
    const grouped = {}
    sortedArticles.value.forEach(article => {
      const date = new Date(article.date)
      const yearMonth = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`
      if (!grouped[yearMonth]) {
        grouped[yearMonth] = []
      }
      grouped[yearMonth].push(article)
    })
    return grouped
  })

  const t = (path) => {
    const keys = path.split('.')
    let value = messages.value
    for (const key of keys) {
      value = value?.[key]
    }
    return value || path
  }

  const getTagName = (tagId) => {
    const tag = tags.value.find(t => t.id === tagId)
    if (!tag) return tagId
    return currentLang.value === 'zh' ? tag.name : tag.nameEn
  }

  const getArticleTitle = (article) => {
    return currentLang.value === 'zh' ? article.title : (article.titleEn || article.title)
  }

  const getArticleExcerpt = (article) => {
    return currentLang.value === 'zh' ? article.excerpt : (article.excerptEn || article.excerpt)
  }

  const loadData = async () => {
    try {
      const response = await fetch('/src/data/articles.json')
      const data = await response.json()
      articles.value = data.articles
      tags.value = data.tags
      carouselImages.value = data.carousel
    } catch (error) {
      console.error('Failed to load data:', error)
    }
  }

  const toggleLang = () => {
    currentLang.value = currentLang.value === 'zh' ? 'en' : 'zh'
    localStorage.setItem('blog-lang', currentLang.value)
  }

  const toggleTheme = () => {
    isDark.value = !isDark.value
    document.documentElement.setAttribute('data-theme', isDark.value ? 'dark' : 'light')
    localStorage.setItem('blog-theme', isDark.value ? 'dark' : 'light')
  }

  const selectTag = (tagId) => {
    selectedTag.value = selectedTag.value === tagId ? null : tagId
  }

  const toggleTagCloud = () => {
    tagCloudCollapsed.value = !tagCloudCollapsed.value
  }

  const setCarouselIndex = (index) => {
    carouselIndex.value = index
  }

  const nextCarousel = () => {
    carouselIndex.value = (carouselIndex.value + 1) % carouselImages.value.length
  }

  const setCurrentArticle = (articleId) => {
    currentArticleId.value = articleId
  }

  const initFromStorage = () => {
    const savedLang = localStorage.getItem('blog-lang')
    const savedTheme = localStorage.getItem('blog-theme')
    
    if (savedLang) {
      currentLang.value = savedLang
    }
    
    if (savedTheme) {
      isDark.value = savedTheme === 'dark'
      document.documentElement.setAttribute('data-theme', savedTheme)
    } else {
      document.documentElement.setAttribute('data-theme', 'dark')
    }
  }

  return {
    articles,
    tags,
    carouselImages,
    selectedTag,
    currentArticleId,
    currentLang,
    isDark,
    carouselIndex,
    tagCloudCollapsed,
    filteredArticles,
    sortedArticles,
    articlesByMonth,
    messages,
    t,
    getTagName,
    getArticleTitle,
    getArticleExcerpt,
    loadData,
    toggleLang,
    toggleTheme,
    selectTag,
    toggleTagCloud,
    setCarouselIndex,
    nextCarousel,
    setCurrentArticle,
    initFromStorage
  }
})

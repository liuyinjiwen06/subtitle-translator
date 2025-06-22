import { MetadataRoute } from 'next'
import { i18nConfig } from '../../i18nConfig'

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://subtitletranslator.cc'
  
  // 页面路径
  const pages = [
    { path: '', priority: 1.0 },
    { path: '/english-subtitle', priority: 0.9 },
    { path: '/chinese-subtitle', priority: 0.9 },
    { path: '/spanish-subtitle', priority: 0.9 },
    { path: '/portuguese-subtitle', priority: 0.9 },
    { path: '/french-subtitle', priority: 0.9 }
  ]
  
  const sitemap: MetadataRoute.Sitemap = []
  
  // 为每个页面和每种语言生成URL
  pages.forEach(page => {
    i18nConfig.locales.forEach(locale => {
      const url = locale === 'en' 
        ? `${baseUrl}${page.path}`
        : `${baseUrl}/${locale}${page.path}`
      
      sitemap.push({
        url,
        lastModified: new Date(),
        changeFrequency: 'weekly',
        priority: page.priority,
      })
    })
  })
  
  return sitemap
} 
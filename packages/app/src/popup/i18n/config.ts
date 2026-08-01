import en from './languages/en.json' with { type: 'json' }
import zhcn from './languages/zh-cn.json' with { type: 'json' }

export const languages: Record<string, Record<string, string>> = {
  en,
  'zh-cn': zhcn
}

export const languageList = [
  {
    label: 'English',
    value: 'en'
  },
  {
    label: '简体中文',
    value: 'zh-cn'
  },
]

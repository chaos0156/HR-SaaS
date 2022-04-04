import Vue from 'vue' // 引入Vue
import VueI18n from 'vue-i18n' // 引入国际化的包
import Cookie from 'js-cookie' // 引入cookie包
import elementEN from 'element-ui/lib/locale/lang/en' // 引入饿了么的英文包
import elementZH from 'element-ui/lib/locale/lang/zh-CN' // 引入饿了么的中文包
import elementJA from 'element-ui/lib/locale/lang/ja' // 引入饿了么的日文包
import elementKO from 'element-ui/lib/locale/lang/ko' // 引入饿了么的韩文包

import customZH from './zh' // 引入自定义的中文包
import customEN from './en' // 引入自定义的英文包
import customJA from './ja'
import customKO from './ko'
Vue.use(VueI18n) // 全局注册国际化包
export default new VueI18n({
  // 中文zh   /  英文en
  locale: Cookie.get('language') || 'zh', // 从cookie中获取语言类型 获取不到就是中文
  messages: {
    en: {
      ...elementEN, // 将饿了么的英文语言包引入
      ...customEN
    },
    zh: {
      ...elementZH, // 将饿了么的中文语言包引入
      ...customZH
    },
    ja: {
      ...elementJA, // 将饿了么的日文语言包引入
      ...customJA
    },
    ko: {
      ...elementKO, // 将饿了么的韩文语言包引入
      ...customKO
    }
  }
})

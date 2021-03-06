import Vue from 'vue'

import ajax from './ajax'
import cube from './cube'
import svgIcon from './svgIcon'
import VueImgLoader from './vueImgLoader'
import calendar from './calendar'

export default {
  install(Vue) {
    Vue.use(ajax)
    Vue.use(svgIcon)
    Vue.use(cube)
    Vue.use(VueImgLoader)
    Vue.use(calendar)
  }
}

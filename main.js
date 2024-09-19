import App from './App'
import Vue from 'vue'
import TuniaoUI from '@/uni_modules/tuniao-ui'
import store from './store'
import './uni.promisify.adaptor'
Vue.config.productionTip = false
App.mpType = 'app'
Vue.use(TuniaoUI)

// 引入TuniaoUI提供的vuex简写方法
let vuexStore = require('./store/$tn.mixin.js')
Vue.mixin(vuexStore)

const app = new Vue({
	store,
  ...App
})

require('./common/request/index')(app)

app.$mount()
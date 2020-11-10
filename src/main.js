// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue';
import App from './App';
import router from './router';
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import VueRouter from 'vue-router';
import 'es6-promise/auto';
import Vuex from 'vuex';
import store from './store'
import axios from 'axios';
import Fragment from 'vue-fragment'
import VCharts from 'v-charts'
//table
import XEUtils from 'xe-utils'
import VXETable from 'vxe-table'
import 'vxe-table/lib/style.css'
//markdown
import { mavonEditor } from "mavon-editor";
import "mavon-editor/dist/css/index.css";


Vue.use(VCharts)
Vue.config.productionTip = false;
Vue.use(ElementUI);
Vue.use(VueRouter);
Vue.use(Vuex);
Vue.prototype.ElementUI = ElementUI;
Vue.prototype.$axios = axios;
Vue.prototype.$store = store;
Vue.use(Fragment.Plugin)
Vue.use(VXETable)
Vue.prototype.$modal = VXETable.modal
Vue.prototype.$XEUtils = XEUtils
Vue.prototype.$cookie = XEUtils.cookie
Vue.component("mavon-editor", mavonEditor);
/**
 * 改变路由重复点击出错
 */
const originalPush = VueRouter.prototype.push
VueRouter.prototype.push = function push(location) {
  return originalPush.call(this, location).catch(err => err)
}

router.beforeEach((to, from, next) => {
  /* 路由发生变化修改页面title */
  if (to.meta.title) {
    document.title = to.meta.title
  }
  if (to.matched.some(record => record.meta.requiresAuth)) {
    //这里判断用户是否登录，验证本地存储是否有token
    if (!localStorage.Authorization) { // 判断当前的token是否存在
      next({
        path: '/login',
        query: { redirect: to.fullPath }
      })
    } else {
      next()
    }
  } else {
    next() // 确保一定要调用 next()
  }
  //获取权限
});
//每次请求加token
axios.interceptors.request.use(
  config => {
    if (localStorage.Authorization) {  // 判断是否存在token，如果存在的话，则每个http header都加上token
      config.headers.Authorization = `${localStorage.Authorization}`;
    }
    return config;
  },
  err => {
    return Promise.reject(err);
  });
//自定义全局指令
Vue.directive('has', {
  inserted: function (el, binding) {
    if (!permissionJudge(binding.value)) {
      el.parentNode.removeChild(el);
    }

    function permissionJudge(value) {
      // 此处store.getters.getMenuBtnList代表vuex中储存的按钮菜单数据
      let list = store.getters.getMenuBtnList;
      for (let item of list) {
        if (item === value) {
          return true;
        }
      }
      return false;
    }
  }
});

VXETable.formats.mixin({
  // 格式化性别
  formatSex ({ cellValue }) {
    return cellValue ? (cellValue === '1' ? '男' : '女') : ''
  },
  // 格式化下拉选项
  formatSelect ({ cellValue }, list) {
    const item = list.find(item => item.value === cellValue)
    return item ? item.label : ''
  },
  // 格式化日期，默认 yyyy-MM-dd HH:mm:ss
  formatDate ({ cellValue }, format) {
    return XEUtils.toDateString(cellValue, format || 'yyyy-MM-dd HH:mm:ss')
  },
  // 四舍五入金额，每隔3位逗号分隔，默认2位数
  formatAmount ({ cellValue }, digits = 2) {
    return XEUtils.commafy(XEUtils.toNumber(cellValue), { digits: digits })
  },
  // 格式化银行卡，默认每4位空格隔开
  formatBankcard ({ cellValue }) {
    return XEUtils.commafy(XEUtils.toString(cellValue), { spaceNumber: 4, separator: ' ' })
  },
  // 四舍五入,默认两位数
  formatFixedNumber ({ cellValue }, digits = 2) {
    return XEUtils.toFixed(XEUtils.round(cellValue, digits), digits)
  },
  // 向下舍入,默认两位数
  formatCutNumber ({ cellValue }, digits = 2) {
    return XEUtils.toFixed(XEUtils.floor(cellValue, digits), digits)
  },
  // 转换 moment 类型为字符串
  toMomentString ({ cellValue }, format) {
    return cellValue ? cellValue.format(format) : ''
  },
})


new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>'
});

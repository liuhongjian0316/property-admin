import Vue from 'vue'
import Router from 'vue-router'
Vue.use(Router)

export default new Router({
  mode:'history',//url去掉#号
  routes: [
    {
      path: '/',
      component: () => import(/* webpackChunkName: "主页" */ '@/view/login/login.vue'),
      meta: { title: '登录' }
    },
    {
      path: '/login',
      component: () => import(/* webpackChunkName: "主页" */ '@/view/login/login.vue'),
      meta: { title: '登录' }
    },
    {
      path: '/sp/shop',
      component: () => import(/* webpackChunkName: "主页" */ '@/view/shopProperties/shop/login/login.vue'),
      meta: { title: '商户登录' }
    },
    {
      path: '/sp/admin/login',
      component: () => import(/* webpackChunkName: "主页" */ '@/view/shopProperties/admin/login/login.vue'),
      meta: { title: '登录' }
    },
    //商户物业 商户物业admin
    {
      path: '/sp/admin/index',
      component: () => import(/* webpackChunkName: "主页" */ '@/view/shopProperties/admin/home/index'),
      meta: { title: '主页' },
      children:[
        {
          path: '/sp/admin/shop',
          component: () => import(/* webpackChunkName: "errerpage" */ '@/view/shopProperties/admin/shop/shop'),
          meta: { title: '商户信息' },
        },
        {
          path: '/sp/admin/worker',
          component: () => import(/* webpackChunkName: "errerpage" */ '@/view/shopProperties/admin/worker/worker'),
          meta: { title: '员工信息' },
        },
        {
          path: '/sp/admin/workordertype',
          component: () => import(/* webpackChunkName: "errerpage" */ '@/view/shopProperties/admin/worker/orderType.vue'),
          meta: { title: '工单类型' },
        },
        {
          path: '/sp/admin/workertype',
          component: () => import(/* webpackChunkName: "errerpage" */ '@/view/shopProperties/admin/worker/repairType'),
          meta: { title: '维修员类型' },
        },
        {
          path: '/sp/admin/organize',
          component: () => import(/* webpackChunkName: "errerpage" */ '@/view/shopProperties/admin/organize/organize'),
          meta: { title: '组织信息' },
        },
        {
          path: '/sp/admin/console',
          component: () => import(/* webpackChunkName: "errerpage" */ '@/view/shopProperties/admin/home/console'),
          meta: { title: '控制台' },
        },
      ]
    },
    {
      path: '/sp/shop/login',
      component: () => import(/* webpackChunkName: "主页" */ '@/view/shopProperties/shop/login/login.vue'),
      meta: { title: '登录' }
    },
    //商户物业 商户模块
    {
      path: '/sp/shop/index',
      component: () => import(/* webpackChunkName: "主页" */ '@/view/shopProperties/shop/home/index'),
      meta: { title: '主页' },
      children:[
        {
          path: '/sp/shop/notice',
          component: () => import(/* webpackChunkName: "errerpage" */ '@/view/shopProperties/shop/notice/notice'),
          meta: { title: '通知' },
        },
        {
          path: '/sp/shop/console',
          component: () => import(/* webpackChunkName: "errerpage" */ '@/view/shopProperties/shop/home/console'),
          meta: { title: '控制台' },
        },
        {
          path: '/sp/shop/repairApply',
          component: () => import(/* webpackChunkName: "errerpage" */ '@/view/shopProperties/shop/workflow/repairApply'),
          meta: { title: '维修申请' },
        },
        {
          path: '/sp/shop/hanlding',
          component: () => import(/* webpackChunkName: "errerpage" */ '@/view/shopProperties/shop/workflow/handling'),
          meta: { title: '正在处理' },
        },
        {
          path: '/sp/shop/finished',
          component: () => import(/* webpackChunkName: "errerpage" */ '@/view/shopProperties/shop/workflow/finished'),
          meta: { title: '已完成' },
        },
        {
          path: '/sp/shop/tel/handling',
          component: () => import(/* webpackChunkName: "errerpage" */ '@/view/shopProperties/shop/workflow/telOrder/handling'),
          meta: { title: '电话报修' },
        },
        {
          path: '/sp/shop/tel/finished',
          component: () => import(/* webpackChunkName: "errerpage" */ '@/view/shopProperties/shop/workflow/telOrder/finished'),
          meta: { title: '已完成' },
        },
        {
          path: '/sp/shop/reward/repairApply',
          component: () => import(/* webpackChunkName: "errerpage" */ '@/view/shopProperties/shop/workflow/reward/repairApply'),
          meta: { title: '发布抢单' },
        },{
          path: '/sp/shop/reward/handling',
          component: () => import(/* webpackChunkName: "errerpage" */ '@/view/shopProperties/shop/workflow/reward/handling'),
          meta: { title: '正在进行' },
        },
        ,{
          path: '/sp/shop/reward/finished',
          component: () => import(/* webpackChunkName: "errerpage" */ '@/view/shopProperties/shop/workflow/reward/finished'),
          meta: { title: '已完成' },
        }
      ]
    },
    {
      path: '/sp/service/login',
      component: () => import(/* webpackChunkName: "主页" */ '@/view/shopProperties/service/login/login'),
      meta: { title: '登录' }
    },
    //客服模块
    {
      path: '/sp/service/index',
      component: () => import(/* webpackChunkName: "主页" */ '@/view/shopProperties/service/home/index'),
      meta: { title: '主页' },
      children:[
        {
          path: '/sp/service/repairApply',
          component: () => import(/* webpackChunkName: "errerpage" */ '@/view/shopProperties/service/workflow/repairApply'),
          meta: { title: '电话报修' },
        },{
          path: '/sp/service/notice',
          component: () => import(/* webpackChunkName: "errerpage" */ '@/view/shopProperties/service/workflow/notice.vue'),
          meta: { title: '发布公告' },
        },
      ]
    },
    {
      path: '/sp/repair/login',
      component: () => import(/* webpackChunkName: "主页" */ '@/view/shopProperties/repairworker/login/login'),
      meta: { title: '登录' }
    },
    //维修员模块
    {
      path: '/sp/repair/index',
      component: () => import(/* webpackChunkName: "主页" */ '@/view/shopProperties/repairworker/home/index'),
      meta: { title: '主页' },
      children:[
        {
          path: '/sp/repair/notice',
          component: () => import(/* webpackChunkName: "errerpage" */ '@/view/shopProperties/repairworker/notice/notice'),
          meta: { title: '公告' },
        },
        {
          path: '/sp/repair/untreat',
          component: () => import(/* webpackChunkName: "errerpage" */ '@/view/shopProperties/repairworker/workflow/untreat'),
          meta: { title: '待办' },
        }, {
          path: '/sp/repair/grabOrder',
          component: () => import(/* webpackChunkName: "errerpage" */ '@/view/shopProperties/repairworker/workflow/grabOrder/grabOrder'),
          meta: { title: '抢单' },
        }, {
          path: '/sp/repair/hanlding',
          component: () => import(/* webpackChunkName: "errerpage" */ '@/view/shopProperties/repairworker/workflow/grabOrder/hanlding'),
          meta: { title: '正在处理' },
        },
        {
          path: '/sp/repair/handling',
          component: () => import(/* webpackChunkName: "errerpage" */ '@/view/shopProperties/repairworker/workflow/handling'),
          meta: { title: '正在处理' },
        },
        {
          path: '/sp/repair/recall',
          component: () => import(/* webpackChunkName: "errerpage" */ '@/view/shopProperties/repairworker/workflow/recall'),
          meta: { title: '撤单申请' },
        },
        {
          path: '/sp/repair/console',
          component: () => import(/* webpackChunkName: "errerpage" */ '@/view/shopProperties/repairworker/home/console'),
          meta: { title: '控制台' },
        },
      ]
    },
    {
      path: '/sp/manager/login',
      component: () => import(/* webpackChunkName: "主页" */ '@/view/shopProperties/manager/login/login'),
      meta: { title: '登录' }
    },
    //内部员工模块
    {
      path: '/sp/manager/index',
      component: () => import(/* webpackChunkName: "主页" */ '@/view/shopProperties/manager/home/index'),
      meta: { title: '主页' },
      children:[
        {
          path: '/sp/manager/untreat',
          component: () => import(/* webpackChunkName: "errerpage" */ '@/view/shopProperties/manager/workflow/untreat'),
          meta: { title: '待办' },
        },

        {
          path: '/sp/manager/refusedaudit',
          component: () => import(/* webpackChunkName: "errerpage" */ '@/view/shopProperties/manager/workflow/refusedaudit'),
          meta: { title: '拒单审核' },
        },
        {
          path: '/sp/manager/unreinforce',
          component: () => import(/* webpackChunkName: "errerpage" */ '@/view/shopProperties/manager/workflow/unreinforce'),
          meta: { title: '增援处理' },
        },

        {
          path: '/sp/manager/tel/untreat',
          component: () => import(/* webpackChunkName: "errerpage" */ '@/view/shopProperties/manager/workflow/telOrder/untreat'),
          meta: { title: '电话报修' },
        },{
          path: '/sp/manager/tel/refusedaudit',
          component: () => import(/* webpackChunkName: "errerpage" */ '@/view/shopProperties/manager/workflow/telOrder/refusedaudit'),
          meta: { title: '拒单审核' },
        }
      ]
    },
    {
      path: '/register',
      component: () => import(/* webpackChunkName: "主页" */ '@/view/login/register.vue'),
      meta: { title: '注册' }
    },
    {
      path: '*',
      component: () => import(/* webpackChunkName: "errerpage" */ '@/components/404/404.vue'),
      meta: { title: '404' },
    },
    {
      path: '/index',
      component: () => import(/* webpackChunkName: "主页" */ '@/view/home/index.vue'),
      meta: { title: '首页',requiresAuth: true },
      children:[
        {
          path: '/user',
          component: () => import(/* webpackChunkName: "主页" */ '@/view/user/user.vue'),
          meta: { title: '用户管理' },
        },
        {
          path: '/menu',
          component: () => import(/* webpackChunkName: "主页" */ '@/view/menu/menu.vue'),
          meta: { title: '菜单管理' },
        },
        {
          path: '/role',
          component: () => import(/* webpackChunkName: "主页" */ '@/view/role/role.vue'),
          meta: { title: '角色管理' },
        },
        {
          path: '/community',
          component: () => import(/* webpackChunkName: "errerpage" */ '@/view/communityProperties/admin/community/community.vue'),
          meta: { title: '小区信息' },
        },
        {
          path: '/auditcommunity',
          component: () => import(/* webpackChunkName: "errerpage" */ '@/view/communityProperties/admin/community/auditcommunity.vue'),
          meta: { title: '审核小区' },
        },
        {
          path: '/applycompany',
          component: () => import(/* webpackChunkName: "errerpage" */ '@/view/company/applycompany.vue'),
          meta: { title: '申请公司' },
        },
        {
          path: '/auditcompany',
          component: () => import(/* webpackChunkName: "errerpage" */ '@/view/company/auditcompany.vue'),
          meta: { title: '审核公司' },
        },
        {
          path: '/building',
          component: () => import(/* webpackChunkName: "errerpage" */ '@/view/communityProperties/admin/building/building.vue'),
          meta: { title: '楼栋信息' },
        },
        {
          path: '/unit',
          component: () => import(/* webpackChunkName: "errerpage" */ '@/view/communityProperties/admin/unit/unit.vue'),
          meta: { title: '单元信息' },
        },
        {
          path: '/house',
          component: () => import(/* webpackChunkName: "errerpage" */ '@/view/communityProperties/admin/house/house.vue'),
          meta: { title: '房屋信息' },
        },
        {
          path: '/addhouse',
          component: () => import(/* webpackChunkName: "errerpage" */ '@/view/communityProperties/admin/house/addHouse.vue'),
          meta: { title: '添加房屋' },
        },
        {
          path: '/landlords',
          component: () => import(/* webpackChunkName: "errerpage" */ '@/view/communityProperties/admin/landlords/landlords.vue'),
          meta: { title: '业主信息' },
        },
        {
          path: '/landlordsMember',
          component: () => import(/* webpackChunkName: "errerpage" */ '@/view/communityProperties/admin/landlords/landlordsMember.vue'),
          meta: { title: '业主成员' },
        },
      ]
    }
  ]
})

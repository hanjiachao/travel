import Main from '@/view/main'
import parentView from '@/components/parent-view'

/**
 * iview-admin中meta除了原生参数外可配置的参数:
 * meta: {
 *  title: { String|Number|Function }
 *         显示在侧边栏、面包屑和标签栏的文字
 *         使用'{{ 多语言字段 }}'形式结合多语言使用，例子看多语言的路由配置;
 *         可以传入一个回调函数，参数是当前路由对象，例子看动态路由和带参路由
 *  hideInBread: (false) 设为true后此级路由将不会出现在面包屑中，示例看QQ群路由配置
 *  hideInMenu: (false) 设为true后在左侧菜单不会显示该页面选项
 *  notCache: (false) 设为true后页面在切换标签后不会缓存，如果需要缓存，无需设置这个字段，而且需要设置页面组件name属性和路由配置的name一致
 *  access: (null) 可访问该页面的权限数组，当前路由设置的权限会影响子路由
 *  icon: (-) 该页面在左侧菜单、面包屑和标签导航处显示的图标，如果是自定义图标，需要在图标名称前加下划线'_'
 *  beforeCloseName: (-) 设置该字段，则在关闭当前tab页时会去'@/router/before-close.js'里寻找该字段名对应的方法，作为关闭前的钩子函数
 * }
 */

export default [
  {
    path: '/login',
    name: 'login',
    meta: {
      title: 'Login - 登录',
      hideInMenu: true
    },
    component: () => import('@/view/login/login.vue')
  },
  {
    path: '/',
    name: '_home',
    redirect: '/home',
    component: Main,
    meta: {
      notCache: true
    },
    children: [
      {
        path: '/home',
        name: 'home',
        meta: {
          hideInMenu: true,
          title: '个人中心',
          notCache: true,
          icon: 'md-home'
        },
        component: () => import('@/view/workbench/index')
        // component: () => import('@/view/aTest/ant-test')
      }
    ]
  },
  {
    path: '/operator',
    name: 'operator',
    component: Main,
    meta: {
      notCache: true
    },
    children: [
      {
        path: 'index',
        name: 'importOrder',
        meta: {
          title: '输单',
          icon: 'ios-brush'
        },
        component: () => import('@/view/operator/index')
      },
      {
        path: 'addGroup',
        name: 'group',
        meta: {
          title: '并团',
          icon: 'ios-brush'
        },
        component: () => import('@/view/operator/addGroup')
      }
    ]
  },
  {
    path: '/financial',
    name: 'financial',
    component: Main,
    meta: {
      notCache: true
    },
    children: [
      {
        path: 'order',
        name: 'audit',
        meta: {
          title: '审核',
          icon: 'ios-brush'
        },
        component: () => import('@/view/financial/order')
      },
      {
        path: 'sales',
        name: 'results',
        meta: {
          title: '业绩',
          icon: 'ios-brush'
        },
        component: () => import('@/view/financial/sales')
      },
      {
        path: 'operators',
        name: 'result',
        meta: {
          title: '业绩',
          icon: 'ios-brush'
        },
        component: () => import('@/view/financial/operators')
      }
    ]
  },
  {
    path: '/sales',
    name: 'sales',
    component: Main,
    meta: {
      notCache: true
    },
    children: [
      {
        path: 'index',
        name: 'index',
        meta: {
          title: '占座',
          icon: 'ios-brush'
        },
        component: () => import('@/view/sales/index')
      },
      {
        path: 'seat',
        name: 'seat',
        meta: {
          title: '业绩',
          icon: 'ios-brush'
        },
        component: () => import('@/view/sales/seat')
      }
    ]
  },
  {
    path: '/resource',
    name: 'resource',
    component: Main,
    meta: {
      notCache: true
    },
    children: [
      {
        path: 'index',
        name: 'community',
        meta: {
          title: '门店管理',
          icon: 'ios-brush'
        },
        component: () => import('@/view/resource/index')
      },
      {
        path: 'course',
        name: 'course',
        meta: {
          title: '线路管理',
          icon: 'ios-brush'
        },
        component: () => import('@/view/resource/course')
      },
      {
        path: 'timer',
        name: 'timer',
        meta: {
          title: '时间管理',
          icon: 'ios-brush'
        },
        component: () => import('@/view/resource/timer')
      },
      {
        path: 'costing',
        name: 'costing',
        meta: {
          title: '成本管理',
          icon: 'ios-brush'
        },
        component: () => import('@/view/resource/costing')
      },
      {
        path: 'seta',
        name: 'seta',
        meta: {
          title: '座位管理',
          icon: 'ios-brush'
        },
        component: () => import('@/view/resource/seta')
      },
      {
        path: 'airlines',
        name: 'airlines',
        meta: {
          title: '航空公司管理',
          icon: 'ios-brush'
        },
        component: () => import('@/view/resource/airlines')
      }
    ]
  },
  {
    path: '/statistical',
    name: 'statistical',
    component: Main,
    meta: {
      notCache: true
    },
    children: [
      {
        path: 'index',
        name: 'tourists',
        meta: {
          title: '游客统计',
          icon: 'ios-brush'
        },
        component: () => import('@/view/statistical/index')
      },
      {
        path: 'profits',
        name: 'profits',
        meta: {
          title: '利润统计',
          icon: 'ios-brush'
        },
        component: () => import('@/view/statistical/profits')
      },
      {
        path: 'andGroup',
        name: 'andGroup',
        meta: {
          title: '并团统计',
          icon: 'ios-brush'
        },
        component: () => import('@/view/statistical/andGroup')
      },
      {
        path: 'seat',
        name: 'seats',
        meta: {
          title: '占座统计',
          icon: 'ios-brush'
        },
        component: () => import('@/view/statistical/seat')
      }
    ]
  },
  {
    path: '/test',
    name: 'test',
    component: Main,
    meta: {
      hideInBread: true
    },
    children: [
      {
        path: 'index',
        name: 'test_index',
        meta: {
          icon: '',
          title: '测试用'
        },
        component: () => import('@/view/aTest/index.vue')
      },
      {
        path: 'collectTest',
        name: 'test_collect',
        meta: {
          icon: '',
          title: '组件收集测试'
        },
        component: () => import('@/view/aTest/component-collect-test.vue')
      },
      {
        path: 'select',
        name: 'test_select',
        meta: {
          icon: '',
          title: '测试用'
        },
        component: () => import('@/view/aTest/select-test.vue')
      },
      {
        path: 'ant',
        name: 'test_ant',
        meta: {
          icon: '',
          title: 'ant测试用'
        },
        component: () => import('@/view/aTest/ant-test.vue')
      },
      {
        path: 'st',
        name: 'searchTest',
        meta: {
          icon: '',
          title: 'search测试'
        },
        component: () => import('@/view/aTest/test.vue')
      }
    ]
  },
  {
    path: '/auth',
    name: 'auth',
    component: Main,
    meta: {
      hideInBread: true
    },
    children: [
      {
        path: 'index',
        name: 'roles',
        meta: {
          icon: '_qq',
          title: '权限管理'
        },
        component: () => import('@/view/auth/index.vue')
      },
      {
        path: 'administrator',
        name: 'admins',
        meta: {
          icon: '_qq',
          title: '管理员管理'
        },
        component: () => import('@/view/auth/administrator.vue')
      }
    ]
  },
  {
    path: '/system',
    name: 'system_index',
    component: Main,
    meta: {
      hideInBread: true
    },
    children: [
      {
        path: 'index',
        name: 'systems',
        meta: {
          icon: '_qq',
          title: '系统设置'
        },
        component: () => import('@/view/system-manage/index.vue')
      }
    ]
  },
  {
    path: '/modifyPass',
    name: 'modifyPass',
    component: Main,
    meta: {
      hideInBread: true
    },
    children: [
      {
        path: 'index',
        name: 'modifyPass_manage',
        meta: {
          icon: '_qq',
          title: '修改密码管理'
        },
        component: () => import('@/view/modifyPass/index.vue')
      }
    ]
  },
  {
    path: '/module',
    name: 'module',
    component: Main,
    meta: {
      hideInBread: true
    },
    children: [
      {
        path: 'index',
        name: 'permissions',
        meta: {
          icon: '_qq',
          title: '模块管理'
        },
        component: () => import('@/view/module/index.vue')
      }
    ]
  },
  {
    path: '/roleList',
    name: 'roleList',
    component: Main,
    meta: {
      hideInBread: true
    },
    children: [
      {
        path: 'index',
        name: 'roles_manage',
        meta: {
          icon: '_qq',
          title: '角色管理'
        },
        component: () => import('@/view/roleList/index.vue')
      }
    ]
  },
  {
    path: '/dictionary',
    name: 'dictionary_index',
    component: Main,
    meta: {
      hideInBread: true
    },
    children: [
      {
        path: 'index',
        name: 'dictionary',
        meta: {
          icon: '_qq',
          title: '字典库管理'
        },
        component: () => import('@/view/dictionary/index.vue')
      }
    ]
  },
  {
    path: '/activities',
    name: 'activities_index',
    component: Main,
    meta: {
      hideInBread: true
    },
    children: [
      {
        path: 'index',
        name: 'activities',
        meta: {
          icon: '_qq',
          title: '活动管理'
        },
        component: () => import('@/view/activities/index.vue')
      }
    ]
  },
  {
    path: '/message',
    name: 'message',
    component: Main,
    meta: {
      hideInBread: true,
      hideInMenu: true
    },
    children: [
      {
        path: 'message_page',
        name: 'message_page',
        meta: {
          icon: 'md-notifications',
          title: '消息中心'
        },
        component: () => import('@/view/single-page/message/index.vue')
      }
    ]
  },
  {
    path: '/excel',
    name: 'excel',
    meta: {
      icon: 'ios-stats',
      title: 'EXCEL导入导出'
    },
    component: Main,
    children: [
      {
        path: 'upload-excel',
        name: 'upload-excel',
        meta: {
          icon: 'md-add',
          title: '导入EXCEL'
        },
        component: () => import('@/view/excel/upload-excel.vue')
      },
      {
        path: 'export-excel',
        name: 'export-excel',
        meta: {
          icon: 'md-download',
          title: '导出EXCEL'
        },
        component: () => import('@/view/excel/export-excel.vue')
      }
    ]
  },
  {
    path: '/tools_methods',
    name: 'tools_methods',
    meta: {
      hideInBread: true
    },
    component: Main,
    children: [
      {
        path: 'tools_methods_page',
        name: 'tools_methods_page',
        meta: {
          icon: 'ios-hammer',
          title: '工具方法',
          beforeCloseName: 'before_close_normal'
        },
        component: () => import('@/view/tools-methods/tools-methods.vue')
      }
    ]
  },
  {
    path: '/error_store',
    name: 'error_store',
    meta: {
      hideInBread: true
    },
    component: Main,
    children: [
      {
        path: 'error_store_page',
        name: 'error_store_page',
        meta: {
          icon: 'ios-bug',
          title: '错误收集'
        },
        component: () => import('@/view/error-store/error-store.vue')
      }
    ]
  },
  {
    path: '/error_logger',
    name: 'error_logger',
    meta: {
      hideInBread: true,
      hideInMenu: true
    },
    component: Main,
    children: [
      {
        path: 'error_logger_page',
        name: 'error_logger_page',
        meta: {
          icon: 'ios-bug',
          title: '错误收集'
        },
        component: () => import('@/view/single-page/error-logger.vue')
      }
    ]
  },
  {
    path: '/directive',
    name: 'directive',
    meta: {
      hideInBread: true
    },
    component: Main,
    children: [
      {
        path: 'directive_page',
        name: 'directive_page',
        meta: {
          icon: 'ios-navigate',
          title: '指令'
        },
        component: () => import('@/view/directive/directive.vue')
      }
    ]
  },
  {
    path: '/argu',
    name: 'argu',
    meta: {
      hideInMenu: true
    },
    component: Main,
    children: [
      {
        path: 'params/:id',
        name: 'params',
        meta: {
          icon: 'md-flower',
          title: route => `{{ params }}-${route.params.id}`,
          notCache: true,
          beforeCloseName: 'before_close_normal'
        },
        component: () => import('@/view/argu-page/params.vue')
      },
      {
        path: 'query',
        name: 'query',
        meta: {
          icon: 'md-flower',
          title: route => `{{ query }}-${route.query.id}`,
          notCache: true
        },
        component: () => import('@/view/argu-page/query.vue')
      }
    ]
  },
  {
    path: '/401',
    name: 'error_401',
    meta: {
      hideInMenu: true
    },
    component: () => import('@/view/error-page/401.vue')
  },
  {
    path: '/500',
    name: 'error_500',
    meta: {
      hideInMenu: true
    },
    component: () => import('@/view/error-page/500.vue')
  },
  {
    path: '*',
    name: 'error_404',
    meta: {
      hideInMenu: true
    },
    component: () => import('@/view/error-page/404.vue')
  }
]

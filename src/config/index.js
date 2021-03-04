export default {
  /**
   * @description 配置显示在浏览器标签的title
   */
  title: '旅游管理',
  /**
   * @description token在Cookie中存储的天数，默认1天
   */
  cookieExpires: 1,
  /**
   * @description 是否使用国际化，默认为false
   *              如果不使用，则需要在路由中给需要在菜单中展示的路由设置meta: {title: 'xxx'}
   *              用来在菜单中显示文字
   */
  useI18n: true,
  /**
   * @description api请求基础路径
   */
  baseUrl: {
    // dev: 'http://api.tjsxqqzgh.com/backend', // .6线下接口
    // dev: 'http://xq.pangukj.com/backend',
    dev: 'http://travel.haozhicheng.weyoui.cn/index.php/',
    // dev: 'http://travel.chenchaoweb.cn/index.php/',
    // dev: 'http://xq-server.com/backend',
    // pro: 'http://travel.chenchaoweb.cn/index.php/'
    pro: 'http://travel.haozhicheng.weyoui.cn/index.php/'
    // pro: 'http://api.tjsxqqzgh.com/backend'
    // pro: 'http://xq.pangukj.com/backend'
  },

  timeout: 5000,
  /**
   * @description 默认打开的首页的路由name值，默认为home
   */
  homeName: 'home',
  /**
   * @description 需要加载的插件
   */
  plugin: {
    'error-store': {
      showInHeader: true, // 设为false后不会在顶部显示错误日志徽标
      developmentOff: true // 设为true后在开发环境不会收集错误信息，方便开发中排查错误
    }
  }
}

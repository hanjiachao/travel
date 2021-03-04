<template>
    <Layout style="height: 100%" class="main">
      <Sider hide-trigger collapsible :width="256" :collapsed-width="64" v-model="collapsed" class="left-sider" :style="{overflow: 'hidden'}">
        <side-menu accordion ref="sideMenu" :active-name="$route.name" :collapsed="collapsed" @on-select="turnToPage" :menu-list="menuList">
          <!-- 需要放在菜单上面的内容，如Logo，写在side-menu标签内部，如下 -->
          <div class="logo-con" @click="$router.push('/home')" style="cursor: pointer">
<!--            <img v-show="!collapsed" :src="maxLogo" key="max-logo" />-->
<!--            <img v-show="collapsed" :src="minLogo" key="min-logo" />-->
          </div>
        </side-menu>
      </Sider>
      <Layout>
      <Header class="header-con">
        <header-bar :collapsed="collapsed" @on-coll-change="handleCollapsedChange">
          <user :message-unread-count="unreadCount" :user-avator="userAvator"/>
          <fullscreen v-model="isFullscreen" style="margin-right: 10px;"/>
        </header-bar>
      </Header>
      <Content class="main-content-con">
        <Layout class="main-layout-con">
          <!--<div class="tag-nav-wrapper">-->
            <!--<tags-nav :value="$route" @input="handleClick" :list="tagNavList" @on-close="handleCloseTag"/>-->
          <!--</div>-->
          <Content class="content-wrapper">
            <keep-alive :include="cacheList">
              <router-view/>
            </keep-alive>
            <ABackTop :height="100" :bottom="80" :right="50" container=".content-wrapper"></ABackTop>
          </Content>
        </Layout>
      </Content>
    </Layout>
  </Layout>
</template>
<script>
import SideMenu from '@/components/main/side-menu'
import HeaderBar from '@/components/main/header-bar'
import TagsNav from '@/components/main/tags-nav'
import User from '@/components/main/user'
import ABackTop from '@/components/main/a-back-top'
import Fullscreen from '@/components/main/fullscreen'
import Language from '@/components/main/language'
import ErrorStore from '@/components/main/error-store'
import { mapMutations, mapActions, mapGetters } from 'vuex'
// import { getNewTagList, getNextRoute, routeEqual } from '@/libs/util'
import minLogo from '@/assets/images/minLogo-xq.png'
import maxLogo from '@/assets/images/maxLogo-xq.png'
import ajax from '@/libs/ajax'
import './main.less'
export default {
  name: 'Main',
  components: {
    SideMenu,
    HeaderBar,
    Language,
    TagsNav,
    Fullscreen,
    ErrorStore,
    User,
    ABackTop
  },
  data () {
    return {
      collapsed: false,
      minLogo,
      maxLogo,
      isFullscreen: false
    }
  },
  computed: {
    ...mapGetters([
      'errorCount'
    ]),
    tagNavList () {
      return this.$store.state.app.tagNavList
    },
    tagRouter () {
      return this.$store.state.app.tagRouter
    },
    userAvator () {
      if (this.$store.state.admin.info) {
        return this.$store.state.admin.info.headimg
      } else {
        return ''
      }
    },
    cacheList () {
      return ['ParentView', ...this.tagNavList.length ? this.tagNavList.filter(item => !(item.meta && item.meta.notCache)).map(item => item.name) : []]
    },
    menuList () {
      let list = this.$store.state.app.menuList
      return list
    },
    local () {
      return this.$store.state.app.local
    },
    hasReadErrorPage () {
      return this.$store.state.app.hasReadErrorPage
    },
    unreadCount () {
      return this.$store.state.user.unreadCount
    },
    overView () {
    }
  },
  methods: {
    ...mapMutations([
      'setBreadCrumb',
      'setTagNavList',
      'addTag',
      'setLocal',
      'setHomeRoute',
      'addMenuList'
    ]),
    ...mapActions([
      'handleLogin',
      'getUnreadMessageCount'
    ]),
    findRoute (route, menuList) {
      if (!menuList) {
        menuList = this.menuList
      }
      for (let item of menuList) {
        if (item.name === route) {
          return item
        } else if (item.children) {
          let result = this.findRoute(route, item.children)
          if (result) {
            return result
          }
        }
      }
      return null
    },
    turnToPage (route) {
      let router = this.findRoute(route)
      let path
      if (router.router_type === 'inline-link') {
        path = `${router.router}`
      }
      this.$router.push({ path })
      this.addTagList()
    },
    addTagList (router) {

    },
    handleCollapsedChange (state) {
      this.collapsed = state
    },
    handleCloseTag (res, type, route) {
      if (type === 'all') {
        this.turnToPage(this.$config.homeName)
      } else if (routeEqual(this.$route, route)) {
        if (type !== 'others') {
          const nextRoute = getNextRoute(this.tagNavList, route)
          this.$router.push(nextRoute)
        }
      }
      this.setTagNavList(res)
    },
    handleClick (item) {
      this.turnToPage(item)
    },
    getMenu () {
      let _this = this
      _this.addMenuList([])
      ajax.get({
        url: '/Api/Login/getMenuList',
        // url: 'permissions',
        userinfo: true
      }).then((res) => {
        _this.addMenuList(res.result.list)
      }).catch((error) => {
        if (error.response.data.errorMsg === '没有权限') {
          _this.addMenuList([])
        }
      })
    }
  },
  watch: {
    '$route' (newRoute) {
      // console.log(newRoute)
      // const { name, query, params, meta/ } = newRoute
      // this.addTag({
      //   route: { name, query, params, meta },
      //   type: 'push'
      // })
      // this.setBreadCrumb(newRoute)
      // this.setTagNavList(getNewTagList(this.tagNavList, newRoute))
      // this.$refs.sideMenu.updateOpenName(newRoute.name)
    }
  },
  created () {
    this.getMenu()
  },
  mounted () {
    /**
     * @description 初始化设置面包屑导航和标签导航
     */
    // this.setTagNavList()
    // this.setHomeRoute(routers)
    // this.addTag({
    //   route: this.$store.state.app.homeRoute
    // })
    // this.setBreadCrumb(this.$route)
    // // 设置初始语言
    // this.setLocal(this.$i18n.locale)
    // // 如果当前打开页面不在标签栏中，跳到homeName页
    // if (!this.tagNavList.find(item => item.name === this.$route.name)) {
    //   this.$router.push({
    //     name: this.$config.homeName
    //   })
    // }
    // 获取未读消息条数
    // this.getUnreadMessageCount()
  }
}
</script>
<style scoped>
  .main .content-wrapper{
    padding: 0;
  }

</style>

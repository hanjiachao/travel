<template>
  <div id="app">
    <router-view v-if="isRouterAlive" />
  </div>
</template>

<script>
export default {
  name: 'App',
  provide () {
    return {
      reload: this.reload
    }
  },
  data () {
    return {
      isRouterAlive: true
    }
  },
  methods: {
    reload () {
      this.isRouterAlive = false
      this.$nextTick(function () {
        this.isRouterAlive = true
      })
    }
  }
}
</script>

<style lang="less">
.el-loading-mask{
  z-index: 500;
}
.ivu-back-top-show{
  display: none!important;
}
.ivu-drawer-wrap{
  z-index: 5000!important;
}
.el-table__row .el-button{
  padding: 0!important;
}
.over-ellipsis{
  overflow:hidden;
  text-overflow:ellipsis;
  white-space:nowrap
}
.over-ellipsis2{
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}
ul,li{
  list-style: none;
}
.ivu-split-pane{
  overflow-y: auto;
}
.ivu-layout-sider{
  width: 230px !important;
  min-width: 230px !important;
  max-width: 230px !important;
  flex: 0 0 230px !important;
}
.ivu-layout-sider-collapsed{
  width: 64px !important;
  min-width: 64px !important;
  max-width: 64px !important;
  flex: 0 0 64px !important;
}
.ivu-notice{
  z-index: 10000!important;
}
.size{
  width: 100%;
  height: 100%;
}
.ivu-back-top-show{
  display: none;
}
html,body{
  .size;
  overflow: hidden;
  margin: 0;
  padding: 0;
}
#app {
  .size;
}
.clear{
  clear: both;
}
.fl{
  float: left;
}
.fr{
  float: right;
}
</style>

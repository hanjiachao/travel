<style scoped>
  .apply-tabs >>> .ivu-tabs-bar{
    background: #fff;
    margin-top: 10px;
  }
  .status-screening >>> .ivu-btn{
    margin-right: 10px;
  }
  .apply-tabs >>> .ivu-tabs-tab{
    padding: 16px!important;
    margin: 0 8px !important;
  }
  .apply-tabs >>> .ivu-tabs-nav-scroll{
    text-align: center;
  }
  .apply-tabs >>> .ivu-tabs-nav{
    float: inherit !important;
    display: inline-block !important;
  }
  .apply-tabs >>> .ivu-tabs-ink-bar{
    left: 8px !important;
  }
  .apply-tabs >>> .ivu-tabs-nav-prev{
    line-height: 49px;
  }
  .apply-tabs >>> .ivu-tabs-nav-next{
    line-height: 49px;
  }
</style>
<template>
  <Tabs class="apply-tabs" @on-click="changeTab">
    <TabPane label="材料申报" v-if="means.hasPermission('apply_material_diffcult')">
      <materail></materail>
    </TabPane>
    <TabPane label="登记表申报" v-if="means.hasPermission('apply_sheet_diffcult')">
      <registration v-if="sheetShow"></registration>
    </TabPane>
  </Tabs>
</template>

<script>
import materail from './material-declaration'
import registration from './registration-declaration'
import means from '@/libs/means'
export default {
  name: 'apply',
  components: {
    materail,
    registration
  },
  data () {
    return {
      sheetShow: false,
      means: means
    }
  },
  methods: {
    changeTab (index) {
      if (index === 1) {
        this.sheetShow = true
      }
    },
    checkAuth () {
      if (!means.hasPermission('apply_material_diffcult') && means.hasPermission('apply_sheet_diffcult')) {
        this.sheetShow = true
      }
    }
  },
  created () {
    this.checkAuth()
  }
}
</script>

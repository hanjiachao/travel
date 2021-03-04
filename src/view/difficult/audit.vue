<style scoped>
  .audit-tabs >>> .ivu-tabs-bar{
    background: #fff;
    margin-top: 10px;
  }
  .status-screening >>> .ivu-btn{
    margin-right: 10px;
  }
  .audit-tabs >>> .ivu-tabs-tab{
    padding: 16px!important;
    margin: 0 8px !important;
  }
  .audit-tabs >>> .ivu-tabs-nav-scroll{
    text-align: center;
  }
  .audit-tabs >>> .ivu-tabs-nav{
    float: inherit !important;
    display: inline-block !important;
  }
  .audit-tabs >>> .ivu-tabs-ink-bar{
    left: 8px !important;
  }
  .audit-tabs >>> .ivu-tabs-nav-prev{
    line-height: 49px;
  }
  .audit-tabs >>> .ivu-tabs-nav-next{
    line-height: 49px;
  }
</style>
<template>
  <Tabs class="audit-tabs" @on-click="changeTab">
    <TabPane v-if="means.hasPermission('audit_matetrial_diffcult')" label="材料审核">
      <materail></materail>
    </TabPane>
    <TabPane v-if="means.hasPermission('audit_sheet_difficult')" label="登记表审核">
      <registration v-if="sheetShow"></registration>
    </TabPane>
  </Tabs>
</template>

<script>
import materail from './material-audit'
import registration from './registration-audit'
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
      if (!means.hasPermission('audit_matetrial_diffcult') && means.hasPermission('audit_sheet_difficult')) {
        this.sheetShow = true
      }
    }
  },
  created () {
    this.checkAuth()
  }
}
</script>

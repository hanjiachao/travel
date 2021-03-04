<style scoped>
  .welfare-tabs{
    overflow: visible;
  }
  .welfare-tabs >>> .ivu-tabs-bar{
    background: #fff;
    margin-top: 10px;
    margin-bottom: 0;
  }
  .status-screening >>> .ivu-btn{
    margin-right: 10px;
  }
  .welfare-tabs >>> .ivu-tabs-tab{
    padding: 16px!important;
    margin: 0 8px !important;
  }
  .welfare-tabs >>> .ivu-tabs-nav-scroll{
    text-align: center;
  }
  .welfare-tabs >>> .ivu-tabs-nav{
    float: inherit !important;
    display: inline-block !important;
  }
  .welfare-tabs >>> .ivu-tabs-ink-bar{
    left: 8px !important;
  }
  .welfare-tabs >>> .ivu-tabs-nav-prev{
    line-height: 49px;
  }
  .welfare-tabs >>> .ivu-tabs-nav-next{
    line-height: 49px;
  }
  .block-up{
    display: none;
  }
</style>
<template>
  <div>
    <Tabs class="welfare-tabs" @on-click="changeTab">
      <TabPane label="已启用">
        <new-welfare @look-records="lookRecords" v-if="currentIndex === 0"></new-welfare>
      </TabPane>
      <TabPane :class="currentIndex === 1 ? '' : 'block-up'" label="已停用">
        <old-welfare @look-records="lookRecords" v-if="currentIndex === 1"></old-welfare>
      </TabPane>
    </Tabs>
    <records-modal ref="recordsModal" :ticket="ticket"></records-modal>
  </div>
</template>

<script>
import newWelfare from './new-welfare'
import oldWelfare from './old-welfare'
import recordsModal from './recordsModal'

export default {
  name: 'welfareIndex',
  components: {
    'new-welfare': newWelfare,
    'old-welfare': oldWelfare,
    'records-modal': recordsModal
  },
  data () {
    return {
      oldShow: false,
      currentIndex: 0,
      ticket: {}
    }
  },
  methods: {
    changeTab (index) {
      this.currentIndex = index
      if (index === 1) {
        this.oldShow = true
      }
    },
    lookRecords (ticket) {
      this.ticket = ticket
      this.$refs.recordsModal.modalShow = true
    }
  },
  created () {
  }
}
</script>

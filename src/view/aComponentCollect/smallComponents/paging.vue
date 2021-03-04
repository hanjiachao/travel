<style scoped lang="less">
  .paging{
    padding: 10px 0;
    line-height: 40px;
    /deep/ .ivu-page-item a{
      font-size: 12px;
    }
  }
</style>
<template>
  <div class="paging" :style="{ textAlign: configObj.align || 'right' }">
    <Page style="display: inline-block; margin-bottom: 0;vertical-align: top;"
          :total="total"
          :page-size="pageSize"
          :show-sizer="configObj.showSize"
          :current="value"
          @on-change="toPage"
          :show-total="configObj.showTotal"
          :show-elevator="configObj.showElevator">
      <div solt>
        <span style="display: inline-block;">
          共{{ total }}条
        </span>
        <div v-if="configObj.refresh"
             style="margin-left: 10px;display: inline-block;vertical-align: top;">
          <Button style="padding: 4px 10px 6px;"
                  type="default"
                  @click="refresh">
            <Icon type="md-refresh" />
          </Button>
        </div>
      </div>
    </Page>
    <!--<div v-if="configObj.showSize" style="padding-left: 13px;line-height: 40px;padding-top: 2px; display: inline-block;vertical-align: top;">-->
      <!--{{ pageSize + '条/页' }}-->
    <!--</div>-->
  </div>
</template>

<script>
export default {
  name: 'paging-collection',
  props: {
    pageSize: {
      type: Number,
      default: 20
    },
    total: {
      type: Number,
      default: 0
    },
    value: {
      type: Number,
      default: 1
    },
    config: {
      type: Object,
      default: () => {}
    }
  },
  methods: {
    toPage (page) {
      this.$emit('on-change', page)
    },
    refresh () {
      this.$emit('refresh')
    }
  },
  computed: {
    configObj () {
      return this.config || {}
    }
  }
}
</script>

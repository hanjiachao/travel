<style scoped lang="less">
  .paging{
    padding: 10px 0;
    /deep/ .ivu-select-default{
      /deep/ .ivu-icon{
        display: none;
      }
      .ivu-select-selected-value{
        padding: 0;
      }
    }
  }
</style>
<template>
  <div class="fr paging">
    <div class="fl">
      <Page :total="total" :page-size="pageSize" :current="value" @on-change="toPage" show-total></Page>
    </div>
    <div class="fl" style="padding-left: 13px;line-height: 31px;padding-top: 2px;">
      {{ pageSize + '条/页' }}
    </div>
  </div>
</template>

<script>
export default {
  name: 'paging',
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
    }
  },
  data () {
    return {
    }
  },
  methods: {
    toPage (page) {
      this.$emit('on-change', page)
    }
  }
}
</script>

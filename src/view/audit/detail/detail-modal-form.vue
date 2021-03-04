<style scoped lang="less">
  .item-info{
    display: inline-block;
    width: 50%;
    font-size: 14px;
    min-height: 30px;
    margin-top: 10px;
    .label{
      display: inline-block;
      color: #99a9bf;
      box-sizing: border-box;
      padding: 0 10px;
      vertical-align: top;
    }
    .value{
      vertical-align: top;
      display: inline-block;
      word-break: break-all;
      .image-info{
        width: 40px;
        margin-right: 6px;
        cursor: pointer;
      }
    }
  }
</style>
<style scoped>
  .card-body{
    padding: 15px;
  }
  .card-list >>> .ivu-card-body{
    padding: 0;
  }
  .card-title{
    color: #4C8BD5;
    font-size: 15px;
    cursor: pointer;
  }
  .card-title .title-icon{
    color: #666;
    float: right;
  }
</style>
<template>
  <div>
    <ul>
      <li class="item-info" v-for="(infoItem, infoIndex) in itemList" :key="infoIndex">
        <div class="label"
             :style="{
               width: infoItem.labelWidth || hideItem.labelWidth || '120px',
               textAlign: infoItem.labelPosition || hideItem.labelPosition || 'right'
             }">
          {{ infoItem.label + ':' }}
        </div>
        <div class="value"
             :style="{
                width: infoItem.labelWidth ?  'calc(100% - ' + infoItem.labelWidth + ')' : hideItem.labelWidth ? 'calc(100% - ' + hideItem.labelWidth + ')' : 'calc(100% - 120px)'
             }">
          <span v-if="infoItem.type === 'imageList' && detail[infoItem.value] && detail[infoItem.value].length > 0" style="display: inline-block">
            <img @click="bigImage(infoItem.label, detail[infoItem.value], imageIndex)" class="image-info" v-for="(image, imageIndex) in detail[infoItem.value]" :key="imageIndex" :src="image">
          </span>
          <span v-else-if="infoItem.type !== 'imageList' && detail[infoItem.value]">{{ detail[infoItem.value] }}</span>
          <span v-else>未填</span>
        </div>
      </li>
    </ul>
  </div>
</template>

<script>
import means from '@/libs/means.js'
export default {
  name: 'detail-modal-form-audit',
  props: {
    hideItem: {
      type: Object,
      default: () => {}
    },
    data: {
      type: Object,
      default: () => {}
    }
  },
  data () {
    return {
      detail: {},
      showHistory: true
    }
  },
  methods: {
    bigImage (title, list, index) {
      this.$emit('big-image', title, list, index)
    }
  },
  computed: {
    itemList () {
      let _this = this
      let itemList = this.hideItem.itemList || []
      itemList.map(item => {
        if (item.decisionBy) {
          if (_this.data[item.decisionBy.valueName]) {
            _this.data[item.value] = item.decisionBy.haveValue
          } else {
            _this.data[item.value] = item.decisionBy.nullValue
          }
        }
      })
      itemList = itemList.filter(item => {
        if (!item.depend || (item.depend && means.checkDepend(item.depend, data))) {
          return item
        }
      })
      _this.detail = { ..._this.data }
      return itemList
    }
  }
}
</script>

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
  .detail-box >>> .ivu-modal-body{
    height: 600px;
    overflow-y: auto;
  }
  .detail-box >>> .ivu-btn-text {
    display: none;
  }
</style>
<template>
  <Modal class="detail-box" :mask-closable="false" width="800" v-model="modalShow" :title="title">
    <div class="card-list">
      <Card v-for="(cardItem, cardIndex) in hideItemForm" :key="cardIndex" style="margin-bottom: 10px;">
        <div slot="title" class="card-title" @click="showCase[cardItem.showCase] = !showCase[cardItem.showCase]">
          {{ cardItem.title }}
          <Icon v-if="showCase[cardItem.showCase]" class="title-icon" type="ios-arrow-down" />
          <Icon v-else class="title-icon" type="ios-arrow-forward" />
        </div>
        <div v-show="showCase[cardItem.showCase]" class="card-body">
          <el-form label-position="right" inline class="demo-table-expand">
            <el-form-item label-width="100px" v-for="(item, index) in cardItem.formItems" :label="item.label + ':'"  :key="index" v-if="data[item.value]">
              <span>{{ data[item.value] || '未填' }}</span>
            </el-form-item>
          </el-form>
        </div>
      </Card>
    </div>
  </Modal>
</template>

<script>
export default {
  name: 'registration-detail',
  props: {
    hideItem: {
      type: Array,
      default: () => []
    },
    data: {
      type: Object,
      default: () => {}
    },
    title: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      modalShow: false,
      showCase: {},
      imageInfo: {}
    }
  },
  methods: {
  },
  computed: {
    hideItemForm () {
      let _this = this
      let forms = _this.hideItem
      let showCase = {}
      forms.map(cardItem => {
        if (cardItem.defaultCase) {
          showCase[cardItem.showCase] = true
        } else {
          showCase[cardItem.showCase] = false
        }
        return cardItem
      })
      _this.showCase = { ...showCase }
      return forms
    }
  }
}
</script>

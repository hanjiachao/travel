<style scoped>
  .card-body{
    padding: 15px;
    position: relative;
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
<style scoped lang="less">
  .card-list{
    .card-item{
      margin-bottom: 10px;
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
      .inline-card{
        width: 100%;
      }
    }
  }
  .tans-info{
    .arrow{
      margin-top: 40px;
    }
    .trans-item{
      padding: 5px 10px;
      .label{
        color: #99a9bf;
      }
    }
  }
</style>
<template>
  <div class="card-list">
    <Card class="card-item" v-for="(cardItem, cardIndex) in hideItemList" :key="cardIndex">
      <div slot="title" class="card-title" @click="showCase[cardItem.showCase] = !showCase[cardItem.showCase]">
        {{ cardItem.title }}
        <Icon v-if="showCase[cardItem.showCase]" class="title-icon" type="ios-arrow-down" />
        <Icon v-else class="title-icon" type="ios-arrow-forward" />
      </div>
      <div v-show="showCase[cardItem.showCase]" class="card-body">
        <div v-for="(infoItem, infoIndex) in cardItem.formItems" :key="infoIndex" class="item-info" :style="{ width: infoItem.allCol ? '100%' : '50%' }" :class="infoItem.inlineCard ? 'inline-card' : ''">
          <div v-if="infoItem.type === 'card'">
            <Card class="card-item">
              <div slot="title" class="card-title" @click="showCase[infoItem.showCase] = !showCase[infoItem.showCase]">
                {{ infoItem.title }}
                <Icon v-if="showCase[infoItem.showCase]" class="title-icon" type="ios-arrow-down" />
                <Icon v-else class="title-icon" type="ios-arrow-forward" />
              </div>
              <div v-show="showCase[infoItem.showCase]" class="card-body">
                <Card v-if="means.getKeyValue(infoItem.value, detail) && means.getKeyValue(infoItem.value, detail).length > 0" class="card-item" v-for="(inlineCardInfo, inlineCardIndex) in means.getKeyValue(infoItem.value, detail)" :key="inlineCardIndex">
                  <div class="card-body">
                    <div class="item-info" v-for="(inlineItem, inlineItemIndex) in infoItem.formItems" :key="inlineItemIndex">
                      <div class="label"
                           :style="mylabelStyle(infoItem, cardItem, hideItem, infoItem.labelStyle)">
                        {{ inlineItem.label + ':' }}
                      </div>
                      <div class="value"
                           :style="myValueStyle(infoItem, cardItem, hideItem, infoItem.valueStyle)">
                        <span v-if="inlineCardInfo[inlineItem.value]">{{ inlineCardInfo[inlineItem.value] }}</span>
                        <span v-else>未填</span>
                      </div>
                    </div>
                  </div>
                </Card>
                <div v-if="!means.getKeyValue(infoItem.value, detail) || means.getKeyValue(infoItem.value, detail).length < 1" style="line-height: 100px; text-align: center; color: #888;">
                  该项未填
                </div>
              </div>
            </Card>
          </div>
          <div v-else>
            <div class="label"
                 :style="mylabelStyle(infoItem, cardItem, hideItem, infoItem.labelStyle)">
              {{ infoItem.label + ':' }}
            </div>
            <div class="value"
                 :style="myValueStyle(infoItem, cardItem, hideItem, infoItem.valueStyle)">
              <span v-if="infoItem.type === 'imageList' && means.getKeyValue(infoItem.value, detail) && means.getKeyValue(infoItem.value, detail).length > 0">
                {{ 111 }}
                <img @click="bigImage(infoItem.label, means.getKeyValue(infoItem.value, detail), imageIndex)" class="image-info" v-for="(image, imageIndex) in means.getKeyValue(infoItem.value, detail)" :key="imageIndex" :src="image">
              </span>
              <span v-else-if="infoItem.type !== 'imageList' && means.getKeyValue(infoItem.value, detail)">{{ means.getKeyValue(infoItem.value, detail) + (infoItem.extraText ? getExtraText(infoItem) : '') }}</span>
              <span v-else>未填</span>
            </div>
          </div>
        </div>
      </div>
    </Card>
  </div>
</template>

<script>
import means from '@/libs/means.js'
export default {
  name: 'detail-modal-card-audit-collection',
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
  components: {
  },
  data () {
    return {
      means: means,
      showCase: {},
      showRecord: false,
      detail: {}
    }
  },
  methods: {
    getExtraText (item) {
      if (means.getKeyValue(item.extraText.depend.valueName, this.data) === item.extraText.depend.value) {
        return item.extraText.text
      }
      return ''
    },
    mylabelStyle (infoItem, cardItem, hideItem, style) {
      let styleObj = {
        width: infoItem.labelWidth || cardItem.labelWidth || hideItem.labelWidth || '120px',
        textAlign: infoItem.labelPosition || cardItem.labelPosition || hideItem.labelPosition || 'right'
      }
      if (style) {
        Object.assign(styleObj, style)
      }
      return styleObj
    },
    myValueStyle (infoItem, cardItem, hideItem, style) {
      let styleObj = {
        width: infoItem.labelWidth ?  'calc(100% - ' + infoItem.labelWidth + ')' : cardItem.labelWidth ? 'calc(100% - ' + cardItem.labelWidth + ')' : hideItem.labelWidth ? 'calc(100% - ' + hideItem.labelWidth + ')' : 'calc(100% - 120px)'
      }
      if (style) {
        Object.assign(styleObj, style)
      }
      return styleObj
    },
    bigImage (title, list, index) {
      this.$emit('big-image', title, list, index)
    }
  },
  computed: {
    hideItemList () {
      let _this = this
      let cardList = JSON.parse(JSON.stringify(_this.hideItem.itemList))
      let data = JSON.parse(JSON.stringify(_this.data))
      let showCase = {}
      cardList = cardList.filter(card => {
        showCase[card.showCase] = card.defaultCase || false
        if (card.type === 'trans') {
          return card
        }
        let formItems = card.formItems.filter(item => {
          if (item.groupBy) {
            let value = []
            let joinBy = item.joinBy || ''
            for (let i in item.groupBy) {
              if (means.getKeyValue(item.groupBy[i], data)) {
                value.push(means.getKeyValue(item.groupBy[i], data))
              }
            }
            if (value.length > 0) {
              data[item.value] = value.join(joinBy)
            } else {
              data[item.value] = ''
            }
          }
          if (item.decisionBy) {
            if (data[item.decisionBy.valueName]) {
              data[item.value] = item.decisionBy.haveValue
            } else {
              data[item.value] = item.decisionBy.nullValue
            }
          }
          if (item.type === 'card') {
            showCase[item.showCase] = item.defaultCase || false
          }
          if (!item.depend || means.checkDepend(item.depend, data)) {
            return item
          }
        })
        card.formItems = formItems
        return card
      })
      _this.showCase = showCase
      _this.detail = data
      return cardList
    }
  }
}
</script>

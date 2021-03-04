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
<style scoped lang="less">
  .card-list{
    .card-item{
      margin-bottom: 10px;
      .item-info{
        display: inline-block;
        width: 50%;
        font-size: 14px;
        line-height: 40px;
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
            height: 40px;
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
        <div v-for="(infoItem, infoIndex) in cardItem.formItems" :key="infoIndex" class="item-info" :class="infoItem.inlineCard ? 'inline-card' : ''">
          <div v-if="infoItem.inlineCard && infoItem.valueType === 'array'">
            <Card v-if="means.getKeyValue(infoItem.value, detail) && means.getKeyValue(infoItem.value, detail).length > 0" class="card-item">
              <div slot="title" class="card-title" @click="showCase[infoItem.showCase] = !showCase[infoItem.showCase]">
                {{ infoItem.title }}
                <Icon v-if="showCase[infoItem.showCase]" class="title-icon" type="ios-arrow-down" />
                <Icon v-else class="title-icon" type="ios-arrow-forward" />
              </div>
              <div v-show="showCase[infoItem.showCase]" class="card-body">
                <Card v-if="means.getKeyValue(infoItem.value, detail) && means.getKeyValue(infoItem.value, detail).length > 1" class="card-item" v-for="(inlineCardInfo, inlineCardIndex) in means.getKeyValue(infoItem.value, detail)" :key="inlineCardIndex">
                  <div class="card-body">
                    <div class="item-info" v-for="(inlineItem, inlineItemIndex) in infoItem.inlineItems" :key="inlineItemIndex">
                      <div class="label"
                           :style="{
                               width: infoItem.labelWidth || cardItem.labelWidth || hideItem.labelWidth || '120px',
             textAlign: infoItem.labelPosition || cardItem.labelPosition || hideItem.labelPosition || 'right'
                             }">
                        {{ inlineItem.label + ':' }}
                      </div>
                      <div class="value"
                           :style="{
                              width: infoItem.labelWidth ?  'calc(100% - ' + infoItem.labelWidth + ')' : cardItem.labelWidth ? 'calc(100% - ' + cardItem.labelWidth + ')' : hideItem.labelWidth ? 'calc(100% - ' + hideItem.labelWidth + ')' : 'calc(100% - 120px)'
                           }">
                        <span v-if="inlineCardInfo[inlineItem.value]">{{ inlineCardInfo[inlineItem.value] }}</span>
                        <span v-else>未填</span>
                      </div>
                    </div>
                  </div>
                </Card>
                <div v-else class="item-info" v-for="(inlineItem, inlineItemIndex) in infoItem.inlineItems" :key="inlineItemIndex">
                  <div class="label"
                       :style="{
                               width: infoItem.labelWidth || cardItem.labelWidth || hideItem.labelWidth || '120px',
             textAlign: infoItem.labelPosition || cardItem.labelPosition || hideItem.labelPosition || 'right'
                             }">
                    {{ inlineItem.label + ':' }}
                  </div>
                  <div class="value"
                       :style="{
                         width: infoItem.labelWidth ?  'calc(100% - ' + infoItem.labelWidth + ')' : cardItem.labelWidth ? 'calc(100% - ' + cardItem.labelWidth + ')' : hideItem.labelWidth ? 'calc(100% - ' + hideItem.labelWidth + ')' : 'calc(100% - 120px)'
                         }">
                    <span v-if="inlineCardInfo[inlineItem.value]">{{ inlineCardInfo[inlineItem.value] }}</span>
                    <span v-else>未填</span>
                  </div>
                </div>
              </div>
            </Card>
          </div>
          <div v-else>
            <div class="label"
                 :style="{
             width: infoItem.labelWidth || cardItem.labelWidth || hideItem.labelWidth || '120px',
             textAlign: infoItem.labelPosition || cardItem.labelPosition || hideItem.labelPosition || 'right'
           }">
              {{ infoItem.label + ':' }}
            </div>
            <div class="value"
                 :style="{
              width: infoItem.labelWidth ?  'calc(100% - ' + infoItem.labelWidth + ')' : cardItem.labelWidth ? 'calc(100% - ' + cardItem.labelWidth + ')' : hideItem.labelWidth ? 'calc(100% - ' + hideItem.labelWidth + ')' : 'calc(100% - 120px)'
           }">
            <span v-if="infoItem.type === 'imageList' && means.getKeyValue(infoItem.value, detail) && means.getKeyValue(infoItem.value, detail).length > 0">
              <img @click="bigImage(infoItem.label, means.getKeyValue(infoItem.value, detail), imageIndex)" class="image-info" v-for="(image, imageIndex) in means.getKeyValue(infoItem.value, detail)" :key="imageIndex" :src="image">
            </span>
              <span v-else-if="infoItem.type !== 'imageList' && means.getKeyValue(infoItem.value, detail)">{{ means.getKeyValue(infoItem.value, detail) }}</span>
              <span v-else>未填</span>
            </div>
          </div>
        </div>
      </div>
    </Card>
  </div>
</template>

<script>
import means from '../../libs/means.js'
export default {
  name: 'detail-modal-card',
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
      means: means,
      showCase: {},
      detail: {}
    }
  },
  methods: {
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
        let formItems = card.formItems.filter(item => {
          if (item.decisionBy) {
            if (data[item.decisionBy.valueName]) {
              data[item.value] = item.decisionBy.haveValue
            } else {
              data[item.value] = item.decisionBy.nullValue
            }
          }
          if (item.inlineCard) {
            showCase[item.showCase] = item.defaultCase || false
          }
          if (!item.depend || (item.depend && means.checkDepend(item.depend, data))) {
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

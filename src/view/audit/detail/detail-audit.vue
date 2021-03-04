<style scoped>
  .no-audit{
    text-align: center;
    line-height: 60px;
    font-size: 14px;
  }
  .small-text{
    font-size: 13px;
    line-height: 24px;
  }
  .big-text{
    font-size: 14px;
    line-height: 30px;
    padding-left: 30px;
  }
  .record-content{
    margin-left: 100px;
    padding: 0 50px 0 100px;
    text-align: left;
  }
  .result-img{
    position: absolute;
    top: 50%;
    left: 50px;
    transform: translateY(-50%);
  }
  .record-content .content-item{
    margin-bottom: 0;
  }
</style>
<template>
  <div>
    <Timeline v-if="recordList.length > 0">
      <TimelineItem v-for="(record, recordIndex) in recordList" :key="recordIndex" :color="statusColor[means.getKeyValue(history.resultValue, record)]">
        <div class="small-text" style="padding-bottom: 10px;">
          {{ means.getKeyValue(history.timeValue, record) }}
        </div>
        <Card>
          <div class="result-img">
            <img :src="resultImg[record.result]">
          </div>
          <div class="big-text record-content">
            <p v-if="record.resultType" class="content-item">
              <span>
                审核类型:
              </span>
              {{ record.resultType }}
            </p>
            <p v-for="(item, index) in history.formItems" :key="index" class="content-item">
              <span>
              {{ record.resultType && !item.label ? record.resultType : item.label }}:
            </span>
              {{ means.getKeyValue(item.value, record) || '无' }}
            </p>
          </div>
        </Card>
      </TimelineItem>
    </Timeline>
    <div v-else class="no-audit">
      暂未查询到该申请的审核记录
    </div>
  </div>
</template>

<script>
import ajax from '@/libs/ajax'
import means from '@/libs/means'
import throwed from '../../../assets/images/throw.png'
import rejected from '../../../assets/images/rejected.png'
export default {
  name: 'detail-audit',
  props: {
    history: {
      type: Object,
      default: () => {}
    }
  },
  data () {
    return {
      means: means,
      resultImg: {
        '通过': throwed,
        '驳回': rejected
      },
      statusColor: {
        '通过': 'green',
        '驳回': 'red'
      },
      recordList: []
    }
  },
  methods: {
    getRecord () {
      let _this = this
      this.recordList = []
      let url = this.history.url
      let method = this.history.method || 'get'
      ajax.request({
        url: url,
        method: method,
        userinfo: true
      }).then((res) => {
        let list = res
        let dataPosition = _this.history.dataPosition || ['result']
        for (let i in dataPosition) {
          list = list[dataPosition[i]]
        }
        if (_this.history.groupBy) {
          let data = []
          for (let i in _this.history.groupBy) {
            let groupData = means.getKeyValue(_this.history.groupBy[i], list)
            if (groupData) {
              if (_this.history.groupBy[i] === 'shift_out') {
                for (let j in groupData) {
                  groupData[j].resultType = '转出'
                }
              } else if (_this.history.groupBy[i] === 'shift_in') {
                for (let j in groupData) {
                  groupData[j].resultType = '转入'
                }
              }
              data = data.concat(groupData)
            }
          }
          _this.recordList = data
          return false
        }
        _this.recordList = list
      })
    }
  },
  created () {
  },
  watch: {
    history: {
      handler () {
        if (this.history.url) {
          this.getRecord()
        }
      },
      deep: true
    }
  }
}
</script>

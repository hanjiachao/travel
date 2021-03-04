<style scoped>
  ul,li{
    list-style: none;
  }
  .modal-box >>> .el-table__expanded-cell{
    padding: 20px 10px;
  }
  .demo-table-expand {
    font-size: 0;
  }
  .demo-table-expand >>> label {
    width: 90px;
    color: #99a9bf;
  }
  .demo-table-expand >>> .el-form-item {
    margin-right: 0;
    margin-bottom: 0;
    width: 50%;
  }
  .card-body{
    padding: 15px;
  }
  .card-list >>> .ivu-card-body{
    padding: 0;
  }
  .card-list >>> .ivu-card {
    margin-bottom: 10px;
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
  .modal-box >>> .ivu-modal-body{
    height: 400px;
    overflow-y: auto;
  }
  .modal-box >>> .ivu-btn-text{
    display: none;
  }
</style>
<template>
  <Modal v-if="false" class="modal-box" v-model="modalShow"
         :title="config.title ? config.title : '标题'"
         width="600"
         :mask-closable="false">
    <div class="card-list">
      <Timeline>
        <TimelineItem v-for="(item, itemIndex) in recordItems" :key="itemIndex" :color="timelineColor[item.status]">
          <div class="baseInfo">
            {{ item.aduitTime }}
            {{ item.status }}
          </div>
          <Card>
            <div slot="title" class="card-title" @click="showCase[item.matCase] = !showCase[item.matCase]">
              {{ '申报材料' }}
              <Icon v-if="showCase[item.matCase]" class="title-icon" type="ios-arrow-down" />
              <Icon v-else class="title-icon" type="ios-arrow-forward" />
            </div>
            <div v-show="showCase[item.matCase]" class="card-body">
              <ul>
                <li class="material-item" v-for="(materialItem, materialIndex) in material" :key="materialIndex">
                  <p>
                    {{ paramsMap[materialItem] }}
                  </p>
                  <p>
                    <img style="width: 30px;height: 30px;padding: 5px 10px; cursor: pointer" v-for="(materialImage, imageIndex) in item.material[materialItem]" :src="materialImage" :key="imageIndex">
                  </p>
                </li>
              </ul>
            </div>
          </Card>
          <Card>
            <div slot="title" class="card-title" @click="showCase[item.regCase] = !showCase[item.regCase]">
              {{ '登记表信息' }}
              <Icon v-if="showCase[item.regCase]" class="title-icon" type="ios-arrow-down" />
              <Icon v-else class="title-icon" type="ios-arrow-forward" />
            </div>
            <div v-show="showCase[item.regCase]" class="card-body">
              <ul>
                <li v-for="(regParam, regIndex) in registra" :key="regIndex" style="width: 50%; float: left;" v-if="item.registration[regParam]">
                  <span style="color: #99a9bf;display: inline-block;width: 100px;text-align: right">
                    {{ paramsMap[regParam] }}：
                  </span>
                  {{ item.registration[regParam] }}
                </li>
                <div style="clear: both"></div>
              </ul>
            </div>
          </Card>
          <Card>
            <div slot="title" class="card-title" @click="showCase[item.audCase] = !showCase[item.audCase]">
              {{ '审核信息' }}
              <Icon v-if="showCase[item.audCase]" class="title-icon" type="ios-arrow-down" />
              <Icon v-else class="title-icon" type="ios-arrow-forward" />
            </div>
            <div v-show="showCase[item.audCase]" class="card-body">
              <ul>
                <li v-for="(audParam, audIndex) in auditInfo" :key="audIndex" style="width: 50%; float: left;" v-if="item.audit[audParam]">
                  <span style="color: #99a9bf;display: inline-block;width: 100px;text-align: right">
                    {{ paramsMap[audParam] }}：
                  </span>
                  {{ item.audit[audParam] }}
                </li>
                <div style="clear: both"></div>
              </ul>
            </div>
          </Card>
        </TimelineItem>
      </Timeline>
    </div>
  </Modal>
</template>

<script>
export default {
  name: 'material-record-modal',
  props: {
    config: {
      type: Object,
      default: () => {}
    }
  },
  data () {
    return {
      modalShow: false,
      recordList: [],
      timelineColor: {
        '审核中': 'blue',
        '审核驳回': 'red',
        '审核通过': 'green'
      },
      material: ['material1', 'material2', 'material3'],
      registra: ['name', 'sex', 'age'],
      auditInfo: ['auditPerson', 'auditTime'],
      paramsMap: {
        'name': '姓名',
        'sex': '性别',
        'age': '年龄',
        'auditTime': '审核时间',
        'auditPerson': '审核人',
        'material1': '材料一',
        'material2': '材料二',
        'material3': '材料三'
      },
      baseInfo: ['status', 'aduitTime'],
      showCase: {}
    }
  },
  methods: {
    getRecordList () {
      let recordList = [{
        status: '审核中',
        regCase: 'case1reg',
        matCase: 'case1mat',
        audCase: 'case1aud',
        aduitTime: '2017-05-17',
        registration: {
          name: '任勇',
          sex: '男',
          age: '23'
        },
        audit: {
          auditTime: '2017-05-18',
          auditPerson: '任勇'
        },
        material: {
          material1: ['test', 'test', 'test', 'test', 'test'],
          material2: ['test', 'test', 'test'],
          material3: ['test', 'test', 'test', 'test']
        }
      }, {
        status: '审核驳回',
        regCase: 'case2reg',
        matCase: 'case2mat',
        audCase: 'case2aud',
        aduitTime: '2017-05-18',
        rejectReason: '',
        registration: {
          name: '任勇',
          sex: '男',
          age: '23'
        },
        audit: {
          auditTime: '2017-05-18',
          auditPerson: '任勇'
        },
        material: {
          material1: ['test', 'test', 'test', 'test'],
          material2: ['test', 'test', 'test', 'test'],
          material3: ['test', 'test', 'test', 'test']
        }
      }, {
        status: '审核中',
        regCase: 'case3reg',
        matCase: 'case3mat',
        audCase: 'case3aud',
        aduitTime: '2017-05-20',
        registration: {
          name: '任勇',
          sex: '男',
          age: '23'
        },
        audit: {
          auditTime: '2017-05-18',
          auditPerson: '任勇'
        },
        material: {
          material1: ['test', 'test', 'test', 'test'],
          material2: ['test', 'test', 'test', 'test'],
          material3: ['test', 'test', 'test', 'test']
        }
      }, {
        status: '审核通过',
        regCase: 'case4reg',
        matCase: 'case4mat',
        audCase: 'case4aud',
        aduitTime: '2017-05-22',
        registration: {
          name: '任勇',
          sex: '男',
          age: '23'
        },
        audit: {
          auditTime: '2017-05-18',
          auditPerson: '任勇'
        },
        material: {
          material1: ['test', 'test', 'test', 'test'],
          material2: ['test', 'test', 'test', 'test'],
          material3: ['test', 'test', 'test', 'test']
        }
      }]
      this.recordList = recordList
    }
  },
  computed: {
    recordItems () {
      let recordList = [ ...this.recordList ]
      let _this = this
      let showCase = {}
      recordList.map(item => {
        showCase[item.matCase] = false
        showCase[item.regCase] = false
        showCase[item.audCase] = false
      })
      _this.showCase = { ...showCase }
      return recordList
    }
  },
  watch: {
    config: {
      handler () {
        this.getRecordList()
      },
      deep: true,
      immediate: true
    }
  }
}
</script>

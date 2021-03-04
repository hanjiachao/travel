<style scoped lang="less">
  ul,li{
    list-style: none;
  }
  .add-principal{
    display: block;
    width: 100%
  }
  .act-item{
    padding: 10px;
    width: 50%;
    box-sizing: border-box;
    float: left;
    font-size: 15px;
    line-height: 24px;
    .operation{
      padding: 5px;
      float: right;
      margin-left: 10px;
    }
  }
</style>
<template>
  <div>
    <div style="padding: 20px;">
      <Button class="add-principal" type="success" @click="addSub" size="large">新的活动</Button>
    </div>
    <ul>
      <li class="act-item" v-for="(act, index) in actList" :key="index">
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <span style="font-size: 15px; line-height: 30px">{{ act.name }}</span>
            <Poptip
              style="float: right;"
              transfer
              confirm
              title="确认要删除吗?"
              @on-ok="sendDel(act)"
              ok-text="确定"
              cancel-text="取消">
              <el-button class="operation" type="primary">删除</el-button>
            </Poptip>
            <Poptip
              style="float: right;"
              transfer
              confirm
              title="确认要结束吗?"
              @on-ok="sendFinish"
              ok-text="确定"
              cancel-text="取消">
              <el-button class="operation" :disabled="act.status === '已结束'" @click="finish(act)" type="primary">活动结束</el-button>
            </Poptip>
            <el-button class="operation" @click="edit(act)" type="primary">编辑</el-button>
          </div>
          <div v-for="(param, index) in showParams" :key="index" v-if="act[param]" class="param-item">
            {{ paramsMap[param] + ': ' + act[param] }}
          </div>
        </el-card>
      </li>
      <div style="clear: both"></div>
    </ul>
    <act-drawer ref="addDrawer"></act-drawer>
  </div>
</template>

<script>
import ajax from '@/libs/ajax'
import means from '@/libs/means'
import actDrawer from './actDrawer.vue'
export default {
  name: 'index',
  components: {
    'act-drawer': actDrawer
  },
  data () {
    return {
      means: means,
      paramsMap: {
        name: '活动名称',
        intro: '活动介绍',
        num: '已参与人数',
        startTime: '活动开始时间',
        endTime: '活动结束时间',
        status: '活动状态'
      },
      showParams: ['name', 'intro', 'num', 'startTime', 'endTime', 'status'],
      actList: [{
        name: '夏季凉风',
        intro: '夏天给的福利哦',
        num: 156,
        startTime: '2019-04-27',
        endTime: '2019-05-27',
        status: '正在进行'
      }, {
        name: '冬日暖阳',
        intro: '冬天给的福利哦',
        num: 182,
        startTime: '2019-03-27',
        endTime: '2019-04-27',
        status: '已结束'
      }, {
        name: '金秋助学',
        intro: '秋天给的福利哦',
        num: 198,
        startTime: '2019-05-27',
        endTime: '2019-06-27',
        status: '未开始'
      }]
    }
  },
  methods: {
    getList () {
      let _this = this
      ajax.get({
        url: '',
        userinfo: true,
        params: {
          fr_id: _this.cruuentOrgan.fr_id
        }
      }).then(res => {
        _this.principalList = res.result.list
      })
    },
    sendDel (act) {
      let _this = this
      ajax.post({
        url: '',
        userinfo: true
      }).then(res => {
        _this.getList()
        this.$Notice.success({
          title: '系统提示',
          duration: 3,
          desc: '提交成功'
        })
      }).catch((err) => {
        this.$Notice.error({
          title: '系统提示',
          duration: 3,
          desc: err.errorMessage
        })
      })
    },
    addSub () {
      this.$refs.addDrawer.showDrawer = true
    },
    edit (data) {
    },
    sendFinish () {
    },
    finish (data) {
    }
  },
  created () {
  }
}
</script>

<style scoped>

</style>

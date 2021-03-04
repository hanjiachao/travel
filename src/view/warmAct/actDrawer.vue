<style scoped>
  .drawer-footer{
    width: 100%;
    position: absolute;
    bottom: 0;
    left: 0;
    border-top: 1px solid #e8e8e8;
    padding: 10px 16px;
    text-align: right;
    background: #fff;
    z-index: 1000;
  }
  .drawer-footer >>> .ivu-poptip-body {
    text-align: left;
  }
  .drawer-footer >>> .ivu-poptip-body-content-inner{
    text-align: center;
  }
  .add-drawer >>> .ivu-form-item-label{
    font-size: 15px;
  }
</style>
<template>
  <div>
    <Drawer class="add-drawer" :mask-closable="false"
            title="添加"
            width="800"
            v-model="showDrawer"
            :styles="styles">
      <Form label-position="right" :label-width="100">
        <Row>
          <Col span="12" v-for="(item, index) in formItems" :key="index">
            <formItem :label="item.label">
              <Input size="large" />
            </formItem>
          </Col>
        </Row>
      </Form>
      <Card>
        <div slot="title">
          报名需填字段
        </div>
        <div class="drag-box-card">
          <drag-list :list1.sync="list1" :list2.sync="list2" :dropConClass="dropConClass" @on-change="handleChange">
            <h3 slot="left-title">剩余可选字段</h3>
            <Card class="drag-item" slot="left" slot-scope="left">{{ left.itemLeft.name }}</Card>
            <h3 slot="right-title">已选字段</h3>
            <Card class="drag-item" slot="right" slot-scope="right">{{ right.itemRight.name }}</Card>
          </drag-list>
        </div>
      </Card>
      <div class="drawer-footer">
        <Button style="margin-right: 8px" @click="cancel" :disabled="sending">取消</Button>
        <Poptip :confirm="confirm"
                :title="confirm ? submitTip.title : null"
                :content="submitTip.content"
                @on-ok="sendData">
          <Button type="primary" @click="sumbitForm" :loading="sending">提交</Button>
        </Poptip>
      </div>
    </Drawer>
  </div>
</template>

<script>
import dragList from '_c/drag-list'
export default {
  name: 'actModal',
  components: {
    'drag-list': dragList
  },
  data () {
    return {
      styles: {
        height: 'calc(100% - 55px)',
        overflow: 'auto',
        paddingBottom: '53px',
        position: 'static'
      },
      showDrawer: true,
      list1: [{
        name: '111',
        id: '1'
      }, {
        name: '22222',
        id: '2'
      }, {
        name: '22222',
        id: '3'
      }, {
        name: '22222',
        id: '4'
      }, {
        name: '22222',
        id: '5'
      }, {
        name: '22222',
        id: '6'
      }],
      list2: [],
      dropConClass: {
        left: ['drop-box', 'left-drop-box'],
        right: ['drop-box', 'right-drop-box']
      },
      handleList: [],
      submitTip: {
        content: '',
        title: ''
      },
      confirm: false,
      sending: false
    }
  },
  methods: {
    handleChange ({ src, target, oldIndex, newIndex }) {
      this.handleList.push(`${src} => ${target}, ${oldIndex} => ${newIndex}`)
    },
    sendData () {
    },
    reset () {
    },
    sumbitForm () {
    },
    cancel () {
      this.showDrawer = false
    }
  },
  computed: {
    formItems () {
      return [{
        label: '活动名称'
      }]
    }
  },
  watch: {
    showDrawer: {
      handler () {
        this.reset()
      },
      deep: true,
      immediate: true
    }
  },
  created () {}
}
</script>

<style lang="less">
  .drag-box-card{
    display: inline-block;
    width: 100%;
    height: 560px;
    .drag-item{
      margin: 10px;
    }
    h3{
      padding: 10px 15px;
    }
    .drop-box{
      border: 1px solid #eeeeee;
      height: 455px;
      border-radius: 5px;
    }
    .left-drop-box{
      margin-right: 10px;
    }
    .right-drop-box{
      //
    }
  }
  .handle-log-box{
    display: inline-block;
    margin-left: 20px;
    border: 1px solid #eeeeee;
    vertical-align: top;
    width: 200px;
    height: 500px;
    h3{
      padding: 10px 14px;
    }
    .handle-inner-box{
      height: ~"calc(100% - 44px)";
      overflow: auto;
      p{
        padding: 14px 0;
        margin: 0 14px;
        border-bottom: 1px dashed #eeeeee;
      }
    }
  }
  .res-show-box{
    display: inline-block;
    margin-left: 20px;
    border: 1px solid #eeeeee;
    vertical-align: top;
    width: 350px;
    height: 570px;
  }
</style>

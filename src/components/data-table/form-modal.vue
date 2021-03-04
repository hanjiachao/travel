<style>
  .drawer-index{
    z-index: 5000!important;
  }
</style>
<template>
  <div class="test">
    <Drawer
        :mask-closable="false"
        :title="title"
        v-model="drawShow"
        width="720"
        :styles="styles"
        :mask-style="maskStyle"
        class-name="drawer-index"
    >
      <data-form :config="config" ref="dataForm" :formItems="formItems" :defaultData="defaultData" v-show="drawShow" :sending="sending"></data-form>
      <div class="drawer-footer">
        <Button style="margin-right: 8px" @click="closeModal" :disabled="sending">取消</Button>
        <template v-if="isConfirm">
          <Poptip v-show="confirmShow"
                  :confirm="confirm"
                  :title="confirm ? submitTip.title : null"
                  :content="submitTip.content"
                  @on-ok="sendData"
                  >
            <span @click="stopClick" class="stop-area"><Button type="primary" @click="sumbitForm" :loading="sending">提交</Button></span>
          </Poptip>
          <Button type="primary" @click="sumbitForm" :loading="sending" v-show="!confirmShow">提交</Button>
        </template>
        <el-tooltip manual placement="top" :content="submitTip.content" v-model="confirmShow" v-else>
          <Button type="primary" @click="sumbitForm" :loading="sending">提交</Button>
        </el-tooltip>
      </div>
    </Drawer>
    <Modal v-model="modalShow" :title="title" :mask-closable="false" class="form-modal">
      <data-form :config="config" ref="dataForm" :sending="sending" :formItems="formItems" :defaultData="defaultData" v-if="modalShow"></data-form>
      <div slot="footer" class="modal-footer">
        <Button style="margin-right: 8px" @click="closeModal" :disabled="sending">取消</Button>
        <template v-if="isConfirm">
          <Poptip v-show="confirmShow"
                  :confirm="confirm"
                  :title="confirm ? submitTip.title : null"
                  :content="submitTip.content"
                  @on-ok="sendData"
                 >
            <span @click="stopClick" class="stop-area"><Button type="primary" @click="sumbitForm" :loading="sending">提交</Button></span>
          </Poptip>
          <Button type="primary" @click="sumbitForm" :loading="sending" v-show="!confirmShow">提交</Button>
        </template>
        <el-tooltip manual placement="top" :content="submitTip.content" v-model="confirmShow" v-else>
          <Button type="primary" @click="sumbitForm" :loading="sending">提交</Button>
        </el-tooltip>
      </div>
    </Modal>
  </div>
</template>

<script>
import ajax from '../../libs/ajax'
import dataFrom from './form.vue'
export default {
  name: 'form-modal',
  components: {
    'data-form': dataFrom
  },
  props: {
    config: {
      type: Object,
      default: () => {}
    },
    value: {
      type: Object,
      default: () => {}
    }
  },
  data () {
    return {
      maskStyle: {
        zIndex: 5000
      },
      styles: {
        height: 'calc(100% - 55px)',
        overflow: 'auto',
        paddingBottom: '53px',
        position: 'static'
      },
      clicking: false,
      confirmShow: true,
      modalTempModel: true, // 解决modal先收缩再消失的问题
      sending: false,
      confirm: false,
      submitTip: {
        title: '确认操作?',
        content: '请检查红色提示项'
      }
    }
  },
  methods: {
    stopClick (e) {
      if (this.sending) {
        e.stopPropagation()
      }
    },
    cancel () {
      this.$emit('input', {})
      this.modalTempModel = true
    },
    closeModal () {
      let _this = this
      this.modalTempModel = false
      setTimeout(() => {
        _this.cancel()
      }, 200)
    },
    sumbitForm () {
      let _this = this
      if (this.clicking) {
        return false
      }
      this.clicking = true
      this.$refs['dataForm'].validate((data) => {
        _this.confirm = true
        if (!_this.isConfirm) {
          _this.sendData()
        } else {
          _this.confirmShow = true
        }
        this.clicking = false
      }, (error) => {
        this.submitTip.content = error || '请检查红色提示项'
        _this.confirm = false
        _this.confirmShow = true
        this.clicking = false
      })
    },
    sendData () {
      if (this.config.notSubmit) {
        this.$emit('not-submit')
        return
      }
      if (this.sending) {
        return
      }
      this.sending = true
      let _this = this
      let data = this.$refs.dataForm.getFormData()
      if (this.config && this.config.loadParams) {
        Object.assign(data, this.config.loadParams)
      }
      let method = this.value.method ? this.value.method : 'post'
      ajax.request({
        url: this.value.url,
        userinfo: true,
        data: data,
        method: method,
        finishCallback () {
          _this.sending = false
        }
      }).then((res) => {
        _this.$emit('save-success')
        _this.closeModal()
        this.$Notice.success({
          title: '系统提示',
          duration: 3,
          desc: '提交成功'
        })
      })
    }
  },
  computed: {
    drawShow: {
      get () {
        return this.formItemLength > 5
      },
      set () {
        this.cancel()
      }
    },
    modalShow: {
      get () {
        return this.modalTempModel && this.formItemLength <= 5 && this.formItemLength > 0
      },
      set () {
        this.closeModal()
      }
    },
    formItemLength () {
      return this.formItems.length
    },
    title () {
      return this.value.title || ''
    },
    formItems () {
      return this.value.formItems || []
    },
    defaultData () {
      return this.value.defaultData || {}
    },
    isConfirm () {
      return this.value.confirm !== false
    }
  }
}
</script>
<style scoped>
  .modal-footer >>> .ivu-poptip-body, .drawer-footer >>> .ivu-poptip-body {
    text-align: left;
  }
  .modal-footer >>> .ivu-poptip-body-content-inner, .drawer-footer >>> .ivu-poptip-body-content-inner{
    text-align: center;
  }
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
  .stop-click {
    display: inline-block;
    height: 100%;
  }
  .form-modal >>> .ivu-modal-body{
    max-height: 500px;
    overflow-y: auto;
  }
</style>

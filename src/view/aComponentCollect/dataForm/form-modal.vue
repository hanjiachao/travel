<template>
  <div>
    <Drawer :mask-closable="false"
            :title="title"
            width="900"
            v-model="showDrawer"
            :styles="styles">
      <div>
        <classify-form ref="form" :defaultData="defaultData" :sending="sending" :classifyList="formItems" :config="config"></classify-form>
      </div>
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
import ajax from '@/libs/ajax'
import classifyForm from './classify-form.vue'

export default {
  name: 'form-page-collection',
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
  components: {
    'classify-form': classifyForm
  },
  data () {
    return {
      styles: {
        height: 'calc(100% - 55px)',
        overflow: 'auto',
        paddingBottom: '53px',
        position: 'static'
      },
      submitTip: {
        title: '确认操作?',
        content: '请检查红色提示项'
      },
      confirm: false,
      sending: false,
      clicking: false
    }
  },
  methods: {
    cancel () {
      this.$emit('input', {})
    },
    sendData () {
      this.sending = true
      let _this = this
      let method = this.value.method || 'post'
      let data = this.$refs.form.getFormData()
      if (this.config && this.config.loadParams) {
        Object.assign(data, this.config.loadParams)
      }
      ajax.request({
        url: this.value.url,
        userinfo: true,
        method: method,
        data: data,
        finishCallback () {
          _this.sending = false
        }
      }).then(() => {
        _this.$emit('save-success')
        _this.cancel()
        _this.$Notice.success({
          title: '系统提示',
          duration: 3,
          desc: '提交成功'
        })
      })
    },
    sumbitForm () {
      let _this = this
      if (this.clicking) {
        return false
      }
      this.clicking = true
      this.$refs.form.validate((data) => {
        _this.confirm = true
        _this.clicking = false
      }, () => {
        _this.confirm = false
        _this.clicking = false
      })
    }
  },
  computed: {
    showDrawer: {
      get () {
        return this.fromItemLength > 0
      },
      set () {
        this.cancel()
      }
    },
    title () {
      return this.value.title || ''
    },
    fromItemLength () {
      return this.formItems.length
    },
    formItems () {
      return this.value.formItems || this.value.classify || []
    },
    defaultData () {
      return this.value.defaultData || {}
    }
  }
}
</script>

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
</style>

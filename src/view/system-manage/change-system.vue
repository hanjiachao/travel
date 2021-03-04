<style scoped>
  .modal-box >>> .ivu-poptip-body-content-inner{
    text-align: center;
  }
</style>
<template>
  <Modal :mask-closable="false"
         :title="title"
         class="modal-box"
         v-model="modalShow">
    <form-page ref="fromPage" :config="config" :sending="sending" :defaultData="defaultData" :formItems="formItmes"></form-page>
    <div slot="footer">
      <Button style="margin-right: 5px;" :disabled="sending" @click="cancel">取消</Button>
      <Poptip :confirm="confirm" :transfer="true" title="确认操作?" content="请检查红色提示项" @on-ok="sendData">
        <Button type="primary" @click="submit" :loading="sending">提交</Button>
      </Poptip>
    </div>
  </Modal>
</template>

<script>
import ajax from '../../libs/ajax'
import formPage from './form-page.vue'
export default {
  name: 'change-system',
  components: {
    'form-page': formPage
  },
  props: {
    value: {
      type: Object,
      default: () => {}
    },
    config: {
      type: Object,
      default: () => {}
    }
  },
  data () {
    return {
      sending: false,
      confirm: false,
      tempModel: true,
      clicking: false
    }
  },
  methods: {
    submit () {
      let _this = this
      if (this.clicking) {
        return false
      }
      this.clicking = true
      this.$refs.fromPage.formValidate((data) => {
        _this.confirm = true
        _this.clicking = false
      }, (error) => {
        _this.confirm = false
        _this.clicking = false
      })
    },
    sendData () {
      let _this = this
      let data = this.$refs.fromPage.getData()
      this.sending = true
      let url = 'system/' + data
      ajax.post({
        url: url,
        userinfo: true,
        finishCallback () {
          _this.sending = false
        }
      }).then((res) => {
        _this.cancel()
        _this.$emit('save-success')
        this.$Notice.success({
          title: '系统提示',
          duration: 3,
          desc: '设置成功'
        })
      })
    },
    cancel () {
      this.tempModel = false
      setTimeout(() => {
        this.$emit('input', {})
        this.tempModel = true
      }, 200)
    }
  },
  computed: {
    defaultData () {
      return this.value.defaultData || {}
    },
    bool () {
      return this.formItmes[0].type === 'bool'
    },
    modalShow: {
      get () {
        return this.formLength > 0 && this.tempModel
      },
      set () {
        this.cancel()
      }
    },
    formLength () {
      return this.formItmes.length
    },
    formItmes () {
      return this.value.formItems || []
    },
    title () {
      return this.value.title || ''
    }
  }
}
</script>

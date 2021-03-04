<style scoped>
  .control-panel{
    padding-bottom: 10px;
  }
  .control-panel >>> .fl button{
    margin-right: 10px;
  }
  .control-panel >>> .column-control{
    padding: 0;
  }
  .control-panel >>> .column-control .box{
    padding: 6px 10px;
    display: inline-block;
  }
  .control-panel >>> .column-control .ivu-dropdown-rel{
    height: 30px;
  }
  .stop-click {
    display: inline-block;
    height: 100%;
  }
  .column-show-filter {
    display: inline-block;
    width: 70px;
    text-align: left;
  }
</style>
<template>
    <div class="control-panel">
      <div class="fl">
        <span v-for="(control, controlIndex) in controls" :key="controlIndex" v-if="['multiple', 'none'].indexOf(control.selection) > -1">
          <Button :sending="sending" v-if="control.type === 'form'" :icon="control.icon" :type="control.style || 'default'" @click="showForm(control)">{{ control.title }}</Button>
          <Poptip v-else-if="control.type === 'handle'"
                  title="确认要操作?" placement='right'
                  content="请至少选择一项进行操作"
                  :confirm="confirm"
                  transfer
                  @on-ok="handle(control)">
            <Button :sending="sending" :icon="control.icon" :type="control.style || 'default'">{{ control.title }}</Button>
          </Poptip>
        </span>
      </div>
      <div class="clear"></div>
      <form-modal v-model="forms" :config="config" @save-success="saveSuccess"></form-modal>
    </div>
</template>

<script>
import formModal from './form-page.vue'
import means from '@/libs/means'
export default {
  name: 'control-panel',
  components: {
    'form-modal': formModal
  },
  props: {
    config: {
      type: Object,
      default: () => {}
    },
    controls: {
      type: Array,
      default: () => []
    },
    batchData: {
      type: Array,
      default: () => []
    }
  },
  data () {
    return {
      means: means,
      forms: {},
      singleForms: {},
      sending: false
    }
  },
  methods: {
    showForm (control) {
      let forms = { ...control }
      this.forms = { ...forms }
    },
    handle (control) {
      this.sending = true
      let data = {}
      let list = []
      let url = control.url
      let method = control.method || 'post'
      for (let i in this.batchData) {
        list.push(this.batchData[i][control.batch.value])
      }
      data[control.batch.name] = list
      ajax.request({
        url: url,
        method: method,
        userinfo: true,
        data: data,
        params: data
      })
      console.log(control)
      console.log(this.batchData)
      setTimeout(() => {
        // this.$emit('save-success')
        this.sending = false
      }, 2000)
    },
    saveSuccess () {
      this.$emit('save-success')
    }
  },
  computed: {
    confirm () {
      return this.batchData.length > 0
    }
  }
}
</script>

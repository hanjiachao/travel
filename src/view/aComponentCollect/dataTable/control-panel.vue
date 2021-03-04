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
    padding: 6px 10px 7px;
    display: inline-block;
    float: left;
  }
  .control-panel >>> .column-control .ivu-dropdown-rel{
    height: 30px;
  }
  .control-panel >>> .ivu-btn-default:hover{
    z-index: 900!important;
  }
  .control-panel >>> .ivu-select-dropdown{
    top: 30px;
  }
  .control-panel >>> .column-control .ivu-dropdown-rel{
    height: 30px;
  }
  .control-panel .column-control .arrow-down{
    transition: 0.3s;
  }
  .control-panel .column-control .arrow-down-active{
    transform: rotate(180deg);
  }
</style>
<template>
    <div class="control-panel">
      <div style="float: left;">
        <span v-for="(control, controlIndex) in controls" :key="controlIndex" v-if="['multiple', 'none'].indexOf(control.selection) > -1 && means.hasPermission(control.auth)">
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
      <div style="float: right;">
        <ButtonGroup>
          <Button type="default" v-if="configObj.refresh" @click="refresh">
            <Icon type="md-refresh" />
          </Button>
          <Button v-clickoutside="clickOustSide" v-if="columnFold" @click="columnFilterShow = !columnFilterShow" class="column-control">
            <div class="box">
              <Icon type="ios-list-box"></Icon>
              <Icon type="ios-arrow-down" class="arrow-down" :class="columnFilterShow ? 'arrow-down-active' : ''"></Icon>
            </div>
            <Dropdown style="float: left;" trigger="custom" :visible="columnFilterShow"  placement="bottom-end">
              <DropdownMenu slot="list">
                <CheckboxGroup v-model="showColumns">
                  <DropdownItem v-for="(cItem, cIndex) in showItem" :key="cIndex">
                    <span @click.stop="">
                      <Checkbox :label="cItem.value" :disabled="cItem.hideDisabled">
                        <span style="display: inline-block; width: 70px; text-align: left;">{{ cItem.label }}</span>
                      </Checkbox>
                    </span>
                  </DropdownItem>
                </CheckboxGroup>
              </DropdownMenu>
            </Dropdown>
          </Button>
          <Button v-if="searchAllow" @click="searchShowChange" :type="searchShow?'primary':'default'">
            <Icon type="ios-search" />
          </Button>
        </ButtonGroup>
      </div>
      <div style="clear: both"></div>
      <form-modal v-model="forms" :config="config" @save-success="saveSuccess"></form-modal>
      <single-form v-model="singleForms" :config="config" @save-success="saveSuccess"></single-form>
    </div>
</template>

<script>
import formModal from '../dataForm/form-modal.vue'
import singleForm from '../../../components/data-table/form-modal.vue'
import means from '@/libs/means'
import Clickoutside from 'element-ui/src/utils/clickoutside'

export default {
  name: 'control-panel-collection',
  directives: {
    Clickoutside
  },
  components: {
    'form-modal': formModal,
    'single-form': singleForm
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
    searchs: {
      type: Array,
      default: () => []
    },
    batchData: {
      type: Array,
      default: () => []
    },
    showItem: {
      type: Array,
      default: () => []
    }
  },
  data () {
    return {
      means: means,
      forms: {},
      singleForms: {},
      sending: false,
      searchShow: false,
      showColumns: [],
      columnFilterShow: false,
      columnFold: false
    }
  },
  methods: {
    // 左侧操作按钮
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
      setTimeout(() => {
        this.sending = false
      }, 2000)
    },
    saveSuccess () {
      this.$emit('save-success')
    },
    // 刷新按钮
    refresh () {
      this.$emit('refresh')
    },
    // 打开或收起筛表单
    searchShowChange () {
      this.searchShow = !this.searchShow
      this.$emit('search-show-change', this.searchShow)
    },
    initShowColumns () {
      this.showColumns = this.showItem.filter(item => {
        return !item.hide
      }).map(item => {
        return item.value
      })
    },
    clickOustSide () {
      this.columnFilterShow = false
    }
  },
  computed: {
    confirm () {
      return this.batchData.length > 0
    },
    // 是否展示搜索按钮
    searchAllow () {
      return this.searchs.length > 0
    },
    configObj () {
      return this.config || {}
    }
  },
  watch: {
    showColumns () {
      this.$emit('show-columns-change', this.showColumns)
    }
  },
  created () {
    this.initShowColumns()
  }
}
</script>

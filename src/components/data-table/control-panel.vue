<template>
  <div>
    <div class="control-panel">
      <div class="fl">
        <span v-for="(item, index) in controls" :key="index" v-if="['multiple', 'none'].indexOf(item.selection) > -1">
          <Button :icon="item.icon" :type="item.style || 'default'" :key="index" @click="controlClick(item)" v-if="item.type === 'form'">{{item.title}}</Button>
          <Poptip title="确认要操作?" placement='right' confirm transfer v-else-if="item.type === 'del' || item.type === 'general'" @on-ok="batch(item)">
            <span class="stop-click" @click="stopClick">
              <Button :disabled="item.disabled" :icon="item.icon" :type="item.style || 'default'" :key="index" @click="controlClick(item)">{{item.title}}</Button>
            </span>
          </Poptip>
        </span>
      </div>
      <div style="float: right">
        <ButtonGroup>
          <Button icon="ios-search" @click="searchPanelShowChange" :type="searchPanelShow?'primary':'default'" v-if="search.length > 0"></Button>
          <Button @click="columnFilterShow=!columnFilterShow" class="column-control">
            <div class="fl box">
              <Icon type="ios-list-box"></Icon>
              <Icon type="ios-arrow-down"></Icon>
            </div>
            <Dropdown class="fl" trigger="custom" :visible="columnFilterShow"  placement="bottom-end">
              <DropdownMenu slot="list">
                <CheckboxGroup v-model="showColumns">
                  <DropdownItem v-for="(citem, cindex) in allTableColumns" :key="cindex">
                    <span @click.stop="">
                      <Checkbox :label="citem.value" :disabled="citem.hideDisabled">
                        <span class="column-show-filter">{{citem.key}}</span>
                      </Checkbox>
                    </span>
                  </DropdownItem>
                </CheckboxGroup>
              </DropdownMenu>
            </Dropdown>
          </Button>
        </ButtonGroup>
      </div>
      <div class="clear"></div>
    </div>
    <form-modal :config="config" v-model="formProps" @save-success="saveSuccess"></form-modal>
  </div>
</template>

<script>
import formModal from './form-modal.vue'
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
    options: {
      type: Array,
      default: () => []
    },
    columns: {
      type: Array,
      default: () => []
    },
    search: {
      type: Array,
      default: () => []
    },
    selections: {
      type: Array,
      default: () => []
    },
    primaryKey: {
      type: String,
      default: () => ''
    }
  },
  data () {
    return {
      formProps: {},
      columnFilterShow: false,
      formPanelShow: false,
      searchPanelShow: false,
      showColumns: []
    }
  },
  methods: {
    saveSuccess: function () {
      this.$emit('save-success')
    },
    stopClick () {
    },
    batch (item) {
      let url = item.url
      let primaryKey = this.config.primaryKey
      let selections = this.selections
      let batchArr = []
      for (let i in selections) {
        batchArr.push(selections[i][primaryKey])
      }
      console.log(url)
    },
    controlClick (item) {
      if (item.type === 'form' && item.formItems) {
        let formProps = item
        if (item.selection === 'multiple') {
          formProps.defaultData = {
            [this.primaryKey]: this.selections.map(item => {
              return item[this.primaryKey]
            })
          }
        }
        this.formProps = { ...formProps }
      } else if (item.type === 'del') {

      }
    },
    initShowColumns () {
      this.showColumns = this.columns.filter(item => {
        return !item.hide
      }).map(item => {
        return item.key
      })
    },
    searchPanelShowChange () {
      this.searchPanelShow = !this.searchPanelShow
      this.$emit('search-show-change', this.searchPanelShow)
    },
    checkWhere () {
      let _this = this
      for (let i in _this.options) {
        _this.options[i].disabled = false
        if (_this.options[i].selection === 'multiple' && _this.options[i].where) {
          for (let j in _this.selections) {
            if (!means.checkWhere(_this.options[i].where, _this.selections[j])) {
              _this.options[i].disabled = true
              break
            }
          }
        }
      }
    }
  },
  computed: {
    controls () {
      this.checkWhere()
      return this.options
    },
    allTableColumns () {
      return this.columns.map(item => {
        return {
          key: item.title,
          value: item.key,
          hideDisabled: item.hideDisabled
        }
      })
    }
  },
  watch: {
    columns () {
      this.initShowColumns()
    },
    showColumns () {
      this.$emit('show-columns-change', this.showColumns)
    }
  },
  created () {
    this.initShowColumns()
  }
}
</script>

<style scoped>
  .control-panel{
    padding: 10px 0 15px;
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

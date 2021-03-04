<style scoped lang="less">
  .disabled{
    cursor: not-allowed !important;
    color: #999;
  }
  .frame{
    position: relative;
    .show-part:hover {
      .clear-icon{
        display: inline-block;
      }
    }
    .show-part{
      padding: 0 7px;
      box-sizing: border-box;
      line-height: 34px;
      border: 1px solid #dcdee2;
      border-radius: 4px;
      cursor: pointer;
      background: #fff;
      color: #515a6e;
      .hide-show-icon{
        transform: rotate(180deg);
      }
      .clear-icon{
        position: absolute;
        right: 10px;
        top: 0;
        z-index: 10000;
        display: none;
      }
    }
    .show-part-active{
      border-color: #57a3f3;
    }
    .show-part:hover{
      border-color: #57a3f3;
    }
    .hide-part{
      background: #fff;
      position: absolute;
      left: 0;
      right: 0;
      padding: 10px 0;
      min-width: 200px;
      max-height: 300px;
      overflow-y: auto;
      box-sizing: border-box;
      box-shadow: 0 1px 6px rgba(0, 0, 0, 0.2);
      margin: 5px 0;
      z-index: 10000;
      *{
        margin: 0;
      }
      .hide-list{
        min-height: 30px;
        box-sizing: border-box;
        max-height: 200px;
        overflow-y: auto;
        .hide-item{
          cursor: pointer;
          padding: 0 20px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
        .hide-item:hover{
          background: #f3f3f3;
        }
        .selected-focus{
          color: #2d8cf0;
          background: #f3f3f3;
        }
      }
    }
  }
</style>

<template>
  <div v-clickoutside="handleClose" class="clear frame" id="select-paging-ry">
    <div class="show-part" :class="hidePartShow ? 'show-part-active' : ''" @click="hidePartShow = !hidePartShow">
      <Icon @click="clearSearch" v-if="option && configObj.clearable" color="#808695" class="clear-icon" style="margin-top: 10px;" type="ios-close-circle" />
      <Icon color="#808695" :class="{ 'hide-show-icon': hidePartShow }" style="margin-top: 10px;transition: .3s" class="fr" type="ios-arrow-down" />
      <p :style="{ color: option ? '' : '#c5c8ce' }" style="width: calc(100% - 40px);overflow: hidden; text-overflow: ellipsis;white-space: nowrap;float: left;margin: 0;">
        {{ option || placeholder }}
      </p>
      <div class="clear"></div>
    </div>
    <transition name="el-zoom-in-top">
      <div v-show="hidePartShow" class="hide-part" :style="{ width: configObj.hideWidth || 'auto' }">
        <div style="position: relative">
          <el-tree :show-checkbox="configObj.multiSelect" :data="dataList" :props="defaultProps" :lazy="configObj.lazy" :load="loadNode" @node-click="nodeClick"></el-tree>
          <Spin fix v-if="listLoading"></Spin>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
import ajax from '@/libs/ajax'
import Clickoutside from 'element-ui/src/utils/clickoutside'

export default {
  name: 'tree-select-collection',
  directives: {
    Clickoutside
  },
  props: {
    config: {
      type: Object,
      default: () => {}
    },
    value: {
      default: ''
    },
    placeholder: {
      type: String,
      default: ''
    },
    disabled: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      dataList: [],
      hidePartShow: false,
      listLoading: false,
      option: ''
    }
  },
  methods: {
    getList () {
      this.listLoading = true
      let configObj = this.configObj
      let url = configObj.url
      let method = configObj.method || 'get'
      let data = {}
      if (this.configObj.extraParams) {
        Object.assign(data, this.configObj.extraParams)
      }
      let dataPosition = this.dataPosition
      ajax.request({
        url: url,
        method: method,
        userinfo: true,
        params: data,
        data: data
      }).then(res => {
        let list = res
        for (let i in dataPosition) {
          list = list[dataPosition[i]]
        }
        if (list instanceof Object) {
          list = [list]
        }
        this.dataList = list
        this.listLoading = false
      })
    },
    chooseValue (item) {
      this.option = item.key
      this.$emit('input', item.value)
      this.$emit('get-key', item.key)
      this.hidePartShow = false
    },
    clearSearch (e) {
      this.$emit('input', '')
      e.stopPropagation()
    },
    handleClose () {
      this.hidePartShow = false
    },
    // 懒加载方法
    loadNode (node, resolve) {
    },
    // 选中
    nodeClick (data) {
      this.$emit('input', data[this.valueName])
      this.$emit('get-key', data[this.keyName])
      this.option = data[this.keyName]
      this.hidePartShow = false
    }
  },
  computed: {
    configObj () {
      return this.config || {}
    },
    dataPosition () {
      return this.configObj.dataPosition || ['result']
    },
    keyName () {
      return this.configObj.keyName || 'name'
    },
    valueName () {
      return this.configObj.valueName || 'id'
    },
    childrenMark () {
      return this.configObj.childrenMark || 'children'
    },
    children () {
      return this.configObj.children || 'children'
    },
    defaultProps () {
      return {
        label: this.keyName,
        children: this.children
      }
    }
  },
  watch: {
    value: {
      handler (value) {
        if (!value && value !== 0) {
          this.option = ''
        }
      },
      deep: true,
      immediate: true
    },
    configObj: {
      handler (config) {
        if (!config.lazy && this.configObj.url) {
          this.getList()
        }
      },
      deep: true,
      immediate: true
    }
  }
}
</script>

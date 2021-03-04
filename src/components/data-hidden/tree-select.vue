<style>
  .ant-select-dropdown{
    z-index: 5060!important;
  }
</style>
<template>
    <div>
      <a-tree-select
        style="width: 100%"
        :placeholder="placeholder"
        :treeData="treeData"
        :allowClear="config.allowClear"
        :value="value"
        size="large"
        @change="changeValue"
      >
      </a-tree-select>
    </div>
</template>

<script>
import { TreeSelect } from 'ant-design-vue'
import 'ant-design-vue/dist/antd.css'
import ajax from '@/libs/ajax'
export default {
  name: 'tree-select',
  components: {
    'a-tree-select': TreeSelect
  },
  props: {
    config: {
      type: Object,
      default: () => {}
    },
    value: {
      type: String,
      default: ''
    },
    placeholder: {
      type: String,
      default: ''
    },
    data: {
      type: Object,
      default: () => {}
    }
  },
  data () {
    return {
      treeData: []
    }
  },
  methods: {
    changeValue (value) {
      this.$emit('input', value)
    },
    getTreeData () {
      let _this = this
      let url = this.config.url
      let method = this.config.method || 'get'
      let userinfo = this.config.userinfo || false
      let dataPosition = this.config.dataPosition || ['result']
      ajax.request({
        url: url,
        method: method,
        userinfo: userinfo
      }).then(res => {
        let list = res
        for (let i in dataPosition) {
          list = list[dataPosition[i]]
        }
        list = _this.iteration(list)
        _this.treeData = list
      })
    },
    iteration (list) {
      let _this = this
      let keyName = this.config.keyName || 'id'
      let valueName = this.config.valueName || 'id'
      let titleName = this.config.titleName || 'name'
      let childrenName = this.config.childrenName || 'children'
      list = list.map(item => {
        item.key = item[keyName] + ''
        item.value = item[valueName] + ''
        item.title = item[titleName] + ''
        if (item[childrenName]) {
          item.children = _this.iteration(item[childrenName])
        }
        return item
      })
      return list
    }
  },
  watch: {
    config: {
      handler () {
        if (this.config.url) {
          this.getTreeData()
        }
      },
      deep: true,
      immediate: true
    }
  }
}
</script>

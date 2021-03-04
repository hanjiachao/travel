<template>
  <el-cascader style="width: 100%" clearable @change="giveValue" :props="props" :change-on-select="config.anyLevel" :placeholder="placeholder" size="large" :options="options" :load-data="loadData" v-model="option"></el-cascader>
</template>

<script>
import ajax from '@/libs/ajax'
export default {
  name: 'form-cascader',
  props: {
    config: {
      type: Object,
      default: () => {}
    },
    disabled: {
      type: Boolean,
      default: false
    },
    value: {
      type: Array,
      default: () => []
    },
    placeholder: {
      type: String,
      default: ''
    },
    wordType: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      options: [],
      option: [],
      props: {
        _this: this,
        lazy: true,
        lazyLoad (node, resolve) {
          this._this.loadData(node, resolve)
        }
      }
    }
  },
  methods: {
    getOptions () {
      let _this = this
      if (this.wordType === '') {
        return false
      }
      let url = this.configObj.url || 'dictionary/all/' + this.wordType
      let method = this.configObj.method || 'get'
      let data = this.configObj.data || {}
      ajax.request({
        url: url,
        userinfo: true,
        method: method,
        data: data,
        params: data
      }).then(res => {
        let options = []
        let list = res
        if (_this.configObj.valuePosition) {
          for (let i in _this.configObj.valuePosition) {
            list = list[_this.configObj.valuePositio[i]]
          }
        } else {
          list = res.result
        }
        for (let i in list) {
          let children = []
          if (_this.value[1]) {
            children.push({
              value: _this.value[1],
              label: _this.value[1]
            })
          }
          options.push({
            value: _this.configObj.valueKey ? list[i][_this.configObj.valueKey] : list[i].value,
            label: _this.configObj.labelKey ? list[i][_this.configObj.labelKey] : list[i].key,
            children: children,
            loading: false
          })
        }
        _this.options = options
      }).catch(res => {
        _this.getOptions()
      })
    },
    loadData (item, callback) {
      let _this = this
      item.loading = true
      let url = this.configObj.url || 'dictionary/all/' + item.value
      let method = this.configObj.method || 'get'
      let data = this.configObj.data || {}
      ajax.request({
        url: url,
        userinfo: true,
        method: method,
        data: data,
        params: data
      }).then(res => {
        let options = []
        let list = res
        if (_this.configObj.valuePosition) {
          for (let i in _this.configObj.valuePosition) {
            list = list[_this.configObj.valuePositio[i]]
          }
        } else {
          list = res.result
        }
        for (let i in list) {
          options.push({
            value: _this.configObj.valueKey ? list[i][_this.configObj.valueKey] : list[i].value,
            label: _this.configObj.labelKey ? list[i][_this.configObj.labelKey] : list[i].key
          })
        }
        item.loading = false
        callback(options)
      })
    },
    giveValue (value, selectedData) {
      this.option = value
      this.$emit('input', value)
    }
  },
  computed: {
    configObj () {
      return this.config || {}
    }
  },
  created () {
  },
  watch: {
    wordType: {
      handler () {
        let options = []
        if (this.value[0]) {
          options = [{
            value: this.value[0],
            label: this.value[0]
          }]
        }
        if (this.value[1]) {
          options[0].children = [{
            value: this.value[1],
            label: this.value[1]
          }]
        }
        this.options = JSON.parse(JSON.stringify(options))
        this.option = this.value
        this.getOptions()
      },
      deep: true,
      immediate: true
    }
  }
}
</script>

<style scoped>

</style>

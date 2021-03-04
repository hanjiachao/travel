<template>
    <Select :disabled="disabled" v-model="option"
            :size="configObj.size || 'large'"
            :clearable="configObj.clearable"
            multiple
            @on-change="giveValue"
            :placeholder="placeholder">
      <Option v-for="(option, index) in options" :value="option.value" :key="index">
        {{ option.label }}
      </Option>
    </Select>
</template>

<script>
import ajax from '@/libs/ajax'
export default {
  name: 'form-select-mutli',
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
      default: ''
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
      option: ''
    }
  },
  methods: {
    getOptions () {
      let _this = this
      if (this.wordType === '') {
        return
      }
      if (this.wordType === '是或否') {
        this.options = [{
          value: '是',
          label: '是'
        }, {
          value: '否',
          label: '否'
        }]
        return
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
        let valuePosition = _this.configObj.valuePosition || ['result']
        for (let i in valuePosition) {
          list = list[valuePosition[i]]
        }
        for (let i in list) {
          options.push({
            value: (_this.configObj.valueKey ? list[i][_this.configObj.valueKey] : list[i].value) + '',
            label: _this.configObj.labelKey ? list[i][_this.configObj.labelKey] : list[i].key
          })
        }
        _this.options = options
      })
    },
    giveValue () {
      this.$emit('input', this.option)
    }
  },
  computed: {
    configObj () {
      return this.config || {}
    }
  },
  watch: {
    value: {
      handler () {
        this.option = this.value || []
      },
      deep: true,
      immediate: true
    },
    wordType: {
      handler () {
        // this.options = [{
        //   value: this.value || '',
        //   label: this.value || ''
        // }]
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

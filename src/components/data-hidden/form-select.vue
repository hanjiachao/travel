<template>
    <Select :disabled="disabled" v-model="option"
            :size="configObj.size || 'large'"
            :clearable="configObj.clearable"
            :multiple="configObj.multiple"
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
  name: 'form-select',
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
    optionList: {
      type: Array,
      default: []
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
      this.options = this.optionList
    },
    giveValue () {
      this.$emit('input', this.option)
      this.$emit('change', this.option)
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
        this.option = this.value || ''
      },
      deep: true,
      immediate: true
    },
    wordType: {
      handler () {
        this.options = [{
          value: this.value || '',
          label: this.value || ''
        }]
        this.getOptions()
      },
      deep: true,
      immediate: true
    }
  }
}
</script>

<style scoped>
  Option{padding: 0 15px}
</style>

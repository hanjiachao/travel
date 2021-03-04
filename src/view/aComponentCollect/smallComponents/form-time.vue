<template>
  <div>
    <TimePicker
      :type="timeType || 'time'"
      :format="configObj.format || 'HH:mm:ss'"
      :placeholder="placeholder"
      style="width: 100%;"
      size="large"
      :separator="configObj.separator || '~'"
      :confirm="configObj.confirm"
      @on-change="timeChange"
      v-model="timeValue"
    ></TimePicker>
  </div>
</template>

<script>
export default {
  name: 'form-time',
  props: {
    placeholder: {
      type: String,
      default: ''
    },
    config: {
      type: Object,
      default: () => {}
    },
    timeType: {
      type: String,
      default: 'time'
    },
    value: {}
  },
  data () {
    return {
      timeValue: ''
    }
  },
  methods: {
    timeChange (time) {
      this.$emit('input', time)
      this.$emit('get-datetime', time)
    }
  },
  computed: {
    configObj () {
      return this.config || {}
    }
  },
  watch: {
    value () {
      this.timeValue = this.value
    }
  }
}
</script>

<style scoped>

</style>

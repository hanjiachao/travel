<template>
    <div>
      <DatePicker
        :type="dateType || 'date'"
        :format="getFormat()"
        :placeholder="placeholder"
        style="width: 100%;"
        size="large"
        :show-week-numbers="configObj.showWeek"
        :separator="configObj.separator || '~'"
        :confirm="configObj.confirm"
        @on-change="dateChange"
        v-model="dateValue"
      ></DatePicker>
    </div>
</template>

<script>
export default {
  name: 'form-date',
  props: {
    placeholder: {
      type: String,
      default: ''
    },
    config: {
      type: Object,
      default: () => {}
    },
    dateType: {
      type: String,
      default: 'date'
    },
    value: {}
  },
  data () {
    return {
      dateValue: ''
    }
  },
  methods: {
    getFormat () {
      let format = ''
      switch (this.dateType) {
        case 'daterange':
          format = 'yyyy/MM/dd'
          break
        case 'datetime':
          format = 'yyyy-MM-dd HH:mm:ss'
          break
        case 'datetimerange':
          format = 'yyyy/MM/dd HH:mm:ss'
          break
        case 'year':
          format = 'yyyy'
          break
        case 'month':
          format = 'MM'
          break
        default:
          format = 'yyyy-MM-dd'
      }
      return this.configObj.format || format
    },
    dateChange (date) {
      this.$emit('input', date)
      this.$emit('get-datetime', date)
    }
  },
  computed: {
    configObj () {
      return this.config || {}
    }
  },
  watch: {
    value: {
      handler (value) {
        this.dateValue = value
      },
      deep: true,
      immediate: true
    }
  }
}
</script>

<style scoped>

</style>

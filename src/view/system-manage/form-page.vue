<template>
  <el-form @submit.native.prevent ref="form" :model="formData" :rules="ruleValidate">
    <el-form-item v-for="(item, index) in formList" :key="index" :label="item.label" :prop="item.value">
      <i-switch v-if="item.type === 'bool'" :disabled="sending" v-model="formData[item.value]" size="large">
        <span slot="open">开启</span>
        <span slot="close">关闭</span>
      </i-switch>
      <el-select :disabled="sending" v-else-if="item.type === 'enum'"
                 v-model="formData[item.value]">
        <el-option :label="iitem" :value="iitem" v-for="(iitem, iindex) in item.options" :key="iindex">{{iitem}}</el-option>
      </el-select>
      <el-input :disabled="sending" v-else :type="item.type === 'number' || item.type === 'integer' ? 'number' : 'text'" v-model="formData[item.value]" :placeholder="'请输入' + item.label"></el-input>
    </el-form-item>
  </el-form>
</template>

<script>
export default {
  name: 'system-form-page',
  props: {
    formItems: {
      type: Array,
      default: () => []
    },
    sending: {
      type: Boolean,
      default: false
    },
    defaultData: {
      type: Object,
      default: () => {}
    }
  },
  data () {
    return {
      formData: {},
      ruleValidate: {},
      rules: {
        required: {
          required: true,
          message: '该项不能为空',
          trigger: 'blur'
        },
        mobile: {
          type: 'string',
          message: '手机号格式不正确',
          trigger: 'blur',
          pattern: /^1[345689]\d{9}$/
        },
        email: {
          type: 'email',
          message: '邮箱格式不正确',
          trigger: 'blur'
        },
        number: {
          type: 'string',
          message: '必须是非负整数',
          trigger: 'blur',
          pattern: /^[0-9]*$/
        },
        integer: {
          type: 'integer',
          message: '必须是整数',
          trigger: 'blur'
        },
        url: {
          type: 'url',
          message: '网址格式不正确',
          trigger: 'blur'
        },
        tel: {
          type: 'string',
          message: '电话号码格式不正确',
          trigger: 'blur',
          pattern: /^([0-9]{3,4}-)?[0-9]{7,8}$/
        },
        idcard: {
          validator: function (rule, value, callback) {
            let result = checkIdCard(value)
            result ? callback() : callback(new Error('idcard check error'))
          },
          message: '身份证格式不正确',
          trigger: 'blur'
        },
        stringLength: (min, max) => {
          let validator = {
            type: 'string',
            trigger: 'blur'
          }
          let message = ''
          if (min > 0) {
            validator.min = parseInt(min)
          }
          if (max) {
            validator.max = parseInt(max)
          }
          if (min) {
            if (max) {
              message = `长度在${min}-${max}位`
            } else {
              message = `长度必须大于${min}位`
            }
          } else {
            if (max) {
              message = `长度不能超过${max}`
            }
          }
          validator.message = message
          return validator
        },
        arrayLength: (min, max) => {
          let validator = {
            type: 'array',
            trigger: 'change'
          }
          let message = ''
          if (min > 0) {
            validator.min = parseInt(min)
          }
          if (max) {
            validator.max = parseInt(max)
          }
          if (min) {
            if (max) {
              message = `必须选择${min}到${max}项`
            } else {
              message = `至少选择${min}项`
            }
          } else {
            if (max) {
              message = `不能超过${max}项`
            }
          }
          validator.message = message
          return validator
        },
        equalTo: (field) => {
          let validator = {
            validator: function (rule, value, callback) {
              rule.formData[rule.checkField] === value ? callback() : callback(new Error('equalTo check error'))
            },
            message: '两次输入不一致',
            trigger: 'blur'
          }
          validator.formData = this.formData
          validator.checkField = field
          return validator
        }
      },
      type: '',
      key: ''
    }
  },
  methods: {
    formValidate (success, error) {
      this.$refs['form'].validate((valid) => {
        if (valid) {
          success()
        } else {
          error()
          return false
        }
      })
    },
    initRuleValidate () {
      let rules = {}
      let _this = this
      this.formList.map((item) => {
        if (item.rules) {
          rules[item.value] = item.rules.map((ruleItem) => {
            let returnRule = { ..._this.rules[ruleItem] }
            return returnRule
          })
        }
      })
      this.ruleValidate = rules
    },
    getData () {
      let data = ''
      if (this.type === 'bool') {
        data = this.formData[this.key] ? '是' : '否'
      } else {
        data = this.formData[this.key]
      }
      return this.key + '/' + data
    }
  },
  computed: {
    formList () {
      let _this = this
      let formData = {}
      let defaultData = { ..._this.defaultData }
      let formList = _this.formItems.map(item => {
        if (item.type === 'bool') {
          defaultData[item.value] = defaultData[item.value] === '是'
          _this.type = 'bool'
        } else {
          _this.type = ''
        }
        _this.key = item.value
        return item
      })
      Object.assign(formData, defaultData)
      _this.formData = JSON.parse(JSON.stringify(formData))
      return formList
    }
  },
  watch: {
    formList: {
      handler () {
        this.initRuleValidate()
      },
      deep: true,
      immediate: true
    }
  }
}
</script>

<style scoped>

</style>

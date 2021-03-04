<style scoped>
  *{
    font-size: 14px;
  }
  ul,li{
    list-style: none;
  }
  .info-card{
    margin-bottom: 20px;
  }
  .card-title{
    color: #4C8BD5;
    font-size: 15px;
    cursor: pointer;
  }
  .card-title .title-icon{
    color: #666;
    float: right;
  }
  .card-body{
    padding: 15px;
  }
  .form-list >>> .ivu-form-item-label{
    font-size: 15px;
  }
  .form-list >>> .ivu-card-body{
    padding: 0;
  }
  .data-table-form >>> .el-upload--picture-card{
    width: 70px;
    height: 70px;
    line-height: 80px;
    margin-top: 5px;
  }
  .data-table-form >>> .el-upload-list__item{
    width: 70px;
    height: 70px;
    margin-top: 5px;
    border: none;
  }
</style>

<template>
  <div class="form-list">
    <Form class="data-table-form" :rules="ruleValidate" :model="formData" ref="form">
      <Card v-for="(card, cardIndex) in formList" :key="cardIndex" class="info-card">
        <div class="card-title" slot="title" @click="showCase[card.showCase] = !showCase[card.showCase]">
          {{ card.title }}
          <Icon v-if="showCase[card.showCase]" class="title-icon" type="ios-arrow-down" />
          <Icon v-else class="title-icon" type="ios-arrow-forward" />
        </div>
        <div class="card-body" v-show="showCase[card.showCase]">
          <Row :gutter="20">
            <Col v-for="(formItem, fromIndex) in card.formItems" :span="formItem.span? formItem.span : formItem.type === 'card' ? 24 : 8" :key="fromIndex">
              <Card v-if="formItem.type === 'card'">
                <div class="card-title" slot="title" @click="showCase[formItem.showCase] = !showCase[formItem.showCase]">
                  {{ formItem.title }}
                  <Icon v-if="showCase[formItem.showCase]" class="title-icon" type="ios-arrow-down" />
                  <Icon v-else class="title-icon" type="ios-arrow-forward" />
                </div>
                <div v-show="showCase[formItem.showCase]" class="card-body">
                  <Card v-for="(childrenCard, cardIndex) in formData[formItem.cardValue]" :key="cardIndex" style="margin-bottom: 10px;">
                    <div class="card-body">
                      <Poptip style="float: right;"
                              confirm
                              v-if="formItem.inceAllow"
                              title="确认要移除吗?"
                              @on-ok="delChildCard(formItem.cardValue, cardIndex)"
                              ok-text="确定"
                              cancel-text="取消">
                        <Button style="width: 20px; height: 20px;" shape="circle" type="error" size="small" icon="md-remove"></Button>
                      </Poptip>
                      <div style="clear: both"></div>
                      <Row :gutter="20">
                        <Col v-for="(childrenItem, childrenIndex) in formItem.childrenForm" :key="childrenIndex" :span="childrenItem.span? childrenItem.span : 8">
                          <formItem :label="childrenItem.label">
                            <tree-select v-if="childrenItem.type === 'treeSelect'" :config="childrenItem.config ? childrenItem.config : {}" v-model="childrenCard[childrenItem.value]" :placeholder="childrenItem.placeholder? childrenItem.placeholder : '请选择' + childrenItem.label"></tree-select>
                            <form-cascader v-else-if="childrenItem.type === 'cascader'" :config="childrenItem.config || {}" v-model="childrenCard[childrenItem.value]" :wordType="childrenItem.options" :placeholder="childrenItem.placeholder? childrenItem.placeholder : '请选择' + childrenItem.label"></form-cascader>
                            <form-select v-else-if="childrenItem.type === 'select'" v-model="childrenCard[childrenItem.value]" :config="childrenItem.config ? formItem.config : {}" :wordType="childrenItem.options" :placeholder="childrenItem.placeholder? childrenItem.placeholder : '请选择' + childrenItem.label"></form-select>
                            <DatePicker v-else-if="childrenItem.type === 'date'" format="yyyy-MM-dd" style="width: 100%" :value="childrenCard[childrenItem.value]" @on-change="(a, b) => { birChange (a, b, childrenItem.value)}" :start-date="childrenItem.startTime ? new Date(childrenItem.startTime) : new Date()" size="large" type="date" :placeholder="childrenItem.placeholder? childrenItem.placeholder : '请选择' + childrenItem.label"></DatePicker>
                            <Input v-else size="large" v-model="childrenCard[childrenItem.value]" :rows="3" :type="childrenItem.type? childrenItem.type : 'text'" :placeholder="childrenItem.placeholder? childrenItem.placeholder : '请输入' + childrenItem.label" />
                          </formItem>
                        </Col>
                      </Row>
                    </div>
                  </Card>
                  <Button style="width: 100%;" type="primary" size="large" v-if="formItem.inceAllow" @click="addChildCard(formItem.cardValue)">添加{{ formItem.title }}</Button>
                </div>
              </Card>
              <formItem v-else-if="formItem.showItem" :label="formItem.label" :prop="formItem.value">
                <form-select-paging
                  v-if="formItem.type === 'selectPaging'"
                  :config="formItem.config || {}" v-model="formData[formItem.value]" :placeholder="formItem.placeholder? formItem.placeholder : '请选择' + formItem.label"></form-select-paging>
                <tree-select
                  v-else-if="formItem.type === 'treeSelect'"
                  :config="formItem.config || {}" v-model="formData[formItem.value]" :placeholder="formItem.placeholder? formItem.placeholder : '请选择' + formItem.label"></tree-select>
                <form-cascader
                  v-else-if="formItem.type === 'cascader'"
                  :config="formItem.config || {}" v-model="formData[formItem.value]" :wordType="formItem.options" :placeholder="formItem.placeholder? formItem.placeholder : '请选择' + formItem.label"></form-cascader>
                <form-select v-else-if="formItem.type === 'select'"
                             :disabled="formItem.disabled" :config="formItem.config || {}" :wordType="formItem.options" v-model="formData[formItem.value]" :placeholder="formItem.placeholder? formItem.placeholder : '请选择' + formItem.label"></form-select>
                <form-date
                  v-else-if="['date', 'daterange', 'datetime', 'datetimerange', 'year', 'month'].indexOf(formItem.type) > -1"
                  :dateType="formItem.type" :config="formItem.config || {}" v-model="formData[formItem.value]" :placeholder="formItem.placeholder? formItem.placeholder : '请选择' + formItem.label"></form-date>
                <form-time
                  v-else-if="['time', 'timerange'].indexOf(formItem.type) > -1"
                  :timeType="formItem.type" :config="formItem.config || {}" v-model="formData[formItem.value]" :placeholder="formItem.placeholder? formItem.placeholder : '请选择' + formItem.label"></form-time>
                <el-upload
                  action=""
                  :id="'upload-formItem-' + formItem.value"
                  :ref="formItem.value"
                  :list-type="formItem.type==='file' ? 'text' : 'picture-card'"
                  v-else-if="formItem.type==='file' || formItem.type==='image'"
                  :on-success="(response, file, filelist) => uploadSuccess(formItem, response, file, filelist)"
                  :on-error="(err, file, filelist) => uploadFail(formItem, err, file, filelist)"
                  :on-progress="onUploadProgress"
                  :disabled="formItem.readonly || sending"
                  :http-request="(options) => uploadFile(options, formItem)"
                  :on-remove="(file) => removeFile(formItem, file)"
                  :on-change="() => fileListChange(formItem)"
                  :on-exceed="() => overproof(formItem)"
                  :file-list="fileList[formItem.value].fileList"
                  :before-remove="(file) => beforeRemove(formItem, file)"
                  multiple
                >
                  <i class="el-icon-plus" v-if="formItem.type==='image'"></i>
                  <el-button size="small" type="default" v-else>点击上传</el-button>
                  <div slot="tip" class="el-upload__tip" v-if="fileList[formItem.value].tip">
                    {{fileList[formItem.value].tip}}
                  </div>
                </el-upload>
                <form-upload
                  v-else-if="formItem.type === 'upload' || formItem.type==='file' || formItem.type==='image'"
                  :config="formItem.config || {}" :list-type="formItem.type" :fileList="fileList[formItem.value].fileList" @fileChange="fileChange">
                </form-upload>
                <Input
                  v-else
                  size="large" :rows="3" :type="formItem.type? formItem.type : 'text'" v-model="formData[formItem.value]" :placeholder="formItem.placeholder? formItem.placeholder : '请输入' + formItem.label" />
                <div v-if="formItem.attention">
                  {{ formItem.attention }}
                </div>
              </formItem>
            </Col>
          </Row>
        </div>
      </Card>
    </Form>
  </div>
</template>

<script>
import ajax from '@/libs/ajax'
import checkIdCard from '@/libs/idcard'
import formSelect from '../smallComponents/form-select.vue'
import fromCascader from '../smallComponents/form-cascader.vue'
import formSelectPaging from '../smallComponents/form-select-paging.vue'
import treeSelect from '../smallComponents/tree-select.vue'
import formDate from '../smallComponents/form-date'
import formTime from '../smallComponents/form-time'
import formUpload from '../smallComponents/form-upload'

export default {
  name: 'classify-form-collection',
  components: {
    'form-select': formSelect,
    'form-cascader': fromCascader,
    'tree-select': treeSelect,
    'form-select-paging': formSelectPaging,
    'form-date': formDate,
    'form-time': formTime,
    'form-upload': formUpload
  },
  props: {
    classifyList: Array,
    sending: {
      type: Boolean,
      default: false
    },
    config: {
      type: Object,
      default: () => {}
    },
    defaultData: {
      type: Object,
      default: () => {}
    }
  },
  data () {
    return {
      validateCallback: {
        success: null,
        error: null
      },
      submitType: {},
      groupBy: {},
      showCase: {},
      childrenForm: {},
      formData: {},
      fileList: {},
      sex: '',
      rules: {
        required: {
          required: true,
          message: '该项不能为空',
          trigger: 'blur'
        },
        requiredNumber: {
          required: true,
          message: '该项不能为空',
          trigger: 'blur',
          type: 'number'
        },
        requiredArray: {
          required: true,
          type: 'array',
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
      ruleValidate: {}
    }
  },
  methods: {
    getFormData () {
      let data = {}
      Object.keys(this.formData).forEach((key) => {
        if (key.indexOf(',') < 0) {
          if (this.submitType[key] === 'string') {
            data[key] = JSON.stringify(this.formData[key])
          } else if (this.groupBy[key]) {
            let groupBy = this.groupBy[key]
            let dataItem = [ ...this.formData[key] ]
            for (let i in groupBy) {
              data[groupBy[i]] = dataItem[i]
              delete this.formData[groupBy[i]]
            }
          } else if (this.formData[key]) {
            data[key] = this.formData[key]
          }
        }
      })
      return data
    },
    validate (success, error) {
      this.validateCallback = { success, error }
      if (Object.keys(this.fileList).length > 0 && !this.checkAllUpload()) {
        this.validateCallback.error('等待文件上传完成')
      } else {
        this.formValidate(success, error)
      }
    },
    checkAllUpload () {
      for (let index in this.fileList) {
        if (this.fileList[index].limit === 1) {
          if (this.$refs[index] && this.$refs[index][0] && this.$refs[index][0].uploadFiles.length > 0 && this.formData[index] === '') {
            return false
          }
        } else {
          if (this.$refs[index] && this.$refs[index][0] && this.formData[index].length !== this.$refs[index][0].uploadFiles.length) {
            return false
          }
        }
      }
      return true
    },
    formValidate (success, error) {
      this.$refs.form.validate((valid) => {
        if (valid) {
          success()
        } else {
          error()
        }
      })
    },
    initRuleValidate () {
      let rules = {}
      let _this = this
      this.formItemList.map(cardItem => {
        cardItem.formItems.map(formItem => {
          if (formItem.rules) {
            rules[formItem.value] = formItem.rules.map((ruleItem) => {
              let returnRule = { ..._this.rules[ruleItem] }
              return returnRule
            })
          }
        })
      })
      this.ruleValidate = rules
    },
    dateChange (a, b, valueName) {
      this.formData[valueName] = a
    },
    addChildCard (value) {
      let form = { ...this.childrenForm[value] }
      this.formData[value].push(form)
    },
    delChildCard (value, index) {
      this.formData[value].splice(index, 1)
    },
    // 上传文件
    uploadSuccess (item, response) {
      this.formData[item.value].push(response.result.relative_path)
    },
    uploadFail (item, err, file, fileList) {
      if (err.toString() !== 'Cancel') {
        this.$Notice.error({
          title: `${item.label}上传失败`,
          duration: 3,
          desc: err.errorMessage
        })
      }
    },
    uploadFile (options, item) {
      let data = new FormData()
      data.append(item.uploadField || 'file', options.file)
      return ajax.post({
        url: 'upload',
        data: data,
        userinfo: true,
        onUploadProgress: options.onProgress
      })
    },
    onUploadProgress (e, file) {
      if (e.total > 0) {
        e.percent = e.loaded / e.total * 100
      }
    },
    removeFile (item, file) {
      if (file.response) {
        this.formData[item.value].splice(this.formData[item.value].indexOf(file.response.result.relative_path), 1)
      } else {
        this.formData[item.value].splice(this.formData[item.value].indexOf(file.url), 1)
      }
      this.fileListChange(item)
    },
    beforeRemove (item, file) {
      let _this = this
      return new Promise((resolve, reject) => {
        if (file.status === 'uploading') {
          _this.$refs[item.value][0].abort(file)
          this.fileListChange(item)
          reject(new Error('cancel'))
        } else {
          resolve()
        }
      })
    },
    fileListChange (item) {
      for (let i in this.$refs[item.value]) {
        this.$refs[item.value][i].$parent.validate('change')
      }
    },
    overproof (item) {
      this.$Notice.error({
        title: `${item.label}选择失败`,
        duration: 3,
        desc: `最多上传${item.limit}个`
      })
    },
    // 组件上传文件
    fileChange () {
    }
  },
  computed: {
    formList () {
      let _this = this
      let formItemList = [ ..._this.formItemList ]
      let formData = { ..._this.formData }
      let list = formItemList.map(cardItem => {
        cardItem = { ...cardItem }
        let formItems = cardItem.formItems.filter(item => {
          if (item.depend) {
            for (let i in item.depend) {
              if (formData[item.depend[i].keyName] !== item.depend[i].value) {
                if (formData[item.value] instanceof Array) {
                  _this.formData[item.value] = []
                } else {
                  _this.formData[item.value] = ''
                }
                item.showItem = false
                return item
              }
            }
            item.showItem = true
            return item
          } else {
            item.showItem = true
            return item
          }
        })
        cardItem.formItems = formItems
        return cardItem
      })
      return list
    },
    formItemList () {
      let _this = this
      let formData = {}
      let defaultData = JSON.parse(JSON.stringify(this.defaultData))
      let formItemList = this.classifyList.map(cardItem => {
        cardItem = { ...cardItem }
        if (cardItem.defaultCase) {
          _this.$set(_this.showCase, cardItem.showCase, true)
        } else {
          _this.$set(_this.showCase, cardItem.showCase, false)
        }
        let formItems = cardItem.formItems.map(formItem => {
          if (typeof defaultData[formItem.value] === 'number') {
            defaultData[formItem.value] = defaultData[formItem.value] + ''
          }
          if (formItem.groupBy && defaultData[formItem.groupBy[0]]) {
            defaultData[formItem.value] = [defaultData[formItem.groupBy[0]], defaultData[formItem.groupBy[1]]]
          }
          formItem = { ...formItem }
          if (formItem.type === 'card') {
            let childrenData = {}
            let defaultNum = parseInt(formItem.defaultNum) || 1
            if (formItem.defaultCase) {
              _this.$set(_this.showCase, formItem.showCase, true)
            } else {
              _this.$set(_this.showCase, formItem.showCase, false)
            }
            formItem.childrenForm.map(childrenItem => {
              childrenData[childrenItem.value] = ''
            })
            let childrenDataList = []
            _this.childrenForm[formItem.cardValue] = { ...childrenData }
            for (let i = 0; i < defaultNum; i++) {
              childrenDataList.push({ ...childrenData })
            }
            formData[formItem.cardValue] = childrenDataList
          } else {
            if (formItem.type === 'image' || formItem.type === 'file' || formItem.type === 'cascader' || formItem.type === 'upload') {
              formData[formItem.value] = []
            } else {
              formData[formItem.value] = ''
            }
          }
          if (formItem.type === 'image' || formItem.type === 'file' || formItem.type === 'upload') {
            formItem.fileList = []
            let fileList = []
            if (_this.defaultData[formItem.value] instanceof Array) {
              fileList = _this.defaultData[formItem.value]
            }
            for (let i in fileList) {
              formItem.fileList.push({
                url: fileList[i]
              })
            }
            this.$set(_this.fileList, formItem.value, formItem)
          }
          if (formItem.submitType) {
            _this.submitType[formItem.value] = formItem.submitType
          }
          if (formItem.groupBy) {
            _this.groupBy[formItem.value] = formItem.groupBy
          }
          return formItem
        })
        cardItem.formItems = [...formItems]
        return cardItem
      })
      Object.assign(formData, defaultData)
      _this.formData = JSON.parse(JSON.stringify(formData))
      return formItemList
    }
  },
  watch: {
    formItemList: {
      handler () {
        this.initRuleValidate()
      },
      deep: true,
      immediate: true
    }
  }
}
</script>

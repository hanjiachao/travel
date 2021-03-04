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
  }
  .data-table-form >>> .el-upload-list__item{
    width: 70px;
    height: 70px;
    border: none;
  }
  .child-file >>> .el-upload--picture-card{
    width: 70px;
    height: 70px;
    line-height: 80px;
  }
  .child-file >>> .el-upload-list__item{
    width: 70px;
    height: 70px;
    border: none;
  }
  .attention{
    font-size: 14px;
    color: #999;
  }
  .rule-icon{
    display: inline-block;
    width: 16px;
    height: 16px;
    cursor: pointer;
    transform: translateY(-1px);
    margin-left: 5px;
    vertical-align: middle;
    background-size: 100% 100%;
    position: relative;
    z-index: 3;
    background-image: url('../../assets/images/rules-icon.png');
  }
</style>
<template>
  <div class="form-list">
    <Form class="data-table-form" :rules="ruleValidate" :model="formData" ref="form">
      <div v-for="(card, cardIndex) in formList" :key="cardIndex">
        <Card class="info-card">
          <div class="card-title" slot="title" @click="showCase[card.showCase] = !showCase[card.showCase]">
            {{ card.title }}
            <Icon v-if="showCase[card.showCase]" class="title-icon" type="ios-arrow-down" />
            <Icon v-else class="title-icon" type="ios-arrow-forward" />
          </div>
          <div class="card-body" v-show="showCase[card.showCase]">
            <Row :gutter="20">
              <Col v-for="(formItem, fromIndex) in card.formItems" :span="formItem.span? formItem.span : 8" :key="fromIndex">
                <formItem :label="formItem.label" label-position="top" :prop="formItem.value" v-if="formItem.showItem">
                  <div style="display: inline-block" slot="label">
                    {{ formItem.label }}
                    <Tooltip v-if="formItem.explain" max-width="200" :content="formItem.explain" placement="top">
                      <i class="rule-icon"></i>
                    </Tooltip>
                  </div>
                  <form-select :disabled="formItem.disabled || false"
                               v-if="formItem.type === 'select' && formItem.dictionary"
                               :config="formItem.config ? formItem.config : {}"
                               :wordType="formItem.options"
                               v-model="formData[formItem.value]"
                               :placeholder="formItem.placeholder? formItem.placeholder : '请选择' + formItem.label"></form-select>
                  <form-select-mutli :disabled="formItem.disabled || false"
                               v-else-if="formItem.type === 'selectMutli'"
                               :config="formItem.config ? formItem.config : {}"
                               :wordType="formItem.options"
                               v-model="formData[formItem.value]"
                               :placeholder="formItem.placeholder? formItem.placeholder : '请选择' + formItem.label"></form-select-mutli>
                  <form-cascader v-else-if="formItem.type === 'cascader'" :config="formItem.config || {}" v-model="formData[formItem.name]" :wordType="formItem.options" :placeholder="formItem.placeholder? formItem.placeholder : '请选择' + formItem.label"></form-cascader>
                  <Select :disabled="formItem.disabled" size="large" v-else-if="formItem.type === 'select'" v-model="formData[formItem.value]" :placeholder="formItem.placeholder? formItem.placeholder : '请选择' + formItem.label">
                    <Option v-for="(option, optionsIndex) in options[formItem.value]" :key="optionsIndex" :value="option.value">{{ option.label }}</Option>
                  </Select>
                  <DatePicker :type="formItem.type" :format="formItem.format || 'yyyy-MM-dd'" :disabled="formItem.disabled" v-else-if="formItem.type === 'date' || formItem.type === 'daterange'" style="width: 100%" :value="formData[formItem.value]" @on-change="(a, b) => { birChange (a, b, formItem)}" size="large" :placeholder="formItem.placeholder? formItem.placeholder : '请选择' + formItem.label"></DatePicker>
                  <el-upload
                    action=""
                    :id="'upload-formItem-' + formItem.value"
                    :ref="formItem.value"
                    :limit="formItem.limit"
                    :list-type="formItem.type==='file' ? 'text' : 'picture-card'"
                    v-else-if="formItem.type==='file' || formItem.type==='image'"
                    :on-success="(response, file) => uploadSuccess(formItem, response, file)"
                    :on-error="(err, file, filelist) => uploadFail(formItem, err, file, filelist)"
                    :on-progress="onUploadProgress"
                    :disabled="formItem.disabled || sending"
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
                  <Input :readonly="formItem.readonly" :disabled="formItem.disabled" v-else-if="formItem.query" size="large" :rows="formItem.row || 3" v-model="formData[formItem.value]" :placeholder="formItem.placeholder? formItem.placeholder : '请输入' + formItem.label" @on-change="getStaffInfo(formItem.value)"/>
                  <Input :readonly="formItem.readonly" :disabled="formItem.disabled" v-else size="large" :rows="formItem.row || 3" :type="formItem.type || 'text'" v-model="formData[formItem.value]" :placeholder="formItem.placeholder? formItem.placeholder : '请输入' + formItem.label" />
                  <div class="attention" v-if="formItem.attention">
                    {{ formItem.attention }}
                  </div>
                </formItem>
              </Col>
            </Row>
          </div>
        </Card>
      </div>
    </Form>
    <Card v-if="formData.cooperator_ids && formData.cooperator_ids.length < 2">
      <div class="card-title" slot="title" @click="showCase.childTicket = !showCase.childTicket">
        子券
        <Icon v-if="showCase.childTicket" class="title-icon" type="ios-arrow-down" />
        <Icon v-else class="title-icon" type="ios-arrow-forward" />
      </div>
      <div v-if="showCase.childTicket" class="card-body">
        <ul>
          <li style="padding-bottom: 20px;" v-for="(child, childIndex) in childTicketList" :key="childIndex">
            <Card>
              <div class="card-body">
                <Poptip confirm
                        style="float: right;"
                        title="确认要移除吗?"
                        @on-ok="delChild(childIndex)"
                        ok-text="确定"
                        cancel-text="取消">
                  <Button style="width: 20px; height: 20px;" shape="circle" type="error" size="small" icon="md-remove"></Button>
                </Poptip>
                <div style="clear: both"></div>
                <Form :model="child" :ref="'childForm' + childIndex" :rules="childRule">
                  <Row :gutter="20">
                    <Col span="8">
                      <formItem label="子券名" prop="name">
                        <Input v-model="child.name" size="large" placeholder="请输入子票名"/>
                      </formItem>
                    </Col>
                    <Col span="8">
                      <formItem label="子券简介" prop="intro">
                        <Input v-model="child.intro" size="large" placeholder="尽量控制在15个字以内"/>
                      </formItem>
                    </Col>
                    <Col span="24" class="child-file">
                      <formItem label="子券图片" prop="image">
                        <!--:on-change="() => fileListChange(childIndex)"-->
                        <!--:before-remove="(file) => beforeRemove(childIndex, file)"-->
                        <el-upload
                          action=""
                          multiple
                          :limit="1"
                          :list-type="'picture-card'"
                          :id="'upload-childFormImage' + childIndex"
                          :ref="'childFormImage' + childIndex"
                          :on-progress="onUploadProgress"
                          :on-success="(response, file, filelist) => uploadSuccessChild(childIndex, response, file, filelist)"
                          :on-error="(err, file, filelist) => uploadFail(childIndex, err, file, filelist)"
                          :http-request="(options) => uploadFile(options, childIndex)"
                          :on-remove="(file) => removeFileChild(childIndex, file)"
                          :on-exceed="() => overproof(childIndex)"
                          :file-list="childFile[childIndex]"
                        >
                          <i class="el-icon-plus"></i>
                        </el-upload>
                      </formItem>
                      <div style="font-size: 14px; color: #999;">
                        (宽高比例1:1即可)
                      </div>
                    </Col>
                  </Row>
                </Form>
              </div>
            </Card>
          </li>
        </ul>
        <Button style="width: 100%;" type="primary" size="large" @click="addChild">添加子票</Button>
      </div>
    </Card>
  </div>
</template>

<script>
import ajax from '@/libs/ajax'
import checkIdCard from '../../libs/idcard'
import formSelect from '@/components/data-hidden/form-select.vue'
import formCascader from '@/components/data-hidden/form-cascader.vue'
import FormSelectMutli from "../../components/data-hidden/form-select-mutli"
export default {
  name: 'welfareForm',
  components: {
    'form-select-mutli': FormSelectMutli,
    'form-select': formSelect,
    'form-cascader': formCascader
  },
  props: {
    classifyList: Array,
    sending: {
      type: Boolean,
      default: false
    },
    defaultData: {
      type: Object,
      default: () => {}
    },
    config: {
      type: Object,
      default: () => {}
    }
  },
  data () {
    return {
      idcardLocked: true,
      validateCallback: {
        success: null,
        error: null
      },
      showCase: {
        childTicket: true
      },
      formData: {},
      emptyUnpreach: {},
      fileList: {},
      rules: {
        requiredArray: {
          required: true,
          type: 'array',
          message: '该项不能为空',
          trigger: 'blur'
        },
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
          message: '必须是数字',
          trigger: 'blur',
          pattern: /^-?[0-9]*$/
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
      ruleValidate: {},
      options: {},
      // 子票信息
      childTicketList: [],
      childFile: [],
      childRule: {
        name: [{
          required: true,
          message: '该项不能为空',
          trigger: 'blur'
        }],
        intro: [{
          required: true,
          message: '该项不能为空',
          trigger: 'blur'
        }],
        image: [{
          required: true,
          message: '该项不能为空',
          trigger: 'blur'
        }]
      }
    }
  },
  methods: {
    getStaffInfo (value) {
      if (this.formData[value].length !== 18) {
        return false
      }
      if (!this.idcardLocked) {
        return false
      }
      let _this = this
      let url = 'staff/check/' + this.formData[value]
      ajax.get({
        url: url,
        userinfo: true,
        finishCallback: function () {
          _this.idcardLocked = true
        }
      }).then((res) => {
        if (res.result === '该职工不存在') {
          this.$emit('employees-exist', true)
          _this.$Notice.error({
            title: '系统提示',
            duration: 3,
            desc: '该职工不存在'
          })
          _this.$set(_this.formData, 'name', '')
          _this.$set(_this.formData, 'sex', '')
          return false
        }
        this.$emit('employees-exist', false)
        _this.$set(_this.formData, 'name', res.result.name)
        _this.$set(_this.formData, 'sex', res.result.sex)
      })
    },
    getFormData () {
      let data = {}
      let formData = { ...this.formData }
      let _this = this
      formData.cooperator_ids = formData.cooperator_ids.join(',')
      Object.keys(formData).forEach((key) => {
        if (formData[key] instanceof Array) {
          data[key] = JSON.stringify(formData[key])
        } else if (!_this.emptyUnpreach[key] || formData[key]) {
          data[key] = formData[key]
        }
      })
      if (data.cooperator_ids.split().length < 2) {
        data.child_tickets = JSON.stringify(_this.childTicketList)
      }
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
          if (this.$refs[index][0].uploadFiles.length > 0 && this.formData[index] === '') {
            return false
          }
        } else {
          if (this.formData[index].length !== this.$refs[index][0].uploadFiles.length) {
            return false
          }
        }
      }
      return true
    },
    formValidate (success, error) {
      let flag = true
      this.$refs.form.validate((valid) => {
        if (!valid) {
          flag = false
        }
      })
      for (let i in this.childTicketList) {
        let name = 'childForm' + i
        this.$refs[name][0].validate((valid) => {
          if (!valid) {
            flag = false
          }
        })
      }
      if (flag) {
        success()
      } else{
        error()
      }
    },
    initRuleValidate () {
      let rules = {}
      let _this = this
      this.formItemList.map(cardItem => {
        cardItem.formItems.map(formItem => {
          if (formItem.rules) {
            rules[formItem.value] = formItem.rules.map((ruleItem) => {
              let returnRule = { ..._this.rules[ruleItem] }
              if (formItem.rulesMsg) {
                returnRule.message = formItem.rulesMsg
              }
              if (ruleItem.indexOf(':') > -1) {
                let ruleArray = ruleItem.split(':')
                return _this.rules[ruleArray[0]](...ruleArray[1].split(','))
              }
              return returnRule
            })
          }
        })
      })
      this.ruleValidate = rules
    },
    birChange (a, b, formItem) {
      if (formItem.groupBy) {
        this.formData[formItem.groupBy[0]] = a[0]
        this.formData[formItem.groupBy[1]] = a[1]
      }
      this.formData[formItem.value] = a
    },
    addChild () {
      this.childTicketList.push({
        name: '',
        intro: '',
        image: ''
      })
      this.childFile.push([])
    },
    delChild (index) {
      this.childTicketList.splice(index, 1)
      this.childFile.splice(index, 1)
    },
    // 上传文件
    uploadSuccess (item, response) {
      if (item.limit > 1) {
        this.formData[item.value].push(response.result.absolute_path)
        return false
      }
      this.formData[item.value] = response.result.absolute_path
    },
    // 以下 uploadFail、uploadFile、onUploadProgress 三个方法 子票和父票公用
    uploadFail (item, err, file, fileList) {
      if (err.toString() !== 'Cancel') {
        this.$Notice.error({
          title: `${item.label || '子票图片'}上传失败`,
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
      if (item.limit > 1) {
        if (file.response) {
          this.formData[item.value].splice(this.formData[item.value].indexOf(file.response.result.absolute_path), 1)
        } else {
          this.formData[item.value].splice(this.formData[item.value].indexOf(file.url), 1)
        }
      } else if (item.limit === 1) {
        this.formData[item.value] = ''
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
        title: `${item.label || '子票图片'}选择失败`,
        duration: 3,
        desc: `最多上传${item.limit || 1}个`
      })
    },
    // 子票上传图片
    uploadSuccessChild (index, response) {
      this.childTicketList[index].image = response.result.absolute_path
    },
    removeFileChild (index, file) {
      this.childTicketList[index].image = ''
    }
  },
  computed: {
    formList () {
      let _this = this
      let formItemList = [ ..._this.formItemList ]
      let formData = { ..._this.formData }
      if (formData.cooperator_ids && formData.cooperator_ids.length > 1) {
        _this.options.write_off_method = [{
          label: '商家后台核销',
          value: '商家后台核销'
        }]
      } else {
        _this.options.write_off_method = [{
          label: '商家后台核销',
          value: '商家后台核销'
        }, {
          label: '商家密码核销',
          value: '商家密码核销'
        }, {
          label: '用户核销',
          value: '用户核销'
        }]
      }
      let list = formItemList.map(cardItem => {
        cardItem = { ...cardItem }
        let formItems = cardItem.formItems.filter(item => {
          if (item.depend) {
            for (let i in item.depend) {
              if (formData[item.depend[i].keyName] !== item.depend[i].value) {
                item.showItem = false
                return false
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
      let childFile = []
      let childTicketList = []
      let defaultData = JSON.parse(JSON.stringify(this.defaultData))
      let formItemList = this.classifyList.map(cardItem => {
        cardItem = { ...cardItem }
        if (cardItem.defaultCase) {
          _this.$set(_this.showCase, cardItem.showCase, true)
        } else {
          _this.$set(_this.showCase, cardItem.showCase, false)
        }
        if (cardItem.lookJust) {
          return cardItem
        }
        let formItems = cardItem.formItems.map(formItem => {
          formItem = { ...formItem }
          formData[formItem.value] = ''
          if (formItem.type === 'select') {
            if (typeof formItem.options === 'string') {
              formItem.dictionary = true
            } else {
              _this.$set(_this.options, formItem.value, formItem.options)
            }
          }
          if (formItem.type === 'selectMutli') {
            formData[formItem.value] = []
          }
          if (formItem.type === 'image' || formItem.type === 'file') {
            formItem.fileList = []
            let fileList = []
            if (_this.defaultData[formItem.value] instanceof Array) {
              fileList = _this.defaultData[formItem.value]
            } else if (typeof _this.defaultData[formItem.value] === 'string') {
              fileList = [_this.defaultData[formItem.value]]
            }
            for (let i in fileList) {
              formItem.fileList.push({
                url: fileList[i]
              })
            }
            formItem.limit = formItem.limit || 1
            if (formItem.limit > 1) {
              formData[formItem.value] = []
            }
            this.$set(_this.fileList, formItem.value, formItem)
          }
          if (formItem.groupBy) {
            defaultData[formItem.value] = [defaultData[formItem.groupBy[0]], defaultData[formItem.groupBy[1]]]
          }
          return formItem
        })
        cardItem.formItems = [...formItems]
        return cardItem
      })
      if (this.defaultData.child_tickets) {
        let ticketList = JSON.parse(JSON.stringify(this.defaultData.child_tickets))
        childTicketList = ticketList
        for (let i in ticketList) {
          childFile.push([{
            url: ticketList[i].image
          }])
        }
      }
      _this.childFile = JSON.parse(JSON.stringify(childFile))
      Object.assign(formData, defaultData)
      _this.formData = JSON.parse(JSON.stringify(formData))
      _this.childTicketList = JSON.parse(JSON.stringify(childTicketList))
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

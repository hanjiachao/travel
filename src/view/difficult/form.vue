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
  .attention{
    font-size: 14px;
    color: #999;
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
                  <form-select :disabled="formItem.disabled || false" v-if="formItem.type === 'select' && formItem.dictionary" :config="formItem.config ? formItem.config : {}" :wordType="formItem.options" v-model="formData[formItem.value]" :placeholder="formItem.placeholder? formItem.placeholder : '请选择' + formItem.label"></form-select>
                  <form-cascader v-else-if="formItem.type === 'cascader'" :config="formItem.config || {}" v-model="formData[formItem.name]" :wordType="formItem.options" :placeholder="formItem.placeholder? formItem.placeholder : '请选择' + formItem.label"></form-cascader>
                  <Select :disabled="formItem.disabled" size="large" v-else-if="formItem.type === 'select'" v-model="formData[formItem.value]" :placeholder="formItem.placeholder? formItem.placeholder : '请选择' + formItem.label">
                    <Option v-for="(option, optionsIndex) in options[formItem.value]" :key="optionsIndex" :value="option.value">{{ option.label }}</Option>
                  </Select>
                  <DatePicker :disabled="formItem.disabled" v-else-if="formItem.type === 'date'" style="width: 100%" :value="formData[formItem.value]" @on-change="(a, b) => { birChange (a, b, formItem.value)}" :start-date="new Date(1990, 0, 1)" size="large" type="date" :placeholder="formItem.placeholder? formItem.placeholder : '请选择' + formItem.label"></DatePicker>
                  <el-upload
                    action=""
                    :id="'upload-formItem-' + formItem.value"
                    :ref="formItem.value"
                    :list-type="formItem.type==='file' ? 'text' : 'picture-card'"
                    v-else-if="formItem.type==='file' || formItem.type==='image'"
                    :on-success="(response, file, filelist) => uploadSuccess(formItem, response, file, filelist)"
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
                  <Input :readonly="formItem.readonly" :disabled="formItem.disabled" v-else-if="formItem.query" size="large" :rows="3" v-model="formData[formItem.value]" :placeholder="formItem.placeholder? formItem.placeholder : '请输入' + formItem.label" @on-change="getStaffInfo(formItem.value)"/>
                  <Input :readonly="formItem.readonly" :disabled="formItem.disabled" v-else size="large" :rows="3" :type="formItem.type || 'text'" v-model="formData[formItem.value]" :placeholder="formItem.placeholder? formItem.placeholder : '请输入' + formItem.label" />
                  <div class="attention" v-if="formItem.attention">
                    {{ formItem.attention }}
                  </div>
                </formItem>
              </Col>
            </Row>
            <Card v-if="card.hasFamily">
              <div class="card-title" slot="title" @click="showCase.familyMemberCase = !showCase.familyMemberCase">
                家庭成员
                <Icon v-if="showCase.familyMemberCase" class="title-icon" type="ios-arrow-down" />
                <Icon v-else class="title-icon" type="ios-arrow-forward" />
              </div>
              <div v-if="showCase.familyMemberCase" class="card-body">
                <ul>
                  <li style="padding-bottom: 20px;" v-for="(members, familyIndex) in familyMembers" :key="familyIndex">
                    <Card>
                      <div class="card-body">
                        <Poptip confirm
                                style="float: right;"
                                title="确认要移除吗?"
                                @on-ok="delFamily(familyIndex)"
                                ok-text="确定"
                                cancel-text="取消">
                          <Button style="width: 20px; height: 20px;" shape="circle" type="error" size="small" icon="md-remove"></Button>
                        </Poptip>
                        <div style="clear: both"></div>
                        <Row :gutter="20">
                          <Col span="8">
                            <formItem label="姓名">
                              <Input v-model="members.name" size="large" placeholder="请输入姓名"/>
                            </formItem>
                          </Col>
                          <Col span="8">
                            <formItem label="性别">
                              <Select v-model="members.sex" size="large" placeholder="请选择性别">
                                <Option value="男">男</Option>
                                <Option value="女">女</Option>
                              </Select>
                            </formItem>
                          </Col>
                          <Col span="8">
                            <formItem label="关系">
                              <Input v-model="members.relationship" size="large" placeholder="关系"/>
                            </formItem>
                          </Col>
                          <Col span="8">
                            <formItem label="身份证号">
                              <Input size="large" v-model="members.idcard" placeholder="身份证号"/>
                            </formItem>
                          </Col>
                          <Col span="8">
                            <formItem label="政治面貌">
                              <form-select :placeholder="'请选择政治面貌'" :wordType="'政治面貌'" v-model="members.politics"></form-select>
                            </formItem>
                          </Col>
                          <Col span="8">
                            <formItem label="出生日期">
                              <DatePicker style="width: 100%" v-model="members.birthday" @on-change="(a, b) => { memberBirChange (a, b, familyIndex)}" :start-date="new Date(1990, 0, 1)" size="large" type="date" placeholder="出生日期"></DatePicker>
                            </formItem>
                          </Col>
                          <Col span="8">
                            <formItem label="健康状况">
                              <Input size="large" v-model="members.health" placeholder="健康状况"/>
                            </formItem>
                          </Col>
                          <Col span="8">
                            <formItem label="月平均收入">
                              <Input size="large" v-model="members.income" placeholder="月平均收入"/>
                            </formItem>
                          </Col>
                          <Col span="8">
                            <formItem label="医保状况">
                              <form-select :config="{}" :wordType="'医保状况'" v-model="members.healthInsurance" size="large" :placeholder="'请选择医保状况'"/>
                            </formItem>
                          </Col>
                          <Col span="8">
                            <formItem label="单位或学校">
                              <Input v-model="members.unit" size="large" placeholder="单位或学校"/>
                            </formItem>
                          </Col>
                        </Row>
                      </div>
                    </Card>
                  </li>
                </ul>
                <Button style="width: 100%;" type="primary" size="large" @click="addFamily">添加家庭成员</Button>
              </div>
            </Card>
          </div>
        </Card>
      </div>
    </Form>
    <image-modal ref="imageModal" :imageInfo="imageInfo"></image-modal>
  </div>
</template>

<script>
import ajax from '@/libs/ajax'
import checkIdCard from '../../libs/idcard'
import formSelect from '@/components/data-hidden/form-select.vue'
import imageModal from './image-modal.vue'
import formCascader from '@/components/data-hidden/form-cascader.vue'
export default {
  name: 'formPage',
  components: {
    'form-select': formSelect,
    'image-modal': imageModal,
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
        familyMemberCase: true
      },
      formData: {},
      emptyUnpreach: {},
      fileList: {},
      familyMembers: [],
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
      ruleValidate: {},
      options: {},
      imageInfo: {}
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
      let formData = this.formData
      let _this = this
      Object.keys(formData).forEach((key) => {
        if (formData[key] instanceof Array) {
          data[key] = JSON.stringify(formData[key])
        } else if (!_this.emptyUnpreach[key] || formData[key]) {
          data[key] = formData[key]
        }
      })
      data.family_members = JSON.stringify(_this.familyMembers)
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
    birChange (a, b, valueName) {
      this.formData[valueName] = a
    },
    memberBirChange (a, b, index) {
      this.familyMembers[index].birthday = a
    },
    addFamily () {
      this.familyMembers.push({
        name: '',
        sex: '',
        relationship: '',
        idcard: '',
        politics: '',
        birthday: '',
        income: '',
        health: '',
        healthInsurance: '',
        unit: ''
      })
    },
    delFamily (index) {
      this.familyMembers.splice(index, 1)
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
          if (formItem.type === 'image' || formItem.type === 'file') {
            formData[formItem.value] = []
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
          return formItem
        })
        cardItem.formItems = [...formItems]
        return cardItem
      })
      if (this.defaultData.family_members) {
        this.familyMembers = JSON.parse(this.defaultData.family_members)
      }
      let defaultData = JSON.parse(JSON.stringify(this.defaultData))
      Object.assign(formData, defaultData)
      _this.formData = { ...formData }
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

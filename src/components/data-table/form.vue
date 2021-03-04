<style scoped lang="less">
  .el-popper{
    z-index: 5005!important;
  }
  .form-static{
    /deep/ .el-form-item__content{
      position: static;
    }
  }
  .el-picker-panel{
    z-index: 5010!important;
  }
  .el-radio{padding: 5px 0}
</style>
<template>
  <el-form @submit.native.prevent ref="form" :model="formData" :rules="ruleValidate" class="data-table-form" label-position="right" label-width="140px">
    <el-form-item :class="item.className" v-for="(item, index) in formList" :key="index" :label="item.label" :prop="item.name">
      <el-checkbox-group :readonly="item.readonly || sending" v-if="item.type==='checkbox'" v-model="formData[item.name]">
        <el-checkbox :label="iitem.value" v-for="(iitem, iindex) in item.options" :key="iindex">{{iitem.label}}</el-checkbox>
      </el-checkbox-group>
      <el-radio-group :readonly="item.readonly || sending" v-else-if="item.type==='radio'" v-model="formData[item.name]">
        <el-radio :label="iitem.value" v-for="(iitem, iindex) in item.options" :key="iindex">{{iitem.label}}</el-radio>
      </el-radio-group>
      <form-cascader v-else-if="item.type === 'cascader'" :config="item.config || {}" v-model="formData[item.name]" :wordType="item.options" :placeholder="item.placeholder? item.placeholder : '请选择' + item.label"></form-cascader>
      <tree-select v-else-if="item.type === 'treeSelect'" :config="item.config ? item.config : {}" v-model="formData[item.name]" :placeholder="item.placeholder? item.placeholder : '请选择' + item.label"></tree-select>
      <form-select v-else-if="item.type === 'select'" :config="item.config ? item.config : {}" :optionList="item.options" v-model="formData[item.name]" :placeholder="item.placeholder? item.placeholder : '请选择' + item.label"></form-select>
      <el-date-picker :readonly="item.readonly || sending" style="width: 100%" v-else-if="['date', 'datetime', 'datetimerange', 'daterange'].indexOf(item.type) > -1" v-model="formData[item.name]" :type="item.type" :format="item.type.indexOf('time')>-1 ? 'yyyy-MM-dd HH:mm:ss' : 'yyyy-MM-dd'" :value-format="item.type.indexOf('time')>-1 ? 'yyyy-MM-dd HH:mm:ss' : 'yyyy-MM-dd'" placeholder="请选择时间" start-placeholder="开始时间" end-placeholder="结束时间" unlink-panels @change="(a, b) => { changeDateTime (a, b, item)}"></el-date-picker>
      <el-time-picker :clearable="false" :readonly="item.readonly || sending" style="width: 100%" v-else-if="['time', 'timerange'].indexOf(item.type) > -1" is-range  v-model="formData[item.name]" :type="item.type" value-format="HH:mm" placeholder="请选择时间" start-placeholder="开始时间" end-placeholder="结束时间" @change="(a, b) => { changeTime (a, b, item)}"></el-time-picker>
      <el-upload
        :id="'upload-item-' + item.name"
        action=""
        :list-type="item.type==='file' ? 'text' : 'picture-card'"
        :class="item.type==='file' ? 'file-upload' : 'image-upload'"
        :ref="item.name"
        v-else-if="item.type==='file' || item.type==='image'"
        :accept="item.accept"
        :disabled="item.readonly || sending"
        :on-success="(response, file, filelist) => uploadSuccess(item, response, file, filelist)"
        :on-error="(err, file, filelist) => uploadFail(item, err, file, filelist)"
        :on-progress="onUploadProgress"
        :http-request="(options) => uploadFile(options, item)"
        :on-remove="(file) => removeFile(item, file)"
        :limit="item.limit"
        :file-list="fileList[item.name].fileList"
        :on-change="() => fileListChange(item)"
        :on-exceed="() => overproof(item)"
        :before-remove="(file) => beforeRemove(item, file)"
        :multiple="item.limit > 1"
      >
        <i class="el-icon-plus" v-if="item.type==='image'"></i>
        <el-button size="small" type="default" v-else>点击上传</el-button>
        <div slot="tip" class="el-upload__tip" v-if="fileList[item.name].tip">
          {{fileList[item.name].tip}}
        </div>
      </el-upload>
      <vue-ueditor-wrap v-model="formData[item.name]" v-else-if="item.type==='ueditor'" :config="myConfig"></vue-ueditor-wrap>
      <div v-else-if="item.type === 'map'">
        <el-input v-model="formData[item.name]" @focus="mapSelector[item.name].show = true" :readonly="true" :ref="`input-${item.name}`">
          <i
            class="el-icon-location el-input__icon"
            slot="suffix">
          </i>
        </el-input>
        <div class="bm-view-box" v-show="mapSelector[item.name].show">
          <div style="position: absolute;top:5px;left:5px;right:5px;height: 40px;z-index:10000">
            <div class="fl">
              <Input placeholder="输入关键词搜索" style="width: 200px" search @on-search="(value) => { mapSelector[item.name].keyword=value }"/>
            </div>
            <div class="fr">
            <span v-if="mapSelector[item.name].marker" style="color:#000;font-weight: bold">
              {{mapSelector[item.name].marker.lng}},{{mapSelector[item.name].marker.lat}}
            </span>
              <ButtonGroup>
                <Button type="primary" @click="mapConfirm(item)">
                  确定
                </Button>
                <Button type="default" @click="mapSelector[item.name].show=false">
                  取消
                </Button>
              </ButtonGroup>
            </div>
          </div>
          <baidu-map class="bm-view" :scroll-wheel-zoom="true" :center="'北京市'" :zoom="16" @click="(event) => mapClick(item, event)">
            <bm-view class="map" v-if="mapSelector[item.name].keyword !==''"></bm-view>
            <bm-local-search  v-if="mapSelector[item.name].keyword !==''" :panel="false" :keyword="mapSelector[item.name].keyword" :auto-viewport="true"></bm-local-search>
            <bm-marker v-if="mapSelector[item.name].marker" :position="{lng: mapSelector[item.name].marker.lng, lat: mapSelector[item.name].marker.lat}" animation="BMAP_ANIMATION_BOUNCE"></bm-marker>
          </baidu-map>
        </div>
      </div>
      <el-input v-else :readonly="item.readonly || sending" v-model="formData[item.name]" :placeholder="`请输入${item.label}`" :type="item.type || 'text'"></el-input>
    </el-form-item>
  </el-form>
</template>

<script>
import ajax from '../../libs/ajax'
import checkIdCard from '../../libs/idcard'
import VueUeditorWrap from 'vue-ueditor-wrap'
import means from '@/libs/means'
import formSelect from '../data-hidden/form-select.vue'
import treeSelect from '../data-hidden/tree-select.vue'
import formCascader from '../data-hidden/form-cascader.vue'

export default {
  name: 'dataForm',
  components: {
    'form-select': formSelect,
    'tree-select': treeSelect,
    'form-cascader': formCascader,
    VueUeditorWrap
  },
  props: {
    formItems: Array,
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
      required: true
    }
  },
  data () {
    return {
      means: means,
      options: {},
      myConfig: {
        // 编辑器不自动被内容撑高
        autoHeightEnabled: false,
        // 初始容器高度
        initialFrameHeight: 340,
        // 初始容器宽度
        initialFrameWidth: '100%',
        // 上传文件接口（这个地址是我为了方便各位体验文件上传功能搭建的临时接口，请勿在生产环境使用！！！）
        serverUrl: 'http://35.201.165.105:8000/controller.php',
        // UEditor 资源文件的存放路径，如果你使用的是 vue-cli 生成的项目，通常不需要设置该选项，vue-ueditor-wrap 会自动处理常见的情况，如果需要特殊配置，参考下方的常见问题2
        UEDITOR_HOME_URL: process.env.BASE_URL + 'UEditor/'
      },
      mapSelector: {},
      disabledGroup: [],
      formData: {},
      fileList: {},
      uploading: false,
      uploadNoError: true,
      validateCallback: {
        success: null,
        error: null
      },
      rules: {
        required: {
          required: true,
          message: '该项不能为空',
          trigger: 'blur'
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
        englishLetters: {
          type: 'string',
          message: '必须是英文字母',
          trigger: 'blur',
          pattern: /^[a-zA-Z]*$/
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
          if (min === max) {
            message = `长度为${min}位`
          } else if (min) {
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
      groupBy: {},
      needFileName: {}
    }
  },
  methods: {
    mapClick (item, { point }) {
      this.$set(this.mapSelector[item.name], 'marker', point)
    },
    mapConfirm (item) {
      this.formData[item.name] = `${this.mapSelector[item.name].marker.lng},${this.mapSelector[item.name].marker.lat}`
      this.$refs['input-' + item.name][0].focus()
      this.$refs['input-' + item.name][0].blur()
      this.mapSelector[item.name].show = false
    },
    beforeRemove (item, file) {
      let _this = this
      return new Promise((resolve, reject) => {
        if (file.status === 'uploading') {
          _this.$refs[item.name][0].abort(file)
          this.fileListChange(item)
          reject(new Error('cancel'))
        } else {
          resolve()
        }
      })
    },
    fileListChange (item) {
      for (let i in this.$refs[item.name]) {
        this.$refs[item.name][i].$parent.validate('change')
      }
    },
    overproof (item) {
      this.$Notice.error({
        title: `${item.label}选择失败`,
        duration: 3,
        desc: `最多上传${item.limit}个`
      })
    },
    uploadFile (options, item) {
      let data = new FormData()
      if (item.needFileName) {
        let firstIndex = options.file.name.lastIndexOf('.')
        this.needFileName[item.needFileName] = options.file.name.substring(0, firstIndex)
      }
      data.append(item.uploadField || 'test', options.file)
      return ajax.post({
        url: item.uploadUrl || '/Api/UploadFile/uploadFileSingle',
        data: data,
        userinfo: true,
        onUploadProgress: options.onProgress
      })
    },
    removeFile (item, file) {
      if (file.response) {
        if (typeof this.formData[item.name] === 'string') {
          this.formData[item.name] = ''
        } else {
          this.formData[item.name].splice(this.formData[item.name].indexOf(file.response.result[this.checkPath(item)]), 1)
        }
      } else {
        if (typeof this.formData[item.name] === 'string') {
          this.formData[item.name] = ''
        } else {
          this.formData[item.name].splice(this.formData[item.name].indexOf(file.url), 1)
        }
      }
      if (item.needFileName && this.needFileName[item.needFileName] === this.formData[item.needFileName]) {
        this.formData[item.needFileName] = ''
      }
      this.fileListChange(item)
    },
    onUploadProgress (e, file) {
      if (e.total > 0) {
        e.percent = e.loaded / e.total * 100
      }
    },
    uploadSuccess (item, response) {
      if (item.limit === 1) {
        this.formData[item.name] = response.result[this.checkPath(item)]
      } else {
        this.formData[item.name].push(response.result[this.checkPath(item)])
      }
      if (item.needFileName) {
        this.formData[item.needFileName] = this.needFileName[item.needFileName]
      }
    },
    checkPath (item) {
      return item.uploadPath || 'image_relative_path'
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
    uploadFail (item, err, file, fileList) {
      if (err.toString() !== 'Cancel') {
        this.$Notice.error({
          title: `${item.label}上传失败`,
          duration: 3,
          desc: err.errorMessage
        })
      }
    },
    changeDateTime (datetime, typ, item) {
      if (item.originalName instanceof Array) {
        if (!datetime) {
          this.formData[item.originalName[1]] = this.formData[item.originalName[0]] = ''
        } else {
          this.formData[item.originalName[0]] = datetime[0]
          this.formData[item.originalName[1]] = datetime[1]
        }
      }
    },
    changeTime (datetime, typ, item) {
      if (item.originalName instanceof Array) {
        if (!datetime) {
          this.formData[item.originalName[1]] = this.formData[item.originalName[0]] = ''
        } else {
          this.formData[item.originalName[0]] = datetime[0]
          this.formData[item.originalName[1]] = datetime[1]
        }
      }
    },
    initRuleValidate () {
      let rules = {}
      let _this = this
      this.formItemList.map((item) => {
        if (item.rules) {
          rules[item.name] = item.rules.map((ruleItem) => {
            if (ruleItem.indexOf(':') > -1) {
              let ruleArray = ruleItem.split(':')
              return _this.rules[ruleArray[0]](...ruleArray[1].split(','))
            }
            let returnRule = { ..._this.rules[ruleItem] }
            if (item.type === 'checkbox') {
              returnRule.trigger = 'change'
              returnRule.type = 'array'
            } else if (item.type === 'file' || item.type === 'image') {
              returnRule.trigger = 'change'
            }
            return returnRule
          })
        }
      })
      this.ruleValidate = rules
    },
    getFormData () {
      let data = {}
      Object.keys(this.formData).forEach((key) => {
        if (this.groupBy[key]) {
          data[this.groupBy[key][0]] = this.formData[key][0]
          data[this.groupBy[key][1]] = this.formData[key][1]
          delete this.formData[this.groupBy[key][0]]
          delete this.formData[this.groupBy[key][1]]
        } else if (key.indexOf(',') < 0) {
          data[key] = this.formData[key]
        }
      })
      return data
    },
    validate (success, error) {
      this.validateCallback = { success, error }
      if (Object.keys(this.fileList).length > 0 && !this.checkAllUpload()) {
        this.validateCallback.error('等待文件上传完成')
      } else {
        this.formValidate()
      }
    },
    formValidate () {
      this.$refs['form'].validate((valid) => {
        if (valid) {
          this.validateCallback.success && this.validateCallback.success(this.getFormData())
        } else {
          this.validateCallback.error && this.validateCallback.error()
          return false
        }
      })
    }
  },
  computed: {
    formList () {
      let _this = this
      let formItemList = [ ...this.formItemList ]
      let list = formItemList.filter(item => {
        if (item.depend) {
          for (let i in item.depend) {
            if (_this.formData[item.depend[i].keyName] !== item.depend[i].value) {
              if (_this.formData[item.name] instanceof Array) {
                _this.formData[item.name] = []
              } else {
                _this.formData[item.name] = ''
              }
              return false
            }
          }
        }
        if (item.requiredOn) {
          for (let i in item.requiredOn) {
            if (_this.formData[item.requiredOn[i].valueName] !== item.requiredOn[i].value) {
              _this.$set(_this.ruleValidate, item.name, {})
              return item
            }
          }
          _this.$set(_this.ruleValidate, item.name, {
            required: true,
            message: '该项不能为空',
            trigger: 'blur'
          })
        }
        return item
      })
      return list
    },
    formItemList () {
      let _this = this
      let formData = {}
      let formItemList = this.formItems.map(item => {
        item = { ...item }
        formData[item.name] = ''
        if (item.defaultValue) {
          formData[item.name] = item.defaultValue
        }
        if (item.type === 'cascader' || item.type === 'checkbox' || ((item.type === 'file' || item.type === 'image') && item.limit > 1)) {
          formData[item.name] = []
          if (item.groupBy) {
            _this.groupBy[item.name] = item.groupBy
            if (_this.defaultData[item.groupBy[0]]) {
              formData[item.name][0] = _this.defaultData[item.groupBy[0]]
            }
            if (_this.defaultData[item.groupBy[1]]) {
              formData[item.name][1] = _this.defaultData[item.groupBy[1]]
            }
          }
        }
        if (item.type.indexOf('range') > -1 || item.type === 'map') {
          item.originalName = item.name
          item.name = item.name.toString()
          if (this.defaultData[item.originalName[0]] && this.defaultData[item.originalName[1]]) {
            formData[item.name] = [this.defaultData[item.originalName[0]], this.defaultData[item.originalName[1]]]
          }
        }
        if (item.type === 'image' || item.type === 'file') {
          if (!item.limit) {
            item.limit = 1
          }
          item.fileList = []
          let fileList = []
          if (_this.defaultData[item.name] instanceof Array) {
            fileList = _this.defaultData[item.name]
          } else if (typeof _this.defaultData[item.name] === 'string') {
            fileList = _this.defaultData[item.name].split(',')
          }
          for (let i in fileList) {
            item.fileList.push({
              url: fileList[i]
            })
          }
          this.$set(this.fileList, item.name, item)
        }
        if (item.type === 'map') {
          this.$set(this.mapSelector, item.name, { show: false, keyword: '' })
        }
        if (item.type === 'select') {
          if (_this.defaultData[item.name] === item.nullRule) {
            _this.defaultData[item.name] = ''
          }
          if (item.keyLabel && means.getKeyValue(item.keyLabel, _this.defaultData)) {
            _this.$set(_this.options, item.name, [{
              label: means.getKeyValue(item.keyLabel, _this.defaultData),
              value: _this.defaultData[item.name]
            }])
          }
          if (typeof item.options === 'string') {
            item.dictionary = true
          } else {
            _this.$set(_this.options, item.name, item.options)
          }
        }
        // if (this.defaultData[item.name]) {
        //   formData[item.name] = this.defaultData[item.name]
        // }
        return item
      })
      Object.assign(formData, this.defaultData)
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

<style scoped>
  .data-table-form >>> textarea.ivu-input{
    font-size: 12px;
  }
  .data-table-form >>> .ivu-select-placeholder,.data-table-form >>> .ivu-select-selected-value{
    height: 40px !important;
    line-height: 40px !important;
    padding: 0 15px;
  }
  .data-table-form >>> .ivu-select-selection{
    height: 40px;
  }
  .data-table-form >>> .el-checkbox+.el-checkbox{
    margin-left: 0;
  }
  .data-table-form >>> .el-checkbox {
    margin-right: 30px;
  }
  .data-table-form >>> .el-upload-list li:last-child{
    margin-bottom: 10px;
  }
  .data-table-form >>> .image-upload .el-upload-list--picture-card .el-upload-list__item {
    width: 70px;
    height: 70px;
    line-height: 80px;
    margin-bottom: 0px;
    margin-top: 5px;
  }
  .data-table-form >>> .el-upload--picture-card{
    width: 70px;
    height: 70px;
    line-height: 80px;
    margin-top: 5px;
  }
  .data-table-form >>> .image-upload{
    line-height: 0px;
  }
  .data-table-form >>> .image-upload .el-upload-list--picture-card .el-upload-list__item-status-label{
    line-height: 30px;
  }
  .data-table-form >>> .image-upload .el-upload-list--picture-card .el-upload-list__item-actions{
    line-height: 70px;
  }
  .data-table-form >>> .image-upload .el-upload-list--picture-card .el-progress{
    width: 70px;
  }
  .data-table-form >>> .image-upload .el-upload-list--picture-card .el-progress-circle {
    width: 70px !important;
    height: 70px !important;
  }
  .data-table-form >>> .edui-box{
    line-height: 20px;
    height: 20px;
  }
  .bm-view-box{
    margin-top: 10px;
    position: relative;
  }
  .bm-view{
    height: 400px;
    width: 100%;
  }
</style>

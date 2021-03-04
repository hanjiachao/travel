<style scoped>

</style>

<template>
    <div>
      <el-upload
        action=""
        :list-type="listType === 'file' ? 'text' : 'picture-card'"
        :http-request="(options) => upload(options)"
        :on-success="(response) => uploadSuccess(response)"
        :on-error="(error) => uploadFail(error)"
        :on-progress="uploadProgress"
        :on-remove="(file) => removeFile(file)"
        :on-change="fileListChange"
        multiple>
        <i class="el-icon-plus" v-if="listType !== 'file'"></i>
        <el-button size="small" type="default" v-else>点击上传</el-button>
      </el-upload>
    </div>
</template>

<script>
import ajax from '@/libs/ajax'
export default {
  name: 'form-upload',
  props: {
    config: {
      type: Object,
      default: () => {}
    },
    fileList: {
      default: () => []
    },
    listType: {
      type: String,
      default: 'file'
    }
  },
  data () {
    return {
      files: []
    }
  },
  methods: {
    // 上传
    upload (options) {
      let url = this.configObj.uploadUrl || 'upload'
      let data = new FormData()
      data.append(this.configObj.fileName || 'file', options.file)
      return ajax.post({
        url: url,
        data: data,
        userinfo: true,
        onUploadProgress: options.onProgress
      })
    },
    uploadSuccess (res) {
      let dataPosition = this.configObj.dataPosition || ['result', 'absolute_path']
      let file = res
      for (let i in dataPosition) {
        file = file[dataPosition[i]]
      }
      this.files.push(file)
    },
    uploadFail (error) {
      if (error.toString() !== 'Cancel') {
        this.$Notice.error({
          title: '上传失败',
          duration: 3,
          desc: error.errorMessage
        })
      }
    },
    removeFile (file) {
      if (file.response) {
        let dataPosition = this.configObj.dataPosition || ['result', 'absolute_path']
        file = file.response
        for (let i in dataPosition) {
          file = file[dataPosition[i]]
        }
        this.files.splice(this.files.indexOf(file), 1)
      } else {
        this.files.splice(this.files.indexOf(file.url), 1)
      }
    },
    fileListChange () {
    },
    // 不知道干啥用的
    uploadProgress (e) {
      if (e.total > 0) {
        e.percent = e.loaded / e.total * 100
      }
    }
  },
  computed: {
    configObj () {
      return this.config || {}
    }
  },
  created () {
    this.files = this.fileList ? [ ...this.fileList ] : []
  }
}
</script>

<style lang="less">
  .modify-pass-form {
    padding-top: 20px;
  }
  .ivu-poptip-title{
    display: none;
  }
  .modify-pass-form .el-form-item{
    margin-bottom: 32px;
  }
</style>
<template>
  <div>
    <el-row type="flex" justify="center" class="modify-pass-form">
      <el-col :span="18">
        <el-form :rules="rules" @submit.native.prevent ref="form" :model="formData" label-position="right" label-width="100px">
          <el-form-item label="原密码" prop="old_password">
            <el-input type="password" v-model="formData.old_password"></el-input>
          </el-form-item>
          <el-form-item label="新密码" prop="new_password">
            <el-input type="password" v-model="formData.new_password"></el-input>
          </el-form-item>
          <el-form-item label="确认密码" prop="repeat_password">
            <el-input type="password" v-model="formData.repeat_password"></el-input>
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>
    <div style="text-align: center; padding-bottom: 20px;">
      <Poptip  :title="confirm ? submitTip.title : null"
               :confirm="confirm"
               :transfer="true"
               :content="submitTip.content"
               @on-ok="subModify">
        <span @click="stopClick" class="stop-area"><Button type="primary" @click="submitForm">确认</Button></span>
      </Poptip>
    </div>
  </div>
</template>

<script>
import ajax from '@/libs/ajax'
import { mapActions } from 'vuex'

export default {
  name: 'modifyPass',
  data () {
    let checkPass = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请确认密码'))
      } else if (value !== this.formData.new_password) {
        callback(new Error('两次输入密码不一致!'))
      } else {
        callback()
      }
    }
    return {
      submitTip: {
        title: '确认操作？',
        content: '请检查红色提示项'
      },
      confirm: true,
      formData: {
        old_password: '',
        new_password: '',
        repeat_password: ''
      },
      rules: {
        old_password: [{
          required: true,
          message: '请输入原密码',
          trigger: 'blur'
        }],
        new_password: [{
          required: true,
          message: '新密码必须包含数字,大写字母和小写字母,长度在6-20位',
          trigger: 'blur',
          pattern: /^(?=.*[0-9].*)(?=.*[A-Z].*)(?=.*[a-z].*).{6,20}$/
        }],
        repeat_password: [{
          required: true,
          validator: checkPass,
          trigger: 'blur'
        }]
      }
    }
  },
  methods: {
    ...mapActions([
      'handleLogOut'
    ]),
    logout () {
      this.handleLogOut().then(() => {
        this.$router.push({
          name: 'login'
        })
      })
    },
    stopClick (e) {
      if (this.sending) {
        e.stopPropagation()
      }
    },
    submitForm () {
      let _this = this
      this.$refs['form'].validate((valid) => {
        if (valid) {
          _this.confirm = true
        } else {
          _this.confirm = false
          return false
        }
      })
    },
    subModify () {
      let _this = this
      let data = {
        old_pass: _this.formData.old_password,
        pass: _this.formData.new_password,
        pass_bak: _this.formData.repeat_password
      }
      ajax.post({
        url: '/Api/Account/updatePassword',
        data: data,
        userinfo: true
      }).then((res) => {
        _this.$Message.success('修改成功')
        setTimeout(function () {
          _this.formData = {
            password: '',
            new_password: '',
            repeatPassword: ''
          }
          _this.logout()
        }, 1500)
      }).catch((error) => {
        if (error.errorMessage) {
          _this.$Message.error(error.errorMessage)
        }
      })
    }
  }
}
</script>

<style scoped>

</style>

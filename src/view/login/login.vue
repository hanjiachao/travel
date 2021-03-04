<style lang="less">
  @import './login.less';
</style>

<template>
  <div class="login" @keydown.enter="handleSubmit">
    <div class="login-con">
      <Card :bordered="false">
        <p slot="title">
          <Icon type="log-in"></Icon>
          欢迎登录
        </p>
        <div class="form-con">
          <Form ref="loginForm" :model="form" :rules="rules">
            <FormItem prop="username">
              <Input v-model="form.username" placeholder="请输入用户名" size="large">
              <span slot="prepend">
                  <Icon :size="16" type="md-person"></Icon>
              </span>
              </Input>
            </FormItem>
            <FormItem prop="password" class="password-formitem">
              <Input type="password" v-model="form.password" placeholder="请输入密码" size="large">
              <span slot="prepend">
                  <Icon :size="16" type="ios-unlock"></Icon>
              </span>
              </Input>
            </FormItem>
            <div style="padding-bottom: 15px">
              <!--<Checkbox v-model="rememberPass">记住密码</Checkbox>-->
            </div>
            <FormItem>
              <Button @click="handleSubmit" type="primary" long size="large" :loading="logining">
                <span v-if="!logining">登录</span>
                <span v-else v-text="loadStatus"></span>
              </Button>
              <div class="error—info" v-if="errorInfo!==''">
                {{errorInfo}}
              </div>
            </FormItem>
          </Form>
          <!--<p class="login-tip">有问题联系技术部</p>-->
        </div>
      </Card>
    </div>
  </div>
</template>

<script>
import ajax from '@/libs/ajax'
import config from '@/config'
import axios from 'axios'
const { homeName } = config
export default {
  name: 'login',
  data () {
    return {
      logining: false,
      remeberPass: false,
      loadStatus: '登录中...',
      errorInfo: '',
      form: {
        username: '',
        password: ''
      },
      rememberPass: false,
      rules: {
        username: [
          { required: true, message: '账号不能为空', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '密码不能为空', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    handleSubmit () {
      this.$refs.loginForm.validate((valid) => {
        if (valid) {
          let _this = this
          this.logining = true
          this.errorInfo = ''
          ajax.post({
            url: '/Api/Login/index',
            data: this.form
          }).then(function (response) {
            _this.$store.commit('setAccessToken', response.result, _this.rememberPass)
            _this.$store.dispatch('getAdminInfo').then(() => {
              _this.$router.push({
                name: homeName
              })
            }).catch((error) => {
              _this.showError(error.errorMessage)
            })
          }).catch((error) => {
            _this.showError(error.errorMessage)
          })
        }
      })
    },
    showError (errorMessage) {
      this.errorInfo = errorMessage
      this.logining = !this.logining
    }
  }
}
</script>

<style scoped>
  .password-formitem{
    margin-bottom: 15px;
  }
  .error—info{
    color: #f00;
    text-align: center;
  }
</style>

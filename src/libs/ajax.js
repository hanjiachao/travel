import Axios from 'axios'
import baseConfig from '@/config'
import store from '../store'
import Router from '../router'
import qs from 'qs'

const baseUrl = process.env.NODE_ENV === 'development' ? baseConfig.baseUrl.dev : baseConfig.baseUrl.pro

class HttpRequest {
  getInsideConfig () {
    const config = {
      baseURL: baseUrl,
      timeout: baseConfig.timeout,
      headers: {
        'Accept': 'application/json'
        // 'Content-Type': 'application/x-www-form-urlencoded',
      }
    }
    return config
  }
  // 请求s拦截
  interceptors (instance) {
    // 添加请求拦截器
    instance.interceptors.request.use(config => {
      // 在发送请求之前做些什么
      if (config.finishCallback) {
        instance.finishCallback = config.finishCallback
      }
      if (config.loading) {
        this.loading = vm.$Message.loading({
          content: '加载中',
          duration: 0
        })
      }
      if (config.userinfo) {
        if (!store.state.admin.accessToken) {
          vm.$Notice.error({
            title: '系统提示',
            duration: 3,
            desc: '登录信息错误'
          })
          store.commit('setAccessToken', null)
          setTimeout(() => {
            Router.replace({
              path: '/login'
            })
          }, 1500)
          return
        }
        config.headers.Authorization = 'Bearer ' + `${store.state.admin.accessToken}`
        // config.headers.Authorization = `${store.state.admin.accessToken}`
      }
      if (config.method === 'get' || config.method === 'delete') {
        // 消除ie对get请求默认取缓存的影响
        if (config.params) {
          config.params.t = new Date().getTime()
        } else {
          config.params = {
            t: new Date().getTime()
          }
        }
      }
      if (config.data instanceof FormData || config.exportFile) {
        delete config.timeout
      }
      return config
    }, error => {
      // 对请求错误做些什么
      if (this.loading) {
        this.loading()
      }
      return Promise.reject(error)
    })

    // 添加响应拦截器
    instance.interceptors.response.use(res => {
      if (instance.finishCallback) {
        instance.finishCallback()
      }
      if (this.loading) {
        this.loading()
      }
      if (res.headers && res.headers['content-disposition'] && res.headers['content-disposition'].indexOf('attachment') > -1) {
      // if (res.headers && res.headers['content-type'] && res.headers['content-type'].indexOf('csv') > -1) {
        // 处理文件下载
        let blob = new Blob([res.data])
        let downloadElement = document.createElement('a')
        let href = window.URL.createObjectURL(blob)
        let fileName = res.headers['content-disposition'].split('=')[1]
        if ('msSaveOrOpenBlob' in navigator) {
          window.navigator.msSaveOrOpenBlob(blob, fileName)
        } else {
          downloadElement.href = href
          // 设置下载文件名字
          downloadElement.download = decodeURIComponent(fileName)
          document.body.appendChild(downloadElement)
          downloadElement.click()
          // 释放资源
          document.body.removeChild(downloadElement)
          window.URL.revokeObjectURL(href)
        }
        return
      }
      return res.data
    }, error => {
      if (this.loading) {
        this.loading()
      }
      if (instance.finishCallback) {
        instance.finishCallback()
      }
      if (error.response && error.response.data) {
        let errorData = error.response.data
        if (errorData.result === '') {
          errorData = errorData.errorMsg
        } else if (typeof errorData.result === 'string') {
          errorData = errorData.result
        } else if (typeof errorData.result === 'object') {
          for (let i in errorData.result) {
            if (typeof errorData.result[i] === 'object') {
              errorData = errorData.result[i][0]
            } else {
              errorData = errorData.result[i]
            }
            break
          }
        } else {
          errorData = '服务器发生故障,请重试'
        }
        error.errorMessage = errorData
      } else {
        error.errorMessage = '服务器发生故障,请重试'
      }
      // if (this.loading) {
      //   vm.$Message.error(errorData)
      // }
      if (error && error.response && error.response.status === 503) {
        error.errorMessage = '系统正在维护，请稍后再试'
      }
      vm.$Notice.error({
        title: '系统提示',
        duration: 3,
        desc: error.errorMessage
      })
      if (error.response && error.response.data && error.response.data.errorCode === '200001') {
        store.commit('setAccessToken', null)
        setTimeout(() => {
          Router.replace({
            path: '/login'
          })
        }, 1500)
        return
      }
      return Promise.reject(error)
    })
  }
  // 请求实例
  request (options) {
    const instance = Axios.create()
    let source = Axios.CancelToken.source()
    options.cancelToken = source.token
    options = Object.assign(this.getInsideConfig(), options)
    if (Object.prototype.toString.call(options.data) !== '[object FormData]') {
      options.data = qs.stringify(options.data)
    }
    this.interceptors(instance)
    let obj = instance(options)
    obj.abort = () => {
      source.cancel()
    }
    return obj
  }

  delete (options) {
    options.method = 'delete'
    return this.request(options)
  }

  patch (options) {
    options.method = 'patch'
    return this.request(options)
  }

  post (options) {
    options.method = 'post'
    return this.request(options)
  }

  get (options) {
    options.method = 'get'
    return this.request(options)
  }
}

export default new HttpRequest()

import store from '@/store'
let means = {
  getQueryString (name) {
    var reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)', 'i')
    var r = location.href.split('#')[1].substr(location.href.split('#')[1].indexOf('?') + 1).match(reg)
    var context = ''
    if (r !== null) {
      context = r[2]
    }
    reg = null
    r = null
    return context === null || context === '' || context === 'undefined' ? '' : context
  },
  checkDepend (dependList, data) {
    for (let i in dependList) {
      if (dependList[i].value instanceof Array) {
        for (let j in dependList[i].value) {
          if (this.getKeyValue(dependList[i].valueName, data) === dependList[i].value[j]) {
            return true
          }
        }
      } else if (this.getKeyValue(dependList[i].valueName, data) === dependList[i].value) {
        return true
      }
    }
    return false
  },
  operationWidth (powerList) {
    let num = 0
    if (powerList.length < 3) {
      num = 120
      return num
    }
    for (let i in powerList) {
      if (this.hasPermission(powerList[i])) {
        num++
      }
    }
    return num * 45 + 15
  },
  operationAllow (powerList) {
    for (let i in powerList) {
      if (this.hasPermission(powerList[i])) {
        return true
      }
    }
    return false
  },
  getKeyValue (key, data) {
    if (key.indexOf('.') > -1) {
      let levelKeys = key.split('.')
      let item = Object.assign({}, data)
      for (let i in levelKeys) {
        if (item[levelKeys[i]]) {
          item = item[levelKeys[i]]
        } else {
          return ''
        }
      }
      return item
    } else {
      return data[key]
    }
  },
  checkWhere (where, data) {
    for (let index in where) {
      let keyValue = means.getKeyValue(where[index].key, data)
      let rule = where[index].rule
      switch (rule[0]) {
        case '=':
        case 'eq':
          if (rule[1] !== keyValue) {
            return false
          }
          break
        case '!=':
        case 'neq':
          if (rule[1] === keyValue) {
            return false
          }
          break
        case '>':
        case 'gt':
          if (keyValue <= rule[1]) {
            return false
          }
          break
        case '<':
        case 'lt':
          if (keyValue >= rule[1]) {
            return false
          }
          break
        case '>=':
        case 'egt':
          if (keyValue < rule[1]) {
            return false
          }
          break
        case '<=':
        case 'elt':
          if (keyValue > rule[1]) {
            return false
          }
          break
        case 'between':
          if (keyValue < rule[1] || keyValue > rule[2]) {
            return false
          }
          break
        case 'in':
          if (rule[1].indexOf(keyValue) < 0) {
            return false
          }
          break
        case 'notIn':
          if (rule[1].indexOf(keyValue) > -1) {
            return false
          }
          break
      }
    }
    return true
  },
  setToken (token, rememberPass) {
    if (token === null) {
      localStorage.removeItem('token')
    } else {
      token.expires_in = new Date().getTime() + token.expires_in * 1000
      // token.expires_in = new Date().getTime() + 10000
      localStorage.setItem('token', JSON.stringify(token))
    }
  },
  getToken () {
    const token = localStorage.getItem('token')
    if (token) {
      let tokenObj = JSON.parse(token)
      if (tokenObj.expires_in < new Date().getTime()) {
        return tokenObj.access_token
        // return false
      } else {
        return tokenObj.access_token
      }
    } else {
      return false
    }
  },
  hasPermission (permission) {
    let permissions = []
    // if (store.state.admin.info && store.state.admin.info.info.role_id === 1) {
    //   return true
    // }
    if (store.state.admin.info && store.state.admin.info.permissions) {
      permissions = store.state.admin.info.permissions
    }
    return permissions.indexOf(permission) > -1
  }

}
export default means

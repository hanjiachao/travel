<template>
  <div class="permission-setting">
    <div class="submit-btn">
      <Button @click="reset" v-if="means.hasPermission('AllotPermissions')" :disabled="loading || operationUnallow"><Icon type="md-refresh"/>重置</Button>
      <Button type="primary" @click="save" v-if="means.hasPermission('AllotPermissions')" :loading="loading" :disabled="operationUnallow"><Icon type="md-build" />保存</Button>
    </div>
    <div v-if="permissions.length > 0" class="permission-box">
      <Collapse v-model="expend" class="auth-item">
        <Panel v-for="item in permissions" :key="item[keyField]" :name="item[labelField]">
          <div class="auth-title">
            <span @click.stop="">
              <Checkbox :indeterminate="checkType(item)=='indeterminate'" :value="checkType(item)!==''" @on-change="checkAll(item)">{{item[labelField]}}</Checkbox>
            </span>
          </div>
          <div slot="content" style="overflow: hidden;">
            <div v-for="iitem in item.children" :key="iitem[keyField]">
              <div :class="{'sub-auth':iitem.children, 'sub-auth-item': !iitem.children}" style="float: left;">
                <Card v-if="iitem.children">
                  <div slot="title">
                  <span @click.stop="">
                    <Checkbox :indeterminate="checkType(iitem)=='indeterminate'" :value="checkType(iitem)!==''" @on-change="checkAll(iitem)">{{iitem[labelField]}}</Checkbox>
                  </span>
                  </div>
                  <div>
                    <Checkbox v-for="iiitem in iitem.children" :key="iiitem[keyField]" v-model="grantedList[iiitem[keyField]]" @on-change="checkSingle(item, iitem)">{{iiitem[labelField]}}</Checkbox>
                  </div>
                </Card>
                <Checkbox v-else v-model="grantedList[iitem[keyField]]" @on-change="checkSingle(item)">{{iitem[labelField]}}</Checkbox>
              </div>
              <!--<div v-if="!iitem.children" class="clear"></div>-->
            </div>
          </div>
        </Panel>
      </Collapse>
    </div>
    <div v-else style="text-align: center;padding-top: 200px;font-size: 15px;">
      该角色的父角色无任何权限
    </div>
  </div>
</template>
<style scoped lang="css">
  .permission-setting{
    height: 100%;
  }
  .permission-setting .submit-btn{
    height: 50px;
    text-align: right;
    padding-right: 20px;
  }
  .permission-setting .submit-btn .ivu-btn:first-child{
    margin-right: 10px;
  }
  .permission-setting .permission-box{
    height: calc(100% - 50px);
    overflow: auto;
    padding: 10px 0;
    box-sizing: border-box;
  }
  .auth-title{
    font-size: 14px;
    font-weight: bold;
    color: #17233d;
    display: inline-block;
  }
  .auth-title >>> .ivu-checkbox-wrapper{
    font-size: 14px;
  }
  /*.auth-item >>> .sub-auth:nth-of-type(n+2){*/
    /*margin-top: 10px;*/
  /*}*/
  .auth-item >>> .sub-auth{
    margin-top: 10px;
    width: 100%;
  }
  .auth-item >>> .sub-auth-item{
    float: left;
  }
  .auth-item >>> .sub-auth-item:first-child{
    margin-left: 15px;
  }
  .sub-auth >>> .ivu-card-head{
    padding: 5px 15px;
  }
  .sub-auth >>> .ivu-card-head > div{
    font-size: 12px;
    font-weight: bold;
  }
</style>
<script>
import means from '@/libs/means'
import store from '@/store'
import { cloneObj } from '../../libs/util'
export default {
  name: 'permissionSetting',
  props: {
    organizationId: {
      type: Number,
      default: -1
    },
    permissions: {
      type: Array,
      default: function () {
        return []
      }
    },
    granted: {
      default: function () {
        return []
      }
    },
    loading: {
      type: Boolean,
      default: false
    },
    labelField: {
      type: String,
      default: 'menu_name'
    },
    keyField: {
      type: String,
      default: 'name'
    }
  },
  data () {
    return {
      means: means,
      store: store,
      expend: [],
      grantedList: {},
      authKey: 'name'
    }
  },
  methods: {
    checkSingle (item, iitem) {
      let grantedList = cloneObj(this.grantedList)
      let type = this.checkType(item)
      if (iitem) {
        let typeI = this.checkType(iitem)
        grantedList[iitem[this.keyField]] = typeI !== ''
      }
      grantedList[item[this.keyField]] = type !== ''
      this.grantedList = grantedList
    },
    checkAll (item) {
      let type = this.checkType(item)
      let grantedList = cloneObj(this.grantedList)
      grantedList[item[this.keyField]] = type === ''
      if (item.children) {
        for (let i = 0; i < item.children.length; i++) {
          grantedList[item.children[i][this.keyField]] = type === ''
          if (item.children[i].children) {
            for (let j = 0; j < item.children[i].children.length; j++) {
              grantedList[item.children[i].children[j][this.keyField]] = type === ''
            }
          }
        }
      }
      this.grantedList = grantedList
    },
    getGranted () {
      let granted = []
      for (let i in this.grantedList) {
        if (this.grantedList[i]) {
          granted.push(i)
        }
      }
      return granted
    },
    reset () {
      let grantedList = {}
      for (let i = 0; i < this.granted.length; i++) {
        grantedList[this.granted[i]] = true
      }
      this.grantedList = grantedList
    },
    save () {
      let granted = this.getGranted()
      this.$emit('save', granted)
    },
    expendInit () {
      this.expend = []
      for (let i = 0; i < this.permissions.length; i++) {
        this.expend.push(this.permissions[i][this.keyField])
      }
      this.reset()
    },
    notAdmin () {
      return this.store.state.admin.info.info.role_id !== 1 && this.store.state.admin.info.info.role_id !== 2
    }
  },
  computed: {
    operationUnallow () {
      return this.organizationId === 0 && this.notAdmin()
    },
    checkType () {
      return (item) => {
        let type = ''
        let all = true
        if (item.children) {
          for (let i = 0; i < item.children.length; i++) {
            if (item.children[i].children) {
              for (let j = 0; j < item.children[i].children.length; j++) {
                if (this.grantedList[item.children[i].children[j][this.keyField]]) {
                  type = 'indeterminate'
                } else {
                  all = false
                }
              }
            } else {
              if (this.grantedList[item.children[i][this.keyField]]) {
                type = 'indeterminate'
              } else {
                all = false
              }
            }
          }
        } else {
          all = this.grantedList[item[this.keyField]]
        }
        if (all) {
          return 'all'
        } else {
          return type
        }
      }
    }
  },
  created () {
  },
  watch: {
    'permissions': 'expendInit',
    'granted': 'reset'
  }
}
</script>

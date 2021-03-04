<style scoped>
  .control-panel >>> .fl button{
    margin-right: 10px;
  }
  .control-panel >>> .column-control{
    padding: 0;
  }
  .control-panel >>> .column-control .box{
    padding: 6px 10px;
    display: inline-block;
  }
  .control-panel >>> .column-control .ivu-dropdown-rel{
    height: 30px;
  }
  .stop-click {
    display: inline-block;
    height: 100%;
  }
  .column-show-filter {
    display: inline-block;
    width: 70px;
    text-align: left;
  }
  .organization >>> .el-table--border{
    z-index: 1!important;
  }
</style>
<template>
  <Split v-model="split">
    <div slot="left">
      <role-list @row-change="rowChange" :simple="false" ref="table"></role-list>
    </div>
    <div slot="right" style="padding: 18px 10px">
      <permission-setting @save="savePermissions" :organizationId="organizationId" :granted="granted" :permissions="permissions" :loading="loading" :keyField="'name'"></permission-setting>
    </div>
  </Split>
</template>

<script>
import permissionSetting from '../../components/permission-setting/index.vue'
import dateTable from '../../components/data-table/index.vue'
import ajax from '@/libs/ajax'
import roleList from './roleList.vue'

export default {
  name: 'auth',
  components: {
    'permission-setting': permissionSetting,
    'data-table': dateTable,
    'role-list': roleList
  },
  data () {
    return {
      split: 0.5,
      roleId: -1,
      loading: true,
      permissions: [],
      granted: [],
      rowId: -1,
      columns: [
        {
          title: '角色名称',
          key: 'r_name',
          fixed: 'left'
        },
        {
          title: '备注',
          key: 'r_remark'
        }
      ],
      tableData: [],
      config: {
        primaryKey: 'r_id',
        url: 'Role/getList',
        method: 'get',
        split: 1
      },
      grantedItems: {},
      organizationId: -1,
      search: [
        {
          label: '角色名称',
          key: 'name',
          type: 'input',
          fold: false
        }
      ]
    }
  },
  methods: {
    rowChange (row) {
      this.rowId = row.r_id
      this.roleId = row.r_id
      this.organizationId = row.organization_id
      this.getPermissionDetail()
    },
    getPermissionDetail () {
      let _this = this
      this.loading = true
      let id = _this.rowId
      let url = '/Api/Role/singleRoleMenuList'
      ajax.post({
        url: url,
        userinfo: true,
        data: {
          r_id: id
        }
      }).then(res => {
        _this.loading = false
        this.granted = []
        let list = res.result
        _this.permissions = list.menu
        _this.dropOutPermissions(list.menu)
        _this.dropOutChildren(list.permission)
      })
    },
    dropOutChildren (list) {
      for (let i in list) {
        if (list[i].children) {
          this.dropOutChildren(list[i].children)
        }
        this.granted.push(list[i].name)
      }
    },
    dropOutPermissions (list) {
      for (let i in list) {
        this.grantedItems[list[i].name] = list[i].id
        if (list[i].children) {
          this.dropOutPermissions(list[i].children)
        }
      }
    },
    getPermissions () {
      let _this = this
      this.loading = true
      ajax.get({
        url: 'permissions',
        userinfo: true
      }).then(res => {
        let list = res.result
        _this.grantedItems = {}
        _this.dropOutPermissions(list)
        _this.permissions = res.result
        _this.loading = false
      })
    },
    savePermissions (list) {
      let _this = this
      let permissions = []
      for (let i in list) {
        permissions.push(this.grantedItems[list[i]])
      }
      this.loading = true
      let url = '/Api/Role/allotPermissions'
      ajax.post({
        url: url,
        userinfo: true,
        data: {
          r_id: this.rowId,
          permissions: permissions
        }
      }).then(res => {
        _this.loading = false
        _this.getPermissionDetail()
        this.$Notice.success({
          title: '系统提示',
          duration: 3,
          desc: '提交成功'
        })
      }).catch((err) => {
        _this.loading = false
        this.$Notice.error({
          title: '系统提示',
          duration: 3,
          desc: err.errorMessage
        })
      })
    }
  },
  created () {
  }
}
</script>

<style scoped>

</style>

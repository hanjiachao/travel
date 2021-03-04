<template>
  <div>
    <div style="padding: 10px">
      <Button @click="add" v-if="means.hasPermission('AddMenu')">添加</Button>
    </div>
    <div class="module-list">
      <el-table
        :data="data"
        ref="membersTable"
        style="width: 100%"
        border
        row-key="id"
        v-loading="tableLoading"
        stripe>
        <el-table-column
          v-for="(item, index) in showItem"
          :align="index === 0 ? 'left' : 'center'"
          :key="index"
          show-overflow-tooltip
          :label="paramsMap[item]"
          :prop="item">
        </el-table-column>
        <el-table-column
          align="center"
          label="操作"
          v-if="means.operationAllow(powerList)"
          :width="means.operationWidth(powerList)">
          <template slot-scope="scope">
            <el-tooltip content="添加" placement="top" v-if="means.hasPermission(powerList[0])">
              <Button style="margin: 0 3px" @click="addSub(scope.row)">
                <Icon type="md-add"></Icon>
              </Button>
            </el-tooltip>
            <Poptip
              transfer
              confirm
              v-if="means.hasPermission(powerList[1])"
              title="确认要删除吗?"
              @on-ok="sendDel(scope.row)"
              ok-text="确定"
              cancel-text="取消">
              <el-tooltip content="删除" placement="top">
                <Button>
                  <Icon type="md-trash"></Icon>
                </Button>
              </el-tooltip>
            </Poptip>
            <el-tooltip content="编辑" placement="top" v-if="means.hasPermission(powerList[2])">
              <Button @click="edit(scope.row)">
                <Icon type="ios-brush" />
              </Button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <form-modal :config="{}" v-model="forms" @save-success="getList"></form-modal>
  </div>
</template>

<script>
import ajax from '@/libs/ajax'
import means from '@/libs/means'
import formModal from '@/components/data-table/form-modal.vue'

export default {
  name: 'module',
  components: {
    'form-modal': formModal
  },
  data () {
    return {
      tableLoading: true,
      powerList: ['AddMenu', 'SaveMenu', 'DelMenu'],
      forms: {},
      means: means,
      defaultForms: {
        title: '添加',
        confirm: true,
        url: '/Api/Menu/addMenu',
        defaultData: {
          pid: 0,
          order: 1
        },
        formItems: [
          {
            type: 'text',
            name: 'permission',
            label: '权限名称',
            rules: ['required']
          },
          {
            type: 'text',
            name: 'text',
            label: '菜单名称',
            rules: ['required']
          },
          {
            type: 'text',
            name: 'icon',
            label: '图标'
          },
          {
            type: 'text',
            name: 'route',
            label: '路由路径',
            rules: ['required']
          },
          {
            type: 'radio',
            name: 'route_type',
            label: '路由类型',
            rules: ['required'],
            options: [
              {
                label: 'inline-link',
                value: 'inline-link'
              }
            ]
          },
          {
            type: 'radio',
            name: 'type',
            label: '菜单类型',
            rules: ['required'],
            options: [
              {
                label: '菜单',
                value: '菜单'
              },
              {
                label: '权限项',
                value: '权限项'
              }
            ]
          },
          {
            type: 'text',
            name: 'order',
            label: '排序',
            value: 0,
            rules: ['required']
          }
        ]
      },
      showItem: ['menu_name', 'router', 'name', 'type'],
      paramsMap: {
        menu_name: '菜单名称',
        router: '路由路径',
        name: '权限项',
        type: '类型'
      },
      columns: [
        {
          title: '菜单名称',
          key: 'menu_name',
          headerAlign: 'center',
          align: 'center',
          type: 'template',
          template: 'name'
        },
        {
          title: '路由路径',
          key: 'router',
          headerAlign: 'center',
          align: 'center'
        },
        {
          title: '权限项',
          key: 'name',
          headerAlign: 'center',
          align: 'center'
        },
        {
          title: '类型',
          key: 'type',
          headerAlign: 'center',
          align: 'center'
        },
        {
          title: '操作',
          key: 'controls',
          minWidth: '150px',
          type: 'template',
          template: 'controls',
          headerAlign: 'center',
          align: 'center'
        }
      ],
      data: []
    }
  },
  created () {
    this.getList()
  },
  methods: {
    getList () {
      this.tableLoading = true
      let _this = this
      ajax.get({
        url: '/Api/Menu/getMenuList',
        userinfo: true
      }).then(res => {
        _this.data = res.result.list
        _this.tableLoading = false
      })
    },
    add () {
      this.forms = { ...this.defaultForms }
    },
    addSub (row) {
      let forms = JSON.parse(JSON.stringify(this.defaultForms))
      forms.defaultData.pid = row.id
      this.forms = { ...forms }
    },
    edit (row) {
      let forms = JSON.parse(JSON.stringify(this.defaultForms))
      forms.url = '/Api/Menu/saveMenu'
      forms.method = 'post'
      forms.defaultData = {
        permission: row.name,
        text: row.menu_name,
        pid: row.m_pid,
        type: row.type,
        route: row.router,
        route_type: row.router_type,
        icon: row.icon,
        order: row.sort,
        m_id: row.id
      }
      forms.title = '编辑'
      this.forms = { ...forms }
    },
    sendDel (row) {
      let _this = this
      ajax.post({
        url: '/Api/Menu/delMenu',
        userinfo: true,
        data: {
          m_id: row.id
        }
      }).then(res => {
        _this.getList()
        this.$Notice.success({
          title: '系统提示',
          duration: 3,
          desc: '提交成功'
        })
      })
    }
  }
}
</script>

<style>
  .module-list{
    padding: 0 10px;
  }
  .module-list .ivu-btn{
    padding: 5px 10px 6px;
    margin: 0 3px;
  }
</style>

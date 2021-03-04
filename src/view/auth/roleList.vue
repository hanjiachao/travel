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
  .organization-list >>> .ivu-btn {
    margin-right: 3px;
  }
</style>
<template>
  <div class="organization control-panel" style="padding: 10px;">
    <!--<div>-->
    <!--<search-panel :config="defaultForms" @query="query" @empty="empty" :options="search" v-show="searchPanelShow"></search-panel>-->
    <!--</div>-->
    <div style="padding-bottom: 10px">
      <div style="float: left;">
        <Button @click="add" v-if="!simple && means.hasPermission('AddRole')">添加</Button>
      </div>
      <div class="clear"></div>
    </div>
    <el-table
      :data="tableData"
      class="organization-list"
      style="width: 100%;margin-bottom: 20px;"
      border
      stripe
      highlight-current-row
      ref="table"
      v-loading="tableLoading"
      @current-change="rowChange"
      row-key="id">
      <el-table-column v-for="(column, index) in tableColumns" :key="index"
                       :prop="column.key"
                       :label="column.title"
                       :align="index === 0 ? 'left' : 'center'"
                       :fixed="column.fixed? column.fixed : false"
                       show-overflow-tooltip>
      </el-table-column>
      <el-table-column
        :width="means.operationWidth(powerList)"
        v-if="!simple && means.operationAllow(powerList)"
        align="center">
        <template slot="header" slot-scope="scope">
          操作
        </template>
        <template slot-scope="scope">
          <el-tooltip content="创建子角色" placement="top">
            <Button :disabled="operationUnallow(scope.row)" v-if="means.hasPermission('add_role')" @click="addSub(scope.row)">
              <Icon type="md-add"></Icon>
            </Button>
          </el-tooltip>
          <Poptip
            transfer
            confirm
            v-if="means.hasPermission('DelRole')"
            title="确认要删除吗?"
            @on-ok="sendDel(scope.row)"
            ok-text="确定"
            cancel-text="取消">
            <el-tooltip content="删除 " placement="top">
              <Button :disabled="operationUnallow(scope.row)">
                <Icon type="md-trash"></Icon>
              </Button>
            </el-tooltip>
          </Poptip>
          <el-tooltip v-if="means.hasPermission('SaveRole')" content="编辑" placement="top">
            <Button @click="edit(scope.row)" :disabled="operationUnallow(scope.row)">
              <Icon type="ios-brush" />
            </Button>
          </el-tooltip>
        </template>
      </el-table-column>
    </el-table>
    <form-modal :config="{}" v-model="forms" @save-success="getList"></form-modal>
  </div>
</template>

<script>
import ajax from '@/libs/ajax'
import means from '@/libs/means'
import store from '@/store'
import formModal from '@/components/data-table/form-modal.vue'
import controlPanel from '@/components/data-table/control-panel.vue'
import searchPanel from '@/components/data-table/search-panel.vue'
export default {
  name: 'roleList',
  components: {
    'form-modal': formModal,
    'control-panel': controlPanel,
    'search-panel': searchPanel
  },
  props: {
    controls: {
      type: Object,
      default: () => {}
    },
    simple: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      tableLoading: true,
      powerList: ['AddRole', 'DelRole', 'SaveRole'],
      cruuentOrgan: {},
      searchPanelShow: false,
      columnFilterShow: false,
      means: means,
      store: store,
      url: '',
      search: [],
      forms: {},
      showColumns: [],
      columnList: [{
        title: '角色名称',
        key: 'name',
        hideDisabled: true
      }, {
        title: '备注',
        key: 'remark',
        hideDisabled: true
      }],
      tableData: [],
      defaultForms: {
        title: '添加',
        confirm: true,
        url: '/Api/Role/addRole',
        defaultData: {
        },
        formItems: [{
          type: 'text',
          name: 'name',
          label: '角色名称',
          rules: ['required']
        }, {
          type: 'textarea',
          name: 'remark',
          label: '备注'
        }]
      }
    }
  },
  methods: {
    operationUnallow (row) {
      return row.organization_id === 0 && this.notAdmin()
    },
    rowChange (row) {
      this.$emit('row-change', row)
    },
    query (searchForms) {
    },
    empty (searchForms) {
    },
    initShowColumns () {
      this.showColumns = this.columnList.filter(item => {
        return !item.hide
      }).map(item => {
        return item.key
      })
    },
    searchPanelShowChange () {
      this.searchPanelShow = !this.searchPanelShow
    },
    getList () {
      this.tableLoading = true
      let _this = this
      ajax.get({
        url: _this.url,
        userinfo: true
      }).then(res => {
        let list = res.result.role
        _this.tableData = list
        if (_this.tableData.length > 0) {
          _this.$refs.table.setCurrentRow(_this.tableData[0])
          _this.tableLoading = false
        }
      })
    },
    add () {
      this.forms = { ...this.defaultForms }
      this.forms.defaultData.pid = '0'
    },
    addSub (row) {
      let forms = { ...this.defaultForms }
      forms.url = 'role/' + row.id
      this.forms = { ...forms }
    },
    sendDel (row) {
      let _this = this
      let url = '/Api/Role/delRole'
      ajax.post({
        url: url,
        userinfo: true,
        data: {
          r_id: row.r_id
        }
      }).then(res => {
        _this.getList()
        this.$Notice.success({
          title: '系统提示',
          duration: 3,
          desc: '删除成功'
        })
      }).catch((err) => {
        this.$Notice.error({
          title: '系统提示',
          duration: 3,
          desc: err.errorMessage
        })
      })
    },
    edit (row) {
      let forms = { ...this.defaultForms }
      forms.url = '/Api/Role/saveRole'
      forms.method = 'post'
      forms.defaultData = row
      forms.title = '编辑'
      let editForms = []
      for (let i in forms.formItems) {
        if (forms.formItems[i].editDisable) {
          continue
        }
        editForms.push(forms.formItems[i])
      }
      forms.formItems = editForms
      this.forms = { ...forms }
    },
    notAdmin () {
      return this.store.state.admin.info.info.role_id !== 1 && this.store.state.admin.info.info.role_id !== 2
    }
  },
  computed: {
    allTableColumns () {
      return this.columnList.map(item => {
        return {
          key: item.title,
          value: item.key,
          hideDisabled: item.hideDisabled
        }
      })
    },
    tableColumns () {
      let _this = this
      let columns = this.columnList.map(item => {
        item = { ...item }
        item.align = 'center'
        if (_this.showColumns.indexOf(item.key) < 0) {
          return null
        }
        item.tooltip = true
        return item
      }).filter(item => {
        return item
      })
      return columns
    }
  },
  watch: {
  },
  created () {
    if (this.$route.path === '/auth/index') {
      this.url = '/Api/Role/roleList'
    }else {
      this.url = '/Api/Account/roleList'
    }
    this.getList()
    this.initShowColumns()
  }
}
</script>

<style>
  .organization-list .ivu-btn{
    padding: 5px 10px 6px;
  }
</style>

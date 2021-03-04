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
  <div class="organization" style="padding: 10px;">
    <!--<div>-->
    <!--<search-panel :config="defaultForms" @query="query" @empty="empty" :options="search" v-show="searchPanelShow"></search-panel>-->
    <!--</div>-->
    <div style="padding: 10px">
      <!--<div style="float: left;">-->
      <!--<Button @click="add" v-if="means.hasPermission('Framework/add')">添加</Button>-->
      <!--</div>-->
      <div style="float: right;" class="control-panel">
        <ButtonGroup>
          <Button icon="ios-search" @click="searchPanelShowChange" :type="searchPanelShow?'primary':'default'" v-if="search.length > 0"></Button>
          <Button @click="columnFilterShow=!columnFilterShow" class="column-control">
            <div class="fl box">
              <Icon type="ios-list-box"></Icon>
              <Icon type="ios-arrow-down"></Icon>
            </div>
            <Dropdown class="fl" trigger="custom" :visible="columnFilterShow"  placement="bottom-end">
              <DropdownMenu slot="list">
                <CheckboxGroup v-model="showColumns">
                  <DropdownItem v-for="(citem, cindex) in allTableColumns" :key="cindex">
                    <span @click.stop="">
                      <Checkbox :label="citem.value" :disabled="citem.hideDisabled">
                        <span class="column-show-filter">{{citem.key}}</span>
                      </Checkbox>
                    </span>
                  </DropdownItem>
                </CheckboxGroup>
              </DropdownMenu>
            </Dropdown>
          </Button>
        </ButtonGroup>
      </div>
      <div style="clear: both;"></div>
    </div>
    <el-table
      ref="table"
      :data="tableData"
      class="organization-list"
      style="width: 100%;margin-bottom: 20px;"
      border
      stripe
      row-key="fr_id">
      <el-table-column v-for="(column, index) in tableColumns" :key="index"
                       :prop="column.key"
                       :label="column.title"
                       :fixed="column.fixed? column.fixed : false"
                       show-overflow-tooltip>
      </el-table-column>
      <el-table-column
        fixed="right"
        width="150"
        align="center">
        <template slot="header" slot-scope="scope">
          操作
        </template>
        <template slot-scope="scope">
          <Button @click="addSub(scope)" v-if="means.hasPermission('Role/add')">
            <Icon type="md-add"></Icon>
          </Button>
          <Poptip
            v-if="means.hasPermission('Role/delete')"
            transfer
            confirm
            title="确认要删除吗?"
            @on-ok="sendDel"
            ok-text="确定"
            cancel-text="取消">
            <Button @click="del(scope.row.fr_id)">
              <Icon type="md-trash"></Icon>
            </Button>
          </Poptip>
          <Button @click="edit(scope)" v-if="means.hasPermission('Role/edit')">
            <Icon type="ios-brush" />
          </Button>
        </template>
      </el-table-column>
    </el-table>
    <form-modal :config="{}" v-model="forms" @save-success="getList"></form-modal>
  </div>
</template>

<script>
import ajax from '@/libs/ajax'
import means from '@/libs/means'
import formModal from '@/components/data-table/form-modal.vue'
import controlPanel from '@/components/data-table/control-panel.vue'
import searchPanel from '@/components/data-table/search-panel.vue'
export default {
  name: 'organization',
  components: {
    'form-modal': formModal,
    'control-panel': controlPanel,
    'search-panel': searchPanel
  },
  data () {
    return {
      searchPanelShow: false,
      columnFilterShow: false,
      currentId: -1,
      means: means,
      search: [],
      forms: {},
      showColumns: [],
      columnList: [{
        title: '工会名称',
        key: 'fr_name',
        hideDisabled: true
      }],
      tableData: [],
      defaultForms: {
        title: '添加',
        confirm: true,
        url: '/Framework/add',
        defaultData: {
          fr_pid: 0
        },
        formItems: [
          {
            type: 'text',
            name: 'fr_name',
            label: '工会名称',
            rules: ['required']
          },
          {
            type: 'text',
            name: 'account',
            label: '账号',
            editDisable: true,
            rules: ['required']
          },
          {
            type: 'password',
            name: 'password',
            label: '密码',
            editDisable: true,
            rules: ['required']
          },
          {
            type: 'password',
            name: 'repeat_password',
            label: '确认密码',
            editDisable: true,
            rules: ['required', 'equalTo:password']
          }
        ]
      }
    }
  },
  methods: {
    toogleExpand (row) {
      let $table = this.$refs.table
      this.tableData.map((item) => {
        if (row.id !== item.id) {
          $table.toggleRowExpansion(item, false)
        }
      })
      $table.toggleRowExpansion(row)
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
      let _this = this
      ajax.get({
        url: '',
        userinfo: true
      }).then(res => {
        _this.tableData = res.result.list
      })
    },
    add () {
      this.forms = { ...this.defaultForms }
    },
    addSub (data) {
      let forms = { ...this.defaultForms }
      forms.defaultData.fr_pid = data.row.fr_id
      this.forms = { ...forms }
    },
    sendDel () {
      let _this = this
      ajax.post({
        url: '/Framework/delete',
        userinfo: true,
        data: {
          id: this.currentId
        }
      }).then(res => {
        _this.getList()
        this.$Notice.success({
          title: '系统提示',
          duration: 3,
          desc: '提交成功'
        })
      })
    },
    del (id) {
      this.currentId = id
    },
    edit (data) {
      let forms = { ...this.defaultForms }
      forms.url = '/Framework/edit'
      forms.defaultData = data.row
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
        // if (item.type || item.key.indexOf('.') > -1) {
        //   item.render = _this.getRender(item.type)
        // }
        // if (item.sortable) {
        //   item.sortable = 'custom'
        // }
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

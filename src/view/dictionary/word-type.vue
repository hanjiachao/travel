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
  .organization-list >>> .ivu-btn{
    margin-right: 3px;
  }
</style>
<template>
  <div class="organization" style="padding: 10px;">
    <div style="padding: 10px">
      <div style="float: left;">
        <Button @click="add" v-if="means.hasPermission('add_dictionary')">添加</Button>
      </div>
      <div style="clear: both;"></div>
    </div>
    <el-table
      v-loading="tableLoading"
      ref="table"
      :data="tableData"
      class="organization-list"
      style="width: 100%;margin-bottom: 20px;"
      border
      stripe
      highlight-current-row
      @current-change="rowChange">
      <el-table-column v-for="(column, index) in showColumns"
                       :key="index"
                       :prop="column.key"
                       :label="column.title"
                       align="center"
                       :fixed="column.fixed? column.fixed : false"
                       show-overflow-tooltip>
      </el-table-column>
      <el-table-column
        v-if="means.operationAllow(powerList)"
        :width="means.operationWidth(powerList)"
        align="center">
        <template slot="header" slot-scope="scope">
          操作
        </template>
        <template slot-scope="scope">
          <Poptip
            transfer
            confirm
            title="确认要删除吗?"
            v-if="means.hasPermission('delete_dictionary_type')"
            @on-ok="sendDel(scope.row)"
            ok-text="确定"
            cancel-text="取消">
            <el-tooltip content="删除" placement="top">
              <Button>
                <Icon type="md-trash"></Icon>
              </Button>
            </el-tooltip>
          </Poptip>
          <el-tooltip content="编辑" placement="top">
            <Button @click="edit(scope.row)" v-if="means.hasPermission('edit_dictionary_type')">
              <Icon type="ios-brush" />
            </Button>
          </el-tooltip>
        </template>
      </el-table-column>
    </el-table>
    <paging :total="pageData.total" :pageSize="pageData.pageSize" v-model="page" @on-change="toPage"></paging>
    <form-modal :config="{}" v-model="forms" @save-success="getList"></form-modal>
  </div>
</template>

<script>
import ajax from '@/libs/ajax'
import means from '@/libs/means'
import formModal from '@/components/data-table/form-modal.vue'
import paging from '@/components/data-hidden/paging'
export default {
  name: 'word-type',
  components: {
    'form-modal': formModal,
    paging
  },
  data () {
    return {
      powerList: ['delete_dictionary_type', 'edit_dictionary_type'],
      split: 0.5,
      searchPanelShow: false,
      pageData: {
        total: 0,
        pageSize: 20
      },
      page: 1,
      currentId: -1,
      means: means,
      search: [],
      forms: {},
      showColumns: [{
        title: '类型',
        key: 'type'
      }],
      tableData: [],
      defaultForms: {
        title: '添加',
        confirm: true,
        url: 'dictionary',
        defaultData: {
          sort: 0
        },
        formItems: [
          {
            type: 'text',
            name: 'type',
            label: '类型',
            rules: ['required']
          },
          {
            type: 'text',
            name: 'key',
            editDisable: true,
            label: '初始字段显值',
            rules: ['required']
          },
          {
            type: 'text',
            name: 'value',
            editDisable: true,
            label: '初始字段真值',
            rules: ['required']
          },
          {
            name: 'sort',
            label: '字段排序',
            type: 'text',
            editDisable: true,
            rules: ['required']
          }
        ]
      },
      tableLoading: true
    }
  },
  methods: {
    query (searchForms) {
    },
    empty (searchForms) {
    },
    toPage (page) {
      this.page = page
      this.getList()
    },
    rowChange (row) {
      this.$emit('row-change', row)
    },
    searchPanelShowChange () {
      this.searchPanelShow = !this.searchPanelShow
    },
    getList () {
      let _this = this
      this.tableLoading = true
      ajax.get({
        url: 'dictionary/type',
        userinfo: true,
        params: {
          page: _this.page
        }
      }).then(res => {
        _this.tableData = res.result.list
        _this.pageData = {
          total: res.result.meta.total,
          pageSize: res.result.meta.per_page
        }
        if (_this.tableData.length > 0) {
          _this.$refs.table.setCurrentRow(_this.tableData[0])
        }
        _this.tableLoading = false
      })
    },
    add () {
      this.forms = { ...this.defaultForms }
    },
    sendDel (data) {
      let _this = this
      let url = 'dictionary/type/' + data.type
      ajax.delete({
        url: url,
        userinfo: true
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
    edit (data) {
      let forms = { ...this.defaultForms }
      forms.url = 'dictionary/type/' + data.type
      forms.method = 'patch'
      forms.defaultData = data
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
  },
  created () {
    this.getList()
  }
}
</script>

<style>
  .organization-list .ivu-btn{
    padding: 5px 10px 6px;
  }
</style>

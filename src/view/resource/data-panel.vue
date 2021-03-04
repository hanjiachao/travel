<style scoped>
  .control-panel >>> .fl button {
    margin-right: 10px;
  }

  .control-panel >>> .column-control {
    padding: 0;
  }

  .control-panel >>> .column-control .box {
    padding: 6px 10px;
    display: inline-block;
  }

  .control-panel >>> .column-control .ivu-dropdown-rel {
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

  .organization >>> .el-table--border {
    z-index: 1 !important;
  }

  .organization-list >>> .ivu-btn {
    margin-right: 3px;
  }
</style>
<template>
  <div class="organization" style="padding: 10px;">
    <div style="padding: 20px 0" v-if="!simple && means.hasPermission('AddLine')">
      <div style="float: left;">
        <Button @click="add">添加</Button>
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
      @current-change="rowChange"
      row-key="id">
      <el-table-column v-for="(column, index) in showColumns"
                       :key="index"
                       :prop="column.value"
                       :label="column.label"
                       align="center"
                       show-overflow-tooltip>
      </el-table-column>
      <el-table-column
        v-if="!simple && means.operationAllow(powerList)"
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
            v-if="!simple && means.hasPermission('DelLine')"
            @on-ok="sendDel(scope.row)"
            ok-text="确定"
            cancel-text="取消">
            <el-tooltip content="删除" placement="top">
              <Button>
                <Icon type="md-trash"></Icon>
              </Button>
            </el-tooltip>
          </Poptip>
          <!--<el-tooltip content="添加开团时间" placement="top">
              <Button @click="edit(scope.row)" v-if="simple && means.hasPermission('AddLineTime')">
                  <Icon type="ios-brush" />
              </Button>
          </el-tooltip>-->
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
    props: {
      controls: {
        type: Object,
        default: () => {
        }
      },
      simple: {
        type: Boolean,
        default: false
      }
    },
    data() {
      return {
        url: '',
        powerList: ['DelLine'],
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
        showColumns: [
          {
            value: 'l_letter',
            label: '路线英文简称'
          }, {
            value: 'l_name',
            label: '路线名'
          }, {
            value: 'l_days',
            label: '天数'
          }, {
            value: 'l_type',
            label: '路线类型'
          },
          // {
          //   value: 'l_land_type',
          //   label: '所属地接'
          // }, {
          //   value: 'l_land_name',
          //   label: '地接路线名'
          // }
        ],
        tableData: [],
        defaultForms: {
          title: '添加',
          confirm: true,
          url: '/Api/Line/addLine',
          defaultData: {},
          formItems: [{
            type: 'text',
            name: 'l_name',
            label: '路线名',
            rules: ['required']
          },{
            type: 'text',
            name: 'l_letter',
            label: '路线英文简称',
            rules: ['required','englishLetters']
          }, {
            type: 'text',
            name: 'l_days',
            label: '天数',
            rules: ['required']
          }, {
            type: 'select',
            name: 'l_type',
            label: '线路类型',
            options: [
              {
                value: '国内长线',
                label: '国内长线'
              },
              {
                value: '周边短线',
                label: '周边短线'
              },
              {
                value: '出境游',
                label: '出境游'
              }
            ],
            rules: ['required']
          }, {
            type: 'text',
            name: 'l_land_type',
            label: '所属地接',
            rules: ['required']
          }, {
            type: 'text',
            name: 'l_land_name',
            label: '地接路线名',
            rules: ['required']
          }]
        },
        addDefaultForms: {
          title: '添加',
          confirm: true,
          url: 'role',
          defaultData: {},
          formItems: [{
            type: 'date',
            name: 'lt_leave_time',
            label: '开团时间',
            rules: ['required']
          }, {
            type: 'text',
            name: 'lt_total_number',
            label: '容纳人数',
            rules: ['required']
          }]
        },
        tableLoading: true
      }
    },
    methods: {
      query(searchForms) {
      },
      empty(searchForms) {
      },
      toPage(page) {
        this.page = page
        this.getList()
      },
      rowChange(row) {
        this.$emit('row-change', row)
      },
      searchPanelShowChange() {
        this.searchPanelShow = !this.searchPanelShow
      },
      getList() {
        let _this = this
        this.tableLoading = true
        ajax.post({
          url: _this.url,
          userinfo: true,
          data: {
            limit: 10,
            page: this.page - 1
          }
        }).then(res => {
          _this.tableData = res.result.list
          _this.pageData = {
            pageSize: 10,
            total: Number(res.result.count)
          }
          _this.tableLoading = false
          if (_this.tableData.length > 0) {
            _this.$refs.table.setCurrentRow(_this.tableData[0])
          }
        })
      },
      add() {
        this.forms = {...this.defaultForms}
      },
      sendDel(row) {
        let _this = this
        ajax.post({
          url: '/Api/Line/delLine',
          userinfo: true,
          data: {
            l_id: row.l_id
          }
        }).then(res => {
          _this.getList()
          this.$Notice.success({
            title: '系统提示',
            duration: 3,
            desc: '删除成功'
          })
        })
      },
      /*edit(data) {
          let forms = {...this.addDefaultForms}
          forms.url = '/Api/Line/addLineTime'
          forms.method = 'post'
          forms.defaultData = {
              l_id: data.l_id
          }
          forms.title = '添加开团时间'
          let editForms = []
          for (let i in forms.formItems) {
              if (forms.formItems[i].editDisable) {
                  continue
              }
              editForms.push(forms.formItems[i])
          }
          forms.formItems = editForms
          this.forms = {...forms}
      }*/
    },
    computed: {},
    created() {
      if (this.$route.path === '/resource/course') {
        this.url = '/Api/Line/getLineList'
      }else {
        this.url = '/Api/Line/getLTDataList'
      }
      this.getList()
    }
  }
</script>

<style>
  .organization-list .ivu-btn {
    padding: 5px 10px 6px;
  }
</style>

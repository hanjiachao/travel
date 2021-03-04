<style>
  .demo-table-expand {
    font-size: 0;
  }

  .demo-table-expand label {
    width: 90px;
    color: #99a9bf;
  }

  .demo-table-expand .el-form-item {
    margin-right: 0;
    margin-bottom: 0;
    width: 50%;
  }

  .administrator-list .ivu-btn {
    padding: 5px 10px 6px;
  }
</style>
<style scoped lang="less">
  ul, li {
    list-style: none;
  }

  .operation {
    padding: 5px;
    float: right;
    margin-left: 10px;
  }

  .info-list {
    padding-bottom: 10px;

    .info-item {
      margin-left: 10px;
      font-size: 15px;
      line-height: 30px;
    }
  }

  .add-principal {
    display: block;
    margin-bottom: 20px;
    width: 100%
  }

  .no-principal {
    text-align: center;
    padding: 100px 0;
    font-size: 15px;
  }
</style>
<template>
  <Split v-model="split" v-cloak>
    <div slot="left">
      <role-list :simple="true" @row-change="rowChange" ref="role"></role-list>



      <el-upload :before-upload="beforeUpload">
        <i class="el-icon-plus" />
      </el-upload>
    </div>
    <div slot="right" class="organization control-panel" style="padding: 18px 10px">
      <div v-if="rowId === 2 || rowId === 3 || rowId === 4"
           style="text-align: center; padding-top: 100px; font-size: 16px;">
        该角色不支持直接创建管理员，请去组织机构处创建负责人
      </div>
      <div v-else>
        <div style="padding: 10px 0">
          <div style="float: left;">
            <Button @click="add" v-if="means.hasPermission('AddAccount')">添加</Button>
          </div>
          <div class="clear"></div>
        </div>
        <div class="administrator-list">
          <el-table
            :data="tableData"
            ref="table"
            style="width: 100%"
            border
            v-loading="tableLoading"
            stripe>
            <el-table-column
              v-for="(item, index) in showItem"
              align="center"
              :key="index"
              :label="paramMap[item]"
              show-overflow-tooltip
              :prop="item">
            </el-table-column>
            <el-table-column label="公司英文简称"
                             align="center"
                             v-if="rowId === '6'"
                             width="200px">
              <template slot-scope="scope">
                <span>{{scope.row.ad_letter}}</span>
              </template>>
            </el-table-column>
            <el-table-column
              align="center"
              label="操作"
              v-if="means.operationAllow(powerList)"
              :width="means.operationWidth(powerList)">
              <template slot-scope="scope">
                <el-tooltip content="编辑账号" placement="top" v-if="means.hasPermission('SaveAccount')">
                  <Button @click="edit(scope.row)" style="margin: 0 3px">
                    <Icon type="ios-brush"/>
                  </Button>
                </el-tooltip>
                <Poptip
                  transfer
                  confirm
                  title="确认要重置吗?"
                  @on-ok="resetPass(scope.row)"
                  v-if="means.hasPermission('ResetPassword')"
                  ok-text="确定"
                  cancel-text="取消">
                  <el-tooltip content="重置密码" placement="top">
                    <Button style="margin: 0 3px">
                      <Icon type="md-refresh"/>
                    </Button>
                  </el-tooltip>
                </Poptip>
                <Poptip
                  transfer
                  confirm
                  title="确认要删除吗?"
                  @on-ok="delPass(scope.row)"
                  v-if="means.hasPermission('DelAccount')"
                  ok-text="确定"
                  cancel-text="取消">
                  <el-tooltip content="删除账号" placement="top">
                    <Button style="margin: 0 3px">
                      <Icon type="md-trash"/>
                    </Button>
                  </el-tooltip>
                </Poptip>
              </template>
            </el-table-column>
          </el-table>
        </div>
        <paging :total="pageData.total" :pageSize="pageData.pageSize" v-model="page" @on-change="toPage"></paging>
        <form-modal :config="{}" v-model="forms" @save-success="getAdminList"></form-modal>
      </div>
    </div>
  </Split>
</template>

<script>
  import ajax from '@/libs/ajax'
  import means from '@/libs/means'
  import formModal from '@/components/data-table/form-modal.vue'
  import roleList from './roleList.vue'
  import paging from '@/components/data-hidden/paging'

  export default {
    name: 'administrator',
    components: {
      'form-modal': formModal,
      'role-list': roleList,
      paging
    },
    data() {
      return {
        tableLoading: true,
        powerList: ['SaveAccount', 'ResetPassword', 'DelAccount'],
        currentRow: {},
        means: means,
        split: 0.4,
        rowId: 0,
        forms: {},
        cruuentId: 0,
        defaultForms: {
          title: '添加',
          confirm: true,
          url: '/Api/Account/addAccount',
          defaultData: {},
          formItems: [
            {
              type: 'text',
              name: 'ad_name',
              label: '账号',
              rules: ['required']
            }
          ]
        },
        page: 1,
        pageData: {
          total: 0,
          pageSize: 20
        },
        tableData: [],
        showItem: ['ad_name', 'r_name'],
        paramMap: {
          ad_name: '账号',
          r_name: '角色'
        }
      }
    },
    methods: {
      getAdminList() {
        let _this = this
        this.tableData = []
        let url = '/Api/Account/accountList'
        this.tableLoading = true
        ajax.post({
          url: url,
          userinfo: true,
          data: {
            r_id: this.rowId,
            limit: 20,
            page: this.page - 1
          }
        }).then(res => {
          _this.tableData = res.result.list
          _this.pageData = {
            pageSize: 20,
            total: Number(res.result.count)
          }
          _this.tableLoading = false
        })
      },
      rowChange(row) {
        this.page = 1
        this.rowId = row.id
        this.currentRow = row
        if (this.rowId === 2 || this.rowId === 3 || this.rowId === 4) {
          return false
        }
        this.getAdminList()
      },
      toPage(page) {
        this.page = page
        this.getAdminList()
      },
      add() {
        let forms = {...this.defaultForms}
        if (this.rowId === '6') {
          let formItems = forms.formItems.concat()
          formItems.push({
            type: 'text',
            name: 'ad_letter',
            label: '公司英文简称',
            rules: ['required','englishLetters']
          },{
            type: 'text',
            name: 'ad_prompt',
            label: '出发前提示',
            rules: ['required']
          },{
            type: 'text',
            name: 'ad_pay_type',
            label: '付款方式',
            rules: ['required']
          },{
            type: 'image',
            name: 'ad_logo',
            label: '公司logo',
            limit: 1,
            rules: ['required']
          },{
            type: 'image',
            name: 'ad_seal',
            label: '确认单盖章',
            limit: 1,
            rules: ['required']
          })
          forms.formItems = formItems
        }
        forms.url = '/Api/Account/addAccount'
        forms.defaultData = {
          r_id: this.rowId
        }
        this.forms = forms
      },
      edit(row) {
        let forms = {...this.defaultForms}
        if (this.rowId === '6') {
          let formItems = forms.formItems.concat()
          formItems.push({
            type: 'text',
            name: 'ad_letter',
            label: '公司英文简称',
            rules: ['required','englishLetters']
          },{
            type: 'image',
            name: 'ad_logo',
            label: '公司logo',
            limit: 1,
            rules: ['required']
          },{
            type: 'image',
            name: 'ad_seal',
            label: '确认单盖章',
            limit: 1,
            rules: ['required']
          })
          forms.formItems = formItems
        }
        forms.url = '/Api/Account/saveAccount'
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
        this.forms = {...forms}
      },
      resetPass(row) {
        let _this = this
        let url = '/Api/Account/resetPassword'
        ajax.post({
          url: url,
          userinfo: true,
          data: {
            ad_id: row.ad_id
          }
        }).then(res => {
          _this.getAdminList()
          this.$Notice.success({
            title: '系统提示',
            duration: 3,
            desc: '重置成功'
          })
        })
      },
      delPass(row) {
        let _this = this
        let url = '/Api/Account/delAccount'
        ajax.post({
          url: url,
          userinfo: true,
          data: {
            ad_id: row.ad_id
          }
        }).then(res => {
          _this.getAdminList()
          this.$Notice.success({
            title: '系统提示',
            duration: 3,
            desc: '删除成功'
          })
        })
      }
    }
  }
</script>

<style scoped>

</style>

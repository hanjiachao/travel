<style scoped lang="less">
  .partner{
    padding: 10px;
    .partner-table{
      /deep/ .ivu-btn{
        padding: 5px 10px 6px;
      }
    }
  }
</style>
<template>
   <div class="partner">
     <div v-if="means.hasPermission('add_cooperator')">
       <Button @click="add">添加</Button>
     </div>
     <div style="padding: 10px 0;">
       <el-table
         :data="tableData"
         ref="table"
         style="width: 100%"
         border
         v-loading="tableLoading"
         class="partner-table"
         stripe>
         <el-table-column
           v-for="(item, index) in showItem"
           align="center"
           :key="index"
           show-overflow-tooltip
           :label="item.label"
           :prop="item.value">
         </el-table-column>
         <!--<el-table-column-->
           <!--align="center"-->
           <!--label="详情">-->
           <!--<template slot-scope="scope">-->
             <!--<el-button type="text" @click="lookDetail(scope.row)">查看详情</el-button>-->
           <!--</template>-->
         <!--</el-table-column>-->
         <!--v-if="auditInfo && means.operationAllow([auditInfo.auth])"-->
         <!--:width="means.operationWidth([auditInfo.auth])"-->
         <el-table-column
           align="center"
           label="操作"
           v-if="means.operationAllow(powerList)"
           :width="means.operationWidth(powerList)">
           <template slot-scope="scope">
             <Poptip
               v-if="means.hasPermission('delete_cooperator')"
               transfer
               confirm
               title="确认要删除吗?"
               @on-ok="sendDel(scope.row)"
               ok-text="确定"
               cancel-text="取消">
               <el-tooltip content="删除该机构" placement="top">
                 <Button style="margin: 0 3px">
                   <Icon type="md-trash"></Icon>
                 </Button>
               </el-tooltip>
             </Poptip>
             <el-tooltip content="编辑该机构" placement="top" v-if="means.hasPermission('edit_cooperator')">
               <Button style="margin: 0 3px" @click="edit(scope.row)">
                 <Icon type="ios-brush" />
               </Button>
             </el-tooltip>
             <Poptip
               transfer
               confirm
               title="确认要重置吗?"
               @on-ok="resetPass(scope.row)"
               v-if="means.hasPermission('reset_pass_cooperator')"
               ok-text="确定"
               cancel-text="取消">
               <el-tooltip content="重置密码" placement="top">
                 <Button style="margin: 0 3px">
                   <Icon type="md-refresh"></Icon>
                 </Button>
               </el-tooltip>
             </Poptip>
           </template>
         </el-table-column>
       </el-table>
     </div>
     <paging :total="pageData.total" v-model="page" :page-size="pageData.pageSize" @on-change="toPage"></paging>
     <form-modal :config="{}" v-model="forms" @save-success="getTableData"></form-modal>
     <detail-modal ref="detailModal" :data="detailInfo" :title="detailTitle" :hideItem="hideItem"></detail-modal>
     <form-modal :config="{}" v-model="editForms" @save-success="getTableData"></form-modal>
   </div>
</template>

<script>
import ajax from '@/libs/ajax'
import means from '@/libs/means'
import formModal from '../../components/data-table/form-modal.vue'
import detailModal from '../audit/detail/detail-modal.vue'
import paging from '@/components/data-hidden/paging'

export default {
  name: 'partnersIndex',
  components: {
    'form-modal': formModal,
    'detail-modal': detailModal,
    paging
  },
  data () {
    return {
      // table表格数据
      powerList: ['delete_cooperator', 'edit_cooperator', 'reset_pass_cooperator'],
      means: means,
      tableLoading: true,
      tableData: [],
      forms: {},
      editForms: {},
      formItems: [{
        type: 'text',
        name: 'company_name',
        label: '合作商名称',
        editAble: true,
        rules: ['required']
      }, {
        type: 'text',
        name: 'address',
        label: '合作商地址',
        editAble: true,
        rules: ['required']
      }, {
        type: 'text',
        name: 'company_user',
        label: '负责人',
        editAble: true,
        rules: ['required']
      }, {
        type: 'text',
        name: 'mobile',
        label: '负责人手机号',
        editAble: true,
        rules: ['required', 'mobile']
      }, {
        type: 'text',
        name: 'username',
        label: '账号',
        rules: ['required']
      }, {
        type: 'password',
        name: 'password',
        label: '密码',
        rules: ['required']
      }, {
        type: 'text',
        name: 'write_off_password',
        label: '核销密码',
        defaultValue: '123456',
        editAble: true,
        rules: ['required', 'stringLength:6,6']
      }],
      // 展示和隐藏的数据
      showItem: [{
        value: 'company_name',
        label: '合作商名称'
      }, {
        value: 'username',
        label: '账号'
      }, {
        value: 'address',
        label: '地址'
      }, {
        value: 'company_user',
        label: '负责人'
      }, {
        value: 'mobile',
        label: '负责人手机号'
      }, {
        value: 'write_off_password',
        label: '核销密码'
      }],
      hideItem: {
        type: 'form',
        itemList: [{
          value: 'company_name',
          label: '合作商名称'
        }, {
          value: 'address',
          label: '地址'
        }, {
          value: 'company_user',
          label: '负责人'
        }, {
          value: 'mobile',
          label: '负责人手机号'
        }, {
          value: 'username',
          label: '账号'
        }, {
          value: 'write_off_password',
          label: '核销密码'
        }]
      },
      // 详情数据
      detailInfo: {},
      detailTitle: '',
      // 分页数据
      pageData: {
        pageSize: 20,
        total: 0
      },
      page: 1
    }
  },
  methods: {
    // 获取表格数据
    getTableData () {
      this.tableLoading = true
      let _this = this
      ajax.get({
        url: 'cooperators',
        userinfo: true
      }).then(res => {
        _this.tableData = res.result.list
        _this.pageData = {
          pageSize: parseInt(res.result.meta.per_page),
          total: parseInt(res.result.meta.total)
        }
        _this.tableLoading = false
      })
    },
    toPage (page) {
      this.page = page
      this.getTableData()
    },
    // 按钮操作方法
    add () {
      let forms = { ...this.forms }
      forms.url = 'cooperator'
      forms.title = '添加合作商'
      forms.formItems = [ ...this.formItems ]
      this.forms = forms
    },
    edit (row) {
      let forms = { ...this.forms }
      let formItems = this.formItems.filter(item => {
        return item.editAble
      })
      forms.url = 'cooperator/' + row.id
      forms.method = 'patch'
      forms.title = '编辑'
      forms.defaultData = row
      forms.formItems = formItems
      this.editForms = forms
    },
    sendDel (row) {
      let _this = this
      let url = 'cooperator/' + row.id
      ajax.delete({
        url: url,
        userinfo: true
      }).then(res => {
        _this.getTableData()
      })
    },
    resetPass (row) {
      let url = 'cooperator/reset_password/' + row.id
      ajax.patch({
        url: url,
        userinfo: true
      }).then(res => {
        this.$Notice.success({
          title: '系统提示',
          duration: 3,
          desc: '重置成功'
        })
      })
    },
    // 查看详情
    lookDetail (row) {
      this.detailInfo = row
      this.detailTitle = row.company_name
      this.$refs.detailModal.modalShow = true
    }
  },
  created () {
    this.getTableData()
  }
}
</script>

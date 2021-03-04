<style scoped>
  ul,li{
    list-style: none;
  }
  .members-list >>> .el-table__expanded-cell{
    padding: 20px 10px;
  }
  .card-body{
    padding: 15px;
  }
  .card-list >>> .ivu-card-body{
    padding: 0;
  }
  .card-list >>> .ivu-card {
    margin-bottom: 10px;
  }
  .card-title{
    color: #4C8BD5;
    font-size: 15px;
    cursor: pointer;
  }
  .card-title .title-icon{
    color: #666;
    float: right;
  }
  .material-list .material-item{
    padding: 10px 0;
  }
  .material-image-list{
    padding: 10px 0;
  }
  .material-image-list .material-image{
    padding: 0 5px;
    width: 100px;
    height: 100px;
  }
  .seacher-control{
    float: right;
    padding: 20px 0;
  }
  .seacher-control .seacher-btn{
    margin-left: 10px;
  }
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
<style>
  .members-list .ivu-btn{
    padding: 5px 10px 6px;
  }
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
  .prin-list .ivu-btn{
    padding: 5px 10px 6px;
  }
</style>
<template>
  <div style="padding: 0 10px;">
    <div class="seacher-box" v-if="seacherBox">
      <div style="width: 50%">
        <Input v-model="skey" size="large" placeholder="查询" />
      </div>
      <div class="seacher-control">
        <Button class="seacher-btn" @click="query" type="primary">查询</Button>
        <Button class="seacher-btn" @click="empty" type="default">清空</Button>
      </div>
      <div style="clear: both"></div>
    </div>
    <div>
      <div style="float: left;padding-bottom: 10px;">
        <Button @click="add" v-if="means.hasPermission('add_material_diffcult')" style="margin-right:10px;">添加</Button>
      </div>
      <div  style="float: right;padding-bottom: 10px;">
        <Button type="primary" style="margin-right: 10px;" @click="getTableData">刷新</Button>
        <!--<Button icon="ios-search" @click="seacherBox = !seacherBox" :type="seacherBox?'primary':'default'"></Button>-->
      </div>
      <div class="clear" style="padding-bottom: 10px;">
        <RadioGroup v-model="currentStatus" type="button" @on-change="statusChange">
          <Radio label="待审核">待提交</Radio>
          <Radio label="审核中">审核中</Radio>
          <Radio label="通过">已通过</Radio>
          <Radio label="驳回">已驳回</Radio>
          <Radio label="全部">全部</Radio>
        </RadioGroup>
      </div>
    </div>
    <div class="members-list">
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
          show-overflow-tooltip
          :label="item.label"
          :prop="item.value">
        </el-table-column>
        <el-table-column
          align="center"
          label="详情">
          <template slot-scope="scope">
            <el-button type="text" @click="toogleExpand(scope.row)">查看详情</el-button>
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          label="操作"
          v-if="means.operationAllow(powerList)"
          :width="means.operationWidth(powerList)">
          <template slot-scope="scope">
            <!--v-if="means.hasPermission('Staff/quit')"-->
            <!--<el-tooltip content="查看历史记录" placement="top">-->
              <!--<Button style="margin: 0 3px" @click="record(scope.row)">-->
                <!--<Icon type="ios-eye" />-->
              <!--</Button>-->
            <!--</el-tooltip>-->
            <Poptip
              transfer
              confirm
              title="确认要提交吗?"
              @on-ok="submitAudit(scope.row)"
              v-if="means.hasPermission('submit_material_diffcult')"
              ok-text="确定"
              cancel-text="取消">
              <el-tooltip content="提交审核" placement="top">
                <Button style="margin: 0 3px" :disabled="['审核中', '通过', '驳回'].indexOf(scope.row.audit_status) > -1">
                  <Icon type="md-paper-plane"></Icon>
                </Button>
              </el-tooltip>
            </Poptip>
            <!--v-if="means.hasPermission('Staff/edit')"-->
            <el-tooltip content="编辑" placement="top" v-if="means.hasPermission('edit_material_diffcult')">
              <Button style="margin: 0 3px" @click="edit(scope.row)" :disabled="['审核中', '通过'].indexOf(scope.row.audit_status) > -1">
                <Icon type="ios-brush" />
              </Button>
            </el-tooltip>
            <!--v-if="means.hasPermission('Staff/delete')"-->
            <!--<Poptip-->
              <!--transfer-->
              <!--confirm-->
              <!--title="确认要删除吗?"-->
              <!--@on-ok="sendDel(scope.row)"-->
              <!--ok-text="确定"-->
              <!--cancel-text="取消">-->
              <!--<el-tooltip content="删除" placement="top">-->
                <!--<Button style="margin: 0 3px" :disabled="scope.row.status !== '待提交'">-->
                  <!--<Icon type="md-trash"></Icon>-->
                <!--</Button>-->
              <!--</el-tooltip>-->
            <!--</Poptip>-->
          </template>
        </el-table-column>
      </el-table>
    </div>
    <paging :total="pageData.total" :page-size="pageData.pageSize" v-model="page" @on-change="toPage"></paging>
    <div style="clear: both"></div>
    <form-draw ref="formDrawer" v-model="forms" :config="config" @save-success="getTableData"></form-draw>
    <!--<record-modal ref="modal" :config="{}"></record-modal>-->
    <materail-detail ref="detailModal" :title="detailTitle" :data="detailInfo" :hideItem="hideItem" :history="history"></materail-detail>
  </div>
</template>

<script>
import ajax from '@/libs/ajax'
import means from '@/libs/means'
import formDraw from './drawer.vue'
import recordModal from './material-record-modal.vue'
import detailModal from '../audit/detail/detail-modal'
import paging from '@/components/data-hidden/paging'

export default {
  name: 'material-declaration',
  components: {
    'form-draw': formDraw,
    'record-modal': recordModal,
    'materail-detail': detailModal,
    paging
  },
  data () {
    return {
      powerList: ['submit_material_diffcult', 'edit_material_diffcult'],
      means: means,
      // form表单部分参数
      config: {},
      forms: {},
      currentStatus: '待审核',
      classifyList: [{
        title: '职工基本信息',
        showCase: 'baseCase',
        defaultCase: true,
        formItems: [{
          label: '身份证号',
          value: 'idcard',
          query: true,
          queryUrl: '',
          rules: ['required', 'idcard'],
          placeholder: '输入正确身份证号，自动匹配职工信息'
        }, {
          label: '姓名',
          value: 'name',
          readonly: true,
          rules: ['required'],
          placeholder: '根据身份证号自动匹配信息',
          rulesMsg: '请输入正确身份证号以匹配信息'
        }, {
          label: '性别',
          value: 'sex',
          readonly: true,
          rules: ['required'],
          placeholder: '根据身份证号自动匹配信息',
          rulesMsg: '请输入正确身份证号以匹配信息'
        }]
      }, {
        title: '申报材料',
        showCase: 'materialCase',
        defaultCase: true,
        editable: true,
        formItems: [{
          label: '困难职工登记表照片',
          value: 'apply_file',
          type: 'image',
          rules: ['requiredArray'],
          span: 24
        }, {
          label: '诊断证明复印件',
          value: 'diagnostic_proof_file',
          type: 'image',
          rules: ['requiredArray'],
          span: 24
        }, {
          label: '本人及主要家属身份证复印件',
          value: 'family_idcard_file',
          type: 'image',
          rules: ['requiredArray'],
          span: 24
        }, {
          label: '户口本复印件',
          value: 'household_registration_book_file',
          type: 'image',
          rules: ['requiredArray'],
          span: 24
        }, {
          label: '个人困难申请',
          value: 'personal_difficulty_application_file',
          type: 'image',
          rules: ['requiredArray'],
          span: 24
        }, {
          label: '本单位开具的证明',
          value: 'unit_proof_file',
          type: 'image',
          rules: ['requiredArray'],
          span: 24
        }, {
          label: '医院单据',
          value: 'hospital_bill_file',
          type: 'image',
          rules: ['requiredArray'],
          attention: '医院所有花费单据复印件、病例首页复印件一份、CT报告复印件一份、入院记录复印件一份、出院记录复印件一份',
          span: 24
        }, {
          label: '公示材料复印件',
          value: 'publicity_materials_file',
          type: 'image',
          rules: ['requiredArray'],
          span: 24
        }, {
          label: '上级工会证明',
          value: 'superior_unit_proof_file',
          type: 'image',
          rules: ['requiredArray'],
          span: 24
        }, {
          label: '备注',
          value: 'remark',
          type: 'textarea',
          span: 24
        }]
      }],
      // table表格部分参数
      tableData: [],
      history: {
        url: 'difficult_staff/material_audit_records',
        extraUrl: 'id',
        timeValue: 'created_at',
        resultValue: 'result',
        formItems: [{
          value: 'admin.username',
          label: '审核人'
        }, {
          value: 'result',
          label: '审核结果'
        }, {
          value: 'opinion',
          label: '审核意见'
        }]
      },
      showItem: [{
        label: '职工姓名',
        value: 'staff.name'
      }, {
        label: '性别',
        value: 'staff.sex'
      }, {
        label: '手机号码',
        value: 'staff.mobile'
      }, {
        label: '身份证号',
        value: 'staff.idcard'
      }, {
        label: '审核状态',
        value: 'audit_status'
      }],
      hideItem: {
        type: 'card',
        itemList: [{
          title: '职工基本信息',
          showCase: 'baseCase',
          defaultCase: true,
          formItems: [{
            label: '职工姓名',
            value: 'staff.name'
          }, {
            label: '性别',
            value: 'staff.sex'
          }, {
            label: '民族',
            value: 'staff.nation'
          }, {
            label: '身份证号',
            value: 'staff.idcard'
          }, {
            label: '手机号码',
            value: 'staff.mobile'
          }, {
            value: 'remark',
            label: '申报备注'
          }]
        }, {
          title: '申报材料',
          labelWidth: '150px',
          showCase: 'materialCase',
          defaultCase: true,
          formItems: [{
            value: 'apply_file',
            label: '困难职工登记表照片',
            type: 'imageList'
          }, {
            value: 'diagnostic_proof_file',
            label: '诊断证明复印件',
            type: 'imageList'
          }, {
            value: 'family_idcard_file',
            label: '本人及主要家属身份证复印件',
            type: 'imageList'
          }, {
            value: 'household_registration_book_file',
            label: '户口本复印件',
            type: 'imageList'
          }, {
            value: 'personal_difficulty_application_file',
            label: '个人困难申请',
            type: 'imageList'
          }, {
            value: 'unit_proof_file',
            label: '本单位开具的证明',
            type: 'imageList'
          }, {
            value: 'hospital_bill_file',
            label: '医院单据',
            type: 'imageList'
          }, {
            value: 'publicity_materials_file',
            label: '公示材料复印件',
            type: 'imageList'
          }, {
            value: 'superior_unit_proof_file',
            label: '上级工会证明',
            type: 'imageList'
          }]
        }, {
          title: '申请信息',
          showCase: 'applyCase',
          formItems: [{
            value: 'created_at',
            label: '申请时间'
          }, {
            value: 'created_admin.username',
            label: '申请人账号'
          }, {
            value: 'audit_mode',
            label: '审核模式'
          }, {
            value: 'audit_status',
            label: '审核状态'
          }]
        }]
      },
      detailTitle: '',
      detailInfo: {},
      // pager分页部分参数
      page: 1,
      pageData: {
        total: 0,
        pageSize: 20
      },
      tableLoading: false,
      // seacher搜索部分参数
      seacherBox: false,
      skey: ''
    }
  },
  methods: {
    // 分页方法
    toPage (page) {
      this.page = page
    },
    statusChange () {
      this.page = 1
      this.getTableData()
    },
    // table表格部分方法
    getTableData () {
      let _this = this
      this.tableLoading = true
      ajax.get({
        url: 'difficult_staff/my_materials',
        userinfo: true,
        params: {
          status: _this.currentStatus,
          page: _this.page
        }
      }).then((res) => {
        _this.tableData = res.result.list.map(item => {
          if (item.audit_status === '待审核') {
            item.audit_status = '待提交'
          }
          return item
        })
        _this.pageData = {
          total: parseInt(res.result.meta.total),
          pageSize: parseInt(res.result.meta.per_page)
        }
        this.tableLoading = false
      })
    },
    toogleExpand (row) {
      this.detailInfo = JSON.parse(JSON.stringify(row))
      this.detailTitle = row.staff.name
      this.$refs.detailModal.modalShow = true
    },
    // 按钮操作部分方法
    add () {
      let forms = {}
      forms.classify = [ ...this.classifyList ]
      forms.url = 'difficult_staff/material'
      forms.defaultData = {}
      forms.title = '添加'
      this.forms = { ...forms }
    },
    record (row) {
      this.$refs.modal.modalShow = true
    },
    edit (row) {
      let forms = {}
      let classify = this.classifyList.filter(classItem => {
        if (classItem.editable) {
          return classItem
        }
      })
      forms.classify = classify
      forms.url = 'difficult_staff/material/' + row.id
      forms.defaultData = row
      forms.title = '编辑'
      this.forms = { ...forms }
    },
    sendDel (row) {
    },
    submitAudit (row) {
      let _this = this
      let url = 'difficult_staff/submit_material_audit/' + row.id
      ajax.post({
        url: url,
        userinfo: true
      }).then(res => {
        _this.getTableData()
        _this.$Notice.success({
          title: '系统提示',
          duration: 3,
          desc: '提交成功,等待审核'
        })
      })
    },
    // form表单部分方法
    // seacher搜索部分方法
    query () {
    },
    empty () {
    }
  },
  created () {
    this.getTableData()
  }
}
</script>

<style scoped>

</style>

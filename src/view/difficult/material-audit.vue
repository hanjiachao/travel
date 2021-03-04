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
        <RadioGroup v-model="currentStatus" type="button" @on-change="statusChange">
          <Radio label="审核中">审核中</Radio>
          <Radio label="通过">已通过</Radio>
          <Radio label="驳回">已驳回</Radio>
          <Radio label="全部">全部</Radio>
        </RadioGroup>
      </div>
      <div  style="float: right;padding-bottom: 10px;">
        <Button type="primary" style="margin-right: 10px;" @click="getTableData">刷新</Button>
        <!--<Button icon="ios-search" @click="seacherBox = !seacherBox" :type="seacherBox?'primary':'default'"></Button>-->
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
            <!--<el-tooltip content="查看历史记录" placement="top">-->
              <!--<Button style="margin: 0 3px" @click="record(scope.row)">-->
                <!--<Icon type="ios-eye" />-->
              <!--</Button>-->
            <!--</el-tooltip>-->
            <el-tooltip content="审核" placement="top" v-if="means.hasPermission('audit_matetrial_diffcult_btn')">
              <Button style="margin: 0 3px" :disabled="scope.row.audit_status !== '审核中'" @click="audit(scope.row)">
                <Icon type="md-checkbox-outline"></Icon>
              </Button>
            </el-tooltip>
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
import formDraw from '../../components/data-table/form-modal.vue'
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
      powerList: ['audit_matetrial_diffcult_btn'],
      means: means,
      // form表单部分参数
      config: {},
      forms: {},
      currentStatus: '审核中',
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
        label: '身份证号',
        value: 'staff.idcard'
      }, {
        label: '手机号码',
        value: 'staff.mobile'
      }, {
        label: '审核状态',
        value: 'audit_status'
      }],
      hideItem: {
        type: 'card',
        itemList: [{
          title: '基本信息',
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
        url: 'difficult_staff/materials',
        userinfo: true,
        params: {
          status: _this.currentStatus,
          page: _this.page
        }
      }).then((res) => {
        _this.tableData = res.result.list
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
    record (row) {
      this.$refs.modal.modalShow = true
    },
    audit (row) {
      let forms = {}
      forms.formItems = [{
        type: 'radio',
        label: '审核结果',
        name: 'result',
        options: [{
          label: '通过',
          value: '通过'
        }, {
          label: '驳回',
          value: '驳回'
        }],
        rules: ['required']
      }, {
        type: 'textarea',
        label: '审核意见',
        placeholder: '若驳回，则该项必填',
        name: 'opinion',
        requiredOn: [{
          value: '驳回',
          valueName: 'result'
        }]
      }]
      forms.url = 'difficult_staff/audit_material/' + row.id
      forms.title = '审核'
      this.forms = { ...forms }
    },
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

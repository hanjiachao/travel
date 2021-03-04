<style scoped>
  .modal-box >>> .ivu-btn-text{
    display: none;
  }
  .modal-box >>> .ivu-modal-body{
    height: 300px;
    overflow-y: auto;
  }
  .modal-box >>> ul,li{
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
  .card-title{
    color: #4C8BD5;
    font-size: 15px;
    cursor: pointer;
  }
  .card-title .title-icon{
    color: #666;
    float: right;
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
      <div class="fl">
        <RadioGroup v-model="currentStatus" type="button" @on-change="statusChange">
          <Radio label="审核中">审核中</Radio>
          <Radio label="通过">已通过</Radio>
          <Radio label="驳回">已驳回</Radio>
          <Radio label="全部">全部</Radio>
        </RadioGroup>
      </div>
      <div style="float: right;padding-bottom: 10px;">
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
          label="登记表">
          <template slot-scope="scope">
            <el-button type="text" @click="toogleExpand(scope.row)">查看登记表</el-button>
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          label="申报材料">
          <template slot-scope="scope">
            <el-button type="text" @click="lookMaterail(scope.row)">查看申报材料</el-button>
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          label="操作"
          v-if="means.operationAllow(powerList)"
          :width="means.operationWidth(powerList)">
          <template slot-scope="scope">
            <!--v-if="means.hasPermission('Staff/quit')"-->
            <!--<el-tooltip content="查看记录" placement="top">-->
              <!--<Button style="margin: 0 3px" @click="record(scope.row)">-->
                <!--<Icon type="ios-eye" />-->
              <!--</Button>-->
            <!--</el-tooltip>-->
            <el-tooltip content="审核" placement="top" v-if="means.hasPermission('audit_sheet_difficult_btn')">
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
    <detail-modal ref="materialModal" :data="materialData" :hideItem="imageClassify" :history="{}" :title="materialTitle"></detail-modal>
    <form-draw ref="formDrawer" v-model="forms" :config="config" @save-success="getTableData"></form-draw>
    <!--<record-modal ref="modal" :config="{}"></record-modal>-->
    <image-modal ref="imageModal" :imageInfo="imageInfo"></image-modal>
    <detail-modal ref="detailModal" :history="history" :hideItem="hideItem" :data="detailInfo" :title="detailTitle"></detail-modal>
  </div>
</template>

<script>
import ajax from '@/libs/ajax'
import means from '@/libs/means'
import formDraw from '../../components/data-table/form-modal.vue'
import recordModal from './registration-record-modal.vue'
import imageModal from '../../components/data-hidden/image-modal.vue'
import detailModal from '../audit/detail/detail-modal.vue'
import paging from '@/components/data-hidden/paging'

export default {
  name: 'registration-declaration',
  components: {
    'form-draw': formDraw,
    'record-modal': recordModal,
    'image-modal': imageModal,
    'detail-modal': detailModal,
    paging
  },
  data () {
    return {
      powerList: ['audit_sheet_difficult_btn'],
      means: means,
      // form表单部分参数
      config: {},
      forms: {},
      // 查看申报材料
      imageInfo: {},
      imageClassifyShow: false,
      imageClassify: {},
      materialData: {},
      materialTitle: '',
      // table表格部分参数
      currentStatus: '审核中',
      tableData: [],
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
        label: '审核模式',
        value: 'audit_mode'
      }, {
        label: '审核状态',
        value: 'audit_status'
      }],
      history: {
        url: 'difficult_staff/sheet_audit_records',
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
            label: '民族',
            value: 'staff.nation'
          }, {
            label: '性别',
            value: 'staff.sex'
          }, {
            label: '身份证号',
            value: 'staff.idcard'
          }, {
            label: '政治面貌',
            value: 'staff.identity'
          }, {
            label: '出生日期',
            value: 'staff.birthday'
          }, {
            value: 'staff.agricultural',
            label: '户口类型'
          }, {
            label: '婚姻状况',
            value: 'staff.marital_status'
          }, {
            label: '手机号码',
            value: 'staff.mobile'
          }, {
            value: 'other_mobile',
            label: '其他联系方式'
          }, {
            value: 'postal_code',
            label: '邮政编码'
          }, {
            value: 'administrative_division',
            label: '户口所在地行政区划'
          }]
        }, {
          title: '工作情况',
          showCase: 'workCase',
          formItems: [{
            value: 'staff.work_status',
            label: '工作状态'
          }, {
            value: 'working_time',
            label: '工作时间'
          }, {
            value: 'staff.company.name',
            label: '工作单位'
          }, {
            value: 'staff.company.economic_type',
            label: '单位性质'
          }, {
            value: 'staff.company.management_condition',
            label: '企业状况'
          }, {
            value: 'staff.company.industry',
            label: '所属行业'
          }, {
            value: 'staff.wage_level',
            label: '本人月平均收入'
          }]
        }, {
          title: '家庭情况',
          showCase: 'familyCase',
          labelWidth: '180px',
          hasFamily: true,
          formItems: [{
            value: 'is_single_parent',
            label: '是否单亲'
          }, {
            value: 'house_type',
            label: '住房类型'
          }, {
            value: 'floorage',
            label: '住房面积'
          }, {
            value: 'family_number',
            label: '家庭人口'
          }, {
            value: 'family_average_monthly_income',
            label: '家庭月平均收入'
          }, {
            value: 'annual_household_income',
            label: '家庭年度总收入'
          }, {
            value: 'family_nonwage_yincome',
            label: '家庭其他非薪资年收入'
          }, {
            value: 'zero_employment_family',
            label: '是否为零就业家庭'
          }, {
            value: 'can_save_oneself',
            label: '是否有一定自救能力'
          }, {
            type: 'card',
            title: '家庭成员',
            showCase: 'familyMemberCase',
            value: 'family_members',
            allCol: true,
            labelWidth: '120px',
            formItems: [{
              value: 'name',
              label: '姓名'
            }, {
              value: 'sex',
              label: '性别'
            }, {
              value: 'relationship',
              label: '关系'
            }, {
              value: 'idcard',
              label: '身份证号'
            }, {
              value: 'politics',
              label: '政治面貌'
            }, {
              value: 'birthday',
              label: '出生日期'
            }, {
              value: 'income',
              label: '月平均收入'
            }, {
              value: 'health',
              label: '健康状况'
            }, {
              value: 'healthInsurance',
              label: '医保状况'
            }, {
              value: 'unit',
              label: '单位或学校'
            }]
          }]
        }, {
          title: '困难情况',
          showCase: 'poorCase',
          formItems: [{
            value: 'difficulty_category',
            label: '困难类别'
          }, {
            value: 'health',
            label: '健康状况'
          }, {
            value: 'disability_category',
            label: '残疾类别'
          }, {
            value: 'model_worker_type',
            label: '劳模类型'
          }, {
            value: 'medical_insurance_situation',
            label: '医保状况'
          }, {
            value: 'subsistence_allowance_money',
            label: '低保金额'
          }, {
            value: 'difficulty_rescue_money',
            label: '特困救助卡'
          }, {
            value: 'sick_person',
            label: '患病人员'
          }, {
            value: 'enjoy_medical_insurance',
            label: '是否享受医保'
          }, {
            value: 'main_cause_drowsiness',
            label: '主要致困原因'
          }, {
            value: 'secondary_cause_drowsiness',
            label: '次要致困原因(0-3项)'
          }, {
            value: 'other_cause_drowsiness',
            label: '其他原因'
          }]
        }, {
          title: '银行卡信息',
          showCase: 'bankCase',
          formItems: [{
            value: 'bank_card_number',
            label: '银行卡号'
          }, {
            value: 'deposit_bank',
            label: '开户银行'
          }, {
            value: 'branch_name',
            label: '支行名称'
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
      // pager分页部分参数
      page: 1,
      pageData: {
        total: 0,
        pageSize: 20
      },
      tableLoading: false,
      // seacher搜索部分参数
      seacherBox: false,
      skey: '',
      // 查看详情
      detailInfo: {},
      detailTitle: ''
    }
  },
  methods: {
    // 分页方法
    toPage (page) {
      this.page = page
    },
    // table表格部分方法
    statusChange () {
      this.page = 1
      this.getTableData()
    },
    getTableData () {
      let _this = this
      this.tableLoading = true
      ajax.get({
        url: 'difficult_staff/sheets',
        userinfo: true,
        params: {
          page: _this.page,
          status: _this.currentStatus
        }
      }).then(res => {
        _this.tableData = res.result.list
        _this.pageData = {
          total: parseInt(res.result.meta.total),
          pageSize: parseInt(res.result.meta.per_page)
        }
        this.tableLoading = false
      })
    },
    toogleExpand (row) {
      let _this = this
      let url = 'difficult_staff/sheet/' + row.id
      ajax.get({
        url: url,
        userinfo: true
      }).then(res => {
        let data = res.result
        data.created_admin = row.created_admin
        data.family_members = JSON.parse(data.family_members)
        data.staff.agricultural = data.staff.is_agricultural === '是' ? '农业户口' : '非农业户口'
        _this.detailInfo = data
        _this.detailTitle = data.staff.name
        _this.$refs.detailModal.modalShow = true
      })
    },
    lookMaterail (row) {
      let _this = this
      let url = 'difficult_staff/material/' + row.material_id
      ajax.get({
        url: url,
        userinfo: true
      }).then(res => {
        let imageClassify = [{
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
        _this.imageClassify = {
          type: 'form',
          labelWidth: '210px',
          itemList: imageClassify
        }
        _this.materialData = res.result
        _this.materialTitle = row.staff.name
        _this.$refs.materialModal.modalShow = true
      })
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
      forms.url = 'difficult_staff/audit_sheet/' + row.id
      forms.title = '审核'
      this.forms = { ...forms }
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

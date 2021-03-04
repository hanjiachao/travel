<style scoped>
  .audit-tabs >>> .ivu-tabs-bar{
    background: #fff;
    margin-top: 10px;
  }
  .status-screening >>> .ivu-btn{
    margin-right: 10px;
  }
  .audit-tabs >>> .ivu-tabs-tab{
    padding: 16px!important;
    margin: 0 8px !important;
  }
  .audit-tabs >>> .ivu-tabs-nav-scroll{
    text-align: center;
  }
  .audit-tabs >>> .ivu-tabs-nav{
    float: inherit !important;
    display: inline-block !important;
  }
  .audit-tabs >>> .ivu-tabs-ink-bar{
    left: 8px !important;
  }
  .audit-tabs >>> .ivu-tabs-nav-prev{
    line-height: 49px;
  }
  .audit-tabs >>> .ivu-tabs-nav-next{
    line-height: 49px;
  }
</style>
<template>
  <Tabs class="audit-tabs" @on-click="changeTab" v-model="currentTab">
    <TabPane v-for="(tab, tabIndex) in tabList" :key="tabIndex" :label="tab.title" v-if="means.hasPermission(tab.auth)">
      <audit-table v-if="tab.showTable" :config="tab.config" :auditInfo="tab.auditInfo" :showItem="tab.showItem" :hideItem="tab.hideItem" :searchs="tab.searchs" :history="tab.history"></audit-table>
    </TabPane>
  </Tabs>
</template>

<script>
import auditTable from './audit-table.vue'
import means from '@/libs/means'
export default {
  name: 'staff-audit',
  components: {
    'audit-table': auditTable
  },
  data () {
    return {
      means: means,
      currentTab: 0,
      powerList: ['audit_alteration_staff', 'audit_alteration_staff', 'audit_delete_record_staff', 'audit_shift_out_record_staff', 'audit_shift_in_record_staff'],
      tabList: [{
        title: '职工会员添加审核',
        auth: 'audit_alteration_staff',
        showTable: false,
        config: {
          url: 'staff/alterations',
          primaryKey: 'id',
          hasType: true,
          extraData: [{
            value: '创建',
            valueName: 'type'
          }],
          dataPosition: ['result', 'list']
        },
        auditInfo: {
          auth: 'audit_alteration_staff_btn',
          url: 'staff/audit_alteration',
          title: '职工会员添加审核'
        },
        history: {
          url: 'staff/alteration_audit_records',
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
          value: 'name',
          label: '姓名'
        }, {
          value: 'sex',
          label: '性别'
        }, {
          value: 'mobile',
          label: '联系电话'
        },
        // {
        //   value: 'audit_mode',
        //   label: '审核模式'
        // },
        {
          value: 'audit_status',
          label: '审核状态'
        }],
        hideItem: {
          type: 'card',
          labelWidth: '140px',
          itemList: [{
            title: '个人基本信息',
            showCase: 'baseCase',
            defaultCase: true,
            formItems: [
              {
                value: 'name',
                label: '姓名'
              },
              {
                value: 'idcard',
                label: '身份证号'
              },
              {
                value: 'age',
                label: '年龄'
              },
              {
                value: 'sex',
                label: '性别'
              },
              {
                value: 'birthday',
                label: '出生日期'
              },
              {
                value: 'mobile',
                label: '联系电话'
              },
              {
                value: 'nation',
                label: '民族'
              },
              {
                value: 'native_place',
                label: '籍贯'
              },
              {
                value: 'education',
                label: '学历'
              },
              {
                value: 'school',
                label: '毕业院校'
              },
              // {
              //   value: 'is_agricultural',
              //   label: '是否是农业户口'
              // },
              {
                value: 'home_address',
                label: '居住地'
              }
            ]
          }, {
            title: '政治面貌',
            showCase: 'identity',
            formItems: [
              {
                value: 'identity',
                label: '政治面貌'
              },
              {
                value: 'join_party_time',
                label: '入党时间',
                depend: [{
                  valueName: 'identity',
                  value: '中共党员'
                }]
              },
              {
                value: 'is_party_member',
                label: '是否是党委委员'
              },
              {
                value: 'is_npc_member',
                label: '是否是人大代表'
              },
              {
                value: 'is_cppcc_member',
                label: '是否是政协代表'
              }
            ]
          }, {
            title: '工作情况',
            showCase: 'workCase',
            formItems: [
              {
                value: 'work_status',
                label: '就业状态'
              },
              {
                value: 'occupation',
                label: '职业'
              },
              {
                value: 'unit_name',
                label: '单位名称'
              },
              {
                value: 'unit_code',
                label: '单位编码'
              },
              {
                value: 'street_town',
                label: '单位所属街镇'
              },
              {
                value: 'is_this_unit_staff',
                label: '是否是本单位干部'
              },
              {
                value: 'department',
                label: '部门'
              },
              {
                value: 'workshop',
                label: '车间'
              },
              {
                value: 'team',
                label: '班组'
              },
              {
                value: 'working_years',
                label: '工龄'
              },
              {
                value: 'start_working_time',
                label: '参加工作时间'
              },
              {
                value: 'join_labour_union_time',
                label: '加入工会时间'
              },
              {
                value: 'title',
                label: '职称'
              },
              {
                value: 'technical_grade',
                label: '技术等级'
              },
              {
                value: 'is_other_places_worker',
                label: '是否是外来务工人员'
              },
              {
                value: 'wage_level',
                label: '月实发工资'
              },
              {
                value: 'migrant_worker',
                label: '是否是农民工'
              },
              {
                value: 'migrant_worker_prove',
                label: '农民工证明材料',
                type: 'imageList',
                depend: [{
                  valueName: 'migrant_worker',
                  value: ['本地', '外地']
                }]
              }
            ]
          }, {
            title: '婚姻情况',
            showCase: 'marriageCase',
            formItems: [
              {
                value: 'marital_status',
                label: '婚姻状况'
              },
              {
                value: 'spouse_has_job',
                label: '配偶是否有工作',
                depend: [{
                  valueName: 'marital_status',
                  value: '已婚'
                }]
              },
              {
                value: 'spouse_working_unit',
                label: '配偶工作单位',
                depend: [{
                  valueName: 'spouse_has_job',
                  value: '是'
                }]
              },
              {
                value: 'children_age',
                label: '孩子年龄'
              }
            ]
          }, {
            title: '劳模荣誉证明',
            showCase: 'difficultCase',
            formItems: [
              {
                value: 'model_worker_prove',
                label: '劳模证明',
                type: 'imageList'
              },
              {
                value: 'honours_above_district_level_prove',
                label: '荣誉证明',
                type: 'imageList'
              }
            ]
          }, {
            title: '会员服务卡信息',
            showCase: 'bankCase',
            formItems: [
              {
                value: 'member_front_code',
                label: '会员卡正面卡号'
              },
              {
                value: 'member_reverse_side_code',
                label: '会员卡反面卡号'
              },
              {
                value: 'bank_name',
                label: '开户银行'
              }
            ]
          }, {
            title: '申请信息',
            showCase: 'createdPerson',
            formItems: [{
              value: 'created_at',
              label: '申请时间'
            }, {
              value: 'company_name',
              extraText: {
                depend: {
                  valueName: 'company_id',
                  value: 1
                },
                text: '(未分配)'
              },
              label: '申请加入公司'
            }, {
              value: 'operate_type',
              label: '变更类型'
            },
            // {
            //   value: 'audit_mode',
            //   label: '审核模式'
            // },
            {
              value: 'audit_status',
              label: '审核状态'
            }]
          }]
        },
        searchs: []
      }, {
        title: '职工会员编辑审核',
        auth: 'audit_alteration_staff',
        showTable: false,
        config: {
          url: 'staff/alterations',
          primaryKey: 'id',
          hasType: true,
          extraData: [{
            value: '编辑',
            valueName: 'type'
          }],
          dataPosition: ['result', 'list']
        },
        auditInfo: {
          auth: 'audit_alteration_staff_btn',
          url: 'staff/audit_alteration',
          title: '职工会员编辑审核'
        },
        history: {
          url: 'staff/alteration_audit_records',
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
          value: 'name',
          label: '姓名'
        }, {
          value: 'sex',
          label: '性别'
        }, {
          value: 'mobile',
          label: '联系电话'
        },
        // {
        //   value: 'audit_mode',
        //   label: '审核模式'
        // },
        {
          value: 'audit_status',
          label: '审核状态'
        }],
        hideItem: {
          type: 'card',
          labelWidth: '140px',
          itemList: [{
            title: '个人基本信息',
            showCase: 'baseCase',
            defaultCase: true,
            formItems: [
              {
                value: 'name',
                label: '姓名'
              },
              {
                value: 'idcard',
                label: '身份证号'
              },
              {
                value: 'age',
                label: '年龄'
              },
              {
                value: 'sex',
                label: '性别'
              },
              {
                value: 'birthday',
                label: '出生日期'
              },
              {
                value: 'mobile',
                label: '联系电话'
              },
              {
                value: 'nation',
                label: '民族'
              },
              {
                value: 'native_place',
                label: '籍贯'
              },
              {
                value: 'education',
                label: '学历'
              },
              {
                value: 'school',
                label: '毕业院校'
              },
              // {
              //   value: 'is_agricultural',
              //   label: '是否是农业户口'
              // },
              {
                value: 'home_address',
                label: '居住地'
              }
            ]
          }, {
            title: '政治面貌',
            showCase: 'identity',
            formItems: [
              {
                value: 'identity',
                label: '政治面貌'
              },
              {
                value: 'join_party_time',
                label: '入党时间',
                depend: [{
                  valueName: 'identity',
                  value: '中共党员'
                }]
              },
              {
                value: 'is_party_member',
                label: '是否是党委委员'
              },
              {
                value: 'is_npc_member',
                label: '是否是人大代表'
              },
              {
                value: 'is_cppcc_member',
                label: '是否是政协代表'
              }
            ]
          }, {
            title: '工作情况',
            showCase: 'workCase',
            formItems: [
              {
                value: 'work_status',
                label: '就业状态'
              },
              {
                value: 'occupation',
                label: '职业'
              },
              {
                value: 'unit_name',
                label: '单位名称'
              },
              {
                value: 'unit_code',
                label: '单位编码'
              },
              {
                value: 'street_town',
                label: '单位所属街镇'
              },
              {
                value: 'is_this_unit_staff',
                label: '是否是本单位干部'
              },
              {
                value: 'department',
                label: '部门'
              },
              {
                value: 'workshop',
                label: '车间'
              },
              {
                value: 'team',
                label: '班组'
              },
              {
                value: 'working_years',
                label: '工龄'
              },
              {
                value: 'start_working_time',
                label: '参加工作时间'
              },
              {
                value: 'join_labour_union_time',
                label: '加入工会时间'
              },
              {
                value: 'title',
                label: '职称'
              },
              {
                value: 'technical_grade',
                label: '技术等级'
              },
              {
                value: 'is_other_places_worker',
                label: '是否是外来务工人员'
              },
              {
                value: 'wage_level',
                label: '月实发工资'
              },
              {
                value: 'migrant_worker',
                label: '是否是农民工'
              },
              {
                value: 'migrant_worker_prove',
                label: '农民工证明材料',
                type: 'imageList',
                depend: [{
                  valueName: 'migrant_worker',
                  value: ['本地', '外地']
                }]
              }
            ]
          }, {
            title: '婚姻情况',
            showCase: 'marriageCase',
            formItems: [
              {
                value: 'marital_status',
                label: '婚姻状况'
              },
              {
                value: 'spouse_has_job',
                label: '配偶是否有工作',
                depend: [{
                  valueName: 'marital_status',
                  value: '已婚'
                }]
              },
              {
                value: 'spouse_working_unit',
                label: '配偶工作单位',
                depend: [{
                  valueName: 'spouse_has_job',
                  value: '是'
                }]
              },
              {
                value: 'children_age',
                label: '孩子年龄'
              }
            ]
          }, {
            title: '劳模荣誉证明',
            showCase: 'difficultCase',
            formItems: [
              {
                value: 'model_worker_prove',
                label: '劳模证明',
                type: 'imageList'
              },
              {
                value: 'honours_above_district_level_prove',
                label: '荣誉证明',
                type: 'imageList'
              }
            ]
          }, {
            title: '会员服务卡信息',
            showCase: 'bankCase',
            formItems: [
              {
                value: 'member_front_code',
                label: '会员卡正面卡号'
              },
              {
                value: 'member_reverse_side_code',
                label: '会员卡反面卡号'
              },
              {
                value: 'bank_name',
                label: '开户银行'
              }
            ]
          }, {
            title: '申请信息',
            showCase: 'createdPerson',
            formItems: [{
              value: 'created_at',
              label: '申请时间'
            }, {
              value: 'operate_type',
              label: '变更类型'
            },
            // {
            //   value: 'audit_mode',
            //   label: '审核模式'
            // },
            {
              value: 'audit_status',
              label: '审核状态'
            }]
          }]
        },
        searchs: []
      }, {
        title: '职工会员删除审核',
        auth: 'audit_delete_record_staff',
        showTable: false,
        config: {
          url: 'staff/delete_records',
          primaryKey: 'id',
          namePosition: 'staff.name',
          hasType: true,
          dataPosition: ['result', 'list']
        },
        auditInfo: {
          auth: 'audit_delete_record_staff_btn',
          url: 'staff/audit_delete_record',
          title: '职工会员删除审核'
        },
        history: {
          url: 'staff/delete_record_audit_records',
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
          value: 'staff.name',
          label: '姓名'
        }, {
          value: 'staff.sex',
          label: '性别'
        }, {
          value: 'staff.mobile',
          label: '联系电话'
        },
        // {
        //   value: 'audit_mode',
        //   label: '审核模式'
        // },
        {
          value: 'audit_status',
          label: '审核状态'
        }],
        hideItem: {
          type: 'card',
          labelWidth: '140px',
          itemList: [{
            title: '个人基本信息',
            showCase: 'baseCase',
            defaultCase: true,
            formItems: [
              {
                value: 'staff.name',
                label: '姓名'
              },
              {
                value: 'staff.idcard',
                label: '身份证号'
              },
              {
                value: 'staff.age',
                label: '年龄'
              },
              {
                value: 'staff.sex',
                label: '性别'
              },
              {
                value: 'staff.birthday',
                label: '出生日期'
              },
              {
                value: 'staff.mobile',
                label: '联系电话'
              },
              {
                value: 'staff.nation',
                label: '民族'
              },
              {
                value: 'staff.native_place',
                label: '籍贯'
              },
              {
                value: 'staff.education',
                label: '学历'
              },
              {
                value: 'staff.school',
                label: '毕业院校'
              },
              // {
              //   value: 'staff.is_agricultural',
              //   label: '是否是农业户口'
              // },
              {
                value: 'staff.home_address',
                label: '居住地'
              }
            ]
          }, {
            title: '政治面貌',
            showCase: 'identity',
            formItems: [
              {
                value: 'staff.identity',
                label: '政治面貌'
              },
              {
                value: 'staff.join_party_time',
                label: '入党时间',
                depend: [{
                  valueName: 'identity',
                  value: '中共党员'
                }]
              },
              {
                value: 'staff.is_party_member',
                label: '是否是党委委员'
              },
              {
                value: 'staff.is_npc_member',
                label: '是否是人大代表'
              },
              {
                value: 'staff.is_cppcc_member',
                label: '是否是政协代表'
              }
            ]
          }, {
            title: '工作情况',
            showCase: 'workCase',
            formItems: [
              {
                value: 'staff.work_status',
                label: '就业状态'
              },
              {
                value: 'staff.occupation',
                label: '职业'
              },
              {
                value: 'staff.unit_name',
                label: '单位名称'
              },
              {
                value: 'staff.unit_code',
                label: '单位编码'
              },
              {
                value: 'staff.street_town',
                label: '单位所属街镇'
              },
              {
                value: 'staff.is_this_unit_staff',
                label: '是否是本单位干部'
              },
              {
                value: 'staff.department',
                label: '部门'
              },
              {
                value: 'staff.workshop',
                label: '车间'
              },
              {
                value: 'staff.team',
                label: '班组'
              },
              {
                value: 'staff.working_years',
                label: '工龄'
              },
              {
                value: 'staff.start_working_time',
                label: '参加工作时间'
              },
              {
                value: 'staff.join_labour_union_time',
                label: '加入工会时间'
              },
              {
                value: 'staff.title',
                label: '职称'
              },
              {
                value: 'staff.technical_grade',
                label: '技术等级'
              },
              {
                value: 'staff.is_other_places_worker',
                label: '是否是外来务工人员'
              },
              {
                value: 'staff.wage_level',
                label: '月实发工资'
              },
              {
                value: 'migrant_worker',
                label: '是否是农民工'
              },
              {
                value: 'migrant_worker_prove',
                label: '农民工证明材料',
                type: 'imageList',
                depend: [{
                  valueName: 'migrant_worker',
                  value: ['本地', '外地']
                }]
              }
            ]
          }, {
            title: '婚姻情况',
            showCase: 'marriageCase',
            formItems: [
              {
                value: 'staff.marital_status',
                label: '婚姻状况'
              },
              {
                value: 'staff.spouse_has_job',
                label: '配偶是否有工作',
                depend: [{
                  valueName: 'staff.marital_status',
                  value: '已婚'
                }]
              },
              {
                value: 'staff.spouse_working_unit',
                label: '配偶工作单位',
                depend: [{
                  valueName: 'staff.spouse_has_job',
                  value: '是'
                }]
              },
              {
                value: 'staff.children_age',
                label: '孩子年龄'
              }
            ]
          }, {
            title: '劳模荣誉证明',
            showCase: 'difficultCase',
            formItems: [
              {
                value: 'staff.model_worker_prove',
                label: '劳模证明',
                type: 'imageList'
              },
              {
                value: 'staff.honours_above_district_level_prove',
                label: '荣誉证明',
                type: 'imageList'
              }
            ]
          }, {
            title: '会员服务卡信息',
            showCase: 'bankCase',
            formItems: [
              {
                value: 'staff.member_front_code',
                label: '会员卡正面卡号'
              },
              {
                value: 'staff.member_reverse_side_code',
                label: '会员卡反面卡号'
              },
              {
                value: 'staff.bank_name',
                label: '开户银行'
              }
            ]
          }, {
            title: '申请信息',
            showCase: 'createdPerson',
            formItems: [{
              value: 'created_at',
              label: '申请时间'
            }, {
              value: 'operate_type',
              label: '变更类型'
            },
            // {
            //   value: 'audit_mode',
            //   label: '审核模式'
            // },
            {
              value: 'audit_status',
              label: '审核状态'
            }]
          }]
        },
        searchs: []
      }, {
        title: '职工会员转出审核',
        auth: 'audit_shift_out_record_staff',
        showTable: false,
        config: {
          url: 'staff/shift_out_records',
          primaryKey: 'id',
          namePosition: 'staff.name',
          hasType: true,
          dataPosition: ['result', 'list']
        },
        auditInfo: {
          auth: 'audit_shift_out_record_staff_btn',
          url: 'staff/audit_shift_out_record',
          title: '职工会员转出审核',
          statusName: 'shift_out_audit_status'
        },
        history: {
          url: 'staff/shift_record_audit_records',
          extraUrl: 'id',
          timeValue: 'created_at',
          resultValue: 'result',
          dataPosition: ['result', 'shift_out'],
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
          value: 'staff.name',
          label: '姓名'
        }, {
          value: 'staff.sex',
          label: '性别'
        }, {
          value: 'staff.mobile',
          label: '联系电话'
        },
        // {
        //   value: 'shift_out_audit_mode',
        //   label: '审核模式'
        // },
        {
          value: 'shift_out_audit_status',
          label: '审核状态'
        }],
        hideItem: {
          type: 'card',
          labelWidth: '140px',
          itemList: [{
            title: '个人基本信息',
            showCase: 'baseCase',
            defaultCase: true,
            formItems: [
              {
                value: 'staff.name',
                label: '姓名'
              },
              {
                value: 'staff.idcard',
                label: '身份证号'
              },
              {
                value: 'staff.age',
                label: '年龄'
              },
              {
                value: 'staff.sex',
                label: '性别'
              },
              {
                value: 'staff.birthday',
                label: '出生日期'
              },
              {
                value: 'staff.mobile',
                label: '联系电话'
              },
              {
                value: 'staff.nation',
                label: '民族'
              },
              {
                value: 'staff.native_place',
                label: '籍贯'
              },
              {
                value: 'staff.education',
                label: '学历'
              },
              {
                value: 'staff.school',
                label: '毕业院校'
              },
              // {
              //   value: 'staff.is_agricultural',
              //   label: '是否是农业户口'
              // },
              {
                value: 'staff.home_address',
                label: '居住地'
              }
            ]
          }, {
            title: '政治面貌',
            showCase: 'identity',
            formItems: [
              {
                value: 'staff.identity',
                label: '政治面貌'
              },
              {
                value: 'staff.join_party_time',
                label: '入党时间',
                depend: [{
                  valueName: 'staff.identity',
                  value: '中共党员'
                }]
              },
              {
                value: 'staff.is_party_member',
                label: '是否是党委委员'
              },
              {
                value: 'staff.is_npc_member',
                label: '是否是人大代表'
              },
              {
                value: 'staff.is_cppcc_member',
                label: '是否是政协代表'
              }
            ]
          }, {
            title: '工作情况',
            showCase: 'workCase',
            formItems: [
              {
                value: 'staff.work_status',
                label: '就业状态'
              },
              {
                value: 'staff.occupation',
                label: '职业'
              },
              {
                value: 'staff.street_town',
                label: '所属街镇'
              },
              {
                value: 'staff.is_this_unit_staff',
                label: '是否是本单位干部'
              },
              {
                value: 'staff.department',
                label: '部门'
              },
              {
                value: 'staff.workshop',
                label: '车间'
              },
              {
                value: 'staff.team',
                label: '班组'
              },
              {
                value: 'staff.working_years',
                label: '工龄'
              },
              {
                value: 'staff.start_working_time',
                label: '参加工作时间'
              },
              {
                value: 'staff.join_labour_union_time',
                label: '加入工会时间'
              },
              {
                value: 'staff.title',
                label: '职称'
              },
              {
                value: 'staff.technical_grade',
                label: '技术等级'
              },
              {
                value: 'staff.is_other_places_worker',
                label: '是否是外来务工人员'
              },
              {
                value: 'staff.wage_level',
                label: '月实发工资'
              },
              {
                value: 'migrant_worker',
                label: '是否是农民工'
              },
              {
                value: 'migrant_worker_prove',
                label: '农民工证明材料',
                type: 'imageList',
                depend: [{
                  valueName: 'migrant_worker',
                  value: ['本地', '外地']
                }]
              }
            ]
          }, {
            title: '婚姻情况',
            showCase: 'marriageCase',
            formItems: [
              {
                value: 'staff.marital_status',
                label: '婚姻状况'
              },
              {
                value: 'staff.spouse_has_job',
                label: '配偶是否有工作',
                depend: [{
                  valueName: 'staff.marital_status',
                  value: '已婚'
                }]
              },
              {
                value: 'staff.spouse_working_unit',
                label: '配偶工作单位',
                depend: [{
                  valueName: 'staff.spouse_has_job',
                  value: '是'
                }]
              },
              {
                value: 'staff.children_age',
                label: '孩子年龄'
              }
            ]
          }, {
            title: '劳模荣誉证明',
            showCase: 'difficultCase',
            formItems: [
              {
                value: 'staff.model_worker_prove',
                label: '劳模证明',
                type: 'imageList'
              },
              {
                value: 'staff.honours_above_district_level_prove',
                label: '荣誉证明',
                type: 'imageList'
              }
            ]
          }, {
            title: '会员服务卡信息',
            showCase: 'bankCase',
            formItems: [
              {
                value: 'staff.member_front_code',
                label: '会员卡正面卡号'
              },
              {
                value: 'staff.member_reverse_side_code',
                label: '会员卡反面卡号'
              },
              {
                value: 'staff.bank_name',
                label: '开户银行'
              }
            ]
          }, {
            title: '申请信息',
            showCase: 'createdPerson',
            formItems: [{
              value: 'created_at',
              label: '申请时间'
            }, {
              value: 'operate_type',
              label: '变更类型'
            },
            // {
            //   value: 'shift_out_audit_mode',
            //   label: '审核模式'
            // },
            {
              value: 'shift_out_audit_status',
              label: '审核状态'
            }]
          }, {
            type: 'trans',
            title: '转出及转入单位',
            transInfo: {
              rollOut: 'out_company',
              shiftInto: 'in_company'
            },
            formItems: [{
              value: 'name',
              label: '公司/单位名称'
            }, {
              value: 'mobile',
              label: '联系方式'
            }, {
              value: 'address',
              label: '坐落地址'
            }, {
              value: 'director',
              label: '法人/负责人'
            }, {
              value: 'organization.name',
              label: '所属工会'
            }]
          }]
        },
        searchs: []
      }, {
        title: '职工会员转入审核',
        auth: 'audit_shift_in_record_staff',
        showTable: false,
        config: {
          url: 'staff/shift_in_records',
          primaryKey: 'id',
          namePosition: 'staff.name',
          hasType: true,
          dataPosition: ['result', 'list']
        },
        auditInfo: {
          auth: 'audit_shift_in_record_staff_btn',
          url: 'staff/audit_shift_in_record',
          title: '职工会员转入审核',
          statusName: 'shift_in_audit_status'
        },
        history: {
          url: 'staff/shift_record_audit_records',
          extraUrl: 'id',
          timeValue: 'created_at',
          resultValue: 'result',
          dataPosition: ['result', 'shift_in'],
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
          value: 'staff.name',
          label: '姓名'
        }, {
          value: 'staff.sex',
          label: '性别'
        }, {
          value: 'staff.mobile',
          label: '联系电话'
        },
        // {
        //   value: 'shift_in_audit_mode',
        //   label: '审核模式'
        // },
        {
          value: 'shift_in_audit_status',
          label: '审核状态'
        }],
        hideItem: {
          type: 'card',
          labelWidth: '140px',
          itemList: [{
            title: '个人基本信息',
            showCase: 'baseCase',
            defaultCase: true,
            formItems: [
              {
                value: 'staff.name',
                label: '姓名'
              },
              {
                value: 'staff.idcard',
                label: '身份证号'
              },
              {
                value: 'staff.age',
                label: '年龄'
              },
              {
                value: 'staff.sex',
                label: '性别'
              },
              {
                value: 'staff.birthday',
                label: '出生日期'
              },
              {
                value: 'staff.mobile',
                label: '联系电话'
              },
              {
                value: 'staff.nation',
                label: '民族'
              },
              {
                value: 'staff.native_place',
                label: '籍贯'
              },
              {
                value: 'staff.education',
                label: '学历'
              },
              {
                value: 'staff.school',
                label: '毕业院校'
              },
              // {
              //   value: 'staff.is_agricultural',
              //   label: '是否是农业户口'
              // },
              {
                value: 'staff.home_address',
                label: '居住地'
              }
            ]
          }, {
            title: '政治面貌',
            showCase: 'identity',
            formItems: [
              {
                value: 'staff.identity',
                label: '政治面貌'
              },
              {
                value: 'staff.join_party_time',
                label: '入党时间',
                depend: [{
                  valueName: 'staff.identity',
                  value: '中共党员'
                }]
              },
              {
                value: 'staff.is_party_member',
                label: '是否是党委委员'
              },
              {
                value: 'staff.is_npc_member',
                label: '是否是人大代表'
              },
              {
                value: 'staff.is_cppcc_member',
                label: '是否是政协代表'
              }
            ]
          }, {
            title: '工作情况',
            showCase: 'workCase',
            formItems: [
              {
                value: 'staff.work_status',
                label: '就业状态'
              },
              {
                value: 'staff.occupation',
                label: '职业'
              },
              {
                value: 'staff.is_this_unit_staff',
                label: '是否是本单位干部'
              },
              {
                value: 'staff.department',
                label: '部门'
              },
              {
                value: 'staff.workshop',
                label: '车间'
              },
              {
                value: 'staff.team',
                label: '班组'
              },
              {
                value: 'staff.working_years',
                label: '工龄'
              },
              {
                value: 'staff.start_working_time',
                label: '参加工作时间'
              },
              {
                value: 'staff.join_labour_union_time',
                label: '加入工会时间'
              },
              {
                value: 'staff.title',
                label: '职称'
              },
              {
                value: 'staff.technical_grade',
                label: '技术等级'
              },
              {
                value: 'staff.is_other_places_worker',
                label: '是否是外来务工人员'
              },
              {
                value: 'staff.wage_level',
                label: '月实发工资'
              },
              {
                value: 'migrant_worker',
                label: '是否是农民工'
              },
              {
                value: 'migrant_worker_prove',
                label: '农民工证明材料',
                type: 'imageList',
                depend: [{
                  valueName: 'migrant_worker',
                  value: ['本地', '外地']
                }]
              }
            ]
          }, {
            title: '婚姻情况',
            showCase: 'marriageCase',
            formItems: [
              {
                value: 'staff.marital_status',
                label: '婚姻状况'
              },
              {
                value: 'staff.spouse_has_job',
                label: '配偶是否有工作',
                depend: [{
                  valueName: 'staff.marital_status',
                  value: '已婚'
                }]
              },
              {
                value: 'staff.spouse_working_unit',
                label: '配偶工作单位',
                depend: [{
                  valueName: 'spouse_has_job',
                  value: '是'
                }]
              },
              {
                value: 'staff.children_age',
                label: '孩子年龄'
              }
            ]
          }, {
            title: '劳模荣誉证明',
            showCase: 'difficultCase',
            formItems: [
              {
                value: 'staff.model_worker_prove',
                label: '劳模证明',
                type: 'imageList'
              },
              {
                value: 'staff.honours_above_district_level_prove',
                label: '荣誉证明',
                type: 'imageList'
              }
            ]
          }, {
            title: '会员服务卡信息',
            showCase: 'bankCase',
            formItems: [
              {
                value: 'staff.member_front_code',
                label: '会员卡正面卡号'
              },
              {
                value: 'staff.member_reverse_side_code',
                label: '会员卡反面卡号'
              },
              {
                value: 'staff.bank_name',
                label: '开户银行'
              }
            ]
          }, {
            title: '申请信息',
            showCase: 'createdPerson',
            formItems: [{
              value: 'created_at',
              label: '申请时间'
            }, {
              value: 'operate_type',
              label: '变更类型'
            },
            // {
            //   value: 'shift_in_audit_mode',
            //   label: '审核模式'
            // },
            {
              value: 'shift_in_audit_status',
              label: '审核状态'
            }]
          }, {
            type: 'trans',
            title: '转出及转入公司/单位',
            transInfo: {
              rollOut: 'out_company',
              shiftInto: 'in_company'
            },
            formItems: [{
              value: 'name',
              label: '公司/单位名称'
            }, {
              value: 'mobile',
              label: '联系方式'
            }, {
              value: 'address',
              label: '坐落地址'
            }, {
              value: 'director',
              label: '法人/负责人'
            }, {
              value: 'organization.name',
              label: '所属工会'
            }]
          }]
        },
        searchs: []
      }]
    }
  },
  methods: {
    changeTab (index) {
      this.tabList[index].showTable = true
    },
    initAuth () {
      let list = this.powerList
      for (let i in list) {
        if (means.hasPermission(list[i])) {
          this.tabList[i].showTable = true
          break
        }
      }
    }
  },
  created () {
    let tabIndex = means.getQueryString('tabIndex')
    if (tabIndex) {
      let index = parseInt(tabIndex) - 1
      this.currentTab = index
      this.tabList[index].showTable = true
      return false
    }
    this.initAuth()
  }
}
</script>

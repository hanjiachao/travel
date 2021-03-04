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
  <Tabs class="audit-tabs" @on-click="changeTab">
    <TabPane v-for="(tab, tabIndex) in tabList" :key="tabIndex" :label="tab.title" v-if="means.hasPermission(tab.auth)">
      <audit-table v-if="tab.showTable" :config="tab.config" :auditInfo="tab.auditInfo" :showItem="tab.showItem" :hideItem="tab.hideItem" :searchs="tab.searchs" :history="tab.history"></audit-table>
    </TabPane>
  </Tabs>
</template>

<script>
import auditTable from './audit-table.vue'
import means from '@/libs/means'
export default {
  name: 'company-audit-my',
  components: {
    'audit-table': auditTable
  },
  data () {
    return {
      means: means,
      powerList: ['alteration_company_my', 'alteration_company_my', 'delete_record_company_my', 'shift_record_company_my'],
      tabList: [{
        title: '公司/单位添加申请',
        auth: 'alteration_company_my',
        showTable: false,
        config: {
          url: 'company/my_alterations',
          primaryKey: 'id',
          hasType: true,
          extraData: [{
            value: '创建',
            valueName: 'type'
          }],
          dataPosition: ['result', 'list']
        },
        history: {
          url: 'company/alteration_audit_records',
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
          label: '公司名称'
        }, {
          value: 'address',
          label: '坐落地址'
        }, {
          value: 'mobile',
          label: '联系电话'
        }, {
          value: 'director',
          label: '工会主席'
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
            title: '公司信息',
            showCase: 'perinfo',
            defaultCase: true,
            formItems: [{
              value: 'name',
              label: '公司/单位名称'
            }, {
              value: 'code',
              label: '企业信用代码'
            }, {
              value: 'is_new_social_organization',
              label: '是否是新社会组织'
            }, {
              value: 'industry',
              label: '国民经济行业'
            }, {
              value: 'management_condition',
              label: '经营状况'
            }, {
              value: 'economic_type',
              label: '经济类型'
            }, {
              value: 'director',
              label: '法人/负责人'
            }, {
              value: 'mobile',
              label: '联系电话'
            }, {
              value: 'register_address',
              label: '注册地址'
            }, {
              value: 'register_address_zip_code',
              label: '注册地址邮编'
            }, {
              value: 'address',
              label: '坐落地址'
            }, {
              value: 'address_zip_code',
              label: '坐落地址邮编'
            }, {
              value: 'staff_num',
              label: '职工数量'
            }, {
              value: 'farmer_staff_num',
              label: '农民工数量'
            }, {
              value: 'labor_dispatch_staff_num',
              label: '劳务派遣员工数量'
            }, {
              value: 'found_time',
              label: '投产开业时间'
            }]
          }, {
            title: '申请信息',
            showCase: 'createdPerson',
            formItems: [{
              value: 'created_at',
              label: '申请时间'
            }, {
              value: 'created_admin.username',
              label: '申请人账号'
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
        title: '公司/单位编辑申请',
        auth: 'alteration_company_my',
        showTable: false,
        config: {
          url: 'company/my_alterations',
          primaryKey: 'id',
          hasType: true,
          extraData: [{
            value: '编辑',
            valueName: 'type'
          }],
          dataPosition: ['result', 'list']
        },
        history: {
          url: 'company/alteration_audit_records',
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
          label: '公司名称'
        }, {
          value: 'address',
          label: '坐落地址'
        }, {
          value: 'mobile',
          label: '联系电话'
        }, {
          value: 'director',
          label: '工会主席'
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
            title: '公司信息',
            showCase: 'perinfo',
            defaultCase: true,
            formItems: [{
              value: 'name',
              label: '公司/单位名称'
            }, {
              value: 'code',
              label: '企业信用代码'
            }, {
              value: 'is_new_social_organization',
              label: '是否是新社会组织'
            }, {
              value: 'industry',
              label: '国民经济行业'
            }, {
              value: 'management_condition',
              label: '经营状况'
            }, {
              value: 'economic_type',
              label: '经济类型'
            }, {
              value: 'director',
              label: '法人/负责人'
            }, {
              value: 'mobile',
              label: '联系电话'
            }, {
              value: 'register_address',
              label: '注册地址'
            }, {
              value: 'register_address_zip_code',
              label: '注册地址邮编'
            }, {
              value: 'address',
              label: '坐落地址'
            }, {
              value: 'address_zip_code',
              label: '坐落地址邮编'
            }, {
              value: 'staff_num',
              label: '职工数量'
            }, {
              value: 'farmer_staff_num',
              label: '农民工数量'
            }, {
              value: 'labor_dispatch_staff_num',
              label: '劳务派遣员工数量'
            }, {
              value: 'found_time',
              label: '投产开业时间'
            }]
          }, {
            title: '申请信息',
            showCase: 'createdPerson',
            formItems: [{
              value: 'created_at',
              label: '申请时间'
            }, {
              value: 'created_admin.username',
              label: '申请人账号'
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
        title: '公司/单位删除申请',
        auth: 'delete_record_company_my',
        showTable: false,
        config: {
          url: 'company/my_delete_records',
          primaryKey: 'id',
          namePosition: 'company.name',
          hasType: true,
          dataPosition: ['result', 'list']
        },
        history: {
          url: 'company/delete_record_audit_records',
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
          value: 'company.name',
          label: '公司名称'
        }, {
          value: 'company.address',
          label: '坐落地址'
        }, {
          value: 'company.mobile',
          label: '联系电话'
        }, {
          value: 'company.director',
          label: '工会主席'
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
            title: '公司信息',
            showCase: 'perinfo',
            defaultCase: true,
            formItems: [{
              value: 'company.organization.name',
              label: '所属工会',
              labelStyle: {
                fontSize: '15px',
                color: '#409EFF'
              },
              valueStyle: {
                fontSize: '15px',
                color: '#333'
              }
            }, {
              value: 'company.name',
              label: '公司/单位名称'
            }, {
              value: 'company.code',
              label: '企业信用代码'
            }, {
              value: 'company.is_new_social_organization',
              label: '是否是新社会组织'
            }, {
              value: 'company.industry',
              label: '国民经济行业'
            }, {
              value: 'company.management_condition',
              label: '经营状况'
            }, {
              value: 'company.economic_type',
              label: '经济类型'
            }, {
              value: 'company.director',
              label: '法人/负责人'
            }, {
              value: 'company.mobile',
              label: '联系电话'
            }, {
              value: 'company.register_address',
              label: '注册地址'
            }, {
              value: 'company.register_address_zip_code',
              label: '注册地址邮编'
            }, {
              value: 'company.address',
              label: '坐落地址'
            }, {
              value: 'company.address_zip_code',
              label: '坐落地址邮编'
            }, {
              value: 'company.staff_num',
              label: '职工数量'
            }, {
              value: 'company.farmer_staff_num',
              label: '农民工数量'
            }, {
              value: 'company.labor_dispatch_staff_num',
              label: '劳务派遣员工数量'
            }, {
              value: 'company.found_time',
              label: '投产开业时间'
            }]
          }, {
            title: '申请信息',
            showCase: 'createdPerson',
            formItems: [{
              value: 'created_at',
              label: '申请时间'
            }, {
              value: 'created_admin.username',
              label: '申请人账号'
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
        title: '公司/单位转移申请',
        auth: 'shift_record_company_my',
        showTable: false,
        config: {
          url: 'company/my_shift_records',
          primaryKey: 'id',
          namePosition: 'company.name',
          hasType: true,
          dataPosition: ['result', 'list']
        },
        history: {
          url: 'company/shift_record_audit_records',
          extraUrl: 'id',
          timeValue: 'created_at',
          resultValue: 'result',
          groupBy: ['shift_out', 'shift_in'],
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
          value: 'company.name',
          label: '公司名称'
        }, {
          value: 'company.address',
          label: '坐落地址'
        }, {
          value: 'company.mobile',
          label: '联系电话'
        }, {
          value: 'company.director',
          label: '公司法人/负责人'
        },
        // {
        //   value: 'shift_out_audit_mode',
        //   label: '转出审核模式'
        // },
        {
          value: 'shift_out_audit_status',
          label: '转出审核状态'
        },
        // {
        //   value: 'shift_in_audit_mode',
        //   label: '转入审核模式'
        // },
        {
          value: 'shift_in_audit_status',
          label: '转入审核状态'
        }],
        hideItem: {
          type: 'card',
          labelWidth: '140px',
          itemList: [{
            title: '公司/单位信息',
            showCase: 'perinfo',
            defaultCase: true,
            formItems: [{
              value: 'company.name',
              label: '公司/单位名称'
            }, {
              value: 'company.code',
              label: '企业信用代码'
            }, {
              value: 'company.is_new_social_organization',
              label: '是否是新社会组织'
            }, {
              value: 'company.industry',
              label: '国民经济行业'
            }, {
              value: 'company.management_condition',
              label: '经营状况'
            }, {
              value: 'company.economic_type',
              label: '经济类型'
            }, {
              value: 'company.director',
              label: '法人/负责人'
            }, {
              value: 'company.mobile',
              label: '联系电话'
            }, {
              value: 'company.register_address',
              label: '注册地址'
            }, {
              value: 'company.register_address_zip_code',
              label: '注册地址邮编'
            }, {
              value: 'company.address',
              label: '坐落地址'
            }, {
              value: 'company.address_zip_code',
              label: '坐落地址邮编'
            }, {
              value: 'company.staff_num',
              label: '职工数量'
            }, {
              value: 'company.farmer_staff_num',
              label: '农民工数量'
            }, {
              value: 'company.labor_dispatch_staff_num',
              label: '劳务派遣员工数量'
            }, {
              value: 'company.found_time',
              label: '投产开业时间'
            }]
          }, {
            title: '申请信息',
            showCase: 'createdPerson',
            formItems: [{
              value: 'created_at',
              label: '申请时间'
            }, {
              value: 'created_admin.username',
              label: '申请人账号'
            }, {
              value: 'operate_type',
              label: '变更类型'
            },
            // {
            //   value: 'shift_out_audit_mode',
            //   label: '转出审核模式'
            // },
            {
              value: 'shift_out_audit_status',
              label: '转出审核状态'
            },
            // {
            //   value: 'shift_in_audit_mode',
            //   label: '转入审核模式'
            // },
            {
              value: 'shift_in_audit_status',
              label: '转入审核状态'
            }]
          }, {
            type: 'trans',
            title: '转出及转入工会',
            transInfo: {
              rollOut: 'out_organization',
              shiftInto: 'in_organization'
            },
            formItems: [{
              value: 'name',
              label: '工会名称'
            }, {
              value: 'mobile',
              label: '联系方式'
            }, {
              value: 'postal_address',
              label: '通讯地址'
            }, {
              value: 'director',
              label: '工会主席'
            }, {
              value: 'director_mobile',
              label: '主席联系方式'
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
    this.initAuth()
  }
}
</script>

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
  name: 'orgain-audit',
  components: {
    'audit-table': auditTable
  },
  data () {
    return {
      means: means,
      powerList: ['alteration_orgainzation_my', 'alteration_orgainzation_my', 'delete_record_orgainzation_my', 'shift_record_orgainzation_my'],
      tabList: [{
        title: '组织工会创建申请',
        auth: 'alteration_orgainzation_my',
        showTable: false,
        config: {
          url: 'organization/my_alterations',
          primaryKey: 'id',
          hasType: true,
          extraData: [{
            value: '创建',
            valueName: 'type'
          }],
          dataPosition: ['result', 'list']
        },
        history: {
          url: 'organization/alteration_audit_records',
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
          label: '工会名称'
        }, {
          value: 'postal_address',
          label: '通讯地址'
        }, {
          value: 'mobile',
          label: '联系电话'
        }, {
          value: 'director',
          label: '工会主席'
        }, {
          value: 'director_mobile',
          label: '主席电话'
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
            title: '组织工会信息',
            showCase: 'perinfo',
            defaultCase: true,
            formItems: [{
              value: 'name',
              label: '工会名称'
            }, {
              value: 'found_time',
              label: '建会时间'
            }, {
              value: 'postal_address',
              label: '通讯地址'
            }, {
              value: 'mobile',
              label: '联系电话'
            }, {
              value: 'zip_code',
              label: '邮政编码'
            }, {
              value: 'director',
              label: '工会主席'
            }, {
              value: 'director_mobile',
              label: '主席电话'
            }, {
              value: 'change_time',
              label: '成立或换届时间'
            }, {
              value: 'expiration_date',
              label: '届期'
            }, {
              value: 'hierarchy',
              groupBy: ['hierarchy1', 'hierarchy2'],
              joinBy: '/',
              label: '工会层级'
            }, {
              value: 'organization_form',
              groupBy: ['organization_form1', 'organization_form2'],
              joinBy: '/',
              label: '组织形式'
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
        title: '组织工会编辑申请',
        auth: 'alteration_orgainzation_my',
        showTable: false,
        config: {
          url: 'organization/my_alterations',
          primaryKey: 'id',
          hasType: true,
          extraData: [{
            value: '编辑',
            valueName: 'type'
          }],
          dataPosition: ['result', 'list']
        },
        history: {
          url: 'organization/alteration_audit_records',
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
          label: '工会名称'
        }, {
          value: 'postal_address',
          label: '通讯地址'
        }, {
          value: 'mobile',
          label: '联系电话'
        }, {
          value: 'director',
          label: '工会主席'
        }, {
          value: 'director_mobile',
          label: '主席电话'
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
            title: '组织工会信息',
            showCase: 'perinfo',
            defaultCase: true,
            formItems: [{
              value: 'name',
              label: '工会名称'
            }, {
              value: 'found_time',
              label: '建会时间'
            }, {
              value: 'postal_address',
              label: '通讯地址'
            }, {
              value: 'mobile',
              label: '联系电话'
            }, {
              value: 'zip_code',
              label: '邮政编码'
            }, {
              value: 'director',
              label: '工会主席'
            }, {
              value: 'director_mobile',
              label: '主席电话'
            }, {
              value: 'change_time',
              label: '成立或换届时间'
            }, {
              value: 'expiration_date',
              label: '届期'
            }, {
              value: 'hierarchy',
              groupBy: ['hierarchy1', 'hierarchy2'],
              joinBy: '/',
              label: '工会层级'
            }, {
              value: 'organization_form',
              groupBy: ['organization_form1', 'organization_form2'],
              joinBy: '/',
              label: '组织形式'
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
        title: '组织工会删除申请',
        auth: 'delete_record_orgainzation_my',
        showTable: false,
        config: {
          url: 'organization/my_delete_records',
          primaryKey: 'id',
          namePosition: 'organization.name',
          hasType: true,
          dataPosition: ['result', 'list']
        },
        history: {
          url: 'organization/delete_record_audit_records',
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
          value: 'organization.name',
          label: '工会名称'
        }, {
          value: 'organization.postal_address',
          label: '通讯地址'
        }, {
          value: 'organization.mobile',
          label: '联系电话'
        }, {
          value: 'organization.director',
          label: '工会主席'
        }, {
          value: 'organization.director_mobile',
          label: '主席电话'
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
            title: '组织工会信息',
            showCase: 'perinfo',
            defaultCase: true,
            formItems: [{
              value: 'organization.name',
              label: '工会名称'
            }, {
              value: 'organization.found_time',
              label: '建会时间'
            }, {
              value: 'organization.postal_address',
              label: '通讯地址'
            }, {
              value: 'organization.mobile',
              label: '联系电话'
            }, {
              value: 'organization.zip_code',
              label: '邮政编码'
            }, {
              value: 'organization.director',
              label: '工会主席'
            }, {
              value: 'organization.director_mobile',
              label: '主席电话'
            }, {
              value: 'organization.change_time',
              label: '成立或换届时间'
            }, {
              value: 'organization.expiration_date',
              label: '届期'
            }, {
              value: 'hierarchy',
              groupBy: ['organization.hierarchy1', 'organization.hierarchy2'],
              joinBy: '/',
              label: '工会层级'
            }, {
              value: 'organization_form',
              groupBy: ['organization.organization_form1', 'organization.organization_form2'],
              joinBy: '/',
              label: '组织形式'
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
        title: '组织工会转移申请',
        auth: 'shift_record_orgainzation_my',
        showTable: false,
        config: {
          url: 'organization/my_shift_records',
          primaryKey: 'id',
          namePosition: 'organization.name',
          hasType: true,
          dataPosition: ['result', 'list']
        },
        history: {
          url: 'organization/shift_record_audit_records',
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
          value: 'organization.name',
          label: '工会名称'
        }, {
          value: 'organization.postal_address',
          label: '通讯地址'
        }, {
          value: 'organization.mobile',
          label: '联系电话'
        }, {
          value: 'organization.director',
          label: '工会主席'
        }, {
          value: 'organization.director_mobile',
          label: '主席电话'
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
            title: '组织工会信息',
            showCase: 'perinfo',
            defaultCase: true,
            formItems: [{
              value: 'organization.name',
              label: '工会名称'
            }, {
              value: 'organization.found_time',
              label: '建会时间'
            }, {
              value: 'organization.postal_address',
              label: '通讯地址'
            }, {
              value: 'organization.mobile',
              label: '联系电话'
            }, {
              value: 'organization.zip_code',
              label: '邮政编码'
            }, {
              value: 'organization.director',
              label: '工会主席'
            }, {
              value: 'organization.director_mobile',
              label: '主席电话'
            }, {
              value: 'organization.change_time',
              label: '成立或换届时间'
            }, {
              value: 'organization.expiration_date',
              label: '届期'
            }, {
              value: 'hierarchy',
              groupBy: ['organization.hierarchy1', 'organization.hierarchy2'],
              joinBy: '/',
              label: '工会层级'
            }, {
              value: 'organization_form',
              groupBy: ['organization.organization_form1', 'organization.organization_form2'],
              joinBy: '/',
              label: '组织形式'
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

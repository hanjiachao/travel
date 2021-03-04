<template>
  <div>
    <form-modal :config="config" :showItem="showItem" :hideItem="hideItem" :controls="controls" :searchs="searchs" @change-screen="changeScreen"></form-modal>
  </div>
</template>

<script>
import formModal from '@/components/data-hidden/index.vue'
export default {
  name: 'index',
  components: {
    'form-modal': formModal
  },
  data () {
    return {
      showItem: [{
        value: 'name',
        label: '姓名'
      }, {
        value: 'sex',
        label: '性别'
      }, {
        value: 'age',
        label: '年龄'
      }, {
        value: 'status',
        label: '任职状态'
      }],
      hideItem: {
        type: 'form',
        itemList: [
          {
            value: 'name',
            label: '姓名'
          }, {
            value: 'sex',
            label: '性别'
          }, {
            value: 'nation',
            label: '民族'
          }, {
            value: 'education',
            label: '学历'
          }, {
            value: 'birthday',
            label: '出生日期'
          }, {
            value: 'idcard',
            label: '身份证号'
          }, {
            value: 'home_address',
            label: '家庭住址'
          }, {
            value: 'material',
            label: '申报材料',
            type: 'imageList'
          }, {
            value: 'mobile',
            label: '联系电话'
          }, {
            value: 'email',
            label: '电子邮箱'
          }, {
            value: 'other_mobile',
            label: '其他联系方式'
          }, {
            value: 'is_party',
            label: '是否是党员',
            decisionBy: {
              valueName: 'join_party_time',
              haveValue: '是',
              nullValue: '否'
            }
          }, {
            value: 'join_party_time',
            label: '入党时间',
            depend: [{
              valueName: 'is_party',
              value: '是'
            }]
          }, {
            value: 'office_time',
            label: '开始工作时间'
          }, {
            value: 'member_time',
            label: '会员时间'
          }, {
            value: 'end_time',
            label: '会员截止时间'
          }, {
            value: 'status',
            label: '任职状态'
          }, {
            value: 'quit_time',
            label: '离职时间',
            depend: [{
              valueName: 'status',
              value: '离职'
            }]
          }, {
            value: 'quit_reason',
            label: '离职原因',
            depend: [{
              valueName: 'status',
              value: '离职'
            }]
          }
        ]
      },
      hideItem1: {
        type: 'card',
        itemList: [
          {
            title: '个人基本信息',
            showCase: 'perinfo',
            defaultCase: true,
            formItems: [{
              value: 'name',
              label: '姓名'
            }, {
              value: 'sex',
              label: '性别'
            }, {
              value: 'nation',
              label: '民族'
            }, {
              value: 'education',
              label: '学历'
            }, {
              value: 'idcard',
              label: '身份证号'
            }]
          },
          {
            title: '联系方式',
            showCase: 'concatCase',
            formItems: [{
              value: 'mobile',
              label: '联系电话'
            }, {
              value: 'email',
              label: '电子邮箱'
            }, {
              value: 'other_mobile',
              label: '其他联系方式'
            }]
          },
          {
            title: '工作情况',
            showCase: 'workCase',
            formItems: [{
              value: 'material',
              label: '申报材料',
              type: 'imageList'
            }, {
              value: 'is_party',
              label: '是否是党员',
              decisionBy: {
                valueName: 'join_party_time',
                haveValue: '是',
                nullValue: '否'
              }
            }, {
              value: 'join_party_time',
              label: '入党时间',
              depend: [{
                valueName: 'is_party',
                value: '是'
              }]
            }, {
              value: 'office_time',
              label: '工作时间'
            }, {
              value: 'member_time',
              label: '会员时间'
            }, {
              value: 'end_time',
              label: '会员截止时间'
            }, {
              value: 'status',
              label: '任职状态'
            }, {
              value: 'quit_time',
              label: '离职时间',
              depend: [{
                valueName: 'status',
                value: '离职'
              }]
            }, {
              value: 'quit_reason',
              label: '离职原因',
              depend: [{
                valueName: 'status',
                value: '离职'
              }]
            }]
          },
          {
            title: '家庭情况',
            showCase: 'homeCase',
            formItems: [{
              value: 'home_address',
              label: '家庭住址'
            }, {
              value: 'familyMembers',
              valueType: 'array',
              inlineCard: true,
              title: '家庭成员',
              showCase: 'homeMembersCase',
              labelWidth: '80px',
              inlineItems: [{
                value: 'name',
                label: '姓名'
              }, {
                value: 'sex',
                label: '性别'
              }, {
                value: 'age',
                label: '年龄'
              }, {
                value: 'relationship',
                label: '关系'
              }]
            }]
          }
        ]
      },
      config: {
        url: '',
        // 懒加载用 若无懒加载 则不需要该参数
        lazy: {
          lazyUrl: 'organizations',
          lazyUrlPrimary: 'id',
          lazyDataPosition: ['result']
        },
        primaryKey: 'id',
        // 除查询之外的筛选项
        // screening: {
        //   value: 'status',
        //   items: [{
        //     value: '全部',
        //     label: '全部'
        //   }, {
        //     value: '审核中',
        //     label: '审核中'
        //   }, {
        //     value: '通过',
        //     label: '已通过'
        //   }, {
        //     value: '驳回',
        //     label: '已驳回'
        //   }]
        // },
        // 额外参数 查询项之外的筛选项的value值也需要写在这里面
        // extraData: {
        //   status: '全部'
        // },
        columnAlign: '', // 表格中数据的对其方式 center/left/right  默认center
        firstColumnLeft: false, // 设置第一列数据是否居中 防止有子节点时 显示不出层次
        dataPosition: ['result']
      },
      searchs: [{
        label: '姓名',
        value: 'name'
      }, {
        type: 'date',
        label: '开始工作时间',
        value: 'workStartTime'
      }, {
        type: 'select',
        label: '婚姻状况',
        value: 'maritalStatus',
        options: '婚姻状况'
      }, {
        type: 'time',
        label: '睡觉时间',
        value: 'sleepTime',
        fold: true
      }],
      controls1: [{
        title: '添加',
        selection: 'multiple',
        icon: 'md-add',
        type: 'form',
        url: '',
        formItems: [{
          label: '姓名',
          name: 'name',
          type: 'text'
        }]
      }],
      controls: [{
        title: '添加',
        selection: 'multiple',
        auth: 'add_organization',
        icon: 'md-add',
        type: 'form',
        url: '',
        urlPrimary: 'id',
        formNeed: 'parentId',
        classifyCard: true,
        classify: [{
          title: '个人基本信息',
          showCase: 'persoanlCase',
          defaultCase: true,
          formItems: [{
            label: '姓名',
            value: 'name',
            rules: ['required']
          }, {
            label: '学历',
            value: 'education',
            type: 'select',
            options: '学历',
            rules: ['required']
          }, {
            label: '手机号',
            value: 'mobile',
            rules: ['mobile']
          }, {
            label: '出生日期',
            value: 'birthday',
            startDate: '1990-01-01',
            type: 'date',
            rules: ['required']
          }, {
            label: '是否有房',
            value: 'isHouse',
            type: 'cascader',
            options: '是否有房',
            groupBy: ['hasHouse', 'houseType'],
            rules: ['requiredArray']
          }, {
            label: '选择工会',
            value: 'union',
            config: {
              url: 'organizations/all',
              dataPosition: ['result'],
              keyName: 'id',
              valueName: 'id',
              titleName: 'name',
              childrenName: 'children'
            },
            type: 'treeSelect',
            rules: ['requiredArray']
          }, {
            title: '个人经济情况',
            cardValue: 'incomeSitua',
            showCase: 'incomeCase',
            defaultNum: 1,
            type: 'card',
            childrenForm: [{
              label: '月收入',
              value: 'income',
              rules: ['required']
            }, {
              label: '每月支出',
              value: 'spend',
              rules: ['required']
            }, {
              label: '是否有结余',
              value: 'balance',
              type: 'select',
              options: '是或否'
            }]
          }]
        }, {
          title: '家庭情况',
          showCase: 'homeCase',
          defaultCase: true,
          formItems: [{
            label: '婚姻状况',
            value: 'poStatus',
            type: 'select',
            rules: ['required'],
            options: '婚姻状况'
          }, {
            label: '配偶姓名',
            value: 'poName',
            rules: ['required'],
            depend: [{
              keyName: 'poStatus',
              value: '已婚'
            }]
          }, {
            title: '家庭成员',
            cardValue: 'familyMembers',
            showCase: 'familyMembersCase',
            defaultNum: 1,
            inceAllow: true,
            type: 'card',
            childrenForm: [{
              value: 'name',
              label: '姓名'
            }, {
              value: 'sex',
              label: '性别',
              type: 'select',
              options: [{
                label: '男',
                value: '男'
              }, {
                label: '女',
                value: '女'
              }]
            }, {
              value: 'age',
              label: '年龄'
            }, {
              value: 'relationship',
              label: '关系'
            }]
          }]
        }, {
          title: '附件',
          showCase: 'attachmentCase',
          defaultCase: true,
          formItems: [{
            label: '申报材料',
            value: 'material',
            type: 'image',
            span: 24,
            submitType: 'string'
          }, {
            label: '附件',
            value: 'attachment',
            type: 'image',
            span: 24
          }]
        }]
      }, {
        title: '编辑',
        selection: 'single',
        auth: 'edit_organization',
        icon: 'ios-brush',
        type: 'form',
        urlInitial: '',
        urlPrimary: 'id',
        formNeed: 'allRow',
        classifyCard: true,
        classify: [{
          title: '个人基本信息',
          showCase: 'persoanlCase',
          defaultCase: true,
          formItems: [{
            label: '下拉分页测试',
            value: 'cor',
            type: 'selectPaging',
            config: {
              url: 'companies/1',
              keyName: 'name',
              valueName: 'id'
            },
            rules: ['requiredNumber']
          }, {
            label: '姓名',
            value: 'name',
            rules: ['required']
          }, {
            label: '学历',
            value: 'education',
            type: 'select',
            disabled: true,
            options: '学历',
            rules: ['required']
          }, {
            label: '手机号',
            value: 'mobile',
            rules: ['mobile']
          }, {
            label: '出生日期',
            value: 'birthday',
            startDate: '1990-01-01',
            type: 'date',
            format: 'yyyy-MM',
            rules: ['required']
          }, {
            label: '是否有房',
            value: 'isHouse',
            type: 'select',
            options: '是否有房',
            rules: ['required']
          }, {
            title: '个人经济情况',
            cardValue: 'incomeSitua',
            showCase: 'incomeCase',
            inceAllow: true,
            type: 'card',
            childrenForm: [{
              label: '月收入',
              value: 'income',
              rules: ['required']
            }, {
              label: '每月支出',
              value: 'spend',
              rules: ['required']
            }, {
              label: '是否有结余',
              value: 'balance',
              type: 'select',
              options: '是或否'
            }]
          }]
        }, {
          title: '家庭情况',
          showCase: 'homeCase',
          defaultCase: true,
          formItems: [{
            label: '婚姻状况',
            value: 'poStatus',
            type: 'select',
            rules: ['required'],
            options: '婚姻状况'
          }, {
            label: '配偶姓名',
            value: 'poName',
            depend: [{
              keyName: 'poStatus',
              value: '已婚'
            }]
          }, {
            label: '申报材料',
            value: 'material',
            type: 'image',
            span: 24
          }, {
            label: '附件',
            value: 'attachment',
            type: 'image',
            span: 24
          }]
        }]
      }, {
        title: '删除',
        selection: 'single',
        auth: 'delete_organization',
        icon: 'md-trash',
        type: 'handle',
        // 批量操作时的参数
        batch: {
          value: 'id',
          name: 'idList'
        },
        urlInitial: '',
        urlPrimary: 'id'
      }, {
        title: '隐藏操作1',
        selection: 'single',
        auth: 'delete_organization',
        icon: 'ios-beer',
        type: 'handle',
        urlInitial: '',
        urlPrimary: 'id'
        // fold: true
      }, {
        title: '隐藏操作2',
        selection: 'single',
        auth: 'delete_organization',
        icon: 'ios-at',
        type: 'handle',
        urlInitial: '',
        urlPrimary: 'id'
        // fold: true
      }]
    }
  },
  methods: {
    changeScreen (value) {
      let extraData = this.config.extraData || {}
      extraData[this.config.screening.value] = value
      this.$set(this.config, 'extraData', extraData)
    }
  },
  created () {
  }
}
</script>

<style scoped>

</style>

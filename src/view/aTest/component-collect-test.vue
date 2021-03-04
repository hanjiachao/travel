<template>
  <div>
    <data-table :config="config" :showItem="showItems" :hideItem="hideItems" :controls="controls" :searchs="searchs"></data-table>
  </div>
</template>

<script>
import dataTable from '../aComponentCollect/dataTable/table-page'
import store from '../../store'

export default {
  name: 'index',
  components: {
    'data-table': dataTable
  },
  data () {
    return {
      showItems: [
        {
          value: 'name',
          label: '姓名',
          align: 'center',
          fixed: 'left'
        }, {
          value: 'sex',
          label: '性别'
        }, {
          value: 'age',
          label: '年龄',
          hideDisabled: true
        },
        {
          value: 'mobile',
          label: '联系电话',
          hide: true
        }
      ],
      hideItem1: {
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
      hideItems: {
        type: 'card',
        titlePosition: 'name', // 给modal的title所在位置
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
              value: 'status',
              label: '会员状态'
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
              label: '就业状况'
            },
            {
              value: 'occupation',
              label: '职业'
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
              label: '隶属街镇',
              value: 'street_town'
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
        }]
      },
      config: {
        url: 'staffs/by_organization', // 获取表格数据的接口地址
        extraUrl: '1', // 获取表格数据时额外的接口中以链接的形式待在低智商的参数
        extraParams: { // 获取表格数据时额外的参数
          children: '是'
        },
        controlsFixed: 'right', // 操作按钮是否固定
        primaryKey: 'id', // 接口中保留的唯一键
        columnAlign: '', // 表格中数据的对其方式 center/left/right  默认center
        dataPosition: 'result.list', // 表格数据的数组 所在的位置  默认为 result.list
        highlight: true, // 高亮当前行
        // 操作行设置
        controlConifg: {
          refresh: true
        },
        // 分页用数据
        paging: true, // 是否需要分页
        pagingConfig: { // 分页的设置
          pagePosition: 'result.meta', // 分页数据 所在的位置 默认为 result.meta
          pageSize: 'per_page', // 每页多少条的字段 默认为 per_page
          total: 'total', // 共多少条的字段 默认为 total
          showTotal: true, // 是否显示全部的页数
          refresh: true, // 分页器上的刷新按钮
          showElevator: true, // 显示跳到多少页
          showSize: true, // 显示多少页每条
          align: 'right' // 分页显示的位置 默认为 'right'
        }
      },
      searchs: [ // 搜索筛选项
        {
          type: 'treeSelect',
          label: '所属工会',
          value: 'orgain_id',
          inconformity: true, // 真值和显值不一致
          config: {
            url: 'organizations/all',
            keyName: 'name', // 显值字段 默认 'name'
            valueName: 'id', // 真字段 默认 'id'
            children: 'children', // 子节点数据   默认为'children'
            dataPosition: ['result', 0], // 数据所在位置  默认为 ['result']
            clearable: true
          }
        },
        {
          label: '所属单位',
          value: 'company_id',
          type: 'selectPaging',
          inconformity: true, // 真值和显值不一致
          config: {
            url: 'companies',
            keyName: 'name',
            valueName: 'id',
            extraParams: { // 加载选项时额外的参数
              children: '是',
              organization_id: store.state.admin.info.organization.id
            },
            searchAllow: true, // 显示搜索框
            skeyName: 'keyword', // 搜索框的上传字段
            // 分页设置
            pageConfig: {
              position: ['result', 'meta'],
              pageSize: 'per_page',
              total: 'total'
            }
          }
        },
        {
          type: 'daterange', // 日期选择 type为 date、daterange、datetime、datetimerange、year、month时通用
          label: '日期选择',
          value: 'date',
          sizeConfig: { // 栅格布局时的宽度
            size: 24, // 无论屏幕多大 都用这个数值 优先级较低
            xs: 24,
            sm: 12,
            md: 8,
            lg: 6
          },
          groupBy: ['start_date', 'end_date'], // 在daterange、datetimerange时可能会用到
          preachDisabled: true, // 表示该搜索项不需要传,只是作为载体
          joinBy: '~', // 如果值是数组 以什么方式展示当前筛选项中的该项
          config: {
            showWeek: false, // Boolean值 显示星期数 datetimerange  设置该项为true时会有渲染问题
            separator: '/', // 两个日期的分隔符 默认'~' iview3.30以上版本有效
            confirm: false, // 是否显示底部控制栏 即确定和清空按钮
            timePickerOptions: {} // datetime 和 datetimerang 下有效  timepicker的配置项 与iview一致
          }
        },
        {
          type: 'timerange',
          label: '时间选择',
          value: 'time',
          preachDisabled: true,
          groupBy: ['start_time', 'end_time'],
          joinBy: '-',
          config: {
            confirm: true
          }
        },
        {
          type: 'select',
          label: '选择测试',
          value: 'selectTest',
          inconformity: true,
          options: [{
            value: '1',
            label: '2'
          }]
        },
        {
          label: '身份证号',
          value: 'idcard'
        },
        {
          label: '姓名',
          value: 'name'
        },
        {
          label: '手机号',
          value: 'mobile'
        },
        {
          label: '外来务工',
          value: 'is_other_places_worker',
          type: 'select',
          options: '是或否',
          fold: true
        },
        {
          label: '农民工',
          value: 'migrant_worker',
          type: 'select',
          options: [
            {
              label: '外地',
              value: '外地'
            },
            {
              label: '本地',
              value: '本地'
            },
            {
              label: '否',
              value: '否'
            }
          ],
          fold: true
        },
        {
          label: '学历',
          value: 'education',
          type: 'select',
          options: '学历',
          fold: true
        },
        {
          label: '政治面貌',
          value: 'identity',
          type: 'select',
          options: '政治面貌',
          fold: true
        },
        {
          label: '就业状态',
          value: 'work_status',
          type: 'select',
          options: '就业状态',
          fold: true
        }
      ],
      controls: [{
        title: '添加',
        selection: 'none',
        auth: 'add_staff',
        icon: 'md-add',
        type: 'form',
        formType: 'card',
        url: 'staff',
        classify: [{
          title: '个人基本信息',
          showCase: 'baseCase',
          defaultCase: true,
          formItems: [{
            type: 'daterange',
            label: '日期段选择',
            value: 'dateTest',
            groupBy: ['start_date', 'end_date'],
            config: {
            },
            rules: ['requiredArray']
          }, {
            type: 'timerange',
            label: '时间段选择',
            value: 'dateTest',
            groupBy: ['start_time', 'end_time'],
            config: {
            },
            rules: ['requiredArray']
          }, {
            type: 'select',
            label: '性别',
            value: 'sex',
            options: [{
              label: '男',
              value: '男'
            }, {
              label: '女',
              value: '女'
            }]
          }, {
            type: 'treeSelect',
            label: '所属工会',
            value: 'orgain_id',
            config: {
              url: 'organizations/all',
              keyName: 'name',
              valueName: 'id',
              lazy: false, // 子节点是否懒加载
              hideWidth: '400px', // 树状部分宽度，默认100%
              childrenMark: 'children_number', // 是否有子节点的标识 默认为'children_number'
              children: 'children', // 子节点数据   默认为'children'
              dataPosition: ['result', 0], // 数据所在位置  默认为 ['result']
              multiSelect: false // 多选
            },
            rules: ['required']
          }, {
            type: 'selectPaging',
            label: '所属公司',
            value: 'company_id',
            rules: ['requiredNumber'],
            config: {
              url: 'companies',
              clearable: true,
              keyName: 'name', // 显值的字段 默认为'name'
              valueName: 'id', // 真值的字段 默认为'id'
              extraParams: { // 获取数据时额外带的参数
                children: '是',
                organization_id: store.state.admin.info.organization.id
              },
              searchAllow: true,
              skeyName: 'keyword',
              pageConfig: {
                position: ['result', 'meta'],
                pageSize: 'per_page',
                total: 'total'
              }
            }
          }, {
            label: '身份证号',
            value: 'idcard',
            rules: ['required', 'idcard']
          }, {
            label: '职工姓名',
            value: 'name',
            rules: ['required']
          }, {
            label: '民族',
            value: 'nation',
            rules: ['required']
          }, {
            label: '籍贯',
            value: 'native_place',
            rules: ['required']
          }, {
            label: '手机号',
            value: 'mobile',
            rules: ['required', 'mobile']
          }, {
            label: '学历',
            value: 'education',
            type: 'select',
            rules: ['required'],
            options: '学历'
          }, {
            label: '毕业院校',
            value: 'school',
            rules: ['required']
          }, {
            label: '居住地(具体到小区)',
            value: 'home_address',
            rules: ['required']
          }]
        }, {
          title: '政治面貌',
          showCase: 'identity',
          formItems: [{
            label: '政治面貌',
            value: 'identity',
            type: 'select',
            rules: ['required'],
            options: '政治面貌'
          }, {
            label: '入党时间',
            value: 'join_party_time',
            type: 'date',
            depend: [{
              keyName: 'identity',
              value: '中共党员'
            }],
            rules: ['required']
          }, {
            label: '是否是党委委员',
            value: 'is_party_member',
            placeholder: '若是请直接填地区，若不是请填否'
          }, {
            label: '是否是人大代表',
            value: 'is_npc_member',
            placeholder: '若是请直接填地区，若不是请填否'
          }, {
            label: '是否是政协代表',
            value: 'is_cppcc_member',
            placeholder: '若是请直接填地区，若不是请填否'
          }]
        }, {
          title: '工作情况',
          showCase: 'workCase',
          formItems: [{
            type: 'select',
            value: 'work_status',
            label: '就业状态',
            options: '就业状态',
            rules: ['required']
          }, {
            label: '职业',
            value: 'occupation',
            rules: ['required']
          }, {
            label: '是否是本单位干部',
            value: 'is_this_unit_staff',
            type: 'select',
            options: '干部职务',
            rules: ['required']
          }, {
            label: '隶属街镇',
            value: 'street_town',
            rules: ['required']
          }, {
            label: '部门',
            value: 'department'
          }, {
            label: '车间',
            value: 'workshop'
          }, {
            label: '班组',
            value: 'team'
          }, {
            label: '工龄',
            value: 'working_years',
            rules: ['required']
          }, {
            label: '参加工作时间',
            value: 'start_working_time',
            type: 'date',
            rules: ['required']
          }, {
            label: '加入工会时间',
            value: 'join_labour_union_time',
            type: 'date',
            rules: ['required']
          }, {
            label: '职称',
            value: 'title'
          }, {
            label: '技术等级',
            value: 'technical_grade'
          }, {
            label: '是否是外来务工人员',
            value: 'is_other_places_worker',
            type: 'select',
            options: '是或否',
            rules: ['required']
          }, {
            label: '月实发工资',
            value: 'wage_level',
            type: 'select',
            rules: ['required'],
            options: '月实发工资'
          }, {
            label: '是否是农民工',
            value: 'migrant_worker',
            type: 'select',
            rules: ['required'],
            options: [{
              value: '外地',
              label: '外地'
            }, {
              value: '本地',
              label: '本地'
            }, {
              value: '否',
              label: '否'
            }]
          }, {
            label: '农民工证明材料',
            value: 'migrant_worker_prove',
            type: 'image',
            rules: ['requiredArray'],
            span: 24,
            depend: [{
              keyName: 'migrant_worker',
              value: ['外地', '本地']
            }],
            distinguish: true,
            attention: true
          }]
        }, {
          title: '婚姻情况',
          showCase: 'marriageCase',
          formItems: [{
            label: '婚姻状况',
            value: 'marital_status',
            type: 'select',
            rules: ['required'],
            options: '婚姻状况'
          }, {
            label: '配偶是否有工作',
            value: 'spouse_has_job',
            type: 'select',
            options: '是或否',
            rules: ['required'],
            depend: [{
              keyName: 'marital_status',
              value: '已婚'
            }]
          }, {
            label: '配偶工作单位',
            value: 'spouse_working_unit',
            depend: [{
              keyName: 'spouse_has_job',
              value: '是'
            }]
          }, {
            label: '孩子年龄',
            value: 'children_age',
            placeholder: '多个孩子以逗号隔开，若无孩子可不填'
          }]
        }, {
          title: '劳模荣誉证明',
          showCase: 'difficultCase',
          formItems: [{
            value: 'model_worker_prove',
            label: '劳模材料证明',
            span: 24,
            type: 'image'
          }, {
            value: 'honours_above_district_level_prove',
            label: '区级以上荣誉',
            span: 24,
            type: 'image'
          }, {
            value: 'test_prove',
            label: '测试证明',
            span: 24,
            type: 'upload',
            config: {
              uploadUrl: 'upload',
              fileName: 'file',
              dataPosition: ['result', 'absolute_path'] // 上传成功后图片路径所在位置
            },
            attention: '上传组件测试'
          }]
        }, {
          title: '会员服务卡信息',
          showCase: 'bankCase',
          formItems: [{
            label: '会员正面卡号',
            value: 'member_front_code'
          }, {
            label: '会员反面卡号',
            value: 'member_reverse_side_code'
          }, {
            label: '开户银行',
            value: 'bank_name'
          }]
        }]
      }, {
        title: '编辑',
        selection: 'single',
        auth: 'edit_staff',
        icon: 'ios-brush',
        type: 'form',
        formType: 'card',
        url: 'staff',
        extraUrl: 'id',
        method: 'patch',
        formNeed: 'allRow',
        classify: [{
          title: '个人基本信息',
          showCase: 'baseCase',
          defaultCase: true,
          formItems: [{
            label: '身份证号',
            value: 'idcard',
            rules: ['required', 'idcard']
          }, {
            label: '职工姓名',
            value: 'name',
            rules: ['required']
          }, {
            label: '民族',
            value: 'nation',
            rules: ['required']
          }, {
            label: '籍贯',
            value: 'native_place',
            rules: ['required']
          }, {
            label: '手机号',
            value: 'mobile',
            rules: ['required', 'mobile']
          }, {
            label: '学历',
            value: 'education',
            type: 'select',
            rules: ['required'],
            options: '学历'
          }, {
            label: '毕业院校',
            value: 'school',
            rules: ['required']
          }, {
            label: '居住地(具体到小区)',
            value: 'home_address',
            rules: ['required']
          }]
        }, {
          title: '政治面貌',
          showCase: 'identity',
          formItems: [{
            label: '政治面貌',
            value: 'identity',
            type: 'select',
            rules: ['required'],
            options: '政治面貌'
          }, {
            label: '入党时间',
            value: 'join_party_time',
            type: 'date',
            depend: [{
              keyName: 'identity',
              value: '中共党员'
            }],
            rules: ['required']
          }, {
            label: '是否是党委委员',
            value: 'is_party_member',
            placeholder: '若是请直接填地区，若不是请填否'
          }, {
            label: '是否是人大代表',
            value: 'is_npc_member',
            placeholder: '若是请直接填地区，若不是请填否'
          }, {
            label: '是否是政协代表',
            value: 'is_cppcc_member',
            placeholder: '若是请直接填地区，若不是请填否'
          }]
        }, {
          title: '工作情况',
          showCase: 'workCase',
          formItems: [{
            type: 'select',
            value: 'work_status',
            label: '就业状态',
            options: '就业状态',
            rules: ['required']
          }, {
            label: '职业',
            value: 'occupation',
            rules: ['required']
          }, {
            label: '是否是本单位干部',
            value: 'is_this_unit_staff',
            type: 'select',
            options: '干部职务',
            rules: ['required']
          }, {
            label: '隶属街镇',
            value: 'street_town',
            rules: ['required']
          }, {
            label: '部门',
            value: 'department'
          }, {
            label: '车间',
            value: 'workshop'
          }, {
            label: '班组',
            value: 'team'
          }, {
            label: '工龄',
            value: 'working_years',
            rules: ['required']
          }, {
            label: '参加工作时间',
            value: 'start_working_time',
            type: 'date',
            rules: ['required']
          }, {
            label: '加入工会时间',
            value: 'join_labour_union_time',
            type: 'date',
            rules: ['required']
          }, {
            label: '职称',
            value: 'title'
          }, {
            label: '技术等级',
            value: 'technical_grade'
          }, {
            label: '是否是外来务工人员',
            value: 'is_other_places_worker',
            type: 'select',
            options: '是或否',
            rules: ['required']
          }, {
            label: '月实发工资',
            value: 'wage_level',
            type: 'select',
            rules: ['required'],
            options: '月实发工资'
          }, {
            label: '是否是农民工',
            value: 'migrant_worker',
            type: 'select',
            rules: ['required'],
            options: [{
              value: '外地',
              label: '外地'
            }, {
              value: '本地',
              label: '本地'
            }, {
              value: '否',
              label: '否'
            }]
          }, {
            label: '农民工证明材料',
            value: 'migrant_worker_prove',
            type: 'image',
            rules: ['requiredArray'],
            span: 24,
            depend: [{
              keyName: 'migrant_worker',
              value: ['外地', '本地']
            }],
            distinguish: true,
            attention: true
          }]
        }, {
          title: '婚姻情况',
          showCase: 'marriageCase',
          formItems: [{
            label: '婚姻状况',
            value: 'marital_status',
            type: 'select',
            rules: ['required'],
            options: '婚姻状况'
          }, {
            label: '配偶是否有工作',
            value: 'spouse_has_job',
            type: 'select',
            options: '是或否',
            rules: ['required'],
            depend: [{
              keyName: 'marital_status',
              value: '已婚'
            }]
          }, {
            label: '配偶工作单位',
            value: 'spouse_working_unit',
            depend: [{
              keyName: 'spouse_has_job',
              value: '是'
            }]
          }, {
            label: '孩子年龄',
            value: 'children_age',
            placeholder: '多个孩子以逗号隔开，若无孩子可不填'
          }]
        }, {
          title: '劳模荣誉证明',
          showCase: 'difficultCase',
          formItems: [{
            value: 'model_worker_prove',
            label: '劳模材料证明',
            span: 24,
            type: 'image'
          }, {
            value: 'honours_above_district_level_prove',
            label: '区级以上荣誉',
            span: 24,
            type: 'image'
          }]
        }, {
          title: '会员服务卡信息',
          showCase: 'bankCase',
          formItems: [{
            label: '会员正面卡号',
            value: 'member_front_code'
          }, {
            label: '会员反面卡号',
            value: 'member_reverse_side_code'
          }, {
            label: '开户银行',
            value: 'bank_name'
          }]
        }]
      }, {
        title: '删除',
        selection: 'single',
        auth: 'delete_staff',
        icon: 'md-trash',
        type: 'handle',
        method: 'delete',
        // 批量操作时的参数
        batch: {
          value: 'id',
          name: 'idList'
        },
        url: 'staff',
        urlPrimary: 'id'
      }]
    }
  }
}
</script>

<style scoped>

</style>

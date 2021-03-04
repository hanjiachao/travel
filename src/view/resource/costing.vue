<template>
  <div class="conts">
    <div class="tab">
      <el-table
        :highlight-current-row="true"
        :data="tablist"
        class="tab-list"
        style="width: 100%;margin-bottom: 50px;"
        stripe
        row-key="no"
        v-loading="tableLoading"
      >
        <el-table-column
          v-for="(item , index) in tabHeadList"
          :key="index"
          :label="item.label"
          align="center"
          :prop="item.value"
          show-overflow-tooltip
        ></el-table-column>
        <el-table-column label="操作"
                         align="center"
                         width="200px"
        >
          <template slot-scope="scope">
            <el-tooltip content="编辑" placement="bottom" style="margin: 0 3px">
              <Button @click="edit(scope.row)">
                <Icon type="ios-brush"></Icon>
              </Button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <paging :total="pageData.total" :pageSize="pageData.pageSize" v-model="page" @on-change="toPage"></paging>
    <form-modal :config="{}" v-model="forms" @save-success="getList"></form-modal>
  </div>
</template>

<script>

import ajax from '@/libs/ajax'
import means from '@/libs/means'
import paging from '@/components/data-hidden/paging'
import formModal from '@/components/data-table/form-modal.vue'

export default {
  components: {
    'form-modal': formModal,
    paging
  },
  name: 'costing',
  data () {
    return {
      means: means,
      page: 1,
      pageData: {
        total: 0,
        pageSize: 10
      },
      tablist: [
        {
          route: '这是一个线路',
          type: '周边短线',
          money: '23'
        },
        {
          route: '这是一个线路',
          type: '出境游',
          money: '23'
        },
        {
          route: '这是一个线路',
          type: '国内长线',
          money: '23'
        },
        {
          route: '这是一个线路',
          type: '出境游',
          money: '23'
        }
      ],
      tabHeadList: [
        {
          value: 'l_name',
          label: '路线'
        },
        {
          value: 'l_type',
          label: '类型'
        },
        {
          value: 'total_price',
          label: '成本'
        }
      ],
      tableLoading: false,
      forms: {},
      defaultForms: {
        title: '添加',
        confirm: true,
        url: '/Api/Line/saveLineCost',
        defaultData: {},
        formItems: []
      },
      formItems1: [
        {
          type: 'text',
          name: 'l_air_ticket',
          label: '机票成本',
          rules: ['required']
        },
        {
          type: 'text',
          name: 'l_land_price',
          label: '地接价',
          rules: ['required']
        }
      ],
      formItems2: [
        {
          type: 'text',
          name: 'l_air_ticket',
          label: '机票成本',
          rules: ['required']
        },
        {
          type: 'text',
          name: 'l_land_price',
          label: '地接价',
          rules: ['required']
        },
        {
          type: 'text',
          name: 'l_visa',
          label: '签证',
          rules: ['required']
        }
      ],
      formItems3: [
        {
          type: 'text',
          name: 'l_air_ticket',
          label: '机票成本',
          rules: ['required']
        },
        {
          type: 'text',
          name: 'l_meals',
          label: '餐食',
          rules: ['required']
        },
        {
          type: 'text',
          name: 'l_stay',
          label: '住宿',
          rules: ['required']
        },
        {
          type: 'text',
          name: 'l_car',
          label: '车',
          rules: ['required']
        },
        {
          type: 'text',
          name: 'l_guide',
          label: '导游',
          rules: ['required']
        },
        {
          type: 'text',
          name: 'l_admission_ticket',
          label: '门票',
          rules: ['required']
        },
        {
          type: 'text',
          name: 'l_other',
          label: '其他',
          rules: ['required']
        }
      ]
    }
  },
  methods: {
    getList () {
      this.tableLoading = true
      let _this = this
      ajax.post({
        url: '/Api/Line/getLineCostList',
        userinfo: true,
        data: {
          limit: 10,
          page: this.page - 1
        }
      }).then(res => {
        this.tableLoading = false
        _this.pageData = {
          pageSize: 10,
          total: Number(res.result.count)
        }
        _this.tablist = res.result.list
      })
    },
    toPage (page) {
      this.page = page
      this.getList()
    },
    edit (row) {
      console.log(row)
      let forms = { ...this.defaultForms }
      forms.title = '添加成本'
      forms.defaultData = row
      if(row.l_type == '国内长线'){
        forms.formItems = this.formItems1
      }else if(row.l_type == '出境游'){
        forms.formItems = this.formItems2
      }else {
        forms.formItems = this.formItems3
      }
      this.forms = forms
    }
  },
  created () {
    this.getList()
  }
}
</script>

<style scoped>
  .conts{
    background: #ffffff;
    margin: 20px;
    border-radius: 10px;
    padding: 20px;
    overflow: hidden;
  }
</style>

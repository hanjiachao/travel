<template>
  <Split v-model="split">
    <div slot="left">
      <div class="top">
        <search-filter @screening="screening" :spanWidth="spanWidth" :searchs="searchs"></search-filter>
      </div>
      <div class="tab">
        <el-table
                :highlight-current-row="true"
                :data="tablist"
                class="tab-list"
                ref="table"
                style="width: 100%"
                stripe
                row-key="no"
                v-loading="tableLoading"
                @current-change="rowChange"
        >
          <el-table-column
                  v-for="(item , index) in tabHeadList"
                  :key="index"
                  :label="item.label"
                  align="center"
                  :prop="item.value"
                  show-overflow-tooltip
          ></el-table-column>
        </el-table>
        <div style="height: 40px;background: #fff;margin-bottom: 20px">
          <div style="width: 33.3%;line-height: 40px;text-align: center;float: right">总利润：{{total}}</div>
        </div>
        <paging :total="pageData.total" :pageSize="pageData.pageSize" v-model="page" @on-change="toPage"></paging>
      </div>
    </div>
    <div slot="right">
      <div class="tab" style="margin-top: 20px;">
        <el-table
                :highlight-current-row="true"
                :data="smallTablist"
                class="tab-list"
                style="width: 100%;margin-bottom: 50px;"
                stripe
                row-key="no"
                v-loading="tableLoadings"
        >
          <el-table-column
                  v-for="(item , index) in smallTabHeadList"
                  :key="index"
                  :label="item.label"
                  align="center"
                  :prop="item.value"
                  show-overflow-tooltip
          ></el-table-column>
        </el-table>
        <paging :total="pageDatas.total" :pageSize="pageDatas.pageSize" v-model="pages" @on-change="toPages"></paging>
      </div>
    </div>
  </Split>
</template>

<script>

import ajax from '@/libs/ajax'
import means from '@/libs/means'
import searchFilter from '../searchView/search-filter'
import paging from '@/components/data-hidden/paging'

export default {
  name: 'profits',
  components: {
    'search-filter': searchFilter,
    paging
  },
  data () {
    return {
      split: 0.4,
      spanWidth: 24,
      means: means,
      page: 1,
      pageData: {
        total: 0,
        pageSize: 10
      },
      pages: 1,
      pageDatas: {
        total: 0,
        pageSize: 10
      },
      tablist: [],
      tabHeadList: [
        {
          value: 'l_name',
          label: '路线名'
        },
        {
          value: 'order_number',
          label: '订单数量'
        },
        {
          value: 'total_profit',
          label: '总利润'
        }
      ],
      smallTablist: [],
      smallTabHeadList: [
        {
          value: 'or_departure_date',
          label: '出发日期'
        },
        {
          value: 'people_number',
          label: '人数'
        },
        {
          value: 'total_profit',
          label: '利润'
        },
        {
          value: 'total_settlement',
          label: '结算价'
        },
        {
          value: 'or_adult_unit_price',
          label: '单价(成人)'
        },
        {
          value: 'or_adult_insure',
          label: '保险单价(成人)'
        },
        {
          value: 'or_adult_additional_cost',
          label: '附加费用'
        },
        {
          value: 'or_adult_cost_up',
          label: '成本增加(成人)'
        },
        {
          value: 'or_adult_remark',
          label: '成本增加备注(成人)'
        },
        {
          value: 'or_children_unit_price',
          label: '单价(儿童)'
        },
        {
          value: 'or_children_insure',
          label: '保险单价(儿童)'
        },
        {
          value: 'or_children_cost_up',
          label: '成本增加(儿童)'
        },
        {
          value: 'or_children_remark',
          label: '成本增加备注(儿童)'
        },
        {
          value: 'or_deductions_type',
          label: '门店扣款'
        }
      ],
      tableLoading: false,
      tableLoadings: false,
      l_id: '',
      // 筛选
      searchs: [
        {
          label: '时间',
          value: 'start_date',
          type: 'daterange'
        },
        {
          label: '路线',
          value: 'l_name',
          type: 'select',
          options: '路线',
          config: {
            url: '/Api/Line/getLineList',
            method: 'post',
            valuePosition: [],
            valueKey: 'l_name',
            labelKey: 'l_name'
          },
          fold: true
        }
      ],
      searchShow: true,
      queryData: {},
      total: ''
    }
  },
  methods: {
    getList() {
      let _this = this
      this.tableLoading = true
      let data = {
        page: this.page - 1,
        limit: 10
      }
      let queryData = this.queryData
      Object.keys(queryData).forEach((key) => {
        if (queryData[key].value  instanceof Array) {
          data[key] = JSON.stringify(queryData[key].value)
        }else {
          data[key] = queryData[key].value
        }
      })
      ajax.post({
        url: '/Api/VisitorStatistics/getLineList',
        userinfo: true,
        data: data
      }).then((res) => {
        _this.pageData = {
          pageSize: 10,
          total: Number(res.result.count)
        }
        _this.tablist = res.result.list
        _this.tableLoading = false
        if (_this.tablist.length > 0) {
          _this.$refs.table.setCurrentRow(_this.tablist[0])
        }
      })
    },
    toPage (page) {
      this.page = page
      this.getList()
    },
    screening (e) {
      this.page = 1
      this.queryData = e
      this.getList()
    },
    toPages (page) {
      this.pages = page
      this.getSmallList()
    },
    getSmallList() {
      this.tableLoadings = true
      let _this = this
      ajax.post({
        url: '/Api/VisitorStatistics/getOrderStatisticsList',
        userinfo: true,
        data: {
          l_id: _this.l_id,
          page: this.pages - 1,
          limit: 10
        }
      }).then(res => {
        _this.pageDatas = {
          pageSize: 10,
          total: Number(res.result.count)
        }
        _this.smallTablist = res.result.list
        _this.tableLoadings = false
      })
    },
    rowChange (row) {
      this.l_id = row.l_id
      this.getSmallList()
    },
    getTotal() {
      let _this = this
      ajax.post({
        url: '/Api/VisitorStatistics/getLineCountProfits',
        userinfo: true,
      }).then(res => {
        _this.total = res.result.count
      })
    },
  },
  created () {
    this.getList()
    this.getTotal()
  }
}
</script>

<style scoped>
  .top{
    margin: 20px;
  }
  .tab{
    background: #ffffff;
    margin: 0 20px;
  }
</style>

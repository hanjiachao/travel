<template>
  <Split v-model="split">
    <div slot="left">
      <div class="top" style="margin: 20px">
        <search-filter @screening="screening" :searchs="searchs"></search-filter>
      </div>
      <div class="tab">
        <el-table
          :highlight-current-row="true"
          :data="tablist"
          ref="table"
          class="tab-list"
          style="width: 100%;margin-bottom: 50px;"
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
        <paging :total="pageData.total" :pageSize="pageData.pageSize" v-model="page" @on-change="toPage"></paging>
      </div>
    </div>
    <div slot="right">
      <div class="top">
        <Button style="margin: 20px" v-if="downloadFlag" :loading="loading" type="primary" @click="getData">导出</Button>
      </div>
      <div class="tab" style="margin-top: 20px;">
        <el-table
          :highlight-current-row="true"
          :data="smallTablist"
          class="tab-list"
          style="width: 100%;margin-bottom: 50px;"
          stripe
          row-key="no"
          v-loading="tableLoading"
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
  name: 'andGroup',
  components: {
    'search-filter': searchFilter,
    paging
  },
  data () {
    return {
      split: 0.5,
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
          label: '路线'
        },
        {
          value: 'people_number',
          label: '总人数'
        },
        {
          value: 'or_add_time',
          label: '并团日期'
        },
        {
          value: 'or_adname',
          label: '操作计调'
        }
      ],
      smallTablist: [],
      smallTabHeadList: [
        {
          value: 'or_team_number',
          label: '团号'
        },
        {
          value: 'or_departure_date',
          label: '出发日期'
        },
        {
          value: 'or_return_date',
          label: '回程日期'
        },
        {
          value: 'people_number',
          label: '人数'
        },
        {
          value: 'guest_name',
          label: '主客人'
        },
        {
          value: 'or_adname',
          label: '计调'
        }
      ],
      tableLoading: false,
      tableLoadings: false,
      loading: false,
      or_id: '',
      // 筛选
      searchs: [
        {
          label: '团号',
          value: 'skey',
          type: 'text'
        },
        {
          label: '时间',
          value: 'start_date',
          type: 'daterange'
        },
        {
          label: '计调',
          value: 'ad_id',
          type: 'select',
          options: '计调',
          config: {
            url: '/Api/Order/getPeopleList',
            method: 'post',
            data: {
              role: '计调'
            },
            valuePosition: [],
            valueKey: 'ad_id',
            labelKey: 'ad_name'
          },
          fold: true
        },
        {
          label: '线路',
          value: 'l_id',
          type: 'select',
          options: '线路',
          config: {
            url: '/Api/Line/getLineList',
            method: 'post',
            valuePosition: [],
            valueKey: 'l_id',
            labelKey: 'l_name'
          },
          fold: true
        }
      ],
      searchShow: true,
      queryData: {}
    }
  },
  computed: {
    downloadFlag () {
      return means.hasPermission('ExportNextOrderList')
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
        url: '/Api/MergeOrder/getMergeOrderList',
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
        url: '/Api/MergeOrder/getMergeOrderNextList',
        userinfo: true,
        data: {
          or_id: _this.or_id,
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
      this.or_id = row.or_id
      this.getSmallList()
    },
    // 导出
    getData (e) {
      let _this = this
      _this.loading = true
      ajax.get({
        url: '/Api/MergeOrder/exportMergeOrderNextList',
        userinfo: true,
        exportFile: true,
        responseType: 'blob',
        params: {
          or_id: _this.or_id
        }
      }).then(res => {
        _this.loading = false
      })
    }
  },
  created () {
    this.getList()
  }
}
</script>

<style scoped>
  .tab{
    background: #ffffff;
    margin: 0 20px;
  }
  .search-form{
    min-width: 600px;
  }
</style>

<template>
  <Split v-model="split">
    <div slot="left">
      <div class="tab">
        <el-table
          :highlight-current-row="true"
          ref="table"
          :data="tablist"
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
      <div class="tab">
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
import paging from '@/components/data-hidden/paging'

export default {
  name: 'seat',
  components: {
    paging
  },
  data () {
    return {
      split: 0.5,
      // means: means,
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
          value: 's_type',
          label: '交通'
        },
        {
          value: 's_count',
          label: '总座位'
        },
        {
          value: 's_number',
          label: '剩余座位'
        },
        {
          value: 's_leave_date',
          label: '行程日期'
        },
        {
          value: 's_duration',
          label: '占座时间'
        }
      ],
      smallTablist: [],
      smallTabHeadList: [
        {
          value: 'so_add_time',
          label: '占座日期'
        },
        {
          value: 's_leave_date',
          label: '行程日期'
        },
        {
          value: 'so_number',
          label: '人数'
        },
        {
          value: 'so_adname',
          label: '销售'
        },
        {
          value: 'so_status',
          label: '状态'
        }
      ],
      tableLoading: false,
      tableLoadings: false,
      loading: false,
      s_id: ''
    }
  },
  computed: {
    downloadFlag () {
      return means.hasPermission('exportSeatOccupying')
    }
  },
  methods: {
    getList () {
      let _this = this
      this.tableLoading = true
      ajax.post({
        url: '/Api/SeatOccupying/getSeatList',
        userinfo: true,
        data: {
          page: this.page - 1,
          limit: 10
        }
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
    toPages (page) {
      this.pages = page
      this.getSmallList()
    },
    getSmallList () {
      this.tableLoadings = true
      let _this = this
      ajax.post({
        url: '/Api/SeatOccupying/getSeatOccupyingList',
        userinfo: true,
        data: {
          s_id: _this.s_id,
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
      this.s_id = row.s_id
      this.getSmallList()
    },
    // 导出
    getData (e) {
      let _this = this
      _this.loading = true
      ajax.get({
        url: '/Api/SeatOccupying/exportSeatOccupyingList',
        userinfo: true,
        exportFile: true,
        responseType: 'blob',
        params: {
          s_id: _this.s_id
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
    margin-top: 20px;
  }
</style>

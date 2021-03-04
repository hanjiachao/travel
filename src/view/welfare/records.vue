<style scoped lang="less">
</style>
<template>
  <div>
    <el-table :data="tableData"
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
    </el-table>
    <paging :pageSize="pageData.pageSize" :total="pageData.total" v-model="page" @on-change="changePage"></paging>
  </div>
</template>

<script>
import ajax from '@/libs/ajax'
import paging from '../../components/data-hidden/paging'

export default {
  name: 'records',
  components: {
    paging
  },
  props: {
    ticket: {
      type: Object,
      default: () => {}
    }
  },
  data () {
    return {
      tableData: [],
      tableLoading: false,
      ticketId: -1,
      page: 1,
      pageData: {
        pageSize: 20,
        total: 0
      },
      showItem: [{
        value: 'staff.name',
        label: '会员姓名'
      }, {
        value: 'write_off_code',
        label: '券码'
      }, {
        value: 'status',
        label: '核销状态'
      }, {
        value: 'write_off_time',
        label: '核销时间'
      }]
    }
  },
  methods: {
    getTableData () {
      this.tableLoading = true
      let url = 'ticket/receive_lists/' + this.ticketId
      ajax.get({
        url: url,
        userinfo: true,
        params: {
          page: this.page
        }
      }).then((res) => {
        this.pageData = {
          pageSize: parseInt(res.result.meta.per_page),
          total: parseInt(res.result.meta.total)
        }
        this.tableData = res.result.list.map(item => {
          if (item.write_off_time) {
            item.write_off_time = new Date(item.write_off_time * 1000).Format('yyyy-MM-dd hh:mm:ss')
          } else {
            item.write_off_time = '-'
          }
          if (item.status === '已核销' || item.status === '部分核销') {
            item.status = '已使用'
          } else if (item.status === '未核销') {
            item.status = '未使用'
          }
          return item
        })
        this.tableLoading = false
      })
    },
    changePage (page) {
      this.page = page
      this.getTableData()
    }
  },
  watch: {
    ticket: {
      handler (ticket) {
        if (ticket.id) {
          this.ticketId = ticket.id
          this.getTableData()
        }
      },
      deep: true,
      immediate: true
    }
  }
}
</script>

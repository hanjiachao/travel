<style scoped lang="less">
  .bill-record{
    /deep/ .ivu-modal-body{
      height: 500px;
      overflow-y: auto;
    }
    /deep/ .ivu-btn-text{
      display: none;
    }
  }
</style>
<template>
    <Modal class="bill-record" :width="750" :mask-closable="false" title="账单明细" v-model="modalShow">
      <div>
        <el-table
          :highlight-current-row="true"
          ref="table"
          :data="recordList"
          class="settle-table"
          style="width: 100%;margin-bottom: 20px;"
          border
          stripe
          v-loading="tableLoading"
          show-header
          row-key="id">
          <el-table-column v-for="(item, index) in showItem"
                           :key="index"
                           align="center"
                           :prop="item.value"
                           :label="item.label"
                           show-overflow-tooltip>
          </el-table-column>
        </el-table>
      </div>
      <paging v-model="page" :pageSize="pageData.pageSize" :total="pageData.total" @on-change="changePage"></paging>
    </Modal>
</template>

<script>
import paging from '../../components/data-hidden/paging'
import ajax from '@/libs/ajax'
export default {
  name: 'bill-records',
  components: {
    paging
  },
  props: {
    currentBill: {
      default: ''
    }
  },
  data () {
    return {
      recordList: [],
      page: 1,
      pageData: {
        pageSize: 20,
        total: 0
      },
      modalShow: false,
      tableLoading: true,
      showItem: [{
        value: 'ticket.ticket_name',
        label: '券名'
      }, {
        value: 'write_off_code',
        label: '券码'
      }, {
        value: 'staff.name',
        label: '会员姓名'
      }, {
        value: 'write_off_time',
        label: '使用时间'
      }]
    }
  },
  methods: {
    getList () {
      this.tableLoading = true
      ajax.get({
        url: 'ticket/bill_records/' + this.currentBill,
        userinfo: true,
        params: {
          page: this.page
        }
      }).then((res) => {
        this.recordList = res.result.list.map(item => {
          if (item.write_off_time) {
            item.write_off_time = new Date(item.write_off_time * 1000).Format('yyyy-MM-dd hh:mm:ss')
          }
          return item
        })
        this.pageData = {
          pageSize: parseInt(res.result.meta.per_page),
          total: parseInt(res.result.meta.total)
        }
        this.tableLoading = false
      })
    },
    changePage (page) {
      this.page = page
      this.getList()
    }
  },
  watch: {
    currentBill: {
      handler (value) {
        if (value || value === 0) {
          this.page = 1
          this.getList()
        }
      },
      deep: true
      // immediate: true
    }
  }
}
</script>

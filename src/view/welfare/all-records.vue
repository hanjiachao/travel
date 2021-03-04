<style scoped lang="less">
  .all-records{
    padding: 15px;
    box-sizing: border-box;
    /deep/ .el-loading-mask{
      z-index: 500;
    }
  }
</style>
<template>
    <div class="all-records">
      <div>
        <div v-show="searchShow" style="padding-bottom: 10px;">
          <Row :gutter="20">
            <Col v-for="(item, index) in 4" :key="index" style="padding-bottom: 10px;" :xs="12" :sm="8" :md="8" :lg="6">
              <Select v-if="item === 1" style="width: 100%" size="large" v-model="currentStatus">
                <Option value="全部">
                  全部
                </Option>
                <Option value="已使用">
                  已使用
                </Option>
                <Option value="未使用">
                  未使用
                </Option>
                <Option value="已过期">
                  已过期
                </Option>
              </Select>
              <Input v-else-if="item === 2" style="width: 100%" size="large" v-model="writeOffCode" placeholder="核销码"/>
              <span v-else-if="item === 3">
                按:
                <Select style="width: calc(100% - 21px)" size="large" v-model="dateType">
                <Option value="领取时间">
                  领取时间
                </Option>
                <Option value="使用时间">
                  使用时间
                </Option>
              </Select>
              </span>
              <span v-else-if="item === 4">
                <DatePicker style="width: 100%" size="large" format="yyyy/MM/dd" @on-change="changeDate" v-model="reciveDate" type="daterange" placeholder="选择时间段"></DatePicker>
              </span>
            </Col>
          </Row>
          <div class="fr">
            <Button type="primary" @click="search">查询</Button>
          </div>
          <div class="clear"></div>
        </div>
        <div>
          <div class="fr">
            <Button type="primary" @click="getList">刷新</Button>
          </div>
          <div class="fr">
            <Button :type="searchShow ? 'primary' : 'default'" style="margin-right: 10px;" @click="searchShow = !searchShow">
              <Icon type="ios-search" />
            </Button>
          </div>
          <div class="clear"></div>
        </div>
        <div class="clear"></div>
      </div>
      <div style="padding-top: 10px;">
        <el-table
          :highlight-current-row="true"
          ref="table"
          :data="recordList"
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
      <div>
        <paging v-model="page" :pageSize="pageData.pageSize" :total="pageData.total" @on-change="changePage"></paging>
      </div>
    </div>
</template>

<script>
import paging from '../../components/data-hidden/paging'
import ajax from '@/libs/ajax'

export default {
  name: 'all-records',
  components: {
    paging
  },
  data () {
    return {
      recordList: [],
      currentStatus: '全部',
      searchShow: false,
      showItem: [{
        label: '券名',
        value: 'ticket.ticket_name'
      }, {
        label: '券码',
        value: 'write_off_code'
      }, {
        label: '会员姓名',
        value: 'staff.name'
      }, {
        label: '领取时间',
        value: 'created_at'
      }, {
        label: '状态',
        value: 'status'
      }, {
        label: '使用时间',
        value: 'write_off_time'
      }],
      page: 1,
      pageData: {
        pageSize: 20,
        total: 0
      },
      reciveDate: '',
      // 搜索条件
      writeOffCode: '',
      dateType: '领取时间',
      startTime: '',
      endTime: '',
      searchData: {
        writeOffCode: '',
        dateType: '领取时间',
        startTime: '',
        endTime: '',
        status: '全部'
      },
      tableLoading: true
    }
  },
  methods: {
    // 获取记录列表
    getList () {
      this.tableLoading = true
      let data = {
        page: this.page,
        status: this.searchData.status,
        date_type: this.searchData.dateType,
        write_off_code: this.searchData.writeOffCode
      }
      if (this.searchData.startTime && this.searchData.endTime) {
        data.start_date = this.searchData.startTime
        data.end_date = this.searchData.endTime
      }
      ajax.get({
        url: 'ticket/all_receive_lists',
        userinfo: true,
        params: data
      }).then((res) => {
        this.recordList = res.result.list.map(item => {
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
    },
    changeDate (date) {
      this.startTime = date[0]
      this.endTime = date[1]
    },
    // 刷新界面
    refresh () {
      this.getList()
    },
    // 查询
    search () {
      this.page = 1
      this.searchData = {
        writeOffCode: this.writeOffCode,
        dateType: this.dateType,
        startTime: this.startTime,
        endTime: this.endTime,
        status: this.currentStatus
      }
      this.getList()
    }
  },
  created () {
    this.getList()
  }
}
</script>

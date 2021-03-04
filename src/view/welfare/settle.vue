<style scoped lang="less">
  .settle{
    padding: 15px;
    /deep/ .el-loading-mask{
      z-index: 500;
    }
    .settle-table{
      /deep/ .ivu-btn{
        padding: 5px 10px 6px;
      }
    }
  }
</style>
<template>
    <div class="settle">
      <div v-show="searchShow" style="padding-bottom: 10px;">
        <Row :gutter="20">
          <Col v-for="(item, index) in 5" :key="index" style="padding-bottom: 10px;" :xs="12" :sm="8" :md="8" :lg="4">
            <Select v-if="item === 1" size="large" style="width: 100%" v-model="currentStatus">
              <Option value="全部">
                全部
              </Option>
              <Option value="已结算">
                已结算
              </Option>
              <Option value="未结算">
                未结算
              </Option>
              <Option value="已撤销">
                已撤销
              </Option>
              <Option value="未生成">
                未生成
              </Option>
              <Option value="生成中">
                生成中
              </Option>
              <Option value="生成失败">
                生成失败
              </Option>
            </Select>
            <Input v-else-if="item === 2" size="large" style="width: 100%" placeholder="账单号" v-model="billNo" />
            <form-select v-else-if="item === 3" wordType="核销方式" :config="partnerConfig" style="width: 100%" v-model="partner" :placeholder="'合作商'"></form-select>
            <DatePicker v-else-if="item === 4" size="large" format="yyyy/MM/dd" @on-change="changeDate" v-model="generateDate" style="width: 100%" type="daterange" placeholder="生成时间"></DatePicker>
            <Button v-else-if="item === 5" type="primary" @click="search">查询</Button>
          </Col>
        </Row>
        <div class="clear"></div>
      </div>
      <div>
        <div class="fl">
          <Button type="default" style="margin-right: 10px;" v-if="means.hasPermission('create_bill')" @click="add">生成账单</Button>
        </div>
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
      <div style="padding-top: 10px;">
        <el-table
          :highlight-current-row="true"
          ref="table"
          :data="settleList"
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
          <!---->
          <el-table-column
            :width="means.operationWidth(powerList)"
            v-if="means.operationAllow(powerList)"
            fixed="right"
            align="center">
            <template slot="header" slot-scope="scope">
              操作
            </template>
            <template slot-scope="scope">
              <el-tooltip v-if="means.hasPermission('bill_records')" content="查看账单明细" placement="top">
                <Button @click="detailTabel(scope.row)">
                  <Icon type="md-eye" />
                </Button>
              </el-tooltip>
              <Poptip
                transfer
                confirm
                title="确认要导出吗?"
                @on-ok="exportBill(scope.row)"
                v-if="means.hasPermission('export_bill')"
                ok-text="确定"
                cancel-text="取消">
                <el-tooltip content="导出" placement="top">
                  <Button :loading="downLoading && downLoadingId === scope.row.id" :disabled="['未结算', '已结算', '已撤销'].indexOf(scope.row.status) < 0" style="margin: 0 3px">
                    <Icon v-if="!(downLoading && downLoadingId === scope.row.id)" type="md-log-out" />
                  </Button>
                </el-tooltip>
              </Poptip>
              <Poptip
                transfer
                confirm
                title="确认要结算吗?"
                @on-ok="settleConfirm(scope.row)"
                v-if="means.hasPermission('settle_bill')"
                ok-text="确定"
                cancel-text="取消">
                <el-tooltip content="结算" placement="top">
                  <Button :disabled="scope.row.status !== '未结算'" style="margin: 0 3px">
                    <Icon type="md-paper-plane"></Icon>
                  </Button>
                </el-tooltip>
              </Poptip>
              <Poptip
                transfer
                confirm
                v-if="means.hasPermission('revoke_bill')"
                title="确认要撤销吗?"
                @on-ok="withdraw(scope.row)"
                ok-text="确定"
                cancel-text="取消">
                <el-tooltip content="撤销" placement="top">
                  <Button :disabled="scope.row.status !== '未结算'" style="margin: 0 3px">
                    <Icon type="ios-redo"></Icon>
                  </Button>
                </el-tooltip>
              </Poptip>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div>
        <paging v-model="page" :pageSize="pageData.pageSize" :total="pageData.total" @on-change="changePage"></paging>
      </div>
      <form-modal :config="{}" v-model="addForms" @save-success="getList"></form-modal>
      <bill-records ref="billRecords" :currentBill="currentBill"></bill-records>
    </div>
</template>

<script>
import paging from '../../components/data-hidden/paging'
import formSelect from '../../components/data-hidden/form-select'
import formModal from '../../components/data-table/form-modal'
import billRecords from './bill-records'
import means from '@/libs/means'
import ajax from '@/libs/ajax'

export default {
  name: 'settle',
  components: {
    paging,
    'form-select': formSelect,
    'form-modal': formModal,
    'bill-records': billRecords
  },
  data () {
    return {
      settleList: [],
      means: means,
      powerList: ['revoke_bill', 'bill_records', 'export_bill', 'settle_bill'],
      showItem: [{
        label: '账单号',
        value: 'no'
      }, {
        label: '合作商',
        value: 'cooperator.company_name'
      }, {
        label: '开始时间',
        value: 'start_date'
      }, {
        label: '结束时间',
        value: 'end_date'
      }, {
        label: '核销券数量',
        value: 'ticket_num'
      }, {
        label: '状态',
        value: 'status'
      }, {
        label: '生成时间',
        value: 'created_at'
      }],
      tableLoading: true,
      page: 1,
      pageData: {
        pageSize: 20,
        total: 0
      },
      downLoadingId: -1,
      downLoading: false,
      partnerConfig: {
        url: 'cooperators/all',
        valuePosition: ['result'],
        valueKey: 'id',
        labelKey: 'company_name',
        clearable: true
      },
      generateDate: '',
      partner: '',
      startTime: '',
      endTime: '',
      billNo: '',
      currentStatus: '全部',
      searchData: {
        status: '全部',
        cooperator_id: '',
        start_date: '',
        end_date: '',
        no: ''
      },
      searchShow: false,
      addForms: {},
      defaultForms: {
        title: '生成账单',
        confirm: true,
        url: 'ticket/create_bill',
        defaultData: {
        },
        formItems: [
          {
            type: 'select',
            name: 'cooperator_id',
            label: '合作商',
            config: {
              url: 'cooperators/all',
              valuePosition: ['result'],
              valueKey: 'id',
              labelKey: 'company_name'
            },
            className: 'form-static',
            options: '合作商',
            rules: ['required']
          },
          {
            type: 'daterange',
            name: ['start_date', 'end_date'],
            label: '周期',
            rules: ['required']
          }
        ]
      },
      currentBill: ''
    }
  },
  methods: {
    add () {
      this.addForms = JSON.parse(JSON.stringify(this.defaultForms))
    },
    changePage (page) {
      this.page = page
      this.getList()
    },
    getList () {
      this.tableLoading = true
      let data = {
        page: this.page,
        status: this.searchData.status,
        cooperator_id: this.searchData.cooperator_id,
        no: this.searchData.no
      }
      if (this.searchData.start_date && this.searchData.end_date) {
        data.start_date = this.searchData.start_date
        data.end_date = this.searchData.end_date
      }
      ajax.get({
        url: 'ticket/bills',
        userinfo: true,
        params: data
      }).then((res) => {
        this.settleList = res.result.list
        this.pageData = {
          pageSize: parseInt(res.result.meta.per_page),
          total: parseInt(res.result.meta.total)
        }
        this.tableLoading = false
      })
    },
    changeDate (date) {
      this.startTime = date[0]
      this.endTime = date[1]
    },
    // 查询
    search () {
      this.page = 1
      this.searchData = {
        status: this.currentStatus,
        cooperator_id: this.partner,
        start_date: this.startTime,
        end_date: this.endTime,
        no: this.billNo
      }
      this.getList()
    },
    // 结算
    settleConfirm (row) {
      ajax.patch({
        url: 'ticket/settle_bill/' + row.id,
        userinfo: true
      }).then((res) => {
        this.$Notice.success({
          title: '系统提示',
          duration: 3,
          desc: '结算成功'
        })
        this.getList()
      })
    },
    // 撤销
    withdraw (row) {
      ajax.patch({
        url: 'ticket/revoke_bill/' + row.id,
        userinfo: true
      }).then((res) => {
        this.$Notice.success({
          title: '系统提示',
          duration: 3,
          desc: '撤销成功'
        })
        this.getList()
      })
    },
    // 账单导出
    exportBill (row) {
      this.downLoadingId = row.id
      this.downLoading = true
      ajax.get({
        url: 'ticket/export_bill/' + row.id,
        userinfo: true,
        exportFile: true,
        responseType: 'blob',
        finishCallback: () => {
          this.downLoading = false
        }
      })
    },
    // 查看核销详情
    detailTabel (row) {
      this.currentBill = row.id
      this.$refs.billRecords.modalShow = true
    }
  },
  created () {
    this.getList()
  }
}
</script>

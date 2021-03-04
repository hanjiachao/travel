<template>
  <div class="conts">
    <div class="tit">订单审核</div>
    <div>
      <div class="top">
        <search-filter @screening="screening" :searchs="searchs"></search-filter>
      </div>
      <div class="tabConts">
        <el-table  :highlight-current-row="true"
                   :data="tablist"
                   class="tab-list"
                   style="width: 100%;"
                   stripe
                   v-loading="tableLoading">
          <el-table-column v-for="(item , index) in itemList"
                           :key="index"
                           :label="item.label"
                           align="center"
                           show-overflow-tooltip
                           :prop="item.value"></el-table-column>
          <el-table-column label="结款状态"
                           align="center"
                           prop="check_status">
            <template slot-scope="scope">
              <span :style="{color: scope.row.check_status == '已审核' ? '' : '#108EE9'}">{{scope.row.check_status}}</span>
            </template>
          </el-table-column>
          <el-table-column label="操作"
                           align="center"
                           v-if="means.operationAllow(powerList)"
                           :width="means.operationWidth(powerList)"
          >
            <template slot-scope="scope">
              <Poptip title="确定要通过审核吗？"
                      confirm
                      ok-text="确定"
                      cancel-text="取消"
                      transfer
                      @on-ok="sendDel(scope.row)"
              >
                <el-tooltip content="审核" placement="bottom" style="margin: 0 3px" v-if="means.hasPermission(powerList[0])">
                  <Button>
                    <Icon type="ios-brush"></Icon>
                  </Button>
                </el-tooltip>
              </Poptip>
            </template>
          </el-table-column>
        </el-table>
        <paging :total="pageData.total" :pageSize="pageData.pageSize" v-model="page" @on-change="toPage"></paging>
      </div>
    </div>
  </div>
</template>

<script>
import ajax from '@/libs/ajax'
import means from '@/libs/means'
import searchFilter from '../searchView/search-filter'
import paging from '@/components/data-hidden/paging'
export default {
  name: 'order',
  components: {
    'search-filter': searchFilter,
    paging
  },
  data () {
    return {
      means: means,
      page: 1,
      powerList: ['AuditOrder'],
      pageData: {
        total: 0,
        pageSize: 10
      },
      tableLoading: false,
      itemList: [
        {
          label: '团号',
          value: 'or_team_number'
        }, {
          label: '组团社',
          value: 'tr_name'
        }, {
          label: '计调',
          value: 'or_adname'
        }, {
          label: '线路',
          value: 'l_name'
        }, {
          label: '出发日期',
          value: 'or_departure_date'
        }, {
          label: '回程日期',
          value: 'or_return_date'
        }, {
          label: '主客人',
          value: 'guest_name'
        }, {
          label: '总金额',
          value: 'or_total_price'
        }
      ],
      tablist: [],
      // 筛选
      searchs: [
        {
          label: '团号',
          value: 'skey',
          type: 'text'
        },
        {
          label: '审核状态',
          value: 'ld_night',
          type: 'select',
          options: [{
            value: '已审核',
            label: '已审核'
          }, {
            value: '未审核',
            label: '未审核'
          }],
        },
        {
          label: '出发日期',
          value: 'departure_date',
          type: 'date'
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
        },
        {
          label: '组团社',
          value: 'tr_id',
          type: 'select',
          options: '组团社',
          config: {
            url: '/Api/Travel/getTravelAgencyList',
            method: 'post',
            valuePosition: [],
            valueKey: 'tr_id',
            labelKey: 'name'
          },
          fold: true
        }
      ],
      searchShow: true,
      queryData: {}
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
        url: '/Api/Finance/getOrderList',
        userinfo: true,
        data: data
      }).then((res) => {
        _this.pageData = {
          pageSize: 10,
          total: Number(res.result.count)
        }
        _this.tablist = res.result.list
        _this.tableLoading = false
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
    sendDel (row) {
      let _this = this
      if(row.check_status === '已审核'){
        this.$Notice.error({
          title: '系统提示',
          duration: 3,
          desc: '这项定单已经审核过,请勿重新审核！'
        })
        return false
      }
      ajax.post({
        url: '/Api/Finance/auditOrder',
        userinfo: true,
        data: {
          or_id: row.or_id
        }
      }).then(res => {
        _this.getList()
        this.$Notice.success({
          title: '系统提示',
          duration: 3,
          desc: '审核成功'
        })
      })
    }
  },
  created () {
    this.getList()
  }
}
</script>

<style scoped>
  .conts {
    background: #fff;
    margin: 20px;
    border-radius: 10px;
    overflow: hidden;
  }

  .conts .tit {
    font-weight: bold;
    font-size: 20px;
    padding: 20px;
    border-bottom: 1px solid #ccc;
  }
  .tabConts{
    padding: 0 40px 40px;
  }
</style>

<style scoped lang="less">
  .btm {
    margin: 0 20px;
  }

  .total {
    margin: 20px 0;

    .fr {
      height: 50px;
      line-height: 50px;
      border-top: 1px solid #ccc;
      border-bottom: 1px solid #ccc;
      padding: 0 40px;

      span:last-child {
        margin-left: 40px;
      }
    }
  }
</style>
<style scoped>

</style>
<template>
  <div class="work-bench">
    <div class="conts" style="margin: 20px;">
      <search-filter @screening="screening" :searchs="searchs"></search-filter>
    </div>
    <div class="btm">
      <el-table :highlight-current-row="true"
                :data="tablist"
                class="tab-list"
                style="width: 100%;margin-bottom: 50px;"
                stripe
                row-key="id"
                v-loading="tableLoading">
        <el-table-column
          v-for="(item , index) in itemList"
          :key="index"
          :label="item.label"
          align="center"
          :prop="item.value"
          show-overflow-tooltip
        ></el-table-column>
        <el-table-column width="200px"
                         v-if="means.operationAllow(powerList)"
                         fixed="right"
                         align="center">
          <template slot="header" slot-scope="scope">
            操作
          </template>
          <template slot-scope="scope">
            <el-tooltip content="查看详情" placement="bottom" style="margin: 0 3px">
              <Button @click="toPath('/operator/index?or_id=' + scope.row.or_id + '&detail=详情')">
                <Icon type="md-eye"></Icon>
              </Button>
            </el-tooltip>
            <el-tooltip content="编辑" placement="bottom" style="margin: 0 3px">
              <Button @click="toPath('/operator/index?or_id=' + scope.row.or_id)">
                <Icon type="ios-brush"></Icon>
              </Button>
            </el-tooltip>
            <Poptip title="确定要删除吗？"
                    confirm
                    ok-text="确定"
                    cancel-text="取消"
                    transfer
                    @on-ok="sendDel(scope.row)"
                    v-if="means.hasPermission('DelOrder')"
            >
              <el-tooltip content="删除订单" placement="bottom" style="margin: 0 3px">
                <Button>
                  <Icon type="md-trash"></Icon>
                </Button>
              </el-tooltip>
            </Poptip>
          </template>
        </el-table-column>
      </el-table>
      <div class="total">
        <div class="fr">
          <span>本页合计:{{adult_number}}大{{children_number}}小</span>
          <span>本月合计:{{count_adult_number}}大{{count_children_number}}小</span>
        </div>
        <div class="clear"></div>
      </div>
      <paging :pageSize="pageData.pageSize" :total="pageData.total" @on-change="toPage" v-model="page"></paging>
    </div>
  </div>
</template>

<script>

import searchFilter from '../searchView/search-filter'
import paging from '@/components/data-hidden/paging'
import ajax from '@/libs/ajax'
import means from '@/libs/means'

export default {
  name: 'workbench',
  components: {
    'search-filter': searchFilter,
    paging
  },
  data () {
    return {
      means: means,
      powerList: ['Order', 'SaveOrder', 'DelOrder'],
      page: 1,
      pageData: {
        total: 0,
        pageSize: 20
      },
      tableLoading: false,
      itemList: [
        {
          value: 'or_id',
          label: '序号'
        },
        {
          value: 'or_team_number',
          label: '团号'
        },
        {
          value: 'l_name',
          label: '路线'
        },
        {
          value: 'or_departure_date',
          label: '发团日期'
        },
        {
          value: 'or_return_date',
          label: '回程日期'
        },
        {
          value: 'people_number',
          label: '团人数'
        },
        {
          value: 'or_adname',
          label: '计调'
        },
        {
          value: 'tr_name',
          label: '组团社'
        },
        {
          value: 'guest_name',
          label: '主客人'
        },
        {
          value: 'guest_mobile',
          label: '联系电话'
        }
      ],
      tablist: [],
      count_children_number: '',
      count_adult_number: '',
      adult_number: '',
      children_number: '',
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
          label: '添加时间',
          value: 'add_time',
          type: 'date'
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
    getList () {
      let _this = this
      this.tableLoading = true
      let data = {
        page: this.page - 1,
        limit: 10
      }
      let queryData = this.queryData
      Object.keys(queryData).forEach((key) => {
        if (queryData[key].value instanceof Array) {
          data[key] = JSON.stringify(queryData[key].value)
        } else {
          data[key] = queryData[key].value
        }
      })
      ajax.post({
        url: '/Api/Order/getOrderList',
        userinfo: true,
        data: data
      }).then((res) => {
        _this.pageData = {
          pageSize: 10,
          total: Number(res.result.count)
        }
        _this.tablist = res.result.list
        _this.tableLoading = false
        _this.adult_number = res.result.adult_number
        _this.children_number = res.result.children_number
        _this.count_adult_number = res.result.count_adult_number
        _this.count_children_number = res.result.count_children_number
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
    toPath (path) {
      this.$router.push(path)
    },
    sendDel (row) {
      let _this = this
      ajax.post({
        url: '/Api/Order/delOrder',
        userinfo: true,
        data: {
          or_id: row.or_id
        }
      }).then(res => {
        _this.getList()
        this.$Notice.success({
          title: '系统提示',
          duration: 3,
          desc: '删除成功'
        })
      })
    }
  },
  created () {
    this.getList()
  }
}
</script>

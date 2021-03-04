<template>
  <div class="conts">
    <div class="tit">并团</div>
    <div class="top">
      <search-filter @screening="screening" :searchs="searchs"></search-filter>
      <div class="fr" style="margin-top: 40px;margin-right: 40px;">
        <Button  @click="add" type="primary">并团</Button>
      </div>
      <div class="clear"></div>
    </div>
    <div class="tabConts" style="padding: 40px;">
      <el-table :highlight-current-row="true"
                :data="tablist"
                class="tab-list"
                style="width: 100%;"
                stripe
                @selection-change="selectionChange"
                v-loading="tableLoading">
        <el-table-column type="selection"
                         width="55"></el-table-column>
        <el-table-column v-for="(item , index) in itemList"
                         :key="index"
                         :label="item.label"
                         align="center"
                         :prop="item.value"
                         show-overflow-tooltip></el-table-column>
      </el-table>
      <paging :total="pageData.total" :pageSize="pageData.pageSize" v-model="page" @on-change="toPage"></paging>
    </div>
  </div>
</template>

<script>

  import ajax from '@/libs/ajax'
  import means from '@/libs/means'
  import searchFilter from '../searchView/search-filter'
  import paging from '@/components/data-hidden/paging'

export default {
  name: 'addGroup',
  components: {
    'search-filter': searchFilter,
    paging
  },
  data () {
    return {
      means: means,
      page: 1,
      pageData: {
        total: 0,
        pageSize: 10
      },
      tableLoading: false,
      itemList: [
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
          label: '出发日期'
        },
        {
          value: 'or_return_date',
          label: '回程日期'
        },
        {
          value: 'guest_name',
          label: '主客人'
        },
        {
          value: 'people_number',
          label: '总人数'
        },
        {
          value: 'or_adname',
          label: '计调'
        }
      ],
      tablist: [],
      or_id: [],
      // 筛选
      searchs: [
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
        data[key] = queryData[key].value
      })
      ajax.post({
        url: '/Api/MergeOrder/getOrderList',
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
    selectionChange (row) {
      var list = []
      for (var i in row) {
        list.push(row[i].or_id)
      }
      this.or_id = list
    },
    add () {
      let _this = this
      ajax.post({
        url: '/Api/MergeOrder/createMergeOrder',
        userinfo: true,
        data: {
          or_id: JSON.stringify(_this.or_id)
        }
      }).then(res => {
        _this.getList()
        this.$Notice.success({
          title: '系统提示',
          duration: 3,
          desc: '并团成功'
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
  .conts{
    margin: 20px;
    background: #fff;
    border-radius: 10px;
    overflow: hidden;
  }
  .tit{
    color: #000;
    font-weight: bold;
    font-size: 20px;
    padding: 20px;
    border-bottom: 1px solid #ccc;
  }
  .tabConts .el-table__header{
    background: #ccc;
  }
</style>

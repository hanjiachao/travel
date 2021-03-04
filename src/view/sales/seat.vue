<template>
  <div class="conts">
    <div class="tit">确认占座</div>
    <div class="tab">
      <el-table
        :highlight-current-row="true"
        :data="tablist"
        class="tab-list"
        style="width: 100%;margin-bottom: 50px;"
        stripe
        row-key="id"
        v-loading="tableLoading"
      >
        <el-table-column
          v-for="(item , index) in itemList"
          :key="index"
          :label="item.label"
          align="center"
          :prop="item.value"
          show-overflow-tooltip
        ></el-table-column>
        <el-table-column label="操作"
                         align="center"
                         width="200px">
          <template slot-scope="scope">
            <el-tooltip content="确认提交" placement="bottom" style="margin: 0 3px" v-if="means.hasPermission('ConfirmSeatOccupying')">
              <label style="cursor: pointer;color: #108EE9;" @click="edit(scope.row)">确认提交</label>
            </el-tooltip>
          </template>>
        </el-table-column>
      </el-table>
      <paging :total="pageData.total" :pageSize="pageData.pageSize" v-model="page" @on-change="toPage"></paging>
    </div>
  </div>
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
      means: means,
      page: 1,
      pageData: {
        total: 0,
        pageSize: 10
      },
      tablist: [],
      itemList: [
        {
          value: 'so_number',
          label: '数量'
        },
        {
          value: 'so_add_time',
          label: '保存时间'
        }
      ],
      tableLoading: false
    }
  },
  methods: {
    getList () {
      this.tableLoading = true
      let _this = this
      ajax.post({
        url: '/Api/Seat/seatOccupyingList',
        userinfo: true,
        data: {
          limit: 10,
          page: this.page - 1
        }
      }).then(res => {
        this.tableLoading = false
        _this.pageData = {
          pageSize: 10,
          total: Number(res.result.count)
        }
        _this.tablist = res.result.list
      })
    },
    toPage (page) {
      this.page = page
      this.getList()
    },
    edit (row) {
      let _this = this
      ajax.post({
        url: '/Api/Seat/confirmSeatOccupying',
        userinfo: true,
        data: {
          so_id: row.so_id
        }
      }).then(res => {
        _this.getList()
        this.$Notice.success({
          title: '系统提示',
          duration: 3,
          desc: '占座成功'
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
    background: #ffffff;
    margin: 20px;
    padding: 20px;
    overflow: hidden;
  }
  .conts .tit{
    color: #000;
    font-weight: bold;
    font-size: 20px;
    padding: 20px 0;
    border-bottom: 1px solid #ccc;
  }
  .conts .tab{
    margin-top: 60px;
  }
</style>

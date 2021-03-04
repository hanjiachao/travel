<template>
  <div class="conts">
    <div class="top" v-if="means.hasPermission('AddSeat')">
      <Button type="primary" @click="add1">添加飞机座位</Button>
      <Button style="margin-left: 20px;" type="primary" @click="add2">添加大巴座位</Button>
    </div>
    <div class="tab">
      <el-table
        :highlight-current-row="true"
        :data="tablist"
        class="tab-list"
        style="width: 100%;margin-bottom: 50px;"
        stripe
        row-key="no"
        v-loading="tableLoading"
      >
        <el-table-column
          v-for="(item , index) in tabHeadList"
          :key="index"
          :label="item.label"
          align="center"
          :prop="item.value"
          show-overflow-tooltip
        ></el-table-column>
        <el-table-column label="操作"
                         align="center"
                         width="200px"
                         v-if="means.operationAllow(powerList)"
        >
          <template slot-scope="scope">
            <Poptip title="确定要删除吗？"
                    confirm
                    ok-text="确定"
                    cancel-text="取消"
                    transfer
                    @on-ok="sendDel(scope.row)"
            >
              <el-tooltip content="删除" placement="bottom" style="margin: 0 3px">
                <Button>
                  <Icon type="md-trash"></Icon>
                </Button>
              </el-tooltip>
            </Poptip>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <paging :total="pageData.total" :pageSize="pageData.pageSize" v-model="page" @on-change="toPage"></paging>
    <form-modal :config="{}" v-model="forms" @save-success="getList"></form-modal>
  </div>
</template>

<script>

import ajax from '@/libs/ajax'
import means from '@/libs/means'
import paging from '@/components/data-hidden/paging'
import formModal from '@/components/data-table/form-modal.vue'

export default {
  components: {
    'form-modal': formModal,
    paging
  },
  name: 'seta',
  data () {
    return {
      means: means,
      page: 1,
      pageData: {
        total: 0,
        pageSize: 10
      },
      powerList: ['DelSeat'],
      tablist: [],
      tabHeadList: [
        {
          value: 's_type',
          label: '交通'
        },
        {
          value: 's_count',
          label: '座位'
        },
        {
          value: 's_number',
          label: '剩余座位'
        },
        {
          value: 's_leave_date',
          label: '出发日期'
        },
        {
          value: 's_duration',
          label: '占座时长/时'
        },
        {
          value: 's_add_time',
          label: '添加日期'
        }
      ],
      tableLoading: false,
      forms: {},
      planeItems: [{
        type: 'select',
        name: 'ai_id',
        label: '航空公司',
        options: '航空公司',
        config: {
          url: '/Api/Airline/getAirlineList',
          method: 'post',
          valuePosition: [],
          valueKey: 'ai_id',
          labelKey: 'name'
        },
        rules: ['required']
      }, {
        type: 'text',
        name: 'number',
        label: '座位数量',
        rules: ['required']
      }, {
        type: 'date',
        name: 'leave_date',
        label: '出发日期',
        rules: ['required']
      }, {
        type: 'text',
        name: 'duration',
        label: '占座时长',
        rules: ['required']
      }],
      defaultForms: {
        title: '添加',
        confirm: true,
        url: '/Api/Seat/addSeat',
        defaultData: {},
        formItems: [{
          type: 'text',
          name: 'number',
          label: '座位数量',
          rules: ['required']
        }, {
          type: 'date',
          name: 'leave_date',
          label: '出发日期',
          rules: ['required']
        }, {
          type: 'text',
          name: 'duration',
          label: '占座时间',
          rules: ['required']
        }]
      }
    }
  },
  methods: {
    getList () {
      this.tableLoading = true
        let _this = this
        ajax.post({
          url: '/Api/Seat/getSeatList',
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
    add1 () {
      let form = { ...this.defaultForms }
      form.formItems = this.planeItems
      this.forms = form
    },
    add2 () {
      this.forms = {}
      this.forms = { ...this.defaultForms }
    },
    sendDel (row) {
      let _this = this
      ajax.post({
        url: '/Api/Seat/delSeat',
        userinfo: true,
        data: {
          s_id: row.s_id
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

<style scoped>
  .conts {
    background: #ffffff;
    margin: 20px;
    border-radius: 10px;
    padding: 20px;
    overflow: hidden;
  }
  .conts .tab{
    margin-top: 20px;
  }
</style>

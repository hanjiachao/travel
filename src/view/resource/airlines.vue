<template>
  <div class="conts">
    <div class="top">
      <Button type="primary" v-if="means.hasPermission('AddAirline')" @click="add">添加航空公司</Button>
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
                         v-if="means.hasPermission('DelAirline')"
        >
          <template slot-scope="scope">
            <Poptip title="确定要删除吗？"
                    confirm
                    ok-text="确定"
                    @on-ok="delPass(scope.row)"
                    cancel-text="取消"
                    transfer
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
  name: 'airlines',
  data () {
    return {
      means: means,
      page: 1,
      pageData: {
        total: 0,
        pageSize: 10
      },
      tablist: [],
      tabHeadList: [
        {
          value: 'name',
          label: '航空公司'
        }
      ],
      tableLoading: false,
      forms: {},
      defaultForms: {
        title: '添加',
        confirm: true,
        url: '/Api/Airline/addAirline',
        defaultData: {},
        formItems: [{
          type: 'text',
          name: 'name',
          label: '航空公司',
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
        url: '/Api/Airline/getAirlineList',
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
    add () {
      this.forms = {}
      this.forms = { ...this.defaultForms }
    },
    delPass (row) {
      let _this = this
      let url = '/Api/Airline/delAirline'
      ajax.post({
        url: url,
        userinfo: true,
        data: {
          ai_id: row.ai_id
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
  .conts .tab {
    margin-top: 20px;
  }
</style>

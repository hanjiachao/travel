<template>
  <Split v-model="split">
    <div class="conts" slot="left">
      <dataPanel :simple="true" @row-change="rowChange" ref="role"></dataPanel>
    </div>
    <div class="conts" slot="right">
      <div class="top" style="padding: 20px 0" v-if="means.hasPermission('AddLineTime')">
        <div style="float: left;">
          <Button type="primary" @click="add">添加</Button>
        </div>
        <div style="clear: both;"></div>
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
                           v-if="means.operationAllow(powerList)"
                           :width="means.operationWidth(powerList)"
          >
            <template slot-scope="scope">
              <!--<el-tooltip content="封团" placement="bottom" style="margin: 0 3px" v-if="means.hasPermission(powerList[0])">
                <Button @click="edit(scope.row)">
                  <Icon type="ios-brush"></Icon>
                </Button>
              </el-tooltip>-->
              <Poptip title="确定要封团吗？"
                      confirm
                      ok-text="确定"
                      cancel-text="取消"
                      transfer
                      @on-ok="edit(scope.row)"
                      v-if="means.hasPermission(powerList[0])"
              >
                <el-tooltip content="封团" placement="bottom" style="margin: 0 3px">
                  <Button>
                    <Icon type="ios-brush"></Icon>
                  </Button>
                </el-tooltip>
              </Poptip>
              <Poptip title="确定要删除吗？"
                      confirm
                      ok-text="确定"
                      cancel-text="取消"
                      transfer
                      @on-ok="sendDel(scope.row)"
                      v-if="means.hasPermission(powerList[1])"
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
      <form-modal :config="{}" v-model="forms" @save-success="getList"></form-modal>
    </div>
  </Split>
</template>

<script>

  import ajax from '@/libs/ajax'
  import means from '@/libs/means'
  import dataPanel from './data-panel.vue'
  import formModal from '@/components/data-table/form-modal.vue'

export default {
  components: {
    'form-modal': formModal,
    dataPanel
  },
  name: 'timer',
  data () {
    return {
      split: 0.5,
      means: means,
      page: 1,
      pageData: {
        total: 0,
        pageSize: 10
      },
      powerList: ['LineEndTime', 'delLineTime'],
      tableLoading: false,
      tablist: [],
      tabHeadList: [
        {
          value: 'l_name',
          label: '路线名'
        },
        {
          value: 'lt_leave_time',
          label: '开团日期'
        },
        {
          value: 'lt_total_number',
          label: '人数'
        },
        {
          value: 'lt_surplus_number',
          label: '剩余人数'
        },
        {
          value: 'lt_add_time',
          label: '添加时间'
        },
        {
          value: 'lt_end_time',
          label: '封团时间'
        }
      ],
      l_id: '',
      forms: {},
      defaultForms: {
        title: '编辑',
        confirm: true,
        url: '/Api/Line/addLineTime',
        defaultData: {},
        formItems: [{
          type: 'date',
          name: 'lt_leave_time',
          label: '开团时间',
          rules: ['required']
        }, {
          type: 'text',
          name: 'lt_total_number',
          label: '容纳人数',
          rules: ['required']
        }]
      }
    }
  },
  methods: {
    rowChange (row) {
      this.l_id = row.l_id
      this.getList()
    },
    getList () {
      this.tableLoading = true
      let _this = this
      ajax.post({
        url: '/Api/Line/getLineTimeList',
        userinfo: true,
        data: {
          l_id: _this.l_id,
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
      let forms = { ...this.defaultForms }
      forms.title = '添加开团时间'
      forms.defaultData = {
        l_id: this.l_id
      }
      this.forms = forms
    },
    edit (row) {
      let _this = this
      ajax.post({
        url: '/Api/Line/lineEndTime',
        userinfo: true,
        data: {
          lt_id: row.lt_id
        }
      }).then(res => {
        _this.getList()
        this.$Notice.success({
          title: '系统提示',
          duration: 3,
          desc: '封团成功'
        })
      })
    },
    sendDel (row) {
      let _this = this
      ajax.post({
        url: '/Api/Line/delLineTime',
        userinfo: true,
        data: {
          lt_id: row.lt_id
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

<template>
  <div class="conts">
    <div class="top">
      <Button type="primary" v-if="means.hasPermission('AddTravel')" @click="add">添加旅行社</Button>
    </div>
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
                         v-if="means.operationAllow(powerList)"
                         :width="means.operationWidth(powerList)"
                         >
          <template slot-scope="scope">
            <el-tooltip content="编辑" placement="bottom" style="margin: 0 3px" v-if="means.hasPermission(powerList[0])">
              <Button @click="edit(scope.row)">
                <Icon type="ios-brush"></Icon>
              </Button>
            </el-tooltip>
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
  name: 'index',
  components: {
    'form-modal': formModal,
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
          value: 'name',
          label: '组团社'
        },
        {
          value: 'people',
          label: '负责人'
        },
        {
          value: 'mobile',
          label: '联系方式'
        },
        {
          value: 'address',
          label: '地址'
        },{
          value: 'deductions_type',
          label: '扣款方式'
        }
      ],
      tableLoading: false,
      powerList: ['SaveTravel', 'DelTravel'],
      forms: {},
      defaultForms: {
        title: '添加',
        confirm: true,
        url: '/Api/Travel/addTravel',
        defaultData: {
        },
        formItems: [{
          type: 'text',
          name: 'name',
          label: '组团社',
          rules: ['required']
        }, {
          type: 'text',
          name: 'people',
          label: '负责人',
          rules: ['required']
        }, {
          type: 'text',
          name: 'mobile',
          label: '联系方式',
          rules: ['required']
        }, {
          type: 'text',
          name: 'address',
          label: '地址',
          rules: ['required']
        }, {
          type: 'radio',
          name: 'deductions_type',
          label: '扣款方式',
          options: [{
            label: '1%扣款',
            value: '1%扣款'
          }, {
            label: '2%扣款',
            value: '2%扣款'
          }, {
            label: '每人20元扣款',
            value: '每人20元扣款'
          }, {
            label: '每人30元扣款',
            value: '每人30元扣款;'
          }],
          rules: ['required']
        }]
      }
    }
  },
  methods: {
    add () {
      this.forms = { ...this.defaultForms }
    },
    getList () {
      this.tableLoading = true
      let _this = this
      ajax.post({
        url: '/Api/Travel/getTravelAgencyList',
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
      let forms = { ...this.defaultForms }
      forms.url = '/Api/Travel/saveTravel'
      forms.method = 'post'
      forms.defaultData = row
      forms.title = '编辑'
      let editForms = []
      for (let i in forms.formItems) {
        if (forms.formItems[i].editDisable) {
          continue
        }
        editForms.push(forms.formItems[i])
      }
      forms.formItems = editForms
      this.forms = { ...forms }
    },
    sendDel (row) {
      let _this = this
      ajax.post({
        url: '/Api/Travel/delTravel',
        userinfo: true,
        data: {
          tr_id: row.tr_id
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
  .conts{
    background: #ffffff;
    margin: 20px;
    border-radius: 10px;
    padding: 20px;
    overflow: hidden;
  }
  .conts .tab{
    margin-top: 60px;
  }
</style>

<style scoped lang="less">
  ul,li{
    list-style: none;
  }
  .audit{
    padding: 30px;
    text-align: center;
    .btns{
      padding-top: 100px;
    }
    .switch-item{
      padding-top: 30px;
      float: left;
      width: 50%;
    }
  }
</style>
<style scoped>
  .system >>> .ivu-btn{
    padding: 5px 10px 6px
  }
</style>
<template>
  <div style="padding: 10px;">
    <el-table
      ref="table"
      :data="systemList"
      class="system"
      style="width: 100%;"
      border
      stripe
      v-loading="tableLoading"
      highlight-current-row>
      <el-table-column prop="explain"
                       label="设置名称"
                       align="center"
                       show-overflow-tooltip>
      </el-table-column>
      <el-table-column prop="value"
                       label="当前值"
                       align="center"
                       show-overflow-tooltip>
      </el-table-column>
      <el-table-column
        v-if="means.operationAllow(powerList)"
        :width="means.operationWidth(powerList)"
        align="center">
        <template slot="header" slot-scope="scope">
          操作
        </template>
        <template slot-scope="scope">
          <el-tooltip content="更改设置" placement="top">
            <Button @click="edit(scope.row)" v-if="means.hasPermission('edit_system')">
              <Icon type="ios-brush" />
            </Button>
          </el-tooltip>
        </template>
      </el-table-column>
    </el-table>
    <form-modal @save-success="getList" :config="{}" v-model="forms"></form-modal>
  </div>
</template>
<script>
import ajax from '@/libs/ajax'
import means from '@/libs/means'
import formModal from './change-system.vue'
export default {
  name: 'audit-manage',
  components: {
    'form-modal': formModal
  },
  data () {
    return {
      powerList: ['edit_system'],
      means: means,
      systemList: [],
      // modal参数
      forms: {},
      tableLoading: true
    }
  },
  methods: {
    getList () {
      this.tableLoading = true
      let _this = this
      ajax.get({
        url: 'systems',
        userinfo: true
      }).then((res) => {
        _this.systemList = res.result
        _this.tableLoading = false
      })
    },
    edit (row) {
      let forms = {}
      forms.title = '更改' + row.explain
      forms.defaultData = {}
      forms.defaultData[row.key] = row.value
      forms.formItems = [{
        value: row.key,
        label: row.explain,
        type: row.type,
        rules: ['required'],
        options: row.enum || []
      }]
      this.forms = { ...forms }
    }
  },
  created () {
    this.getList()
  }
}
</script>

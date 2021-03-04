<template>
  <Split v-model="split">
    <div class="conts" slot="left">
      <dataPanel @row-change="rowChange"></dataPanel>
    </div>
    <div class="conts" slot="right">
      <div class="top" style="padding: 20px 0" v-if="addDetailsFlag && means.hasPermission('AddLineDetail')">
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
            v-for="(item , index) in tabItems"
            :key="index"
            :label="item.label"
            align="center"
            :prop="item.value"
            show-overflow-tooltip
          ></el-table-column>
          <el-table-column label="操作"
                           align="center"
                           width="200px"
          >
            <template slot-scope="scope">
              <el-tooltip content="编辑" placement="bottom" style="margin: 0 3px">
                <Button @click="edit(scope.row)">
                  <Icon type="ios-brush"></Icon>
                </Button>
              </el-tooltip>
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
    name: 'course',
    components: {
      'form-modal': formModal,
      dataPanel
    },
    data() {
      return {
        split: 0.5,
        means: means,
        addDetailsFlag: false,
        tableLoading: false,
        forms: {},
        tablist: [],
        tabItems: [
          {
            value: 'ld_traffic',
            label: '交通'
          },
          {
            value: 'ld_hotel',
            label: '酒店'
          },
          {
            value: 'ld_morning',
            label: '早'
          },
          {
            value: 'ld_in',
            label: '中'
          },
          {
            value: 'ld_night',
            label: '晚'
          },
          {
            value: 'ld_trip',
            label: '行程'
          }
        ],
        l_id: '',
        days: '',
        defaultForms: {
          title: '添加',
          confirm: true,
          url: '/Api/Line/addLineDetail',
          defaultData: {},
          formItems: [{
            type: 'text',
            name: 'ld_traffic',
            label: '交通',
            rules: ['required']
          }, {
            type: 'text',
            name: 'ld_hotel',
            label: '酒店',
            rules: ['required']
          }, {
            type: 'select',
            name: 'ld_morning',
            label: '早',
            options: [{
              value: '有',
              label: '有'
            }, {
              value: '无',
              label: '无'
            }],
            rules: ['required']
          }, {
            type: 'select',
            name: 'ld_in',
            label: '中',
            options: [{
              value: '有',
              label: '有'
            }, {
              value: '无',
              label: '无'
            }],
            rules: ['required']
          }, {
            type: 'select',
            name: 'ld_night',
            label: '晚',
            options: [{
              value: '有',
              label: '有'
            }, {
              value: '无',
              label: '无'
            }],
            rules: ['required']
          }, {
            type: 'textarea',
            name: 'ld_trip',
            label: '行程',
            rules: ['required']
          }]
        }
      }
    },
    methods: {
      rowChange(row) {
        this.l_id = row.l_id
        this.days = row.l_days
        this.getList()
      },
      getList() {
        this.tableLoading = true
        let _this = this
        ajax.post({
          url: '/Api/Line/getLineDetailList',
          userinfo: true,
          data: {
            l_id: _this.l_id,
          }
        }).then(res => {
          this.tableLoading = false
          _this.tablist = res.result.list
          if (res.result.list.length < Number(this.days)) {
            this.addDetailsFlag = true
          } else {
            this.addDetailsFlag = false
          }
        })
      },
      add() {
        let forms = {...this.defaultForms}
        forms.defaultData = {
          ld_lid: this.l_id,
          ld_day: this.tablist.length + 1
        }
        this.forms = forms
      },
      edit(row) {
        let forms = {...this.defaultForms}
        forms.url = '/Api/Line/saveLineDetail'
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
        this.forms = {...forms}
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

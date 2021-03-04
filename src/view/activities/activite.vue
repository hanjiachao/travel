<style scoped lang="less">

</style>

<template>
    <div>
      <TablePage :config="tableConfig"
                 :controls="controls"
                 @row-change="rowChange"
                 :showItem="showItems"/>
    </div>
</template>

<script>
import TablePage from '../aComponentCollect/dataTable/table-page'

export default {
  name: 'activite',
  components: {
    TablePage
  },
  data () {
    return {
      tableConfig: {
        url: 'vote',
        userinfo: true,
        paging: true,
        highlight: true,
        dataChange: {
          value: 'need_focus',
          changeTo: 'need_focus_text',
          changeMap: {
            0: '否',
            1: '是'
          }
        }
      },
      showItems: [{
        label: '活动名称',
        value: 'title'
      }, {
        label: '活动详情',
        value: 'desc'
      }, {
        label: '活动规则',
        value: 'rule'
      }, {
        label: '开始时间',
        value: 'start_date'
      }, {
        label: '结束时间',
        value: 'end_date'
      }, {
        label: '是否需要关注',
        value: 'need_focus_text'
      }, {
        label: '每日上限',
        value: 'day_limit'
      }, {
        label: '同一个活动可投上限',
        value: 'same_limit'
      }],
      controls: [{
        title: '添加',
        selection: 'none',
        auth: 'add_staff',
        icon: 'md-add',
        type: 'form',
        formType: 'card',
        url: 'vote/create',
        classify: [{
          title: '添加活动',
          showCase: 'baseCase',
          defaultCase: true,
          formItems: [{
            label: '活动名称',
            value: 'title',
            rules: ['required']
          }, {
            type: 'datetimerange',
            label: '活动时间',
            value: 'dateGroup',
            groupBy: ['start_date', 'end_date'],
            rules: ['requiredArray']
          }, {
            type: 'select',
            label: '是否需要关注',
            value: 'need_focus',
            options: [{
              label: '是',
              value: '1'
            }, {
              label: '否',
              value: '0'
            }],
            rules: ['required']
          }, {
            label: '每日上限',
            value: 'day_limit',
            rules: ['required']
          }, {
            label: '同一个活动每日可投上限',
            value: 'same_limit',
            rules: ['required']
          }, {
            type: 'textarea',
            span: 24,
            label: '活动详情',
            value: 'desc',
            rules: ['required']
          }, {
            type: 'textarea',
            span: 24,
            label: '活动规则',
            value: 'rule',
            rules: ['required']
          }]
        }]
      }, {
        title: '编辑活动',
        selection: 'single',
        auth: 'add_staff',
        icon: 'ios-brush',
        type: 'form',
        formType: 'card',
        formNeed: 'allRow',
        urlPrimary: 'id',
        url: 'vote/update',
        classify: [{
          title: '编辑活动',
          showCase: 'baseCase',
          defaultCase: true,
          formItems: [{
            label: '活动名称',
            value: 'title',
            rules: ['required']
          }, {
            type: 'datetimerange',
            label: '活动时间',
            value: 'dateGroup',
            groupBy: ['start_date', 'end_date'],
            rules: ['requiredArray']
          }, {
            type: 'select',
            label: '是否需要关注',
            value: 'need_focus',
            options: [{
              label: '是',
              value: '1'
            }, {
              label: '否',
              value: '0'
            }],
            rules: ['required']
          }, {
            label: '每日上限',
            value: 'day_limit',
            rules: ['required']
          }, {
            label: '同一个活动每日可投上限',
            value: 'same_limit',
            rules: ['required']
          }, {
            type: 'textarea',
            span: 24,
            label: '活动详情',
            value: 'desc',
            rules: ['required']
          }, {
            type: 'textarea',
            span: 24,
            label: '活动规则',
            value: 'rule',
            rules: ['required']
          }]
        }]
      }, {
        title: '删除',
        selection: 'single',
        auth: 'delete_staff',
        icon: 'md-trash',
        type: 'handle',
        method: 'delete',
        url: 'vote/delete',
        urlPrimary: 'id'
      }]
    }
  },
  methods: {
    rowChange (row) {
      this.$emit('row-change', row)
    }
  }
}
</script>

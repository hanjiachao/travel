<style scoped lang="less">

</style>

<template>
  <div>
    <TablePage :showItem="showItems"
               :controls="controls"
               :config="tableConfig"/>
  </div>
</template>

<script>
import TablePage from '../aComponentCollect/dataTable/table-page'

export default {
  name: 'entry-list',
  props: {
    parentId: {
      default: ''
    }
  },
  components: {
    TablePage
  },
  data () {
    return {
      tableConfig: {
        url: '',
        userinfo: true,
        paging: true,
        pagingConfig: {
          showTotal: true
        }
      },
      showItems: [{
        label: '公司名称',
        value: 'company'
      }, {
        label: '行业',
        value: 'industry'
      }, {
        label: '街道',
        value: 'street'
      }, {
        label: '项目',
        value: 'project'
      }, {
        label: '负责人',
        value: 'manager'
      }, {
        label: '项目简介',
        value: 'desc'
      }, {
        label: '项目成效',
        value: 'effect'
      }, {
        label: '访问量',
        value: 'view_num'
      }, {
        label: '票数',
        value: 'vote_num'
      }],
      controls: [{
        title: '添加',
        selection: 'none',
        auth: 'add_staff',
        icon: 'md-add',
        type: 'form',
        formType: 'card',
        url: 'vote/create_join_record',
        classify: [{
          title: '添加活动项目',
          showCase: 'baseCase',
          defaultCase: true,
          formItems: [{
            label: '公司名称',
            value: 'company',
            rules: ['required']
          }, {
            label: '行业',
            value: 'industry',
            rules: ['required']
          }, {
            label: '街道',
            value: 'street',
            rules: ['required']
          }, {
            label: '项目',
            value: 'project',
            rules: ['required']
          }, {
            label: '负责人',
            value: 'manager',
            rules: ['required']
          }, {
            type: 'textarea',
            span: 24,
            label: '项目描述',
            value: 'desc',
            rules: ['required']
          }, {
            type: 'textarea',
            span: 24,
            label: '项目成效',
            value: 'effect',
            rules: ['required']
          }]
        }]
      }, {
        title: '编辑活动项目',
        selection: 'single',
        auth: 'add_staff',
        icon: 'ios-brush',
        type: 'form',
        formType: 'card',
        formNeed: 'allRow',
        urlPrimary: 'id',
        url: 'vote/update_join_record',
        classify: [{
          title: '编辑活动项目',
          showCase: 'baseCase',
          defaultCase: true,
          formItems: [{
            label: '公司名称',
            value: 'company',
            rules: ['required']
          }, {
            label: '行业',
            value: 'industry',
            rules: ['required']
          }, {
            label: '街道',
            value: 'street',
            rules: ['required']
          }, {
            label: '项目',
            value: 'project',
            rules: ['required']
          }, {
            label: '负责人',
            value: 'manager',
            rules: ['required']
          }, {
            type: 'textarea',
            span: 24,
            label: '项目描述',
            value: 'desc',
            rules: ['required']
          }, {
            type: 'textarea',
            span: 24,
            label: '项目成效',
            value: 'effect',
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
        url: 'vote/delete_join_record',
        urlPrimary: 'id'
      }]
    }
  },
  watch: {
    parentId (id) {
      if (id) {
        this.$set(this.tableConfig, 'url', 'vote/join_records/' + id)
        this.$set(this.controls[0], 'url', 'vote/create_join_record/' + id)
      }
    },
    deep: true,
    immediate: true
  }
}
</script>

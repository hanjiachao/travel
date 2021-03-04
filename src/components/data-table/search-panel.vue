<template>
  <div class="search-panel">
    <Form :model="searchForm" :label-width="80">
      <Row v-for="(item, index) in searchOptions" :key="index">
        <Col span="8" v-for="(iitem, iindex) in item" :key="iindex" v-if="!iitem.fold || !searchFold">
          <FormItem :label="iitem.label">
            <Input v-if="iitem.type === 'input' " v-model="searchForm[iitem.key]" :placeholder="'请输入' + iitem.label" />
            <Select v-else-if="iitem.type === 'select'"
                    :multiple="iitem.multiple"
                    v-model="searchForm[iitem.key]"
                    filterable
                    :remote="iitem.dataUrl"
                    :remote-method="iitem.dataUrl ? function (query) {loadSelectOption(query, index, iindex)} : ()=>{}"
                    :loading="iitem.loading">
              <Option v-for="(searchItem, searchIndex) in iitem.data" :value="searchItem.value" :key="searchIndex">{{ searchItem.label }}</Option>
            </Select>
            <DatePicker @on-change="(a, b) => { changeDate (a, b, iitem)}" v-else-if="['date', 'datetime', 'datetimerange', 'daterange'].indexOf(iitem.type) > -1" v-model="searchForm[iitem.key]" :type="iitem.type" :format="iitem.type.indexOf('time')>-1 ? 'yyyy-MM-dd HH:mm' : 'yyyy-MM-dd'" placeholder="请选择时间" split-panels style="width: 100%"></DatePicker>
            <TimePicker @on-change="(a, b) => { changeTime (a, b, iitem)}" v-else-if="['time', 'timerange'].indexOf(iitem.type) > -1" v-model="searchForm[iitem.key]" :type="iitem.type" format="HH:mm" placeholder="请选择时间" split-panels style="width: 100%"></TimePicker>
          </FormItem>
        </Col>
      </Row>
    </Form>
    <div class="search-control">
      <Button @click="query" type="primary">查询</Button>
      <Button @click="empty" type="default">清空</Button>
      <a @click.prevent="searchFold = !searchFold" v-if="searchFoldAble">
        {{ searchFold ? '更多筛选' : '收起筛选'}}
        <Icon :type="searchFold ? 'ios-arrow-down' : 'ios-arrow-up'"></Icon>
      </a>
      <div class="clear"></div>
    </div>
    <div class="clear"></div>
  </div>
</template>

<script>
export default {
  name: 'search-panel',
  props: {
    options: {
      type: Array,
      default: () => []
    },
    config: {
      type: Object,
      required: true
    }
  },
  data () {
    return {
      searchOptionsList: [],
      searchFold: true,
      searchFoldAble: false,
      searchItemLoading: {},
      searchFormBak: {},
      searchForm: {}
    }
  },
  methods: {
    changeDate (date, typ, item) {
    },
    changeTime (time, typ, item) {
    },
    query () {
      this.$emit('query', this.searchForm)
    },
    empty () {
      let _this = this
      let searchForm = {}
      // console.log(this.searchFormBak)
      for (let i in _this.searchFormBak) {
        for (let j in _this.searchFormBak[i]) {
          searchForm[_this.searchFormBak[i][j].key] = null
        }
      }
      // console.log(this.searchForm)
      this.searchForm = searchForm
      this.$emit('empty', _this.searchForm)
    }
  },
  computed: {
    searchOptions () {
      let unfoldList = []
      let foldList = []
      let _this = this
      this.options.map(function (item) {
        item = { ...item }
        if (item.type === 'select' && item.dataUrl) {
          item.data = []
          item.loading = true
        }
        if (item.fold) {
          foldList.push(item)
          _this.searchFoldAble = true
        } else {
          unfoldList.push(item)
        }
      })
      let tempOptions = [...unfoldList, ...foldList]
      let optionGroup = []
      let searchOptions = []
      for (let i = 0; i < tempOptions.length; i++) {
        optionGroup.push(tempOptions[i])
        if (i % 3 === 2 || i === tempOptions.length - 1) {
          searchOptions.push(optionGroup)
          optionGroup = []
        }
      }
      _this.searchOptionsList = tempOptions
      _this.searchFormBak = searchOptions
      return searchOptions
    }
  }
}
</script>

<style scoped>
  .search-panel {
    padding-bottom: 10px
  }
  .search-control {
    float: right;
  }
  .search-control >>> button{
    margin-right: 10px;
  }
</style>

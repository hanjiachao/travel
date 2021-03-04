<style scoped>
  .search-form >>> .ivu-btn{
    margin-right: 5px;
  }
  .search-form{
    margin-bottom: 5px;
  }
  .form-item{
    padding-bottom: 20px;
  }
  .form-label{
    text-align: right;
    box-sizing: border-box;
    font-size: 14px;
    overflow:hidden;
    text-overflow:ellipsis;
    white-space:nowrap;
  }
</style>

<template>
  <div class="search-form">
    <Row :gutter="20">
      <Col class="form-item" v-for="(search, searchIndex) in searchList" :xs="getColSize(search, 'xs')" :sm="getColSize(search, 'sm')" :md="getColSize(search, 'md')" :lg="getColSize(search, 'lg')" :key="searchIndex" v-if="!search.fold || !searchFold">
        <div :title="search.label" class="fl form-label" style="width: 60px;line-height: 36px">
          {{ search.label }}
        </div>
        <div class="fr" style="width: calc(100% - 70px);">
          <form-select-page
            v-if="search.type === 'selectPaging'"
            @get-key="(key) => getSelectKey(key, search)"
            :config="search.config || {}" v-model="formData[search.value]" :placeholder="search.placeholder? search.placeholder : '搜索' + search.label"></form-select-page>
          <form-select
            v-else-if="search.type === 'select'"
            @get-key="(key) => getSelectKey(key, search)"
            v-model="formData[search.value]" :wordType="search.options" :config="searchConfig(search.config)" :placeholder="search.placeholder || '请选择' + search.label"></form-select>
          <tree-select
            v-else-if="search.type === 'treeSelect'"
            @get-key="(key) => getSelectKey(key, search)"
            :config="search.config || {}"  v-model="formData[search.value]" :placeholder="search.placeholder? search.placeholder : '请选择' + search.label"></tree-select>
          <form-date
            v-else-if="['date', 'daterange', 'datetime', 'datetimerange', 'year', 'month'].indexOf(search.type) > -1"
            @get-datetime="(date) => getDatetime(date, search)"
            v-model="formData[search.value]" :dateType="search.type" :config="search.config || {}" :placeholder="search.placeholder? search.placeholder : '请选择' + search.label"></form-date>
          <form-time
            v-else-if="['time', 'timerange'].indexOf(search.type) > -1"
            @get-datetime="(time) => getDatetime(time, search)"
            v-model="formData[search.value]" :timeType="search.type" :config="search.config || {}" :placeholder="search.placeholder? search.placeholder : '请选择' + search.label"
            ></form-time>
          <Input
            v-else
            :type="search.type || 'text'"
            v-model="formData[search.value]" :placeholder="search.placeholder || '搜索' + search.label" size="large" />
        </div>
        <div class="clear"></div>
      </Col>
    </Row>
    <div style="text-align: right">
      <Button type="primary" @click="query">查询</Button>
      <Button @click="empty">清空</Button>
      <a @click.prevent="searchFold = !searchFold" v-if="searchFoldAble">
        {{ searchFold ? '更多' : '收起'}}
        <Icon :type="searchFold ? 'ios-arrow-down' : 'ios-arrow-up'"></Icon>
      </a>
    </div>
  </div>
</template>

<script>
import formSelect from '../smallComponents/form-select'
import formSelectPage from '../smallComponents/form-select-paging'
import treeSelect from '../smallComponents/tree-select'
import formDate from '../smallComponents/form-date'
import formTime from '../smallComponents/form-time'

export default {
  name: 'seach-panel-audit-collection',
  components: {
    'form-select': formSelect,
    'form-select-page': formSelectPage,
    'tree-select': treeSelect,
    'form-date': formDate,
    'form-time': formTime
  },
  props: {
    searchs: {
      type: Array,
      default: () => []
    }
  },
  data () {
    return {
      searchFoldAble: false,
      searchFold: true,
      formData: {},
      formDataBak: {},
      labelList: {},
      inconformity: {},
      groupItems: {},
      joinBy: {}
    }
  },
  methods: {
    query () {
      let data = {}
      let list = { ...this.formData }
      let labelList = { ...this.labelList }
      Object.keys(list).forEach((key) => {
        if (list[key]) {
          data[key] = {
            label: labelList[key],
            value: list[key]
          }
          if (this.joinBy[key]) {
            data[key].joinBy = this.joinBy[key]
          }
          if (this.inconformity[key]) {
            data[key].trueKey = this.inconformity[key]
          }
          if (this.groupItems[key]) {
            data[key].groupItem = true
          }
        }
      })
      this.$emit('screening', data)
    },
    empty () {
      this.inconformity = {}
      this.formData = { ...this.formDataBak }
    },
    searchConfig (config) {
      config = config || {}
      config.clearable = true
      return config
    },
    getSelectKey (key, item) {
      if (item.inconformity) {
        this.inconformity[item.value] = key
      }
    },
    getDatetime (datetime, search) {
      if (search.groupBy) {
        this.formData[search.groupBy[0]] = datetime[0]
        this.formData[search.groupBy[1]] = datetime[1]
      }
    },
    getColSize (search, screenSize) {
      let sizeOptions = {
        xs: 24,
        sm: 12,
        md: 8,
        lg: 6
      }
      let sizeConfig = search.sizeConfig || {}
      return sizeConfig[screenSize] || sizeConfig.size || sizeOptions[screenSize]
    }
  },
  computed: {
    searchList () {
      let list = [ ...this.searchs ]
      let formData = {}
      let labelList = {}
      let _this = this
      list.map(item => {
        formData[item.value] = ''
        labelList[item.value] = item.label
        if (['daterange', 'datetimerange', 'timerange', 'cascader'].indexOf() > -1) {
          formData[item.value] = []
        }
        if (item.fold) {
          _this.searchFoldAble = true
        }
        if (item.groupBy) {
          item.groupBy.map(groupItem => {
            _this.groupItems[groupItem] = true
            formData[groupItem] = ''
          })
        }
        if (item.joinBy) {
          _this.joinBy[item.value] = item.joinBy
        }
      })
      _this.formData = { ...formData }
      _this.formDataBak = { ...formData }
      _this.labelList = { ...labelList }
      return list
    }
  }
}
</script>

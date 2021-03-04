<style scoped>
  .search-form >>> .ivu-btn{
    margin-right: 5px;
  }
  .search-form{
    padding-bottom: 10px;
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
      <Col class="form-item" v-for="(search, searchIndex) in searchList" :xs="24" :sm="12" :md="8" :lg="6" :key="searchIndex" v-if="!search.fold || !searchFold">
        <div :title="search.label" class="fl form-label" style="width: 60px;line-height: 36px">
          {{ search.label }}
        </div>
        <div style="margin-left: 70px;">
          <form-select v-if="search.type === 'select' && search.dictionary" v-model="formData[search.value]" :wordType="search.options" :config="search.config || {}" :placeholder="search.placeholder || '请选择' + search.label"></form-select>
          <Select size="large" v-else-if="search.type === 'select'" v-model="formData[search.value]" :placeholder="search.placeholder || '请选择' + search.label">
            <Option v-for="(option, optionIndex) in options[search.value]" :key="optionIndex" :value="option.value">
              {{ option.label }}
            </Option>
          </Select>
          <Input v-else v-model="formData[search.value]" :placeholder="search.placeholder || '请选择' + search.label" size="large" />
        </div>
        <div class="clear"></div>
      </Col>
    </Row>
    <div style="text-align: right">
      <Button type="primary" @click="query(false)">查询</Button>
      <Button @click="query(true)">清空</Button>
      <a @click.prevent="searchFold = !searchFold" v-if="searchFoldAble">
        {{ searchFold ? '更多' : '收起'}}
        <Icon :type="searchFold ? 'ios-arrow-down' : 'ios-arrow-up'"></Icon>
      </a>
    </div>
  </div>
</template>

<script>
import formSelect from '../../components/data-hidden/form-select'
export default {
  name: 'seach-panel-hidden',
  components: {
    'form-select': formSelect
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
      options: {}
    }
  },
  methods: {
    query (empty) {
      let data = {}
      if (empty) {
        this.formData = { ...this.formDataBak }
      } else {
        let list = { ...this.formData }
        let labelList = { ...this.labelList }
        Object.keys(list).forEach((key) => {
          if (list[key]) {
            data[key] = {
              label: labelList[key],
              value: list[key]
            }
          }
        })
      }
      this.$emit('query', data)
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
        if (item.fold) {
          _this.searchFoldAble = true
        }
        if (item.type === 'select') {
          if (item.options instanceof Array) {
            _this.$set(_this.options, item.value, item.options)
          } else {
            item.dictionary = true
          }
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

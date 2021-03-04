<style scoped lang="less">
  .filter{
    .search-box{
      background: #fff;
      padding: 10px;
      border-radius: 10px;
    }
    .currentQuery{
      padding: 10px;
      border-radius: 10px;
      background: #fff;
      margin-top: 10px;
      line-height: 30px;
    }
  }
</style>
<template>
  <div class="filter">
    <div class="search-box" v-show="searchShow">
      <search-panel :searchs="searchs" @screening="screening"></search-panel>
    </div>
    <div class="currentQuery" v-if="currentQuery.length > 0">
      <div style="color: #2D8CF0;padding-right: 10px;display: inline-block; font-weight: bold;">
        当前筛选条件
      </div>
      <Tag v-for="(query, queryIndex) in currentQuery" :key="queryIndex" style="line-height: 24px; color: #333;height: 25px;" color="primary" type="border">
        <span>
          {{ query.label }}:
          {{ query.trueKey || query.value }}
        </span>
      </Tag>
    </div>
  </div>
</template>

<script>
import searchPanel from './search-panel'
export default {
  name: 'search-filter',
  components: {
    'search-panel': searchPanel
  },
  props: {
    searchShow: {
      type: Boolean,
      default: false
    },
    searchs: {
      type: Array,
      default: () => []
    }
  },
  data () {
    return {
      queryData: {}
    }
  },
  methods: {
    screening (data) {
      this.queryData = data
      this.$emit('screening', data)
    },
    clearQuery () {
      this.queryData = {}
    }
  },
  computed: {
    currentQuery () {
      let queryData = this.queryData
      let currentQuery = []
      Object.keys(queryData).forEach((key) => {
        currentQuery.push({
          value: queryData[key].value,
          label: queryData[key].label,
          trueKey: queryData[key].trueKey || null
        })
      })
      return JSON.parse(JSON.stringify(currentQuery))
    }
  }
}
</script>

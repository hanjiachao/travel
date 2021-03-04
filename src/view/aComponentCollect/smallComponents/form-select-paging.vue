<style scoped lang="less">
  .disabled{
    cursor: not-allowed !important;
    color: #999;
  }
  .frame{
    position: relative;
    .show-part:hover {
      .clear-icon{
        display: inline-block;
      }
    }
    .show-part{
      padding: 0 7px;
      box-sizing: border-box;
      line-height: 34px;
      border: 1px solid #dcdee2;
      border-radius: 4px;
      cursor: pointer;
      background: #fff;
      color: #515a6e;
      .hide-show-icon{
        transform: rotate(180deg);
      }
      .clear-icon{
        position: absolute;
        right: 10px;
        top: 0;
        z-index: 10000;
        display: none;
      }
    }
    .show-part-active{
      border-color: #57a3f3;
    }
    .show-part:hover{
      border-color: #57a3f3;
    }
    .hide-part{
      background: #fff;
      position: absolute;
      left: 0;
      right: 0;
      min-width: 200px;
      box-sizing: border-box;
      box-shadow: 0 1px 6px rgba(0, 0, 0, 0.2);
      margin: 5px 0;
      z-index: 10000;
      *{
        margin: 0;
      }
      .hide-list{
        min-height: 30px;
        box-sizing: border-box;
        max-height: 200px;
        overflow-y: auto;
        .hide-item{
          cursor: pointer;
          padding: 0 20px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
        .hide-item:hover{
          background: #f3f3f3;
        }
        .selected-focus{
          color: #2d8cf0;
          background: #f3f3f3;
        }
      }
      .paging{
        border-top: 1px solid #dcdee2;
        padding: 5px 0;
      }
      .search-box{
        padding: 10px 20px;
        .search-ipt-box{
          height: 24px;
          .search-ipt{
            line-height: 24px;
            height: 24px;
            width: 100%;
            outline: none;
            border-radius: 5px;
            border: 1px solid #999;
            padding: 0 10px;
          }
        }
      }
    }
  }
</style>

<template>
    <div v-clickoutside="handleClose" class="clear frame" id="select-paging-ry">
      <div class="show-part" :class="hidePartShow ? 'show-part-active' : ''" @click="hidePartShow = !hidePartShow">
        <Icon @click="clearSearch" v-if="option && configObj.clearable" color="#808695" class="clear-icon" style="margin-top: 10px;" type="ios-close-circle" />
        <Icon color="#808695" :class="{ 'hide-show-icon': hidePartShow }" style="margin-top: 10px;transition: .3s" class="fr" type="ios-arrow-down" />
        <p :style="{ color: option ? '' : '#c5c8ce' }" style="width: calc(100% - 40px);overflow: hidden; text-overflow: ellipsis;white-space: nowrap;float: left;margin: 0;">
          {{ option || placeholder }}
        </p>
        <div class="clear"></div>
      </div>
      <transition name="el-zoom-in-top">
        <div v-show="hidePartShow" class="hide-part">
          <div class="search-box" v-if="configObj.searchAllow">
            <div class="search-ipt-box">
              <input class="search-ipt" type="text" v-model="skey" @input="searchList">
            </div>
            <div class="clear"></div>
          </div>
          <div style="position: relative">
            <div style="padding: 10px 0; text-align: center; color: #666; font-size: 15px;" v-if="dataList.length < 1">
              {{ configObj.emptyText || '暂无数据' }}
            </div>
            <ul v-else class="hide-list">
              <li v-for="(item, index) in dataList" :key="index" class="hide-item" :class="value === item.value ? 'selected-focus' : ''" @click="chooseValue(item)" :title="item.key">
                {{ item.key }}
              </li>
            </ul>
            <Spin fix v-if="listLoading"></Spin>
          </div>
          <div class="paging">
            <Icon :class="{ 'disabled': page === 1 }" size="18" :color="page === 1 ? '#ccc' : '#808695'" class="fl" style="cursor: pointer" type="ios-arrow-back" @click="pageChange(-1)" />
            <Icon :class="{ 'disabled': page === allPage }" size="18" :color="page === allPage ? '#ccc' : '#808695'" class="fr" style="cursor: pointer" type="ios-arrow-forward" @click="pageChange(1)" />
            <p style="line-height: 18px; font-size: 16px; text-align: center;margin: 0 30px;">{{ page + ' / ' + allPage }}</p>
            <div class="clear"></div>
          </div>
        </div>
      </transition>
    </div>
</template>

<script>
import ajax from '@/libs/ajax'
import Clickoutside from 'element-ui/src/utils/clickoutside'

export default {
  name: 'form-select-paging-collection',
  directives: {
    Clickoutside
  },
  props: {
    config: {
      type: Object,
      default: () => {}
    },
    value: {
      default: ''
    },
    placeholder: {
      type: String,
      default: ''
    },
    disabled: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      dataList: [],
      hidePartShow: false,
      page: 1,
      total: 0,
      pageSize: 20,
      clickMethod: '',
      listLoading: false,
      skey: '',
      option: '',
      searchTimeout: ''
    }
  },
  methods: {
    pageChange (increase) {
      let page = this.page + increase
      if (page < 1 || page > this.allPage) {
        return false
      }
      this.page = page
      this.getList()
    },
    getList () {
      this.listLoading = true
      let configObj = this.configObj
      let url = configObj.url
      let method = configObj.method || 'get'
      let data = {
        page: this.page
      }
      if (this.configObj.searchAllow) {
        data[this.skeyName] = this.skey
      }
      if (this.configObj.extraParams) {
        Object.assign(data, this.configObj.extraParams)
      }
      let dataPosition = this.dataPosition
      let pageConfig = this.pageConfig
      let key = this.keyName
      let value = this.valueName
      ajax.request({
        url: url,
        method: method,
        userinfo: true,
        params: data,
        data: data
      }).then(res => {
        let list = res
        let pageData = res
        for (let i in dataPosition) {
          list = list[dataPosition[i]]
        }
        for (let i in pageConfig.position) {
          pageData = pageData[pageConfig.position[i]]
        }
        list = list.map(item => {
          return {
            key: item[key],
            value: item[value]
          }
        })
        this.pageSize = pageData[pageConfig.pageSize]
        this.total = pageData[pageConfig.total]
        this.dataList = list
        this.listLoading = false
      })
    },
    // 查找
    searchList () {
      clearTimeout(this.searchTimeout)
      this.searchTimeout = setTimeout(() => {
        this.page = 1
        this.getList()
      }, 300)
    },
    chooseValue (item) {
      this.option = item.key
      this.$emit('input', item.value)
      this.$emit('get-key', item.key)
      this.hidePartShow = false
    },
    clearSearch (e) {
      this.$emit('input', '')
      e.stopPropagation()
    },
    handleClose () {
      this.hidePartShow = false
    }
  },
  computed: {
    configObj () {
      return this.config || {}
    },
    allPage () {
      return Math.ceil(this.total / this.pageSize) || 1
    },
    dataPosition () {
      return this.configObj.dataPosition || ['result', 'list']
    },
    pageConfig () {
      let pageConfig = this.configObj.pageConfig || {}
      return {
        position: pageConfig.position || ['result', 'meta'],
        pageSize: pageConfig.pageSize || 'per_page',
        total: pageConfig.total || 'total'
      }
    },
    keyName () {
      return this.configObj.keyName || 'name'
    },
    valueName () {
      return this.configObj.valueName || 'id'
    },
    skeyName () {
      return this.configObj.skeyName || 'name'
    }
  },
  watch: {
    value: {
      handler (value) {
        if (!value && value !== 0) {
          this.option = ''
        }
      },
      deep: true,
      immediate: true
    },
    configObj: {
      handler (config) {
        if (config.url) {
          this.getList()
        }
      },
      deep: true,
      immediate: true
    }
  }
}
</script>

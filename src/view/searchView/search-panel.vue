<style scoped>
    .search-form >>> .ivu-btn{
        margin-right: 5px;
    }
    .search-form{
        padding-bottom: 15px;
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
            <Col class="form-item" v-for="(search, searchIndex) in searchList" :span="spanWidth" :key="searchIndex" v-if="!search.fold || !searchFold">
                <div :title="search.label" class="fl form-label" style="width: 60px;line-height: 36px">
                    {{ search.label }}
                </div>
                <div class="fr" style="width: calc(100% - 70px);">
                    <form-select-page @get-key="(key) => getSelectKey(key, search)" v-if="search.type === 'selectPaging'" :config="search.config || {}" v-model="formData[search.value]" :placeholder="search.placeholder? search.placeholder : '搜索' + search.label"></form-select-page>
                    <form-select v-else-if="search.type === 'select' && search.dictionary" v-model="formData[search.value]" :wordType="search.options" :config="searchConfig(search.config)" :placeholder="search.placeholder || '搜索' + search.label"></form-select>
                    <Select size="large" v-else-if="search.type === 'select'" v-model="formData[search.value]" :placeholder="search.placeholder || '搜索' + search.label" clearable>
                        <Option v-for="(option, optionIndex) in options[search.value]" :key="optionIndex" :value="option.value">
                            {{ option.label }}
                        </Option>
                    </Select>
                    <!--增加选择时间组件-->
                    <DatePicker v-else-if="['date', 'datetime', 'datetimerange', 'daterange'].indexOf(search.type) > -1" :format="search.format ? search.format : 'yyyy-MM-dd'" :value="formData[search.value]"
                                :type="search.type" placement="bottom-start" @on-change="formData[search.value] = $event" :placeholder="'请选择' + search.label"></DatePicker>
                    <Input v-else v-model="formData[search.value]" :placeholder="search.placeholder || '搜索' + search.label" size="large" />
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
    import formSelect from '../../components/data-hidden/form-select'
    import formSelectPage from '../../components/data-hidden/form-select-paging.vue'
    export default {
        name: 'seach-panel',
        components: {
            'form-select': formSelect,
            'form-select-page': formSelectPage
        },
        props: {
            searchs: {
                type: Array,
                default: () => []
            },
            spanWidth: {
                type: Number,
                default: 8
            }
        },
        data () {
            return {
                searchFoldAble: false,
                searchFold: true,
                formData: {},
                formDataBak: {},
                labelList: {},
                options: {},
                inconformity: {}
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
                        if (this.inconformity[key]) {
                            data[key].trueKey = this.inconformity[key]
                        }
                    }
                })
                this.$emit('screening', data)
            },
            empty () {
                this.inconformity = {}
                this.formData = { ...this.formDataBak }
                // this.$emit('screening', {})
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

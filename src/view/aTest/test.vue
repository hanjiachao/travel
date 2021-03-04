<template>
    <div>
        <search-filter @screening="screening" :searchShow="searchShow" :searchs="searchs"></search-filter>
    </div>
</template>

<script>
    import searchFilter from '../searchView/search-filter'
    export default {
        name: "test",
        components: {
            'search-filter': searchFilter
        },
        data() {
            return{
                // 筛选
                searchs: [
                    {
                        label: '工会名称',
                        value: 'name'
                    },
                    {
                        label: '联系电话',
                        value: 'phone'
                    },
                    {
                        label: '工会主席',
                        value: 'director'
                    }
                ],
                searchShow: true,
                queryData: {}
            }
        },
        methods: {
            // 筛选
            screening (data) {
                console.log(data)
            }
        }
    }
</script>

<style scoped>

</style>
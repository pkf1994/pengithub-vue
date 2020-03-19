<template>

</template>

<script>
    import {util_numberFormat,util_queryParse} from '@/util'
    import {CommonLoading,SimplePagination} from '@/components'
    import {Selector,EmptyNotice} from '../components'
    import {RouteUpdateAwareMixin} from '@/mixins'
    import styled from 'vue-styled-components'
    export default {
        mixins: [RouteUpdateAwareMixin],
        data() {
            return {
                searchType: 'repositories',
            }
        },
        computed: {
            m_query() {
                return this.$route.query.q
            },
            m_sort() {
                return this.$route.query.sort
            },
            m_order() {
                return this.$route.query.order
            },
            m_state() {
                return this.$route.query.state
            },
            m_language() {
                let language = this.$route.query.language
                if(language == 'Any') return ''
                return language
            },
            m_page() {
                return this.$route.query.p
            },
            m_formatTotalCount() {
                return util_numberFormat.thousands(this.totalCount)
            }
        },
        methods: {
            m_routeTo(query) {
                query = {
                    p: this.m_page,
                    sort: this.m_sort,
                    q: this.m_query,
                    order: this.m_order,
                    language: this.m_language,
                    ...query
                }
                let queryStr = util_queryParse.querify(query)
                if(this.$route.fullPath == `/search/${this.searchType}?${queryStr}`) return 
                this.$router.push(`/search/${this.searchType}?${queryStr}`)
            },
        },
        components: {
            Selector,EmptyNotice,CommonLoading,SimplePagination,
            Container: styled.div``,
            Title: styled.h3``,
            ResultContent: styled.div``,

        }
    }
</script>

<style scoped>
    .pagination{
        margin-top: 20px;
        margin-bottom: 15px;
    }
</style>
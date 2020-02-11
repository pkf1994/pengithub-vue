<template>
    <Container class="container pagination flex-row-center">
        <Left class="flex-grow-1"
              :class="{disable: !hasPreviousPage}"
              @click="getPreviousPage">◀</Left>
        <PageInfo class="flex-grow-1">{{currentPage === -1 ? computedCurrentPage : currentPage}} of {{maxPage}}</PageInfo>
        <Right class="flex-grow-1"
               style="border-right: 0"
               :class="{disable: !hasNextPage}"
               @click="getNextPage">▶</Right>
    </Container>
</template>

<script>
    import styled from 'vue-styled-components'
    import {util_animatedScrollTo} from '../../util'
    export default {
        props: {
            apiType: {
                type: String,
                default: 'rest'
            },
            loading: {
                type: Boolean,
                required: true
            },
            pageInfo: {
                type: Object,
                required: true
            },
            currentPage: {
                type: Number,
                default: -1
            },
            totalCount: {
                type: Number,
                required: true
            },
            perPage: {
                type: Number,
                required: true
            },
            dataGetter: {
                type: Function,
                required: true
            }
        },
        computed: {
            maxPage: function () {
                return Math.ceil(this.totalCount/this.perPage)
            },
            computedCurrentPage: function () {
                if(this.pageInfo.prev) {
                    return parseInt(this.pageInfo.prev.page) + 1
                }else if(this.pageInfo.next) {
                    return parseInt(this.pageInfo.next.page) - 1
                }
                return 1
            },
            hasPreviousPage() {
                if(this.apiType === 'rest') {
                    if(this.pageInfo.prev) return true
                    return false
                }
                return this.pageInfo.hasPreviousPage
            },
            hasNextPage() {
                if(this.apiType === 'rest') {
                    if(this.pageInfo.next) return true
                    return false
                }
                return this.pageInfo.hasNextPage
            },
        },
        watch: {
            loading: function (newOne, oldOne) {
                if(!newOne) {
                    util_animatedScrollTo.scrollTo(document.getElementById("app-container"),0)
                }
            }
        },
        methods: {
            getPreviousPage: function() {
                if(!this.hasPreviousPage || this.loading) return
                this.dataGetter({forward:false,changePage: true})
            },
            getNextPage: function () {
                if(!this.hasNextPage || this.loading) return
                this.dataGetter({forward:true,changePage: true})
            }
        },
        components: {
            Container:styled.div``,
            Right: styled.div``,
            Left: styled.div``,
            PageInfo: styled.div``
        }
    }
</script>

<style scoped>
    .container{
        z-index: 2;
        padding: 0;
        margin-top: 0;
        margin-bottom: -1px;
        background-color: #fafbfc;
    }
    .pagination div{
        padding: 10px 15px;
        color: #444d56;
        text-align: center;
        border: 1px solid #d1d5da;
        border-left-color: #fff;
        border-bottom: 0;
    }
    .disable{
        color: #c6cbd1 !important;
    }
</style>
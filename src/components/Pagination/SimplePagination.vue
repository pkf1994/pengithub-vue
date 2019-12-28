<template>
    <Container class="container pagination flex-row-center">
        <Left class="flex-grow-1"
              :class="{disable: !pageInfo.prev}"
              @click="getPreviousPage">Previous</Left>
        <PageInfo >{{currentPage}} of {{pageInfo.last.page}}</PageInfo>
        <Right class="flex-grow-1"
               style="border-right: 0"
               :class="{disable: !pageInfo.next}"
               @click="getNextPage">Next</Right>
    </Container>
</template>

<script>
    import styled from 'vue-styled-components'
    import {util_animatedScrollTo} from '../../util'
    export default {
        props: {
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
                required: true
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
            currentPage: function () {
                if(this.pageInfo.prev) {
                    return this.pageInfo.prev.page + 1
                }else if(this.pageInfo.next) {
                    return this.pageInfo.next.page - 1
                }
                return 1
            }
        },
        watch: {
            loading: function (newOne, oldOne) {
                if(!newOne) {
                    console.log("scroll")
                    util_animatedScrollTo.scrollTo(document.getElementById("app-container"),0)
                }
            }
        },
        methods: {
            getPreviousPage: function() {
                if(!this.pageInfo.prev || this.loading) return
                this.dataGetter({changePage:true,forward:false})
            },
            getNextPage: function () {
                if(!this.pageInfo.next || this.loading) return
                this.dataGetter({changePage:true,forward:true})
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
        color: #d1d5da;
        cursor: default;
        background-color: #fafbfc;
    }
</style>
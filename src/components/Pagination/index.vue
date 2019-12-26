<template>
    <Container class="container pagination flex-row-center">
        <Left class="flex-grow-1"
              :class="{disable: !pageInfo.hasPreviousPage}"
              @click="getPreviousPage">◀</Left>
        <PageInfo class="flex-grow-1">{{currentPage}} of {{maxPage}}</PageInfo>
        <Right class="flex-grow-1"
               style="border-right: 0"
               :class="{disable: !pageInfo.hasNextPage}"
               @click="getNextPage">▶</Right>
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
            maxPage: function () {
                return Math.ceil(this.totalCount/this.perPage)
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
                if(!this.pageInfo.hasPreviousPage || this.loading) return
                this.dataGetter({forward:false})
            },
            getNextPage: function () {
                if(!this.pageInfo.hasNextPage || this.loading) return
                this.dataGetter({forward:true})
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
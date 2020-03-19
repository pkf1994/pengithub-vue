<template>
    <Container class="container pagination flex-row-center flex-items-stretch bg-white">
        <Left   class="flex-grow-1 flex-row-center width-full  d-inline-block"
                :disabled="!pageInfo.prev || loading"
                 @click="_goPrev">Previous</Left>
        <PageInfo >
            <strong style="color: #586069;">
                {{currentPage}} of {{pageInfo.last ? pageInfo.last.page : currentPage}}
            </strong>
        </PageInfo>
        <Right  class="flex-grow-1 flex-row-center width-full d-inline-block"
                :disabled="!pageInfo.next || loading"
                @click="_goNext">Next</Right>
    </Container>
</template>

<script>
    import styled from 'vue-styled-components'
   
    export default {
        props: {
            loading: {
                type: Boolean,
                default: false
            },
            pageInfo: {
                type: Object,
                required: true
            },
            goNext: {
                type: Function,
                default: () => {console.log('go next')}
            },
            goPrev: {
                type: Function,
                default: () => {console.log('go prev')}
            },
        },
     
        computed: {
            currentPage: function () {
                if(this.pageInfo.prev) {
                    return parseInt(this.pageInfo.prev.page) + 1
                }else if(this.pageInfo.next) {
                    return parseInt(this.pageInfo.next.page) - 1
                }
                return 1
            }
        },
        methods: {
            _goNext() {
                if(this.loading) return
                this.goNext()
            },
            _goPrev() {
                if(this.loading) return
                this.goPrev()
            },
        },
        components: {
            Container:styled.div``,
            Right: styled.button``,
            Left: styled.button``,
            PageInfo: styled.div``
        }
    }
</script>

<style scoped>
    .container{
        padding: 0;
        margin-top: 0;
        margin-bottom: -1px;
        background-color: #fafbfc;
    }
    .pagination{
        border: 1px solid #e1e4e8;
    }
    .pagination div{
        position: relative;
        float: left;
        padding: 7px 12px;
        margin-left: -1px;
        font-size: 13px;
        font-style: normal;
        font-weight: 600;
        color: #0366d6;
        white-space: nowrap;
        vertical-align: middle;
        cursor: pointer;
        user-select: none;
        background: #fff;
        border: 1px solid #e1e4e8;
    }
    button:disabled{
        color: #d1d5da !important;
        cursor: default !important;
        background-color: #fafbfc !important;
    }
</style>
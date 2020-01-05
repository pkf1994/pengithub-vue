<template>
    <Container class="container pagination flex-row-center">
        <Left class="flex-grow-1 flex-row-center width-full"
              :class="{disable: !pageInfo.prev || loading}"
              @click="goPrev">Previous</Left>
        <PageInfo >
            <strong style="color: #586069;">
                {{currentPage}} of {{pageInfo.last.page}}
            </strong>
        </PageInfo>
        <Right class="flex-grow-1 flex-row-center width-full"
               :class="{disable: !pageInfo.next || loading}"
               @click="goNext">Next</Right>
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
            prev: {
                type: Function,
                required: true
            },
            next: {
                type: Function,
                required: true
            },
            scrollTargetSelector: {
                type: String,
                default: undefined
            },
            scrollElSelector: {
                type: String,
                default: undefined
            }
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
            async goNext() {
                if(this.loading) return
                await this.next()
                this.scrollToTitle()
            },
            async goPrev() {
                if(this.loading) return
                await this.prev()
                this.scrollToTitle()
            },
            scrollToTitle() {
                if(this.scrollTargetSelector && this.scrollElSelector) {
                    util_animatedScrollTo.scrollToEl(
                        document.querySelector(this.scrollTargetSelector),
                        document.querySelector(this.scrollElSelector),
                        8)
                    return
                }
                if(this.scrollElSelector) {
                    util_animatedScrollTo.scrollTo(document.querySelector(this.scrollElSelector),0,8)
                }
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
    .disable{
        color: #d1d5da !important;
        cursor: default !important;
        background-color: #fafbfc !important;
    }
</style>
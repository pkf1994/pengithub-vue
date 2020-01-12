<template>
    <ComplexBubble :loading="loading">
        <template v-slot:title>
            <Title  class="bubble-title">
                <Inner class="inner">
                    <svg class="branch-icon" viewBox="0 0 10 16" version="1.1" width="10" height="16" aria-hidden="true"><path fill-rule="evenodd" d="M10 5c0-1.11-.89-2-2-2a1.993 1.993 0 00-1 3.72v.3c-.02.52-.23.98-.63 1.38-.4.4-.86.61-1.38.63-.83.02-1.48.16-2 .45V4.72a1.993 1.993 0 00-1-3.72C.88 1 0 1.89 0 3a2 2 0 001 1.72v6.56c-.59.35-1 .99-1 1.72 0 1.11.89 2 2 2 1.11 0 2-.89 2-2 0-.53-.2-1-.53-1.36.09-.06.48-.41.59-.47.25-.11.56-.17.94-.17 1.05-.05 1.95-.45 2.75-1.25S8.95 7.77 9 6.73h-.02C9.59 6.37 10 5.73 10 5zM2 1.8c.66 0 1.2.55 1.2 1.2 0 .65-.55 1.2-1.2 1.2C1.35 4.2.8 3.65.8 3c0-.65.55-1.2 1.2-1.2zm0 12.41c-.66 0-1.2-.55-1.2-1.2 0-.65.55-1.2 1.2-1.2.65 0 1.2.55 1.2 1.2 0 .65-.55 1.2-1.2 1.2zm6-8c-.66 0-1.2-.55-1.2-1.2 0-.65.55-1.2 1.2-1.2.65 0 1.2.55 1.2 1.2 0 .65-.55 1.2-1.2 1.2z"></path></svg>
                    <Summary class="flex flex-justify-between">
                        <span>{{defaultBranch.name}}</span>
                        <svg class="v-align-text-bottom d-inline-block" @click="triggerStretch" v-if="stretch" fill="currentColor" viewBox="0 0 10 16" version="1.1" width="10" height="16" aria-hidden="true"><path fill-rule="evenodd" d="M10 10l-1.5 1.5L5 7.75 1.5 11.5 0 10l5-5 5 5z"></path></svg>
                        <svg class="v-align-text-bottom d-inline-block" @click="triggerStretch" v-else fill="currentColor" viewBox="0 0 10 16" version="1.1" width="10" height="16" aria-hidden="true"><path fill-rule="evenodd" d="M5 11L0 6l1.5-1.5L5 8.25 8.5 4.5 10 6l-5 5z"></path></svg>
                    </Summary>
                    <AnimatedHeightWrapper :stretch="stretch">
                        <Detail style="padding-top: 6px;">
                            <router-link to="/" class="branch-item d" v-for="item in branchList" :key="item.name">
                                {{item.name}}
                            </router-link>
                        </Detail> 
                    </AnimatedHeightWrapper> 
                </Inner>
            </Title>   
        </template>

        <Content class="bubble-content" v-if="defaultBranch && defaultBranch.target">
            Last commit by <strong>{{defaultBranch.target.history.nodes[0].author.name}}</strong> {{commitAt}}
        </Content>

        <template v-slot:footer>
            <router-link to="/" class="d-block footer text-center">
                <svg class="d-inline-block v-align-text-bottom" fill="currentColor" viewBox="0 0 14 16" version="1.1" width="14" height="16" aria-hidden="true"><path fill-rule="evenodd" d="M13 4H7V3c0-.66-.31-1-1-1H1c-.55 0-1 .45-1 1v10c0 .55.45 1 1 1h12c.55 0 1-.45 1-1V5c0-.55-.45-1-1-1zM6 4H1V3h5v1z"></path></svg>
                &nbsp;
                View code  
            </router-link>
        </template>
    </ComplexBubble>
</template>

<script>
    import styled from 'vue-styled-components'
    import {ComplexBubble,AnimatedHeightWrapper} from '../../../../components'
    import {util_dateFormat} from '../../../../util'
    export default {
        props: {
            loading: {
                type: Boolean,
                default: false
            },
            defaultBranch: {
                type: Object,
                default: () => ({})
            },
            branchList: {
                type: Array,
                default: () => ([])
            }
        },
        data() {
            return {
                stretch: false
            }
        },
        computed: {
            commitAt: function() {
                return this.defaultBranch.target && util_dateFormat.getDateDiff(new Date(this.defaultBranch.target.history.nodes[0].authoredDate))
            }
        },
        methods: {
            triggerStretch() {
                this.stretch = !this.stretch
            }
        },
        components: {
            ComplexBubble,
            AnimatedHeightWrapper,
            Title: styled.div``,
            Inner: styled.div``,
            Summary: styled.div``,
            Detail: styled.div``,
            BranchItem: styled.div``,
            Content: styled.div``,
            Footer: styled.div``
        }
    }
</script>

<style scoped>
.inner{
    position: relative;
    padding-left: 19px;
    font-weight: 600;
}
.branch-icon{
    position: absolute;
    top: 1px;
    left: 0;
    width: 16px;
    margin-right: 2px;
    margin-left: -3px;
    color: #586069;
    text-align: center;
    vertical-align: text-bottom;
    display: inline-block;
    fill: currentColor;
}
.branch-item{
    display: block;
    padding: 6px 0;
    font-size: 14px;
    font-weight: 600;
}
.footer{
    padding: 10px 15px;
    font-weight: 500;
    line-height: 1.5;
    color: #0366d6;
}
</style>